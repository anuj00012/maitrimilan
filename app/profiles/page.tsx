import { Search } from "lucide-react";
import { Card, Section } from "@/components/ui";
import { ProfileCard } from "@/components/profile-card";
import { createServerSupabase } from "@/lib/supabase/server";
import { sampleProfiles } from "@/lib/sample-data";
import { isSupabaseConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function ProfilesPage({
  searchParams
}: {
  searchParams: { age?: string; city?: string; education?: string; profession?: string; community?: string; message?: string };
}) {
  if (!isSupabaseConfigured()) {
    return (
      <Section>
        <div>
          <h1 className="text-3xl font-black text-ink">Verified profiles</h1>
          <p className="mt-2 text-stone-600">Demo profiles are shown until Supabase credentials are configured.</p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sampleProfiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      </Section>
    );
  }

  const supabase = createServerSupabase();
  let query = supabase
    .from("profiles")
    .select("id, full_name, date_of_birth, city, state, education, profession, community")
    .eq("verification_status", "approved")
    .eq("is_visible", true)
    .order("created_at", { ascending: false });

  if (searchParams.city) query = query.ilike("city", `%${searchParams.city}%`);
  if (searchParams.education) query = query.ilike("education", `%${searchParams.education}%`);
  if (searchParams.profession) query = query.ilike("profession", `%${searchParams.profession}%`);
  if (searchParams.community) query = query.ilike("community", `%${searchParams.community}%`);

  const { data } = await query;
  const profiles = data && data.length > 0 ? data : sampleProfiles;

  return (
    <Section>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-black text-ink">Verified profiles</h1>
          <p className="mt-2 text-stone-600">Only approved and active profiles are listed here.</p>
          {searchParams.message ? (
            <p className="mt-4 rounded-lg bg-lotus p-3 text-sm font-medium text-sindoor">{searchParams.message}</p>
          ) : null}
        </div>
      </div>
      <Card className="mt-6">
        <form className="grid gap-3 md:grid-cols-5">
          <input name="age" placeholder="Age range" defaultValue={searchParams.age} />
          <input name="city" placeholder="City" defaultValue={searchParams.city} />
          <input name="education" placeholder="Education" defaultValue={searchParams.education} />
          <input name="profession" placeholder="Profession" defaultValue={searchParams.profession} />
          <input name="community" placeholder="Community" defaultValue={searchParams.community} />
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white md:col-span-5">
            <Search size={16} /> Search verified profiles
          </button>
        </form>
      </Card>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
    </Section>
  );
}
