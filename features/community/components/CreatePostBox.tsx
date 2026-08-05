"use client";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type Props = {
  communityType: string;
  communityKey: string;
  onPosted: () => void;
};

export default function CreatePostBox({ communityType, communityKey, onPosted }: Props) {
  const { t } = useLanguage();
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);

  async function handlePost() {
    if (!body.trim()) return;
    setPosting(true);
    try {
      await fetch(`/api/v1/community/${communityType}/${communityKey}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      setBody("");
      onPosted();
    } catch {
      // silently ignore for now
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="px-4 py-3 border-b border-gray-100">
      <textarea
        className="input resize-none"
        rows={2}
        placeholder={t("community.post_placeholder")}
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button
        type="button"
        onClick={handlePost}
        disabled={posting || !body.trim()}
        className="mt-2 bg-orange-500 text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {posting ? t("community.posting") : t("community.post_button")}
      </button>
    </div>
  );
}