import Link from "next/link";
import { Ban, Check, ExternalLink, ShieldCheck, X } from "lucide-react";
import { Button, Card, Section } from "@/components/ui";
import { createServerSupabase } from "@/lib/supabase/server";
import { closeReport, updateUserStatus, updateVerification } from "./actions";
import { isSupabaseConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isSupabaseConfigured()) {
    return (
      <Section>
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-sindoor" />
          <div>
            <h1 className="text-3xl font-black text-ink">Admin dashboard</h1>
            <p className="mt-1 text-stone-600">Supabase is required for admin verification and moderation.</p>
          </div>
        </div>
        <Card className="mt-6">
          <p className="font-bold text-ink">Connect Supabase to use admin tools.</p>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Add your Supabase URL and anon key to `.env.local`, run the SQL files in `supabase/`, create an admin user,
            and restart the dev server.
          </p>
        </Card>
      </Section>
    );
  }

  const supabase = createServerSupabase();

  const [{ data: pending }, { data: users }, { data: reports }, { data: subscriptions }] = await Promise.all([
    supabase
      .from("profiles")
      .select("*, verification_documents(id, storage_path, status)")
      .eq("verification_status", "pending")
      .order("created_at", { ascending: true }),
    supabase.from("users").select("*").order("created_at", { ascending: false }).limit(25),
    supabase.from("reports").select("*").eq("status", "open").order("created_at", { ascending: false }).limit(25),
    supabase.from("subscriptions").select("*").order("created_at", { ascending: false }).limit(25)
  ]);

  async function signedDocumentUrl(path?: string | null) {
    if (!path) return null;
    const { data } = await supabase.storage.from("verification-documents").createSignedUrl(path, 300);
    return data?.signedUrl || null;
  }

  const pendingProfiles = await Promise.all(
    (pending || []).map(async (profile: any) => ({
      profile,
      signedUrl: await signedDocumentUrl(profile.verification_documents?.[0]?.storage_path)
    }))
  );

  return (
    <Section>
      <div className="flex items-center gap-3">
        <ShieldCheck className="text-sindoor" />
        <div>
          <h1 className="text-3xl font-black text-ink">Admin dashboard</h1>
          <p className="mt-1 text-stone-600">Manual verification, reports, users, and subscriptions.</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6">
        <Card>
          <h2 className="text-xl font-bold text-ink">Pending profiles</h2>
          <div className="mt-4 grid gap-4">
            {pendingProfiles.map(({ profile, signedUrl }) => (
                <div key={profile.id} className="rounded-lg bg-stone-50 p-4">
                  <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
                    <div>
                      <p className="font-bold text-ink">{profile.full_name}</p>
                      <p className="text-sm text-stone-600">
                        {profile.city}, {profile.state} - {profile.education} - {profile.profession}
                      </p>
                      <p className="mt-2 text-sm text-stone-600">{profile.about_me}</p>
                      {signedUrl ? (
                        <Link
                          href={signedUrl}
                          target="_blank"
                          className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-sindoor"
                        >
                          View private ID proof <ExternalLink size={15} />
                        </Link>
                      ) : null}
                    </div>
                    <form action={updateVerification} className="flex items-start gap-2">
                      <input type="hidden" name="profileId" value={profile.id} />
                      <Button className="px-3 py-2" type="submit" name="action" value="approve">
                        <Check size={16} />
                      </Button>
                      <Button className="bg-stone-700 px-3 py-2" type="submit" name="action" value="reject">
                        <X size={16} />
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            {pendingProfiles.length === 0 && <p className="text-sm text-stone-500">No pending profiles.</p>}
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="text-xl font-bold text-ink">Manage users</h2>
            <div className="mt-4 grid gap-3">
              {(users || []).map((user) => (
                <div key={user.id} className="flex items-center justify-between gap-3 rounded-lg bg-stone-50 p-3">
                  <div>
                    <p className="text-sm font-bold text-ink">{user.email || user.phone || user.id}</p>
                    <p className="text-xs text-stone-500">Status: {user.status}</p>
                  </div>
                  <form action={updateUserStatus}>
                    <input type="hidden" name="userId" value={user.id} />
                    <input type="hidden" name="status" value={user.status === "blocked" ? "active" : "blocked"} />
                    <button className="inline-flex items-center gap-2 rounded-lg bg-ink px-3 py-2 text-xs font-bold text-white">
                      <Ban size={14} /> {user.status === "blocked" ? "Unblock" : "Block"}
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-ink">Reports</h2>
            <div className="mt-4 grid gap-3">
              {(reports || []).map((report) => (
                <div key={report.id} className="rounded-lg bg-stone-50 p-3">
                  <p className="text-sm font-bold text-ink">{report.reason}</p>
                  <p className="text-xs text-stone-500">Reporter: {report.reporter_id}</p>
                  <form action={closeReport} className="mt-3">
                    <input type="hidden" name="reportId" value={report.id} />
                    <button className="rounded-lg bg-mehendi px-3 py-2 text-xs font-bold text-white">Close report</button>
                  </form>
                </div>
              ))}
              {(!reports || reports.length === 0) && <p className="text-sm text-stone-500">No open reports.</p>}
            </div>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-bold text-ink">Recent subscriptions</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-stone-500">
                <tr>
                  <th className="py-2">User</th>
                  <th>Status</th>
                  <th>Plan</th>
                  <th>Expiry</th>
                </tr>
              </thead>
              <tbody>
                {(subscriptions || []).map((subscription) => (
                  <tr key={subscription.id} className="border-t border-stone-100">
                    <td className="py-2">{subscription.user_id}</td>
                    <td>{subscription.status}</td>
                    <td>{subscription.plan}</td>
                    <td>{subscription.expires_at || "Not active"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Section>
  );
}
