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

  const { data: payment } = await supabase
    .from("payments")
    .select("*, plans(*)")
    .eq("user_id", user.id)
    .eq("razorpay_order_id", razorpay_order_id)
    .maybeSingle();

  if (!payment?.plans) return NextResponse.json({ error: "Payment order not found" }, { status: 404 });

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + payment.plans.duration_days);

  await supabase
    .from("payments")
    .update({
      status: "paid",
      razorpay_payment_id,
      razorpay_signature
    })
    .eq("user_id", user.id)
    .eq("razorpay_order_id", razorpay_order_id);

  await supabase.from("subscriptions").insert({
    user_id: user.id,
    plan_id: payment.plan_id,
    status: "active",
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString(),
    contact_unlocks_used: 0,
    interests_used: 0,
    last_limit_reset_date: startDate.toISOString()
  });

  return NextResponse.json({ ok: true });
}
