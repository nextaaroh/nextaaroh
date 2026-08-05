"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import PostCard from "@/features/community/components/PostCard";
import CreatePostBox from "@/features/community/components/CreatePostBox";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type Post = {
  id: string;
  body: string;
  like_count: number;
  created_at: string;
};

export default function CommunityFeedPage() {
  const { t } = useLanguage();
  const params = useParams<{ type: string; key: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = useCallback(() => {
    setLoading(true);
    fetch(`/api/v1/community/${params.type}/${params.key}`)
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setPosts(data?.data ?? []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [params.type, params.key]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return (
    <div>
      <h1 className="text-lg font-bold px-4 pt-4 pb-2">
        {t("community.title")} — {params.key}
      </h1>
      <CreatePostBox communityType={params.type} communityKey={params.key} onPosted={loadPosts} />
      {loading && <p className="text-center text-gray-400 text-sm py-6">Loading...</p>}
      {!loading && posts.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-6">{t("community.no_posts")}</p>
      )}
      {posts.map((post) => {
        return <PostCard key={post.id} post={post} />;
      })}
    </div>
  );
}