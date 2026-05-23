import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

const AMOUNT_IN_PAISE = 499900;

export async function POST() {
  const supabase = createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return NextResponse.json({ error: "Razorpay is not configured" }, { status: 500 });

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount: AMOUNT_IN_PAISE,
      currency: "INR",
      receipt: `maitrimilan_${user.id}_${Date.now()}`,
      notes: { user_id: user.id, plan: "premium_annual" }
    })
  });

  const order = await response.json();
  if (!response.ok) return NextResponse.json(order, { status: response.status });

  await supabase.from("subscriptions").insert({
    user_id: user.id,
    plan: "premium_annual",
    status: "created",
    amount: AMOUNT_IN_PAISE,
    currency: "INR",
    razorpay_order_id: order.id
  });

  return NextResponse.json(order);
}
