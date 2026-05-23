"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

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

export function PaymentButton({ userEmail }: { userEmail?: string | null }) {
  const [loading, setLoading] = useState(false);

  async function startPayment() {
    setLoading(true);
    const loaded = await loadRazorpay();
    if (!loaded) {
      setLoading(false);
      alert("Razorpay checkout could not load.");
      return;
    }

    const orderResponse = await fetch("/api/razorpay/order", { method: "POST" });
    const order = await orderResponse.json();
    const Razorpay = window.Razorpay;
    if (!Razorpay) {
      setLoading(false);
      alert("Razorpay checkout is unavailable.");
      return;
    }

    const razorpay = new Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "MaitriMilan",
      description: "1-year premium membership",
      order_id: order.id,
      prefill: { email: userEmail || "" },
      theme: { color: "#B23A48" },
      handler: async (response: Record<string, string>) => {
        const verifyResponse = await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response)
        });
        if (verifyResponse.ok) window.location.href = "/subscription?message=Membership activated.";
        else alert("Payment verification failed. Please contact support.");
      },
      modal: {
        ondismiss: () => setLoading(false)
      }
    });

    razorpay.open();
  }

  return (
    <Button onClick={startPayment} disabled={loading} className="w-full">
      {loading ? "Opening checkout..." : "Pay securely with Razorpay"}
    </Button>
  );
}
