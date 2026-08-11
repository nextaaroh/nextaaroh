"use client";
import { useEffect, useState, useRef, useCallback } from "react";

type Message = { id: string; sender_id: string; message: string; created_at: string };

export default function ManagerChatWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [myId, setMyId] = useState("");
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = useCallback(() => {
    fetch("/api/v1/chat/manager")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setMessages(data.messages ?? []);
          setMyId(data.my_id);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 4000);
    return () => clearInterval(interval);
  }, [load]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setInput("");
    try {
      await fetch("/api/v1/chat/manager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      load();
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-[75vh] max-w-md mx-auto p-4">
      <div className="border-b border-gray-200 pb-3 mb-3">
        <p className="font-semibold text-sm">💬 Chat to Support Team</p>
        <p className="text-xs text-gray-400">हमारी Support Team आपकी मदद के लिए यहां है</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {messages.length === 0 ? <p className="text-center text-gray-400 text-sm py-8">कोई सवाल है? यहीं लिखिए।</p> : null}
        {messages.map((msg) => {
          const isMe = msg.sender_id === myId;
          return (
            <div key={msg.id} className={isMe ? "flex justify-end" : "flex justify-start"}>
              <div className={isMe ? "bg-orange-500 text-white rounded-2xl rounded-br-sm px-4 py-2 max-w-[80%] text-sm" : "bg-gray-100 text-gray-800 rounded-2xl rounded-bl-sm px-4 py-2 max-w-[80%] text-sm"}>
                {msg.message}
                <p className={isMe ? "text-[10px] text-white/70 mt-1" : "text-[10px] text-gray-400 mt-1"}>
                  {new Date(msg.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 border-t border-gray-200 pt-3">
        <input
          className="input"
          placeholder="अपना सवाल लिखें..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button type="button" onClick={handleSend} disabled={sending || !input.trim()} className="shrink-0 bg-orange-500 text-white px-4 rounded-lg text-sm font-medium disabled:opacity-50">
          भेजें
        </button>
      </div>
    </div>
  );
}
