"use server";

import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

export async function respondToInterest(formData: FormData) {
  if (!isSupabaseConfigured()) redirect("/requests?message=Add Supabase env keys before managing requests.");
  const supabase = createServerSupabase();
  const interestId = String(formData.get("interestId"));
  const action = String(formData.get("action"));
  const status = action === "accept" ? "accepted" : "rejected";

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: interest } = await supabase
    .from("interests")
    .update({ status, responded_at: new Date().toISOString() })
    .eq("id", interestId)
    .eq("receiver_id", user.id)
    .select("*")
    .single();

  if (interest && status === "accepted") {
    await supabase.from("matches").insert({
      interest_id: interest.id,
      user_one_id: interest.sender_id,
      user_two_id: interest.receiver_id,
      status: "active"
    });
  }

  redirect("/requests?message=Request updated.");
}
