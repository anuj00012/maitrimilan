import Link from "next/link";
import { MapPin, GraduationCap, BriefcaseBusiness, ShieldCheck } from "lucide-react";
import { ageFromDob } from "@/lib/utils";

export type ProfileCardData = {
  id: string;
  full_name: string;
  date_of_birth: string | null;
  city: string | null;
  state: string | null;
  education: string | null;
  profession: string | null;
  community: string | null;
  photo_url?: string | null;
};

export function ProfileCard({ profile }: { profile: ProfileCardData }) {
  const age = ageFromDob(profile.date_of_birth);

  return (
    <Link
      href={`/profiles/${profile.id}`}
      className="group block rounded-lg border border-stone-200 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:border-sindoor/30"
    >
      <div className="relative overflow-hidden rounded-lg bg-lotus">
        <div className="relative aspect-[4/3]">
          {profile.photo_url ? (
            <img
              src={profile.photo_url}
              alt={`${profile.full_name} profile photo`}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full place-items-center text-5xl font-bold text-sindoor">
              {profile.full_name.charAt(0)}
            </div>
          )}
        </div>
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-mehendi shadow-sm">
          <ShieldCheck size={14} />
          Verified
        </span>
      </div>
      <h3 className="mt-4 text-lg font-bold text-ink group-hover:text-sindoor">{profile.full_name}</h3>
      <p className="mt-1 text-sm text-stone-500">
        {age ? `${age} years` : "Age hidden"} {profile.community ? `- ${profile.community}` : ""}
      </p>
      <div className="mt-4 grid gap-2 text-sm text-stone-600">
        <span className="flex items-center gap-2">
          <MapPin size={16} /> {[profile.city, profile.state].filter(Boolean).join(", ") || "Location available on request"}
        </span>
        <span className="flex items-center gap-2">
          <GraduationCap size={16} /> {profile.education || "Education not listed"}
        </span>
        <span className="flex items-center gap-2">
          <BriefcaseBusiness size={16} /> {profile.profession || "Profession not listed"}
        </span>
      </div>
      <p className="mt-4 rounded-lg bg-stone-50 px-3 py-2 text-xs text-stone-500">
        Contact details are protected until both sides agree to connect.
      </p>
    </Link>
  );
}
