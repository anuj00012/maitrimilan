import { CheckCircle2 } from "lucide-react";
import { Card, Section } from "@/components/ui";
import { createServerSupabase } from "@/lib/supabase/server";
import { PaymentButton } from "./payment-button";
import { isSupabaseConfigured } from "@/lib/env";

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
    .select("*")
    .eq("user_id", user?.id)
    .eq("status", "active")
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

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
              <p className="mt-2 text-stone-600">
                Valid until {new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(new Date(subscription.expires_at))}
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-mehendi">Premium annual</p>
              <div className="mt-4 text-5xl font-black text-ink">Rs. 4,999</div>
              <p className="mt-2 text-stone-600">1-year access for premium requests and accepted-match chat.</p>
              <div className="mt-6 grid gap-3 text-sm text-stone-700">
                {["Send premium interests", "Chat after accepted request", "Report/block safety controls", "Transparent expiry tracking"].map(
                  (item) => (
                    <span key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="text-mehendi" size={18} /> {item}
                    </span>
                  )
                )}
              </div>
              <div className="mt-7">
                <PaymentButton userEmail={user?.email} />
              </div>
            </>
          )}
        </Card>
      </div>
    </Section>
  );
}
