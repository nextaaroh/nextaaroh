"use client";
import { useEffect, useState } from "react";

type Session = { id: string; title: string; description: string | null; scheduled_at: string; cover_image_url: string | null };

export default function SessionBanner() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/v1/meetings")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setSessions((data?.data ?? []).slice(0, 3)))
      .catch(() => setSessions([]));
  }, []);

  async function handleRegister(id: string) {
    try {
      await fetch("/api/v1/meetings/" + id + "/rsvp", { method: "POST" });
      setRegisteredIds((prev) => [...prev, id]);
    } catch {
      // silently ignore
    }
  }

  if (sessions.length === 0) return null;

  return (
    <div className="my-4">
      <h2 className="text-sm font-semibold px-4 mb-2">🎥 Upcoming Online Sessions</h2>
      <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {sessions.map((session) => {
          const isRegistered = registeredIds.includes(session.id);
          return (
            <div key={session.id} className="shrink-0 w-64 rounded-xl border border-gray-200 overflow-hidden">
              {session.cover_image_url ? (
                <img src={session.cover_image_url} alt={session.title} className="w-full h-28 object-cover" />
              ) : (
                <div className="w-full h-28 bg-[#0a1a3a] flex items-center justify-center text-3xl">🎥</div>
              )}
              <div className="p-3">
                <p className="text-sm font-medium line-clamp-1">{session.title}</p>
                <p className="text-xs text-gray-400 mb-2">{new Date(session.scheduled_at).toLocaleString("en-IN")}</p>
                <button
                  type="button"
                  onClick={() => handleRegister(session.id)}
                  disabled={isRegistered}
                  className="w-full bg-orange-500 text-white text-xs font-medium py-2 rounded-lg disabled:opacity-50"
                >
                  {isRegistered ? "✓ Registered" : "Register करें"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
