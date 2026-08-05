"use client";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type Post = {
  id: string;
  body: string;
  like_count: number;
  created_at: string;
};

type Props = {
  post: Post;
};

export default function PostCard({ post }: Props) {
  const { t } = useLanguage();
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [liked, setLiked] = useState(false);

  async function handleLike() {
    setLiked(!liked);
    setLikeCount((count) => (liked ? count - 1 : count + 1));
    try {
      await fetch(`/api/v1/community/post/${post.id}/like`, { method: "POST" });
    } catch {
      // silently ignore for now
    }
  }

  return (
    <div className="border-b border-gray-100 px-4 py-4">
      <p className="text-sm text-gray-800 mb-2">{post.body}</p>
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <button
          type="button"
          onClick={handleLike}
          className={liked ? "text-orange-500 font-medium" : ""}
        >
          👍 {t("community.like")} ({likeCount})
        </button>
        <span>💬 {t("community.comments")}</span>
        <button type="button" className="ml-auto text-gray-400">
          🚩 {t("community.report")}
        </button>
      </div>
    </div>
  );
}