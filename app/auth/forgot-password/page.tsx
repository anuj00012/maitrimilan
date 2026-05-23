import { forgotPassword } from "../actions";
import { Button, Card, Field, Section } from "@/components/ui";

export default function ForgotPasswordPage({ searchParams }: { searchParams: { message?: string } }) {
  return (
    <Section className="max-w-xl">
      <Card className="p-7">
        <h1 className="text-3xl font-black text-ink">Reset password</h1>
        <p className="mt-2 text-sm text-stone-600">Enter your registered email to receive reset instructions.</p>
        {searchParams.message ? (
          <p className="mt-4 rounded-lg bg-lotus p-3 text-sm font-medium text-sindoor">{searchParams.message}</p>
        ) : null}
        <form action={forgotPassword} className="mt-6 grid gap-4">
          <Field label="Email" name="email" type="email" required />
          <Button type="submit">Send reset link</Button>
        </form>
      </Card>
    </Section>
  );
}
