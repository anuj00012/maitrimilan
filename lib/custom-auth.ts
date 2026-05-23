import crypto from "crypto";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getDb } from "@/lib/db";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
};

const COOKIE_NAME = "maitrimilan_session";

export function getJwtSecret() {
  return process.env.JWT_SECRET || "dev-only-change-this-secret";
}

export function createSessionToken(user: SessionUser) {
  return jwt.sign(user, getJwtSecret(), { expiresIn: "7d" });
}

export function setSessionCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearSessionCookie() {
  cookies().delete(COOKIE_NAME);
}

export function verifySessionToken(token?: string): SessionUser | null {
  if (!token) return null;
  try {
    return jwt.verify(token, getJwtSecret()) as SessionUser;
  } catch {
    return null;
  }
}

export function getSessionUser() {
  return verifySessionToken(cookies().get(COOKIE_NAME)?.value);
}

export async function requireSessionUser() {
  const user = getSessionUser();
  if (!user) return null;

  const result = await getDb().query(
    "select id, name, email, email_verified from users where id = $1 and email_verified = true",
    [user.id]
  );

  return result.rows[0] ? user : null;
}

export function createVerificationToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function sendVerificationEmail(email: string, token: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const verifyUrl = `${siteUrl}/api/auth/verify-email?token=${token}`;

  if (process.env.RESEND_API_KEY && process.env.EMAIL_FROM) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Verify your MaitriMilan email",
        html: `<p>Welcome to MaitriMilan.</p><p>Verify your email:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`
      })
    });
    return;
  }

  console.log(`MaitriMilan verification link for ${email}: ${verifyUrl}`);
}
