import Link from "next/link";
import { login } from "../actions";
import { Card, Field, Section, Button } from "@/components/ui";

export default function LoginPage({ searchParams }: { searchParams: { message?: string } }) {
  return (
    <Section className="max-w-xl">
      <Card className="p-7">
        <h1 className="text-3xl font-black text-ink">Login</h1>
        <p className="mt-2 text-sm text-stone-600">Continue to MaitriMilan with your registered email.</p>
        {searchParams.message ? (
          <p className="mt-4 rounded-lg bg-lotus p-3 text-sm font-medium text-sindoor">{searchParams.message}</p>
        ) : null}
        <form action={login} className="mt-6 grid gap-4">
          <Field label="Email or phone" name="emailOrPhone" type="text" required />
          <Field label="Password" name="password" type="password" required />
          <Button type="submit">Login</Button>
        </form>
        <div className="mt-5 flex items-center justify-between text-sm">
          <Link className="font-semibold text-sindoor" href="/auth/forgot-password">
            Forgot password?
          </Link>
          <Link className="font-semibold text-sindoor" href="/auth/register">
            Create account
          </Link>
        </div>
      </Card>
    </Section>
  );
}
