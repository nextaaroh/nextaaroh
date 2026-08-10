"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Comment = { id: string; body: string; created_at: string };
type Post = { title: string; body: string; cover_image_url: string | null; category: string | null; comments: Comment[] };

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comment, setComment] = useState("");
  const [posting, setPosting] = useState(false);

  function load() {
    fetch("/api/v1/blog/" + params.slug)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setPost(data))
      .catch(() => setPost(null));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug]);

  async function handleComment() {
    if (!comment.trim()) return;
    setPosting(true);
    try {
      await fetch("/api/v1/blog/" + params.slug + "/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: comment }),
      });
      setComment("");
      load();
    } finally {
      setPosting(false);
    }
  }

  if (!post) {
    return <p className="text-center text-gray-400 text-sm py-8">Loading...</p>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      {post.cover_image_url ? <img src={post.cover_image_url} alt={post.title} className="w-full h-48 object-cover rounded-xl mb-4" /> : null}
      {post.category ? <span className="text-xs font-medium text-orange-500 uppercase">{post.category}</span> : null}
      <h1 className="text-xl font-bold mt-1 mb-4">{post.title}</h1>
      <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{post.body}</div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <h2 className="text-sm font-semibold mb-3">Comments</h2>
        <textarea className="input resize-none" rows={2} placeholder="अपना comment लिखें..." value={comment} onChange={(e) => setComment(e.target.value)} />
        <button type="button" onClick={handleComment} disabled={posting || !comment.trim()} className="mt-2 bg-orange-500 text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-50">
          {posting ? "Posting..." : "Post Comment"}
        </button>
        <div className="mt-4 space-y-3">
          {post.comments.length === 0 ? <p className="text-xs text-gray-400">अभी कोई comment नहीं है</p> : null}
          {post.comments.map((c) => {
            return <div key={c.id} className="text-sm border-b border-gray-50 pb-2">{c.body}</div>;
          })}
        </div>
      </div>
    </div>
  );
}
