"use server";

import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

export async function saveProfile(formData: FormData) {
  if (!isSupabaseConfigured()) redirect("/onboarding?message=Add Supabase env keys before submitting profiles.");
  const supabase = createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const privacyAccepted = formData.get("privacyAccepted") === "on";
  const termsAccepted = formData.get("termsAccepted") === "on";
  if (!privacyAccepted || !termsAccepted) {
    redirect("/onboarding?message=Please accept privacy and terms before submitting.");
  }

  const profilePayload = {
    user_id: user.id,
    full_name: String(formData.get("fullName") || ""),
    gender: String(formData.get("gender") || ""),
    date_of_birth: String(formData.get("dateOfBirth") || ""),
    religion: String(formData.get("religion") || "") || null,
    community: String(formData.get("community") || "") || null,
    caste: String(formData.get("caste") || "") || null,
    education: String(formData.get("education") || ""),
    profession: String(formData.get("profession") || ""),
    income_range: String(formData.get("incomeRange") || "") || null,
    city: String(formData.get("city") || ""),
    state: String(formData.get("state") || ""),
    height: String(formData.get("height") || ""),
    marital_status: String(formData.get("maritalStatus") || ""),
    about_me: String(formData.get("aboutMe") || ""),
    partner_preferences: String(formData.get("partnerPreferences") || ""),
    privacy_accepted: privacyAccepted,
    terms_accepted: termsAccepted,
    verification_status: "pending",
    is_visible: false
  };

  const { data: profile, error } = await supabase
    .from("profiles")
    .upsert(profilePayload, { onConflict: "user_id" })
    .select("id")
    .single();

  if (error || !profile) {
    redirect(`/onboarding?message=${encodeURIComponent(error?.message || "Profile could not be saved.")}`);
  }

  const photos = formData.getAll("photos").filter((item): item is File => item instanceof File && item.size > 0);
  for (const photo of photos.slice(0, 4)) {
    const path = `${user.id}/${crypto.randomUUID()}-${photo.name}`;
    const upload = await supabase.storage.from("profile-photos").upload(path, photo, { upsert: false });
    if (!upload.error) {
      await supabase.from("profile_photos").insert({ profile_id: profile.id, storage_path: path, is_primary: false });
    }
  }

  const document = formData.get("idProof");
  if (document instanceof File && document.size > 0) {
    const path = `${user.id}/${crypto.randomUUID()}-${document.name}`;
    const upload = await supabase.storage.from("verification-documents").upload(path, document, { upsert: false });
    if (!upload.error) {
      await supabase.from("verification_documents").insert({
        profile_id: profile.id,
        user_id: user.id,
        document_type: "id_proof",
        storage_path: path,
        status: "pending"
      });
    }
  }

  redirect("/profiles?message=Profile submitted for manual verification.");
}
