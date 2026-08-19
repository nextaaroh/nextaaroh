"use client";
import { useEffect, useState } from "react";
import VideoCard from "@/features/learning/components/VideoCard";

type Video = { id: string; title: string; youtube_url: string; thumbnail_url: string };

const SKILL_CATEGORIES = [
  { value: "", label: "All", emoji: "🌐", videoCategory: "" },
  { value: "ai", label: "AI", emoji: "🤖", videoCategory: "digital_ai_freelancing" },
  { value: "career", label: "Career", emoji: "💼", videoCategory: "skills_learning" },
  { value: "communication", label: "Communication", emoji: "🗣️", videoCategory: "skills_learning" },
{ value: "sports", label: "Sports", emoji: "🏅", videoCategory: "sports_learning" },
  { value: "digital", label: "Digital", emoji: "💻", videoCategory: "digital_ai_freelancing" },
  { value: "business", label: "Business", emoji: "📈", videoCategory: "digital_ai_freelancing" },
  { value: "creative", label: "Creative", emoji: "🎨", videoCategory: "skills_learning" },
  
];

export default function LearningPage() {
  const [skillCategory, setSkillCategory] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const selected = SKILL_CATEGORIES.find((c) => c.value === skillCategory);
    const query = selected?.videoCategory ? "?category=" + selected.videoCategory : "";
    fetch("/api/v1/learning/videos" + query)
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setVideos(data?.data ?? []))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, [skillCategory]);

  return (
    <div>
      <div className="px-4 pt-4 pb-3 border-b border-gray-100">
        <h1 className="text-lg font-bold">
          Next<span className="text-orange-500">Aaroh</span> Learning
        </h1>
      </div>

      <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
        <a href="/quiz" className="shrink-0 flex flex-col items-center gap-1 bg-white border border-gray-200 rounded-xl px-4 py-2">
          <span className="text-lg">📝</span>
          <span className="text-[10px] font-medium text-gray-700">Quiz</span>
        </a>
        <div className="shrink-0 flex flex-col items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 opacity-60">
          <span className="text-lg">🎓</span>
          <span className="text-[10px] font-medium text-gray-500">Courses</span>
          <span className="text-[8px] text-gray-400">जल्द आ रहा है</span>
        </div>
        <div className="shrink-0 flex flex-col items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 opacity-60">
          <span className="text-lg">🏋️</span>
          <span className="text-[10px] font-medium text-gray-500">Practice</span>
          <span className="text-[8px] text-gray-400">जल्द आ रहा है</span>
        </div>
        <div className="shrink-0 flex flex-col items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 opacity-60">
          <span className="text-lg">🏆</span>
          <span className="text-[10px] font-medium text-gray-500">Challenges</span>
          <span className="text-[8px] text-gray-400">जल्द आ रहा है</span>
        </div>
      </div>

      <div className="px-4 pb-3 border-b border-gray-100">
        <div className="grid grid-cols-2 gap-2">
          {SKILL_CATEGORIES.map((c) => {
            const isActive = skillCategory === c.value;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => setSkillCategory(c.value)}
                className={
                  isActive
                    ? "flex items-center gap-2 bg-orange-500 text-white text-xs font-medium rounded-xl px-3 py-2.5"
                    : "flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-xl px-3 py-2.5"
                }
              >
                <span className="text-base">{c.emoji}</span>
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
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
