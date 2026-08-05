"use client";
import { useEffect, useState } from "react";
import VideoCard from "@/features/learning/components/VideoCard";

type Video = {
  id: string;
  title: string;
  youtube_url: string;
  thumbnail_url: string;
};

export default function LearningPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/learning/videos")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setVideos(data?.data ?? []))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="px-4 pt-4 pb-3 border-b border-gray-100">
        <h1 className="text-lg font-bold">
          Next<span className="text-orange-500">Aaroh</span> Learning
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">Videos जल्द ही यहां जुड़ेंगे</p>
      </div>

      {loading ? <p className="text-center text-gray-400 text-sm py-8">Loading...</p> : null}
      {!loading && videos.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-8">अभी कोई video उपलब्ध नहीं है</p>
      ) : null}

      <div className="px-4 pt-3 space-y-4">
        {videos.map((video) => {
          return <VideoCard key={video.id} video={video} />;
        })}
      </div>
    </div>
  );
}
