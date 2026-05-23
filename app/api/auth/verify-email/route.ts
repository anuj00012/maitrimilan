import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (!token) return NextResponse.redirect(`${siteUrl}/login?verified=false`);

  const result = await getDb().query(
    `update users
     set email_verified = true,
         email_verification_token = null,
         email_verification_expires_at = null,
         updated_at = now()
     where email_verification_token = $1
       and email_verification_expires_at > now()
     returning id`,
    [token]
  );

  if (!result.rows.length) return NextResponse.redirect(`${siteUrl}/login?verified=false`);

  return NextResponse.redirect(`${siteUrl}/login?verified=true`);
}
