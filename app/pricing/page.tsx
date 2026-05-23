import { Section } from "@/components/ui";
import { BASIC_PLANS } from "@/lib/plans";
import { PricingClient } from "./pricing-client";

export default function PricingPage() {
  return (
    <Section>
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-semibold text-sindoor">Basic subscription plans</p>
        <h1 className="mt-3 text-4xl font-black text-ink">Choose the plan that fits your search</h1>
        <p className="mt-4 leading-7 text-stone-600">
          Plans activate only after backend Razorpay signature verification. Expired plans cannot access paid features.
        </p>
      </div>
      <PricingClient fallbackPlans={BASIC_PLANS} />
    </Section>
  );
}
