"use client";
import { useEffect, useState, useCallback } from "react";

type Video = { id: string; title: string; youtube_url: string; thumbnail_url: string; category: string | null };

type Skill = { id: string; name: string; slug: string; category: string; emoji: string | null };

const SKILL_CATEGORIES = [
  { value: "ai", label: "🤖 AI Skills" },
  { value: "career", label: "💼 Career Skills" },
  { value: "communication", label: "🗣️ Communication Skills" },
  { value: "digital", label: "💻 Digital Skills" },
  { value: "business", label: "📈 Business Skills" },
  { value: "creative", label: "🎨 Creative Skills" },
  { value: "sports", label: "🏅 Sports Education" },
];

const CATEGORIES = [
  { value: "skills_learning", label: "Skills Learning Classes" },
  { value: "sports_learning", label: "Sports Learning Classes" },
  { value: "digital_ai_freelancing", label: "Digital Skills, AI & Freelancing Classes" },
];

export default function AdminLearningPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [title, setTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillName, setSkillName] = useState("");
  const [skillCategory, setSkillCategory] = useState(SKILL_CATEGORIES[0].value);
  const [skillEmoji, setSkillEmoji] = useState("");
  const [skillSubmitting, setSkillSubmitting] = useState(false);
  const [skillMessage, setSkillMessage] = useState("");

  const load = useCallback(() => {
    fetch("/api/v1/admin/learning/videos")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setVideos(data?.data ?? []))
      .catch(() => setVideos([]));
  }, []);

  const loadSkills = useCallback(() => {
    fetch("/api/v1/admin/skills")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setSkills(data?.data ?? []))
      .catch(() => setSkills([]));
  }, []);

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  async function handleAddSkill() {
    setSkillMessage("");
    if (!skillName.trim()) {
      setSkillMessage("Skill name ज़रूरी है");
      return;
    }
    setSkillSubmitting(true);
    try {
      const res = await fetch("/api/v1/admin/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: skillName, category: skillCategory, emoji: skillEmoji }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSkillMessage(data.error?.message ?? "कुछ गलत हो गया");
        return;
      }
      setSkillName("");
      setSkillEmoji("");
      loadSkills();
    } finally {
      setSkillSubmitting(false);
    }
  }

  useEffect(() => {
    load();
  }, [load]);

  async function handleAdd() {
    setMessage("");
    if (!title.trim() || !youtubeUrl.trim()) {
      setMessage("Title और YouTube link दोनों ज़रूरी हैं");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/admin/learning/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, youtube_url: youtubeUrl, category }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error?.message ?? "कुछ गलत हो गया");
        return;
      }
      setTitle("");
      setYoutubeUrl("");
      load();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">Skills</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 max-w-md">
        <p className="text-sm font-medium mb-3">नया Skill जोड़ें</p>
        <div className="space-y-2">
          <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Skill Name (e.g. Public Speaking)" value={skillName} onChange={(e) => setSkillName(e.target.value)} />
          <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Emoji (optional, e.g. 🗣️)" value={skillEmoji} onChange={(e) => setSkillEmoji(e.target.value)} />
          <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={skillCategory} onChange={(e) => setSkillCategory(e.target.value)}>
            {SKILL_CATEGORIES.map((c) => {
              return <option key={c.value} value={c.value}>{c.label}</option>;
            })}
          </select>
          {skillMessage ? <p className="text-red-600 text-xs">{skillMessage}</p> : null}
          <button type="button" onClick={handleAddSkill} disabled={skillSubmitting} className="w-full bg-purple-700 text-white text-sm font-medium py-2 rounded-lg disabled:opacity-50">
            {skillSubmitting ? "Adding..." : "Add Skill"}
          </button>
        </div>
      </div>

      <p className="text-sm font-medium mb-2">सारे Skills ({skills.length})</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-8 max-w-2xl">
        {skills.map((s) => {
          return (
            <div key={s.id} className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm flex justify-between">
              <span>{s.emoji} {s.name}</span>
              <span className="text-xs text-gray-400">{s.category}</span>
            </div>
          );
        })}
      </div>

      <h1 className="text-lg font-bold mb-4">Learning Videos</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 max-w-md">
        <p className="text-sm font-medium mb-3">नया Video जोड़ें</p>
        <div className="space-y-2">
          <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Video Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="YouTube URL" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
          <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => {
              return <option key={c.value} value={c.value}>{c.label}</option>;
            })}
          </select>
          {message ? <p className="text-red-600 text-xs">{message}</p> : null}
          <button type="button" onClick={handleAdd} disabled={submitting} className="w-full bg-orange-500 text-white text-sm font-medium py-2 rounded-lg disabled:opacity-50">
            {submitting ? "Adding..." : "Add Video"}
          </button>
        </div>
      </div>

      <p className="text-sm font-medium mb-2">सारे Videos ({videos.length})</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {videos.map((video) => {
          const catLabel = CATEGORIES.find((c) => c.value === video.category)?.label ?? video.category;
          return (
            <div key={video.id} className="border border-gray-200 bg-white rounded-xl overflow-hidden">
              <img src={video.thumbnail_url} alt={video.title} className="w-full aspect-video object-cover" />
              <div className="p-3">
                <p className="text-sm font-medium line-clamp-2">{video.title}</p>
                {catLabel ? <p className="text-xs text-gray-400 mt-1">{catLabel}</p> : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
