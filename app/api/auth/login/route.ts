import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createSessionToken, setSessionCookie } from "@/lib/custom-auth";
import { getDb } from "@/lib/db";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) return NextResponse.json({ message: "Email and password are required." }, { status: 400 });

  const result = await getDb().query("select * from users where lower(email) = lower($1)", [email]);
  const user = result.rows[0];
  if (!user) return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });

  if (!user.email_verified) {
    return NextResponse.json({ message: "Please verify your email before logging in." }, { status: 403 });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });

  setSessionCookie(createSessionToken({ id: user.id, email: user.email, name: user.name }));
  return NextResponse.json({ message: "Login successful." });
}
