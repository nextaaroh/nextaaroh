"use client";
import { useEffect, useState } from "react";
import BlogPostCard from "@/features/blog/components/BlogPostCard";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  category: string | null;
  published_at: string | null;
};

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/blog")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setPosts(data?.data ?? []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 pt-4 pb-6">
      <h1 className="text-lg font-bold mb-2">Blog</h1>
      {loading ? <p className="text-center text-gray-400 text-sm py-8">Loading...</p> : null}
      {!loading && posts.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-8">अभी कोई post उपलब्ध नहीं है</p>
      ) : null}
      <div>
        {posts.map((post) => {
          return <BlogPostCard key={post.id} post={post} />;
        })}
      </div>
    </div>
  );
}