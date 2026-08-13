"use client";
import { useEffect, useState, useCallback } from "react";
import { uploadToImgbb } from "@/lib/imgbb/uploadImage";

type Meeting = { id: string; title: string; scheduled_at: string; stream_embed_url: string | null };

export default function AdminMeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [streamLink, setStreamLink] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(() => {
    fetch("/api/v1/admin/meetings")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setMeetings(data?.data ?? []))
      .catch(() => setMeetings([]));
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
      let coverUrl: string | null = null;
      if (coverFile) {
        setMessage("Cover photo upload हो रही है...");
        coverUrl = await uploadToImgbb(coverFile);
      }
      const res = await fetch("/api/v1/admin/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, scheduled_at: scheduledAt, cover_image_url: coverUrl, stream_embed_url: streamLink }),
      });
      if (res.ok) {
        setMessage("Session बन गया, Home page पर दिखेगा");
        setTitle(""); setDescription(""); setScheduledAt(""); setStreamLink(""); setCoverFile(null);
        load();
      } else {
        setMessage("कुछ गलत हो गया");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "कुछ गलत हो गया");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">Meetings / Online Sessions</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 max-w-md">
        <p className="text-sm font-semibold mb-3">नया Session बनाएं</p>
        <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2" rows={2} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2" type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
        <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2" placeholder="Zoom/Meet Link (optional)" value={streamLink} onChange={(e) => setStreamLink(e.target.value)} />
        <div className="mb-2">
          <label className="text-xs text-gray-500 block mb-1">Cover Photo (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        </div>
        {message ? <p className="text-xs text-orange-600 mb-2">{message}</p> : null}
        <button type="button" onClick={handleCreate} disabled={submitting} className="w-full bg-orange-500 text-white text-sm font-medium py-2 rounded-lg disabled:opacity-50">
          {submitting ? "बन रहा है..." : "Session बनाएं"}
        </button>
      </div>

      <p className="text-sm font-medium mb-2">सारे Sessions ({meetings.length})</p>
      <div className="space-y-2">
        {meetings.map((m) => {
          return (
            <div key={m.id} className="bg-white border border-gray-200 rounded-lg p-3">
              <p className="text-sm font-medium">{m.title}</p>
              <p className="text-xs text-gray-400">{new Date(m.scheduled_at).toLocaleString("en-IN")}</p>
              {m.stream_embed_url ? <p className="text-xs text-blue-600 truncate">{m.stream_embed_url}</p> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
