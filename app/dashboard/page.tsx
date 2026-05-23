import Link from "next/link";
import { CalendarDays, Eye, HeartHandshake, LockKeyhole, MessageCircle, UserRoundCheck } from "lucide-react";
import { ButtonLink, Card, Section } from "@/components/ui";
import { createServerSupabase } from "@/lib/supabase/server";
import { getActiveSubscription } from "@/lib/subscription";

export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }: { searchParams: { message?: string } }) {
  const supabase = createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Section className="max-w-2xl">
        <Card>
          <h1 className="text-2xl font-black text-ink">Login required</h1>
          <p className="mt-2 text-stone-600">Please login to view your MaitriMilan dashboard.</p>
          <ButtonLink href="/auth/login" className="mt-5">
            Login
          </ButtonLink>
        </Card>
      </Section>
    );
  }

  const [{ data: profile }, subscription, { count: sentCount }, { count: receivedCount }] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
    getActiveSubscription(user.id),
    supabase.from("interests").select("id", { count: "exact", head: true }).eq("sender_id", user.id),
    supabase.from("interests").select("id", { count: "exact", head: true }).eq("receiver_id", user.id)
  ]);

  const plan = subscription?.plans;
  const remainingContacts = Math.max((plan?.contact_unlock_limit || 0) - (subscription?.contact_unlocks_used || 0), 0);
  const remainingInterests = Math.max((plan?.interest_limit || 0) - (subscription?.interests_used || 0), 0);

  return (
    <Section>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-semibold text-sindoor">My account</p>
          <h1 className="mt-2 text-3xl font-black text-ink">Dashboard</h1>
          <p className="mt-2 text-stone-600">Track your profile, subscription, requests, and paid feature limits.</p>
          {searchParams.message ? (
            <p className="mt-4 rounded-lg bg-lotus p-3 text-sm font-medium text-sindoor">{searchParams.message}</p>
          ) : null}
        </div>
        <ButtonLink href={profile ? `/profiles/${profile.id}` : "/onboarding"}>
          {profile ? "View my profile" : "Complete onboarding"}
        </ButtonLink>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-4">
        <Card>
          <UserRoundCheck className="text-sindoor" />
          <p className="mt-3 text-sm text-stone-500">Profile status</p>
          <p className="mt-1 text-xl font-black text-ink">{profile?.verification_status || "Not created"}</p>
        </Card>
        <Card>
          <HeartHandshake className="text-sindoor" />
          <p className="mt-3 text-sm text-stone-500">Sent interests</p>
          <p className="mt-1 text-xl font-black text-ink">{sentCount || 0}</p>
        </Card>
        <Card>
          <MessageCircle className="text-sindoor" />
          <p className="mt-3 text-sm text-stone-500">Received requests</p>
          <p className="mt-1 text-xl font-black text-ink">{receivedCount || 0}</p>
        </Card>
        <Card>
          <Eye className="text-sindoor" />
          <p className="mt-3 text-sm text-stone-500">Profile views</p>
          <p className="mt-1 text-xl font-black text-ink">Coming soon</p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <h2 className="text-xl font-bold text-ink">Subscription details</h2>
          {subscription ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-lotus p-4">
                <p className="text-sm font-semibold text-stone-500">Active plan</p>
                <p className="mt-1 text-2xl font-black text-ink">{plan?.name || "Basic Plan"}</p>
              </div>
              <div className="rounded-lg bg-lotus p-4">
                <p className="text-sm font-semibold text-stone-500">Expiry date</p>
                <p className="mt-1 text-lg font-black text-ink">
                  {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(subscription.end_date))}
                </p>
              </div>
              <div className="rounded-lg bg-stone-50 p-4">
                <p className="text-sm font-semibold text-stone-500">Remaining contact unlocks</p>
                <p className="mt-1 text-2xl font-black text-ink">{remainingContacts}</p>
              </div>
              <div className="rounded-lg bg-stone-50 p-4">
                <p className="text-sm font-semibold text-stone-500">Remaining interests</p>
                <p className="mt-1 text-2xl font-black text-ink">{remainingInterests}</p>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-lg bg-lotus p-5">
              <p className="font-bold text-ink">No active subscription</p>
              <p className="mt-2 text-sm text-stone-600">Paid features unlock only after backend Razorpay verification.</p>
              <ButtonLink href="/subscription" className="mt-4">
                View Basic plans
              </ButtonLink>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-ink">Paid feature access</h2>
          <div className="mt-4 grid gap-3 text-sm text-stone-700">
            {[
              "Unlimited profile views",
              "30 contact unlocks per month",
              "100 interests per month",
              "Advanced filters",
              "Chat only with accepted matches"
            ].map((item) => (
              <span key={item} className="flex items-center gap-2 rounded-lg bg-stone-50 p-3">
                <LockKeyhole size={16} className="text-mehendi" /> {item}
              </span>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-stone-500">
            <CalendarDays size={14} /> Limits reset monthly for active Basic plans.
          </p>
        </Card>
      </div>
    </Section>
  );
}
