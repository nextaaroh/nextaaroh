"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { uploadToImgbb } from "@/lib/imgbb/uploadImage";

const CATEGORY_OPTIONS = [
  { value: "previous_year_questions", label: "Previous Year Questions (PYQ)" },
  { value: "handwritten_notes", label: "Handwritten Notes" },
  { value: "study_notes", label: "Study Notes" },
  { value: "assignments_lab_files", label: "Assignments & Lab Files" },
  { value: "sample_papers", label: "Sample Papers" },
  { value: "question_banks", label: "Question Banks" },
  { value: "resume_templates", label: "Resume Templates" },
  { value: "interview_prep", label: "Interview Preparation Material" },
  { value: "ai_prompts", label: "AI Prompts" },
  { value: "ebooks", label: "E-books" },
];

export default function AdminMarketplacePostPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("study_notes");
  const [price, setPrice] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit() {
    setMessage("");
    if (!title.trim() || !description.trim()) {
      setMessage("Title और description ज़रूरी हैं");
      return;
    }
    if (!pdfFile) {
      setMessage("PDF file चुनें");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMessage("Session expired, फिर से login करें");
        return;
      }

      setProgress("PDF upload हो रही है...");
      const safeName = pdfFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filePath = "admin/" + Date.now() + "-" + safeName;
      const { error: uploadError } = await supabase.storage.from("marketplace-files").upload(filePath, pdfFile, {
        contentType: "application/pdf",
      });
      if (uploadError) {
        setMessage("PDF upload नहीं हो पाई: " + uploadError.message);
        return;
      }

      let coverImageUrl: string | null = null;
      if (coverFile) {
        setProgress("Cover image upload हो रही है...");
        coverImageUrl = await uploadToImgbb(coverFile);
      }

      setProgress("Listing post हो रही है...");
      const res = await fetch("/api/v1/admin/marketplace/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          price_paise: price ? Math.round(Number(price) * 100) : 0,
          cover_image_url: coverImageUrl,
          file_path: filePath,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error?.message ?? "कुछ गलत हो गया");
        return;
      }
      setMessage("पोस्ट हो गया, तुरंत live है!");
      setTitle("");
      setDescription("");
      setPrice("");
      setPdfFile(null);
      setCoverFile(null);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "कुछ गलत हो गया");
    } finally {
      setSubmitting(false);
      setProgress("");
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-lg font-bold mb-4">Post to Marketplace (Admin)</h1>
      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" rows={3} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORY_OPTIONS.map((c) => {
            return <option key={c.value} value={c.value}>{c.label}</option>;
          })}
        </select>
        <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" type="number" placeholder="Price (₹, 0 for free)" value={price} onChange={(e) => setPrice(e.target.value)} />

        <div>
          <label className="text-xs font-medium block mb-1">PDF File</label>
          <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          {pdfFile ? <p className="text-xs text-green-600 mt-1">✓ {pdfFile.name}</p> : null}
        </div>

        <div>
          <label className="text-xs font-medium block mb-1">Cover Image (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          {coverFile ? <p className="text-xs text-green-600 mt-1">✓ {coverFile.name}</p> : null}
        </div>

        {progress ? <p className="text-xs text-blue-600">{progress}</p> : null}
        {message ? <p className="text-xs text-orange-600">{message}</p> : null}
        <button type="button" onClick={handleSubmit} disabled={submitting} className="w-full bg-orange-500 text-white text-sm font-medium py-2 rounded-lg disabled:opacity-50">
          {submitting ? "Posting..." : "Post (auto-published, no approval needed)"}
        </button>
      </div>
    </div>
  );
}
