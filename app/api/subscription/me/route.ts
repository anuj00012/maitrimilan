import { NextResponse } from "next/server";
import { requireSessionUser } from "@/lib/custom-auth";
import { getActiveCustomSubscription } from "@/lib/subscription-core";

export async function GET() {
  const user = await requireSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const subscription = await getActiveCustomSubscription(user.id);
  if (!subscription) return NextResponse.json({ subscription: null });

  return NextResponse.json({
    subscription,
    remaining_contact_unlocks: subscription.contact_unlock_limit - subscription.contact_unlocks_used,
    remaining_interests: subscription.interest_limit - subscription.interests_used
  });
}
