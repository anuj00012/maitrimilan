import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { SessionUser } from "@/lib/custom-auth";

export function calculateEndDate(startDate: Date, durationDays: number) {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + durationDays);
  return endDate;
}

export async function getActiveCustomSubscription(userId: string) {
  const db = getDb();
  const result = await db.query(
    `select s.*, p.name, p.contact_unlock_limit, p.interest_limit
     from subscriptions s
     join plans p on s.plan_id = p.id
     where s.user_id = $1
     order by s.created_at desc
     limit 1`,
    [userId]
  );

  if (result.rows.length === 0) return null;

  const subscription = result.rows[0];
  const now = new Date();

  if (subscription.status !== "active" || now > new Date(subscription.end_date)) {
    await db.query("update subscriptions set status = 'expired', updated_at = now() where id = $1", [subscription.id]);
    return null;
  }

  const lastReset = new Date(subscription.last_limit_reset_date || subscription.start_date);
  const daysSinceReset = Math.floor((now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceReset >= 30) {
    const updated = await db.query(
      `update subscriptions
       set contact_unlocks_used = 0,
           interests_used = 0,
           last_limit_reset_date = now(),
           updated_at = now()
       where id = $1
       returning *`,
      [subscription.id]
    );
    return { ...subscription, ...updated.rows[0], contact_unlock_limit: subscription.contact_unlock_limit, interest_limit: subscription.interest_limit };
  }

  return subscription;
}

export async function requireActiveSubscription(user: SessionUser) {
  const subscription = await getActiveCustomSubscription(user.id);
  if (!subscription) {
    return {
      subscription: null,
      response: NextResponse.json({ message: "No active subscription found" }, { status: 403 })
    };
  }

  return { subscription, response: null };
}
