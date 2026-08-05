"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CommentSection from "@/features/blog/components/CommentSection";

type Post = {
  title: string;
  body: string;
  cover_image_url: string | null;
  category: string | null;
};

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    fetch("/api/v1/blog/" + params.slug)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setPost(data))
      .catch(() => setPost(null));
  }, [params.slug]);

  if (!post) {
    return <p className="text-center text-gray-400 text-sm py-8">Loading...</p>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      {post.cover_image_url ? (
        <img src={post.cover_image_url} alt={post.title} className="w-full h-48 object-cover rounded-xl mb-4" />
      ) : null}
      {post.category ? <span className="text-xs font-medium text-orange-500 uppercase">{post.category}</span> : null}
      <h1 className="text-xl font-bold mt-1 mb-4">{post.title}</h1>
      <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{post.body}</div>

      <CommentSection postSlug={params.slug} />
    </div>
  );
}