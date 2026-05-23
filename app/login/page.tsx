"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, Field, Section } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState(
    searchParams.get("verified") === "true"
      ? "Email verified successfully. Please login to continue."
      : searchParams.get("registered")
        ? "Registration successful. Please verify your email before login."
        : ""
  );
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password")
      })
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setMessage(data.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Section className="max-w-xl">
      <Card className="p-7">
        <h1 className="text-3xl font-black text-ink">Login</h1>
        <p className="mt-2 text-sm text-stone-600">Use your verified email and password.</p>
        {message ? <p className="mt-4 rounded-lg bg-lotus p-3 text-sm font-medium text-sindoor">{message}</p> : null}
        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <Field label="Email" name="email" type="email" required />
          <Field label="Password" name="password" type="password" required />
          <Button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Card>
    </Section>
  );
}
