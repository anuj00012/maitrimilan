import { createServerSupabase } from "@/lib/supabase/server";

export async function hasActiveSubscription(userId: string) {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("subscriptions")
    .select("end_date,status")
    .eq("user_id", userId)
    .eq("status", "active")
    .gt("end_date", new Date().toISOString())
    .maybeSingle();

  return Boolean(data);
}

export async function getActiveSubscription(userId: string) {
  const supabase = createServerSupabase();
  const now = new Date().toISOString();

  const { data } = await supabase
    .from("subscriptions")
    .select("*, plans(name, contact_unlock_limit, interest_limit)")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("end_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (data && data.end_date <= now) {
    await supabase.from("subscriptions").update({ status: "expired" }).eq("id", data.id);
    return null;
  }

  return data;
}
