import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireSessionUser } from "@/lib/custom-auth";

export async function POST(request: Request) {
  const user = await requireSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { planId } = await request.json();
  const db = getDb();
  const planResult = await db.query("select * from plans where id = $1", [planId]);
  const plan = planResult.rows[0];
  if (!plan) return NextResponse.json({ message: "Invalid plan" }, { status: 400 });

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return NextResponse.json({ message: "Razorpay is not configured" }, { status: 500 });

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount: plan.price,
      currency: "INR",
      receipt: `mm_${user.id}_${Date.now()}`,
      notes: { user_id: user.id, plan_id: plan.id }
    })
  });

  const order = await response.json();
  if (!response.ok) return NextResponse.json(order, { status: response.status });

  await db.query(
    `insert into payments (user_id, plan_id, razorpay_order_id, amount, currency, status)
     values ($1, $2, $3, $4, 'INR', 'created')`,
    [user.id, plan.id, order.id, plan.price]
  );

  return NextResponse.json({ ...order, plan });
}
