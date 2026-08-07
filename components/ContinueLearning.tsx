"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Video = { id: string; title: string; thumbnail_url: string };

export default function ContinueLearning() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    fetch("/api/v1/learning/continue")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setVideos(data?.data ?? []))
      .catch(() => setVideos([]));
  }, []);

  if (videos.length === 0) return null;

  return (
    <div className="my-4">
      <h2 className="text-sm font-semibold px-4 mb-2">Continue Learning</h2>
      <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {videos.map((video) => {
          return (
            <Link key={video.id} href="/learning" className="shrink-0 w-40">
              <div className="w-40 aspect-video rounded-lg overflow-hidden bg-gray-100">
                <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
              </div>
              <p className="text-xs font-medium mt-1 line-clamp-2">{video.title}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
