import { Flag, ShieldAlert } from "lucide-react";
import { Card, Section } from "@/components/ui";
import { createServerSupabase } from "@/lib/supabase/server";
import { ChatBox } from "./chat-box";
import { blockMatch, reportMatch } from "./safety-actions";
import { isSupabaseConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function ChatPage({ params }: { params: { matchId: string } }) {
  if (!isSupabaseConfigured()) {
    return (
      <Section>
        <Card>Supabase is required for accepted-match chat. Add env keys and restart the dev server.</Card>
      </Section>
    );
  }

  const supabase = createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: match } = await supabase
    .from("matches")
    .select("*")
    .eq("id", params.matchId)
    .eq("status", "active")
    .or(`user_one_id.eq.${user?.id},user_two_id.eq.${user?.id}`)
    .maybeSingle();

  if (!user || !match) {
    return (
      <Section>
        <Card>Chat is available only for accepted matches.</Card>
      </Section>
    );
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("id,sender_id,body,created_at")
    .eq("match_id", params.matchId)
    .order("created_at", { ascending: true });

  return (
    <Section>
      <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-black text-ink">Accepted-match chat</h1>
          <p className="mt-2 text-stone-600">This conversation is available because the request was accepted.</p>
        </div>
        <div className="flex gap-2">
          <form action={reportMatch}>
            <input type="hidden" name="matchId" value={params.matchId} />
            <button className="inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-bold text-stone-700">
              <Flag size={16} /> Report
            </button>
          </form>
          <form action={blockMatch}>
            <input type="hidden" name="matchId" value={params.matchId} />
            <button className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white">
              <ShieldAlert size={16} /> Block
            </button>
          </form>
        </div>
      </div>
      <ChatBox matchId={params.matchId} currentUserId={user.id} initialMessages={messages || []} />
    </Section>
  );
}
