"use client";
import { useEffect, useState, useCallback } from "react";

type Session = { id: string; title: string; description: string | null; scheduled_at: string };

export default function EducatorSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(() => {
    fetch("/api/v1/educator/meetings")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setSessions(data?.data ?? []))
      .catch(() => setSessions([]));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate() {
    if (!title.trim() || !scheduledAt) {
      setMessage("Title और Date/Time ज़रूरी है");
      return;
    }
    setSubmitting(true);
    setMessage("");
    try {
      const res = await fetch("/api/v1/educator/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, scheduled_at: scheduledAt }),
      });
      if (res.ok) {
        setMessage("Session बन गया, students को दिखेगा /meetings पर");
        setTitle("");
        setDescription("");
        setScheduledAt("");
        load();
      } else {
        setMessage("कुछ गलत हो गया");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
        <p className="text-sm font-semibold mb-3">नया Online Session बनाएं</p>
        <input className="input mb-2" placeholder="Session Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="input resize-none mb-2" rows={2} placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input className="input mb-2" type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
        {message ? <p className="text-xs text-orange-600 mb-2">{message}</p> : null}
        <button type="button" onClick={handleCreate} disabled={submitting} className="w-full bg-orange-500 text-white text-sm font-medium py-2.5 rounded-lg disabled:opacity-50">
          {submitting ? "बन रहा है..." : "Session बनाएं"}
        </button>
      </div>

      <p className="text-sm font-medium mb-2">सारे Sessions</p>
      <div className="space-y-2">
        {sessions.map((s) => {
          return (
            <div key={s.id} className="border border-gray-200 rounded-lg p-3">
              <p className="text-sm font-medium">{s.title}</p>
              <p className="text-xs text-gray-400">{new Date(s.scheduled_at).toLocaleString("en-IN")}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
