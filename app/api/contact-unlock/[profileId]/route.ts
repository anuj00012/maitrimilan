import { NextResponse } from "next/server";
import { requireSessionUser } from "@/lib/custom-auth";
import { getDb } from "@/lib/db";
import { requireActiveSubscription } from "@/lib/subscription-core";

export async function POST(_: Request, { params }: { params: { profileId: string } }) {
  const user = await requireSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { subscription, response } = await requireActiveSubscription(user);
  if (response) return response;
  if (subscription.contact_unlocks_used >= subscription.contact_unlock_limit) {
    return NextResponse.json({ message: "Monthly contact unlock limit reached" }, { status: 403 });
  }

  const db = getDb();
  await db.query("begin");
  try {
    await db.query(
      "insert into contact_unlocks (user_id, profile_id) values ($1, $2) on conflict do nothing",
      [user.id, params.profileId]
    );
    await db.query("update subscriptions set contact_unlocks_used = contact_unlocks_used + 1, updated_at = now() where id = $1", [
      subscription.id
    ]);
    await db.query("commit");
  } catch (error) {
    await db.query("rollback");
    throw error;
  }

  return NextResponse.json({ message: "Contact unlocked." });
}
