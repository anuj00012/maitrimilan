import { Flag, HeartHandshake, LockKeyhole } from "lucide-react";
import { Button, Card, Section } from "@/components/ui";
import { createServerSupabase } from "@/lib/supabase/server";
import { ageFromDob } from "@/lib/utils";
import { sampleProfiles } from "@/lib/sample-data";
import { sendInterest, reportProfile } from "./profile-actions";
import { isSupabaseConfigured } from "@/lib/env";

export default async function ProfileDetailPage({ params }: { params: { id: string } }) {
  const sample = sampleProfiles.find((profile) => profile.id === params.id);
  let profile: any = sample;

  if (isSupabaseConfigured()) {
    const supabase = createServerSupabase();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", params.id)
      .eq("verification_status", "approved")
      .eq("is_visible", true)
      .maybeSingle();
    profile = data || sample;
  }

  if (!profile) {
    return (
      <Section>
        <Card>Profile not found or not yet verified.</Card>
      </Section>
    );
  }

  return (
    <Section>
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="p-6">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-lotus">
            {profile.photo_url ? (
              <img
                src={profile.photo_url}
                alt={`${profile.full_name} profile photo`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center text-7xl font-black text-sindoor">
                {profile.full_name.charAt(0)}
              </div>
            )}
          </div>
          <div className="mt-5 grid gap-3">
            <form action={sendInterest}>
              <input type="hidden" name="profileId" value={profile.id} />
              <Button type="submit" className="w-full">
                <HeartHandshake className="mr-2" size={18} />
                Send interest
              </Button>
            </form>
            <form action={reportProfile}>
              <input type="hidden" name="profileId" value={profile.id} />
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm font-bold text-stone-700 hover:border-sindoor hover:text-sindoor">
                <Flag size={18} /> Report profile
              </button>
            </form>
          </div>
          <p className="mt-4 flex items-center gap-2 rounded-lg bg-stone-50 p-3 text-xs text-stone-500">
            <LockKeyhole size={16} /> Phone, email, and address remain hidden until both sides connect.
          </p>
        </Card>
        <div className="grid gap-5">
          <Card>
            <p className="text-sm font-semibold text-mehendi">Verified profile</p>
            <h1 className="mt-2 text-3xl font-black text-ink">{profile.full_name}</h1>
            <p className="mt-2 text-stone-600">
              {ageFromDob(profile.date_of_birth) || "Age hidden"} years • {profile.city}, {profile.state}
            </p>
          </Card>
          <Card>
            <h2 className="text-xl font-bold text-ink">Personal details</h2>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              {[
                ["Education", profile.education],
                ["Profession", profile.profession],
                ["Community", profile.community || "Optional"],
                ["Height", profile.height || "Shared after connect"],
                ["Marital status", profile.marital_status || "Not listed"],
                ["Income", profile.income_range || "Private"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-stone-50 p-3">
                  <dt className="font-semibold text-stone-500">{label}</dt>
                  <dd className="mt-1 font-bold text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <Card>
            <h2 className="text-xl font-bold text-ink">About</h2>
            <p className="mt-3 leading-7 text-stone-700">{profile.about_me || "Details will be available soon."}</p>
          </Card>
          <Card>
            <h2 className="text-xl font-bold text-ink">Partner preferences</h2>
            <p className="mt-3 leading-7 text-stone-700">
              {profile.partner_preferences || "Preferences will be available soon."}
            </p>
          </Card>
        </div>
      </div>
    </Section>
  );
}
