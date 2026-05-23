import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/custom-auth";

export async function POST() {
  clearSessionCookie();
  return NextResponse.json({ message: "Logged out." });
}
