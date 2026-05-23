import crypto from "crypto";
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Invalid verification payload" }, { status: 400 });
  }

  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expected !== razorpay_signature) {
    return NextResponse.json({ error: "Signature mismatch" }, { status: 400 });
  }

  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  await supabase
    .from("subscriptions")
    .update({
      status: "active",
      razorpay_payment_id,
      razorpay_signature,
      starts_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString()
    })
    .eq("user_id", user.id)
    .eq("razorpay_order_id", razorpay_order_id);

  return NextResponse.json({ ok: true });
}
