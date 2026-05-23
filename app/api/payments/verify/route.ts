import crypto from "crypto";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireSessionUser } from "@/lib/custom-auth";
import { calculateEndDate } from "@/lib/subscription-core";

export async function POST(request: Request) {
  const user = await requireSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ message: "Invalid payment payload" }, { status: 400 });
  }

  const expected = crypto.createHmac("sha256", keySecret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
  if (expected !== razorpay_signature) return NextResponse.json({ message: "Payment signature mismatch" }, { status: 400 });

  const db = getDb();
  const paymentResult = await db.query(
    `select p.*, plans.duration_days
     from payments p
     join plans on plans.id = p.plan_id
     where p.user_id = $1 and p.razorpay_order_id = $2`,
    [user.id, razorpay_order_id]
  );
  const payment = paymentResult.rows[0];
  if (!payment) return NextResponse.json({ message: "Payment order not found" }, { status: 404 });

  const startDate = new Date();
  const endDate = calculateEndDate(startDate, payment.duration_days);

  await db.query("begin");
  try {
    await db.query(
      `update payments
       set razorpay_payment_id = $1, razorpay_signature = $2, status = 'paid'
       where id = $3`,
      [razorpay_payment_id, razorpay_signature, payment.id]
    );
    await db.query(
      `insert into subscriptions
       (user_id, plan_id, status, start_date, end_date, contact_unlocks_used, interests_used, last_limit_reset_date)
       values ($1, $2, 'active', $3, $4, 0, 0, $3)`,
      [user.id, payment.plan_id, startDate, endDate]
    );
    await db.query("commit");
  } catch (error) {
    await db.query("rollback");
    throw error;
  }

  return NextResponse.json({ message: "Subscription activated." });
}
