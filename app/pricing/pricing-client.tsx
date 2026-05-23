"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { formatRupees, type Plan } from "@/lib/plans";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpay() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function PricingClient({ fallbackPlans }: { fallbackPlans: Plan[] }) {
  const [plans, setPlans] = useState<Plan[]>(fallbackPlans);
  const [message, setMessage] = useState("");
  const [loadingPlan, setLoadingPlan] = useState("");

  useEffect(() => {
    fetch("/api/plans")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) setPlans(data);
      })
      .catch(() => undefined);
  }, []);

  async function buy(planId: string) {
    setLoadingPlan(planId);
    setMessage("");
    const loaded = await loadRazorpay();
    if (!loaded) {
      setLoadingPlan("");
      setMessage("Razorpay checkout could not load.");
      return;
    }

    const orderResponse = await fetch("/api/payments/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId })
    });
    const order = await orderResponse.json();
    if (!orderResponse.ok) {
      setLoadingPlan("");
      setMessage(order.message || order.error || "Could not create order.");
      return;
    }

    const Razorpay = window.Razorpay;
    if (!Razorpay) return;

    new Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "MaitriMilan",
      description: order.plan?.name,
      order_id: order.id,
      theme: { color: "#B23A48" },
      handler: async (response: Record<string, string>) => {
        const verify = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response)
        });
        const data = await verify.json();
        setMessage(data.message || (verify.ok ? "Payment successful." : "Payment failed."));
        if (verify.ok) window.location.href = "/dashboard";
      },
      modal: { ondismiss: () => setLoadingPlan("") }
    }).open();
  }

  return (
    <>
      {message ? <p className="mt-6 rounded-lg bg-lotus p-3 text-sm font-medium text-sindoor">{message}</p> : null}
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {plans.map((plan) => {
          const badge = plan.id === "basic_3_months" ? "Most Popular" : plan.id === "basic_6_months" ? "Best Value" : "";
          return (
            <Card key={plan.id} className={badge ? "relative border-sindoor/30" : "relative"}>
              {badge ? (
                <span className="absolute right-4 top-4 rounded-full bg-sindoor px-3 py-1 text-xs font-bold text-white">
                  {badge}
                </span>
              ) : null}
              <p className="font-bold text-sindoor">{plan.name}</p>
              <div className="mt-4 text-4xl font-black text-ink">{formatRupees(plan.price)}</div>
              <p className="mt-1 text-sm text-stone-500">Valid for {plan.duration_days} days</p>
              <div className="mt-5 grid gap-2 text-sm text-stone-700">
                {[
                  "Unlimited profile views",
                  "30 contact unlocks per month",
                  "100 interests per month",
                  "Chat only with accepted matches",
                  "Advanced filters",
                  "See who viewed profile",
                  "Basic search priority",
                  "No verified badge",
                  "No video call",
                  "No relationship manager"
                ].map((feature) => (
                  <span key={feature} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-mehendi" size={16} /> {feature}
                  </span>
                ))}
              </div>
              <Button onClick={() => buy(plan.id)} disabled={loadingPlan === plan.id} className="mt-6 w-full">
                {loadingPlan === plan.id ? "Opening..." : "Buy Now"}
              </Button>
            </Card>
          );
        })}
      </div>
    </>
  );
}
