import { createServerSupabase } from "@/lib/supabase/server";

export async function hasActiveSubscription(userId: string) {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("subscriptions")
    .select("expires_at,status")
    .eq("user_id", userId)
    .eq("status", "active")
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  return Boolean(data);
}
