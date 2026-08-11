"use client";
import { useEffect, useState, useCallback } from "react";

type Video = { id: string; title: string; youtube_url: string; thumbnail_url: string; category: string | null };

const CATEGORIES = [
  { value: "skills_learning", label: "Skills Learning Classes" },
  { value: "sports_learning", label: "Sports Learning Classes" },
  { value: "digital_ai_freelancing", label: "Digital Skills, AI & Freelancing Classes" },
];

export default function AdminLearningPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [title, setTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(() => {
    fetch("/api/v1/admin/learning/videos")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setVideos(data?.data ?? []))
      .catch(() => setVideos([]));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAdd() {
    setMessage("");
    if (!title.trim() || !youtubeUrl.trim()) {
      setMessage("Title और YouTube link दोनों ज़रूरी हैं");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/admin/learning/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, youtube_url: youtubeUrl, category }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error?.message ?? "कुछ गलत हो गया");
        return;
      }
      setTitle("");
      setYoutubeUrl("");
      load();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">Learning Videos</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 max-w-md">
        <p className="text-sm font-medium mb-3">नया Video जोड़ें</p>
        <div className="space-y-2">
          <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Video Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="YouTube URL" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
          <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => {
              return <option key={c.value} value={c.value}>{c.label}</option>;
            })}
          </select>
          {message ? <p className="text-red-600 text-xs">{message}</p> : null}
          <button type="button" onClick={handleAdd} disabled={submitting} className="w-full bg-orange-500 text-white text-sm font-medium py-2 rounded-lg disabled:opacity-50">
            {submitting ? "Adding..." : "Add Video"}
          </button>
        </div>
      </div>

      <p className="text-sm font-medium mb-2">सारे Videos ({videos.length})</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {videos.map((video) => {
          const catLabel = CATEGORIES.find((c) => c.value === video.category)?.label ?? video.category;
          return (
            <div key={video.id} className="border border-gray-200 bg-white rounded-xl overflow-hidden">
              <img src={video.thumbnail_url} alt={video.title} className="w-full aspect-video object-cover" />
              <div className="p-3">
                <p className="text-sm font-medium line-clamp-2">{video.title}</p>
                {catLabel ? <p className="text-xs text-gray-400 mt-1">{catLabel}</p> : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
