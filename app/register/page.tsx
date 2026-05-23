"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Field, Section } from "@/components/ui";

export default function RegisterPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password")
      })
    });
    const data = await response.json();
    setLoading(false);
    setMessage(data.message);
    if (response.ok) setTimeout(() => router.push("/login?registered=true"), 1200);
  }

  return (
    <Section className="max-w-xl">
      <Card className="p-7">
        <h1 className="text-3xl font-black text-ink">Create your account</h1>
        <p className="mt-2 text-sm text-stone-600">Register, verify your email, then login manually.</p>
        {message ? <p className="mt-4 rounded-lg bg-lotus p-3 text-sm font-medium text-sindoor">{message}</p> : null}
        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <Field label="Full name" name="name" required />
          <Field label="Email" name="email" type="email" required />
          <Field label="Password" name="password" type="password" required />
          <Button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </Button>
        </form>
      </Card>
    </Section>
  );
}
