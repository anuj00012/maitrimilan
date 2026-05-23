"use server";

import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

function authError(message: string) {
  redirect(`/auth/login?message=${encodeURIComponent(message)}`);
}

export async function register(formData: FormData) {
  if (!isSupabaseConfigured()) redirect("/auth/register?message=Add Supabase env keys before using authentication.");
  const supabase = createServerSupabase();
  const emailOrPhone = String(formData.get("emailOrPhone") || "").trim();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "bride");

  if (!emailOrPhone.includes("@")) {
    redirect("/auth/register?message=Email auth is enabled in this MVP. Add phone OTP in Supabase to use phone login.");
  }

  const { data, error } = await supabase.auth.signUp({
    email: emailOrPhone,
    password,
    options: { data: { role } }
  });

  if (error) redirect(`/auth/register?message=${encodeURIComponent(error.message)}`);

  if (data.user) {
    await supabase.from("users").upsert({
      id: data.user.id,
      email: emailOrPhone,
      role,
      status: "active"
    });
  }

  redirect("/onboarding");
}

export async function login(formData: FormData) {
  if (!isSupabaseConfigured()) redirect("/auth/login?message=Add Supabase env keys before using authentication.");
  const supabase = createServerSupabase();
  const emailOrPhone = String(formData.get("emailOrPhone") || "").trim();
  const password = String(formData.get("password") || "");

  if (!emailOrPhone.includes("@")) authError("Use email login unless Supabase phone OTP is configured.");

  const { error } = await supabase.auth.signInWithPassword({ email: emailOrPhone, password });
  if (error) authError(error.message);

  redirect("/profiles");
}

export async function forgotPassword(formData: FormData) {
  if (!isSupabaseConfigured()) redirect("/auth/forgot-password?message=Add Supabase env keys before password reset.");
  const supabase = createServerSupabase();
  const email = String(formData.get("email") || "").trim();
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/login`
  });

  if (error) redirect(`/auth/forgot-password?message=${encodeURIComponent(error.message)}`);
  redirect("/auth/login?message=Password reset email sent.");
}
