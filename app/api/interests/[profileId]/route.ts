import { NextResponse } from "next/server";
import { requireSessionUser } from "@/lib/custom-auth";
import { getDb } from "@/lib/db";
import { requireActiveSubscription } from "@/lib/subscription-core";

export async function POST(_: Request, { params }: { params: { profileId: string } }) {
  const user = await requireSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { subscription, response } = await requireActiveSubscription(user);
  if (response) return response;
  if (subscription.interests_used >= subscription.interest_limit) {
    return NextResponse.json({ message: "Monthly interest limit reached" }, { status: 403 });
  }

  const db = getDb();
  await db.query("begin");
  try {
    await db.query(
      "insert into interests (sender_id, receiver_profile_id, status) values ($1, $2, 'pending')",
      [user.id, params.profileId]
    );
    await db.query("update subscriptions set interests_used = interests_used + 1, updated_at = now() where id = $1", [
      subscription.id
    ]);
    await db.query("commit");
  } catch (error) {
    await db.query("rollback");
    throw error;
  }

  return NextResponse.json({ message: "Interest sent." });
}
