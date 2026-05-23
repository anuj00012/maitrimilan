import { Card, Section } from "@/components/ui";

export default function VerifyEmailPage() {
  return (
    <Section className="max-w-xl">
      <Card>
        <h1 className="text-3xl font-black text-ink">Check your email</h1>
        <p className="mt-3 text-stone-600">
          We sent a verification link. After verification, you will be sent to the login page and must login manually.
        </p>
      </Card>
    </Section>
  );
}
