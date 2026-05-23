"use server";

import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { hasActiveSubscription } from "@/lib/subscription";

export async function sendInterest(formData: FormData) {
  const supabase = createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const allowed = await hasActiveSubscription(user.id);
  if (!allowed) redirect("/subscription?message=Start your annual membership to send more interests.");

  const receiverProfileId = String(formData.get("profileId"));
  const { data: receiverProfile } = await supabase.from("profiles").select("user_id").eq("id", receiverProfileId).single();
  const { data: senderProfile } = await supabase.from("profiles").select("id").eq("user_id", user.id).single();

  if (!receiverProfile || !senderProfile) redirect("/profiles?message=Complete your profile before sending interest.");

  await supabase.from("interests").insert({
    sender_id: user.id,
    receiver_id: receiverProfile.user_id,
    sender_profile_id: senderProfile.id,
    receiver_profile_id: receiverProfileId,
    status: "pending"
  });

  redirect("/requests?message=Interest sent.");
}

export async function reportProfile(formData: FormData) {
  const supabase = createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  await supabase.from("reports").insert({
    reporter_id: user.id,
    reported_profile_id: String(formData.get("profileId")),
    reason: "User reported from profile page",
    status: "open"
  });

  redirect("/profiles?message=Report submitted for admin review.");
}
