"use client";
import { useState } from "react";

type Video = {
  id: string;
  title: string;
  youtube_url: string;
  thumbnail_url: string;
};

function extractYoutubeId(url: string): string {
  const match = url.match(/(?:v=|youtu\.be\/|shorts\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : "";
}

function getFakeRating(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 1000;
  }
  const rating = (3.7 + (hash % 13) / 10).toFixed(1);
  const count = 100 + (hash % 4800);
  return { rating, count };
}

export default function VideoCard({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false);
  const { rating, count } = getFakeRating(video.id);
  const videoId = extractYoutubeId(video.youtube_url);

  return (
    <div className="border-b border-gray-100 pb-4">
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
        {playing ? (
          <iframe
            src={"https://www.youtube-nocookie.com/embed/" + videoId + "?autoplay=1&rel=0&modestbranding=1"}
            className="w-full h-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} className="absolute inset-0 w-full h-full">
            <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center">
                <span className="text-white text-xl ml-0.5">▶</span>
              </div>
            </div>
          </button>
        )}
      </div>
      <p className="text-sm font-medium mt-2">{video.title}</p>
      <div className="flex items-center gap-1 mt-1">
        <span className="text-yellow-500 text-xs">★</span>
        <span className="text-xs font-medium text-gray-700">{rating}</span>
        <span className="text-xs text-gray-400">({count})</span>
      </div>
    </div>
  );
}
