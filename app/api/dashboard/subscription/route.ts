import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getActiveSubscription } from "@/lib/subscription";

export async function GET() {
  const supabase = createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subscription = await getActiveSubscription(user.id);
  if (!subscription) return NextResponse.json({ subscription: null });

  return NextResponse.json({
    subscription,
    remaining_contact_unlocks:
      (subscription.plans?.contact_unlock_limit || 0) - (subscription.contact_unlocks_used || 0),
    remaining_interests: (subscription.plans?.interest_limit || 0) - (subscription.interests_used || 0)
  });
}
