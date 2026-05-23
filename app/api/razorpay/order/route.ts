import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { BASIC_PLANS } from "@/lib/plans";

export async function POST(request: Request) {
  const supabase = createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { planId } = await request.json().catch(() => ({ planId: "" }));
  const { data: dbPlan } = await supabase.from("plans").select("*").eq("id", planId).maybeSingle();
  const plan = dbPlan || BASIC_PLANS.find((item) => item.id === planId);
  if (!plan) return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 });

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
      amount: plan.price,
      currency: "INR",
      receipt: `maitrimilan_${user.id}_${Date.now()}`,
      notes: { user_id: user.id, plan_id: plan.id, plan_name: plan.name }
    })
  });

  const order = await response.json();
  if (!response.ok) return NextResponse.json(order, { status: response.status });

  await supabase.from("payments").insert({
    user_id: user.id,
    plan_id: plan.id,
    status: "created",
    amount: plan.price,
    currency: "INR",
    razorpay_order_id: order.id
  });

  return NextResponse.json({ ...order, plan });
}
