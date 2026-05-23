import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createVerificationToken, sendVerificationEmail } from "@/lib/custom-auth";

export async function POST(request: Request) {
  const { name, email, password } = await request.json();
  if (!name || !email || !password || password.length < 8) {
    return NextResponse.json({ message: "Name, valid email, and 8 character password are required." }, { status: 400 });
  }

  const db = getDb();
  const existing = await db.query("select id from users where lower(email) = lower($1)", [email]);
  if (existing.rows.length) return NextResponse.json({ message: "Email already registered." }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 12);
  const token = createVerificationToken();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

  await db.query(
    `insert into users (name, email, password_hash, email_verification_token, email_verification_expires_at)
     values ($1, lower($2), $3, $4, $5)`,
    [name.trim(), email.trim(), passwordHash, token, expiresAt]
  );

  await sendVerificationEmail(email.trim(), token);

  return NextResponse.json({
    message: "Registration successful. Please check your email to verify your account."
  });
}
