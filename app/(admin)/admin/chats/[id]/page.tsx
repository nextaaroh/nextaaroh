"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";

type Message = { id: string; sender_id: string; message: string; created_at: string };
type ConversationInfo = { student_id: string; profiles: { full_name: string; username: string; mobile_number: string } | null };

export default function AdminChatThreadPage() {
  const params = useParams<{ id: string }>();
  const [conversation, setConversation] = useState<ConversationInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const load = useCallback(() => {
    fetch("/api/v1/manager/chats/" + params.id)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setConversation(data.conversation);
          setMessages(data.messages ?? []);
        }
      })
      .catch(() => {});
  }, [params.id]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 4000);
    return () => clearInterval(interval);
  }, [load]);

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setInput("");
    try {
      await fetch("/api/v1/manager/chats/" + params.id + "/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      load();
    } finally {
      setSending(false);
    }
  }

  const whatsappLink = conversation?.profiles?.mobile_number ? "https://wa.me/91" + conversation.profiles.mobile_number : null;

  return (
    <div className="max-w-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-semibold">{conversation?.profiles?.full_name}</p>
          <p className="text-xs text-gray-400">@{conversation?.profiles?.username}</p>
        </div>
        {whatsappLink ? (
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg">WhatsApp</a>
        ) : null}
      </div>

      <div className="h-[55vh] overflow-y-auto space-y-3 border border-gray-200 rounded-xl p-3 bg-white mb-3">
        {messages.map((msg) => {
          const isMe = msg.sender_id !== conversation?.student_id;
          return (
            <div key={msg.id} className={isMe ? "flex justify-end" : "flex justify-start"}>
              <div className={isMe ? "bg-orange-500 text-white rounded-2xl rounded-br-sm px-4 py-2 max-w-[80%] text-sm" : "bg-gray-100 text-gray-800 rounded-2xl rounded-bl-sm px-4 py-2 max-w-[80%] text-sm"}>
                {msg.message}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
          placeholder="Reply लिखें..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button type="button" onClick={handleSend} disabled={sending || !input.trim()} className="bg-orange-500 text-white px-4 rounded-lg text-sm font-medium disabled:opacity-50">
          भेजें
        </button>
      </div>
    </div>
  );
}
