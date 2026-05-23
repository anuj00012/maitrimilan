import { CheckCircle2 } from "lucide-react";
import { Card, Section } from "@/components/ui";
import { createServerSupabase } from "@/lib/supabase/server";
import { PaymentButton } from "./payment-button";
import { isSupabaseConfigured } from "@/lib/env";
import { BASIC_PLANS, formatRupees } from "@/lib/plans";

export const dynamic = "force-dynamic";

export default async function SubscriptionPage({ searchParams }: { searchParams: { message?: string } }) {
  if (!isSupabaseConfigured()) {
    return (
      <Section>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-black text-ink">Membership</h1>
          <Card className="mt-8 p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-mehendi">Premium annual</p>
            <div className="mt-4 text-5xl font-black text-ink">Rs. 4,999</div>
            <p className="mt-3 text-stone-600">
              Supabase is not configured yet, so checkout is disabled in this local preview. Add Supabase and Razorpay
              env keys to activate payments.
            </p>
          </Card>
        </div>
      </Section>
    );
  }

  const supabase = createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*, plans(*)")
    .eq("user_id", user?.id)
    .eq("status", "active")
    .gt("end_date", new Date().toISOString())
    .maybeSingle();
  const { data: plans } = await supabase.from("plans").select("*").order("price", { ascending: true });
  const availablePlans = plans?.length ? plans : BASIC_PLANS;

  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-black text-ink">Membership</h1>
        <p className="mt-2 text-stone-600">Free members can create a profile. Premium unlocks annual request access.</p>
        {searchParams.message ? (
          <p className="mt-4 rounded-lg bg-lotus p-3 text-sm font-medium text-sindoor">{searchParams.message}</p>
        ) : null}
        <Card className="mt-8 p-8">
          {subscription ? (
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-mehendi">Active plan</p>
              <h2 className="mt-3 text-3xl font-black text-ink">Premium annual membership</h2>
              <p className="mt-2 text-stone-600">Plan: {subscription.plans?.name || "Basic Plan"}</p>
              <p className="mt-2 text-stone-600">
                Valid until {new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(new Date(subscription.end_date))}
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-mehendi">Basic plans</p>
              <h2 className="mt-3 text-3xl font-black text-ink">Choose your MaitriMilan access</h2>
              <p className="mt-2 text-stone-600">
                Subscription starts only after backend Razorpay signature verification.
              </p>
              <div className="mt-7 grid gap-4 md:grid-cols-3">
                {availablePlans.map((plan) => (
                  <Card key={plan.id} className="flex flex-col shadow-none">
                    <p className="font-bold text-sindoor">{plan.name}</p>
                    <div className="mt-3 text-3xl font-black text-ink">{formatRupees(plan.price)}</div>
                    <p className="mt-1 text-sm text-stone-500">{plan.duration_days} days validity</p>
                    <div className="mt-4 grid gap-2 text-sm text-stone-700">
                      {[
                        "Unlimited profile views",
                        "30 contact unlocks per month",
                        "100 interests per month",
                        "Chat with accepted matches",
                        "Advanced filters",
                        "See who viewed profile",
                        "Basic search priority"
                      ].map((item) => (
                        <span key={item} className="flex gap-2">
                          <CheckCircle2 className="mt-0.5 shrink-0 text-mehendi" size={16} /> {item}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto pt-5">
                      <PaymentButton planId={plan.id} userEmail={user?.email} />
                    </div>
                  </Card>
                ))}
              </div>
              <p className="mt-5 rounded-lg bg-lotus p-3 text-sm text-stone-600">
                Basic plans do not include a verified badge, video calls, or a relationship manager.
              </p>
            </>
          )}
        </Card>
      </div>
    </Section>
  );
}
