import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { BASIC_PLANS } from "@/lib/plans";

export async function GET() {
  const supabase = createServerSupabase();
  const { data, error } = await supabase.from("plans").select("*").order("price", { ascending: true });

  if (error || !data?.length) {
    return NextResponse.json(BASIC_PLANS);
  }

  return NextResponse.json(data);
}
