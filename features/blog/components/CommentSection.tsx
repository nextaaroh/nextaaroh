"use client";
import { useEffect, useState, useCallback } from "react";

type Comment = {
  id: string;
  body: string;
  created_at: string;
};

export default function CommentSection({ postSlug }: { postSlug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);

  const loadComments = useCallback(() => {
    fetch("/api/v1/blog/" + postSlug)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setComments(data?.comments ?? []))
      .catch(() => setComments([]));
  }, [postSlug]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  async function handlePost() {
    if (!body.trim()) return;
    setPosting(true);
    try {
      await fetch("/api/v1/blog/" + postSlug + "/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      setBody("");
      loadComments();
    } catch {
      // silently ignore for now
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="mt-6 pt-4 border-t border-gray-100">
      <h2 className="text-sm font-semibold mb-3">Comments</h2>
      <textarea
        className="input resize-none"
        rows={2}
        placeholder="अपना comment लिखें..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button
        type="button"
        onClick={handlePost}
        disabled={posting || !body.trim()}
        className="mt-2 bg-orange-500 text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {posting ? "Posting..." : "Post Comment"}
      </button>

      <div className="mt-4 space-y-3">
        {comments.length === 0 ? (
          <p className="text-xs text-gray-400">अभी कोई comment नहीं है</p>
        ) : (
          comments.map((c) => {
            return (
              <div key={c.id} className="text-sm border-b border-gray-50 pb-2">
                {c.body}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}