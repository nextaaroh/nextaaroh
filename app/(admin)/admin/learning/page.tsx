"use client";
import { useEffect, useState, useCallback } from "react";

type Video = {
  id: string;
  title: string;
  youtube_url: string;
  thumbnail_url: string;
  category: string | null;
};

export default function AdminLearningPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [title, setTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [category, setCategory] = useState("");
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
      setCategory("");
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
          <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="YouTube URL (https://youtube.com/watch?v=...)" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
          <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Category (optional)" value={category} onChange={(e) => setCategory(e.target.value)} />
          {message ? <p className="text-red-600 text-xs">{message}</p> : null}
          <button type="button" onClick={handleAdd} disabled={submitting} className="w-full bg-orange-500 text-white text-sm font-medium py-2 rounded-lg disabled:opacity-50">
            {submitting ? "Adding..." : "Add Video"}
          </button>
        </div>
      </div>

      <p className="text-sm font-medium mb-2">सारे Videos ({videos.length})</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {videos.map((video) => {
          return (
            <div key={video.id} className="border border-gray-200 bg-white rounded-xl overflow-hidden">
              <img src={video.thumbnail_url} alt={video.title} className="w-full aspect-video object-cover" />
              <div className="p-3">
                <p className="text-sm font-medium line-clamp-2">{video.title}</p>
                {video.category ? <p className="text-xs text-gray-400 mt-1">{video.category}</p> : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
