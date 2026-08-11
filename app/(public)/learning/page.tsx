"use client";
import { useEffect, useState } from "react";
import VideoCard from "@/features/learning/components/VideoCard";

type Video = { id: string; title: string; youtube_url: string; thumbnail_url: string };

const TABS = [
  { value: "", label: "All" },
  { value: "skills_learning", label: "Skills" },
  { value: "sports_learning", label: "Sports" },
  { value: "digital_ai_freelancing", label: "AI & Freelancing" },
];

export default function LearningPage() {
  const [category, setCategory] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const query = category ? "?category=" + category : "";
    fetch("/api/v1/learning/videos" + query)
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setVideos(data?.data ?? []))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div>
      <div className="px-4 pt-4 pb-3 border-b border-gray-100">
        <h1 className="text-lg font-bold">
          Next<span className="text-orange-500">Aaroh</span> Learning
        </h1>
      </div>

      <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-hide">
        {TABS.map((tab) => {
          const isActive = category === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setCategory(tab.value)}
              className={isActive ? "shrink-0 text-xs font-medium bg-orange-500 text-white rounded-full px-3 py-1.5" : "shrink-0 text-xs font-medium bg-gray-100 text-gray-600 rounded-full px-3 py-1.5"}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {loading ? <p className="text-center text-gray-400 text-sm py-8">Loading...</p> : null}
      {!loading && videos.length === 0 ? <p className="text-center text-gray-400 text-sm py-8">अभी कोई video उपलब्ध नहीं है</p> : null}

      <div className="px-4 pt-3 space-y-4">
        {videos.map((video) => {
          return <VideoCard key={video.id} video={video} />;
        })}
      </div>
    </div>
  );
}
