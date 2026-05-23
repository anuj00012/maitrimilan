import Link from "next/link";
import { Check, X } from "lucide-react";
import { Button, Card, Section } from "@/components/ui";
import { createServerSupabase } from "@/lib/supabase/server";
import { respondToInterest } from "./actions";
import { isSupabaseConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function RequestsPage({ searchParams }: { searchParams: { message?: string } }) {
  if (!isSupabaseConfigured()) {
    return (
      <Section>
        <h1 className="text-3xl font-black text-ink">Requests</h1>
        <Card className="mt-6">
          <p className="font-bold text-ink">Supabase is not configured yet.</p>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`, then restart the dev
            server to use sent requests, received requests, accepted matches, and chat.
          </p>
        </Card>
      </Section>
    );
  }

  const supabase = createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const [{ data: sent }, { data: received }, { data: matches }] = await Promise.all([
    supabase
      .from("interests")
      .select("id,status,created_at,receiver:receiver_profile_id(full_name,city,state)")
      .eq("sender_id", user?.id),
    supabase
      .from("interests")
      .select("id,status,created_at,sender:sender_profile_id(full_name,city,state)")
      .eq("receiver_id", user?.id),
    supabase.from("matches").select("id,status,created_at").or(`user_one_id.eq.${user?.id},user_two_id.eq.${user?.id}`)
  ]);

  return (
    <Section>
      <h1 className="text-3xl font-black text-ink">Requests</h1>
      <p className="mt-2 text-stone-600">Chat opens after a received request is accepted.</p>
      {searchParams.message ? (
        <p className="mt-4 rounded-lg bg-lotus p-3 text-sm font-medium text-sindoor">{searchParams.message}</p>
      ) : null}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-xl font-bold text-ink">Received requests</h2>
          <div className="mt-4 grid gap-3">
            {(received || []).map((item: any) => (
              <div key={item.id} className="rounded-lg bg-stone-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-ink">{item.sender?.full_name || "Profile"}</p>
                    <p className="text-sm text-stone-500">
                      {[item.sender?.city, item.sender?.state].filter(Boolean).join(", ")}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-sindoor">Status: {item.status}</p>
                  </div>
                  {item.status === "pending" ? (
                    <form action={respondToInterest} className="flex gap-2">
                      <input type="hidden" name="interestId" value={item.id} />
                      <Button className="px-3 py-2" type="submit" name="action" value="accept">
                        <Check size={16} />
                      </Button>
                      <Button className="bg-stone-700 px-3 py-2" type="submit" name="action" value="reject">
                        <X size={16} />
                      </Button>
                    </form>
                  ) : null}
                </div>
              </div>
            ))}
            {(!received || received.length === 0) && <p className="text-sm text-stone-500">No received requests yet.</p>}
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-bold text-ink">Sent requests</h2>
          <div className="mt-4 grid gap-3">
            {(sent || []).map((item: any) => (
              <div key={item.id} className="rounded-lg bg-stone-50 p-4">
                <p className="font-bold text-ink">{item.receiver?.full_name || "Profile"}</p>
                <p className="text-sm text-stone-500">
                  {[item.receiver?.city, item.receiver?.state].filter(Boolean).join(", ")}
                </p>
                <p className="mt-1 text-sm font-semibold text-sindoor">Status: {item.status}</p>
              </div>
            ))}
            {(!sent || sent.length === 0) && <p className="text-sm text-stone-500">No sent requests yet.</p>}
          </div>
        </Card>
      </div>
      <Card className="mt-6">
        <h2 className="text-xl font-bold text-ink">Accepted chats</h2>
        <div className="mt-4 grid gap-3">
          {(matches || []).map((match) => (
            <Link
              key={match.id}
              href={`/chat/${match.id}`}
              className="rounded-lg bg-lotus p-4 font-bold text-ink hover:text-sindoor"
            >
              Open chat from accepted request
            </Link>
          ))}
          {(!matches || matches.length === 0) && <p className="text-sm text-stone-500">No accepted chats yet.</p>}
        </div>
      </Card>
    </Section>
  );
}
