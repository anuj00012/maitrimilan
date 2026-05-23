const FALLBACK_SUPABASE_URL = "https://cnzrjimfhddvwstebrwu.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY = "sb_publishable_Zs-OYzOmAfAqV33SHDDYlQ_7ScyyvpS";

export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
}

export function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}
