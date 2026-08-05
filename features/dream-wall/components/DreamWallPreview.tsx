"use client";
import { useEffect, useState } from "react";

type DreamPost = {
  id: string;
  dream_text: string;
};

export default function DreamWallPreview() {
  const [posts, setPosts] = useState<DreamPost[]>([]);

  useEffect(() => {
    fetch("/api/v1/dream-wall")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setPosts((data?.data ?? []).slice(0, 4)))
      .catch(() => setPosts([]));
  }, []);

  if (posts.length === 0) return null;

  return (
    <div className="my-4 px-4">
      <h2 className="text-sm font-semibold mb-2">Dream Wall</h2>
      <div className="grid grid-cols-2 gap-2">
        {posts.map((post) => {
          return (
            <div key={post.id} className="rounded-lg bg-orange-50 p-3 text-sm text-gray-700">
              {post.dream_text}
            </div>
          );
        })}
      </div>
    </div>
  );
}