import { register } from "../actions";
import { Button, Card, Field, Section } from "@/components/ui";

export default function RegisterPage({ searchParams }: { searchParams: { message?: string } }) {
  return (
    <Section className="max-w-xl">
      <Card className="p-7">
        <h1 className="text-3xl font-black text-ink">Register</h1>
        <p className="mt-2 text-sm text-stone-600">Create an account before completing verification.</p>
        {searchParams.message ? (
          <p className="mt-4 rounded-lg bg-lotus p-3 text-sm font-medium text-sindoor">{searchParams.message}</p>
        ) : null}
        <form action={register} className="mt-6 grid gap-4">
          <Field label="Email or phone" name="emailOrPhone" type="text" required />
          <Field label="Password" name="password" type="password" required />
          <div className="grid gap-2">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" required>
              <option value="bride">Bride</option>
              <option value="groom">Groom</option>
            </select>
          </div>
          <Button type="submit">Create account</Button>
        </form>
      </Card>
    </Section>
  );
}
