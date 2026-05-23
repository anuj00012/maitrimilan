"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

export async function updateVerification(formData: FormData) {
  if (!isSupabaseConfigured()) return;
  const supabase = createServerSupabase();
  const profileId = String(formData.get("profileId"));
  const action = String(formData.get("action"));
  const approved = action === "approve";

  await supabase
    .from("profiles")
    .update({
      verification_status: approved ? "approved" : "rejected",
      is_visible: approved,
      verified_at: approved ? new Date().toISOString() : null
    })
    .eq("id", profileId);

  await supabase
    .from("verification_documents")
    .update({ status: approved ? "approved" : "rejected" })
    .eq("profile_id", profileId);

  revalidatePath("/admin");
}

export async function updateUserStatus(formData: FormData) {
  if (!isSupabaseConfigured()) return;
  const supabase = createServerSupabase();
  await supabase
    .from("users")
    .update({ status: String(formData.get("status")) })
    .eq("id", String(formData.get("userId")));

  revalidatePath("/admin");
}

export async function closeReport(formData: FormData) {
  if (!isSupabaseConfigured()) return;
  const supabase = createServerSupabase();
  await supabase.from("reports").update({ status: "closed" }).eq("id", String(formData.get("reportId")));
  revalidatePath("/admin");
}
