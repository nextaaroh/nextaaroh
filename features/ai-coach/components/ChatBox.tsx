"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { MoreVertical, Paperclip, Mic, Send, Trash2, Download, Moon, Sun } from "lucide-react";

type Role = "user" | "assistant";
type Message = { role: Role; content: string };
type Coach = "career" | "communication" | "help";

const QUICK_PROMPTS: Record<Coach, string[]> = {
  career: [
    "Resume review karni hai",
    "Ek custom 'Zero se Pro' tech roadmap banao",
    "Mock interview practice karni hai",
  ],
  communication: [
    "Mera ek jawab review karo",
    "Public speaking tips do",
    "Interview confidence kaise badhaye",
  ],
  help: [
    "NextAaroh kya hai?",
    "Career Coach kaise use karu?",
    "Apni profile kaise update karu?",
  ],
};

const COACH_NAME: Record<Coach, string> = {
  career: "NextAaroh - AI Career Coach",
  communication: "NextAaroh - AI Communication Coach",
  help: "NextAaroh - Help Assistant",
};

export default function ChatBox({
  coach,
  greeting,
}: {
  coach: Coach;
  greeting: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [recording, setRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`chat-history-${coach}`);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {
        // ignore corrupt cache
      }
    }
  }, [coach]);

  useEffect(() => {
    localStorage.setItem(`chat-history-${coach}`, JSON.stringify(messages));
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, coach]);

  async function sendMessage(text: string) {
    if (!text.trim() || isTyping) return;
    setError(null);
    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/v1/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coach, messages: nextMessages }),
      });

      const raw = await res.text();
      let data: any = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        throw new Error(`Server ne invalid response diya (status ${res.status}): ${raw.slice(0, 200)}`);
      }

      if (!res.ok) {
        throw new Error(data?.error?.message ?? `Request failed (status ${res.status})`);
      }
      if (!data?.reply) {
        throw new Error("AI se koi reply nahi mila");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Kuch galat ho gaya";
      setError(message);
    } finally {
      setIsTyping(false);
    }
  }

  function handleClearHistory() {
    setMessages([]);
    localStorage.removeItem(`chat-history-${coach}`);
    setMenuOpen(false);
  }

  function handleExportTranscript() {
    const text = messages.map((m) => `${m.role === "user" ? "You" : "Coach"}: ${m.content}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${coach}-coach-transcript.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setMenuOpen(false);
  }

  function handleAttachment(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setInput((prev) => `${prev}${prev ? " " : ""}[Attached: ${file.name}]`);
    e.target.value = "";
  }

  function handleVoiceInput() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Is browser mein voice input support nahi hai");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.onstart = () => setRecording(true);
    recognition.onend = () => setRecording(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => `${prev}${prev ? " " : ""}${transcript}`);
    };
    recognition.start();
  }

  return (
    <div className={dark ? "dark" : ""}>
      <div className="flex h-full w-full flex-col rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
              NA
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {COACH_NAME[coach]}
              </p>
              <p className="text-xs text-emerald-500">{isTyping ? "Typing..." : "Online"}</p>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Options"
            >
              <MoreVertical size={18} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 z-10 mt-1 w-48 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
                <button
                  onClick={handleClearHistory}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <Trash2 size={14} /> Clear history
                </button>
                <button
                  onClick={handleExportTranscript}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <Download size={14} /> Export transcript
                </button>
                <button
                  onClick={() => setDark((d) => !d)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  {dark ? <Sun size={14} /> : <Moon size={14} />} {dark ? "Light mode" : "Dark mode"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
          {messages.length === 0 && (
            <div className="space-y-3">
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-neutral-100 px-4 py-3 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
                {greeting}
              </div>
              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS[coach].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  m.role === "user"
                    ? "rounded-tr-sm bg-indigo-600 text-white"
                    : "rounded-tl-sm bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                }`}
              >
                {m.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  m.content
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-tl-sm bg-neutral-100 px-4 py-3 text-sm text-neutral-500 dark:bg-neutral-800">
                • • •
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 border-t border-neutral-200 px-3 py-3 dark:border-neutral-800">
          <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleAttachment} />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Attach file"
          >
            <Paperclip size={18} />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="Ask about your career, roadmap, or interview..."
            className="flex-1 rounded-full border border-neutral-300 bg-neutral-50 px-4 py-2 text-sm outline-none focus:border-indigo-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          />
          <button
            onClick={handleVoiceInput}
            className={`rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
              recording ? "text-red-500" : "text-neutral-500"
            }`}
            aria-label="Voice input"
          >
            <Mic size={18} />
          </button>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="rounded-full bg-indigo-600 p-2 text-white disabled:opacity-40"
            aria-label="Send"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
