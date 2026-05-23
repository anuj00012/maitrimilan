"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Send } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/browser";

type Message = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export function ChatBox({
  matchId,
  currentUserId,
  initialMessages
}: {
  matchId: string;
  currentUserId: string;
  initialMessages: Message[];
}) {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const channel = supabase
      .channel(`match:${matchId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `match_id=eq.${matchId}` },
        (payload) => setMessages((current) => [...current, payload.new as Message])
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId, supabase]);

  function sendMessage() {
    const body = text.trim();
    if (!body) return;
    setText("");
    startTransition(async () => {
      await supabase.from("messages").insert({ match_id: matchId, sender_id: currentUserId, body });
    });
  }

  return (
    <div className="grid min-h-[60vh] grid-rows-[1fr_auto] rounded-lg border border-stone-200 bg-white shadow-soft">
      <div className="grid content-end gap-3 overflow-y-auto p-4">
        {messages.map((message) => {
          const own = message.sender_id === currentUserId;
          return (
            <div key={message.id} className={own ? "text-right" : "text-left"}>
              <p
                className={
                  own
                    ? "ml-auto inline-block max-w-[82%] rounded-lg bg-sindoor px-4 py-2 text-sm text-white"
                    : "inline-block max-w-[82%] rounded-lg bg-lotus px-4 py-2 text-sm text-ink"
                }
              >
                {message.body}
              </p>
            </div>
          );
        })}
        {messages.length === 0 ? <p className="text-center text-sm text-stone-500">No messages yet.</p> : null}
      </div>
      <div className="flex gap-2 border-t border-stone-200 p-3">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") sendMessage();
          }}
          placeholder="Type a respectful message"
          disabled={isPending}
        />
        <button
          onClick={sendMessage}
          className="grid h-11 w-12 place-items-center rounded-lg bg-sindoor text-white hover:bg-ink"
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
