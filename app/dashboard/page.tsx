import Link from "next/link";
import { CalendarDays, CreditCard, Eye, HeartHandshake, LockKeyhole } from "lucide-react";
import { ButtonLink, Card, Section } from "@/components/ui";
import { getSessionUser } from "@/lib/custom-auth";
import { getActiveCustomSubscription } from "@/lib/subscription-core";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = getSessionUser();

  if (!user) {
    return (
      <Section className="max-w-2xl">
        <Card>
          <h1 className="text-2xl font-black text-ink">Login required</h1>
          <p className="mt-2 text-stone-600">Please login to view your dashboard.</p>
          <ButtonLink href="/login" className="mt-5">
            Login
          </ButtonLink>
        </Card>
      </Section>
    );
  }

  let subscription: any = null;
  try {
    subscription = await getActiveCustomSubscription(user.id);
  } catch {
    subscription = null;
  }

  const startDate = subscription?.start_date ? new Date(subscription.start_date) : null;
  const endDate = subscription?.end_date ? new Date(subscription.end_date) : null;
  const daysRemaining = endDate
    ? Math.max(Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)), 0)
    : 0;

  return (
    <Section>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-semibold text-sindoor">Welcome, {user.name}</p>
          <h1 className="mt-2 text-3xl font-black text-ink">Dashboard</h1>
          <p className="mt-2 text-stone-600">Your plan, paid feature limits, and account status.</p>
        </div>
        <ButtonLink href="/pricing">Upgrade plan</ButtonLink>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-4">
        <Card>
          <CreditCard className="text-sindoor" />
          <p className="mt-3 text-sm text-stone-500">Active plan</p>
          <p className="mt-1 text-xl font-black text-ink">{subscription?.name || "No active plan"}</p>
        </Card>
        <Card>
          <CalendarDays className="text-sindoor" />
          <p className="mt-3 text-sm text-stone-500">Days remaining</p>
          <p className="mt-1 text-xl font-black text-ink">{daysRemaining}</p>
        </Card>
        <Card>
          <LockKeyhole className="text-sindoor" />
          <p className="mt-3 text-sm text-stone-500">Contact unlocks left</p>
          <p className="mt-1 text-xl font-black text-ink">
            {subscription ? subscription.contact_unlock_limit - subscription.contact_unlocks_used : 0}
          </p>
        </Card>
        <Card>
          <HeartHandshake className="text-sindoor" />
          <p className="mt-3 text-sm text-stone-500">Interests left</p>
          <p className="mt-1 text-xl font-black text-ink">
            {subscription ? subscription.interest_limit - subscription.interests_used : 0}
          </p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <h2 className="text-xl font-bold text-ink">Subscription details</h2>
          {subscription ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Info label="Start date" value={startDate ? startDate.toLocaleDateString("en-IN") : "-"} />
              <Info label="Expiry date" value={endDate ? endDate.toLocaleDateString("en-IN") : "-"} />
              <Info label="Payment status" value="Paid and verified" />
              <Info label="Subscription status" value={subscription.status} />
            </div>
          ) : (
            <div className="mt-5 rounded-lg bg-lotus p-5">
              <p className="font-bold text-ink">No active subscription found</p>
              <p className="mt-2 text-sm text-stone-600">Buy a Basic plan to unlock paid features.</p>
              <ButtonLink href="/pricing" className="mt-4">
                View pricing
              </ButtonLink>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-ink">Paid features</h2>
          <div className="mt-4 grid gap-3 text-sm text-stone-700">
            {[
              "Unlimited profile views",
              "30 contact unlocks per month",
              "100 interests per month",
              "Chat only with accepted matches",
              "Advanced filters",
              "See who viewed profile",
              "Basic search priority"
            ].map((item) => (
              <span key={item} className="flex items-center gap-2 rounded-lg bg-stone-50 p-3">
                <Eye size={16} className="text-mehendi" /> {item}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs text-stone-500">
            No verified badge, video call, or relationship manager included in Basic plans.
          </p>
        </Card>
      </div>
    </Section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-lotus p-4">
      <p className="text-sm font-semibold text-stone-500">{label}</p>
      <p className="mt-1 text-lg font-black text-ink">{value}</p>
    </div>
  );
}
