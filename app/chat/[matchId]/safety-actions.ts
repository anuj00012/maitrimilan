"use server";

import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

export async function reportMatch(formData: FormData) {
  if (!isSupabaseConfigured()) redirect("/requests?message=Add Supabase env keys before reporting chats.");
  const supabase = createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  await supabase.from("reports").insert({
    reporter_id: user.id,
    match_id: String(formData.get("matchId")),
    reason: "Reported from chat",
    status: "open"
  });

  redirect("/requests?message=Chat report sent to admin.");
}

export async function blockMatch(formData: FormData) {
  if (!isSupabaseConfigured()) redirect("/requests?message=Add Supabase env keys before blocking matches.");
  const supabase = createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  await supabase
    .from("matches")
    .update({ status: "blocked", blocked_by: user.id })
    .eq("id", String(formData.get("matchId")))
    .or(`user_one_id.eq.${user.id},user_two_id.eq.${user.id}`);

  redirect("/requests?message=Match blocked.");
}
