"use client";
import { useState } from "react";
import { containsContactInfo } from "@/lib/moderation/contactInfoFilter";
import { createClient } from "@/lib/supabase/client";

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
  { value: "ebooks", label: "E-books (only if you own the rights)" },
];

export default function SellForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("study_notes");
  const [pricingType, setPricingType] = useState("free");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [originalityChecked, setOriginalityChecked] = useState(false);
  const [rightsChecked, setRightsChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [message, setMessage] = useState("");

  const isEbook = category === "ebooks";
  const isPaid = pricingType === "paid";
  const descriptionHasContactInfo = containsContactInfo(description) || containsContactInfo(title);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!originalityChecked) {
      setMessage("पहले confirm करें कि यह आपका खुद का बनाया हुआ content है");
      return;
    }
    if (isEbook && !rightsChecked) {
      setMessage("E-book के लिए rights confirm करना ज़रूरी है");
      return;
    }
    if (descriptionHasContactInfo) {
      setMessage("Title/Description में UPI ID, phone number या bank details नहीं लिख सकते।");
      return;
    }
    if (!title.trim()) {
      setMessage("Title भरना ज़रूरी है");
      return;
    }
    if (isPaid && (!price || Number(price) <= 0)) {
      setMessage("Paid content के लिए सही Price डालें");
      return;
    }
    if (!file) {
      setMessage("PDF file upload करना ज़रूरी है");
      return;
    }
    if (file.type !== "application/pdf") {
      setMessage("सिर्फ PDF files allowed हैं");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setMessage("File का size 20MB से कम होना चाहिए");
      return;
    }

    setSubmitting(true);
    setUploadProgress("PDF upload हो रही है...");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMessage("पहले login करें");
        setSubmitting(false);
        return;
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filePath = user.id + "/" + Date.now() + "-" + safeName;

      const { error: uploadError } = await supabase.storage.from("marketplace-files").upload(filePath, file, {
        contentType: "application/pdf",
        upsert: false,
      });

      if (uploadError) {
        setMessage("File upload नहीं हो पाई: " + uploadError.message);
        setSubmitting(false);
        setUploadProgress("");
        return;
      }

      setUploadProgress("Listing submit हो रही है...");
      const finalPricePaise = isPaid ? Math.round(Number(price) * 100) : 0;
      const res = await fetch("/api/v1/marketplace/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          price_paise: finalPricePaise,
          originality_declared: true,
          file_path: filePath,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error?.message ?? "कुछ गलत हो गया, फिर कोशिश करें");
        setSubmitting(false);
        setUploadProgress("");
        return;
      }

      setMessage("Submit हो गया! Admin approval के बाद live होगा।");
      setTitle("");
      setDescription("");
      setPrice("");
      setFile(null);
      setPricingType("free");
      setOriginalityChecked(false);
      setRightsChecked(false);
    } catch {
      setMessage("Network error — इंटरनेट चेक करें");
    } finally {
      setSubmitting(false);
      setUploadProgress("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold">Sell your Content</h1>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800">
        सारी payments सिर्फ NextAaroh Payment Gateway से होती हैं। Buyer के साथ सीधे UPI/bank details share करना allowed नहीं है।
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Title</label>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="जैसे: Class 10 Science Complete Notes" />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Description</label>
        <textarea className="input resize-none" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="इसमें क्या-क्या है, बताइए... (कोई contact details ना लिखें)" />
        {descriptionHasContactInfo ? <p className="text-red-600 text-xs mt-1">⚠️ UPI/phone/bank details जैसा कुछ लग रहा है</p> : null}
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Category</label>
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORY_OPTIONS.map((c) => {
            return <option key={c.value} value={c.value}>{c.label}</option>;
          })}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium block mb-2">Pricing</label>
        <div className="flex gap-2">
          <button type="button" onClick={() => setPricingType("free")} className={pricingType === "free" ? "flex-1 bg-green-500 text-white font-medium py-2.5 rounded-lg text-sm" : "flex-1 bg-gray-100 text-gray-600 font-medium py-2.5 rounded-lg text-sm"}>
            🆓 Free
          </button>
          <button type="button" onClick={() => setPricingType("paid")} className={pricingType === "paid" ? "flex-1 bg-orange-500 text-white font-medium py-2.5 rounded-lg text-sm" : "flex-1 bg-gray-100 text-gray-600 font-medium py-2.5 rounded-lg text-sm"}>
            💰 Paid
          </button>
        </div>
      </div>

      {isPaid ? (
        <div>
          <label className="text-sm font-medium block mb-1">Price (₹)</label>
          <input className="input" type="number" min="1" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="जैसे: 49" />
        </div>
      ) : null}

      <div>
        <label className="text-sm font-medium block mb-1">PDF Upload</label>
        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="input" />
        {file ? <p className="text-xs text-green-600 mt-1">✓ {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)</p> : null}
        <p className="text-xs text-gray-400 mt-1">सिर्फ PDF, max 20MB</p>
      </div>

      <div className="border border-gray-200 rounded-lg p-3">
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" checked={originalityChecked} onChange={(e) => setOriginalityChecked(e.target.checked)} className="mt-1" />
          <span>मैं confirm करता/करती हूं कि यह content मेरा खुद का बनाया हुआ है</span>
        </label>
      </div>

      {isEbook ? (
        <div className="border border-orange-200 bg-orange-50 rounded-lg p-3">
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" checked={rightsChecked} onChange={(e) => setRightsChecked(e.target.checked)} className="mt-1" />
            <span>मैं confirm करता/करती हूं कि इस e-book के rights मेरे पास हैं</span>
          </label>
        </div>
      ) : null}

      {uploadProgress ? <p className="text-sm text-blue-600">{uploadProgress}</p> : null}
      {message ? <p className="text-sm text-orange-600">{message}</p> : null}

      <button type="submit" disabled={submitting} className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg disabled:opacity-50">
        {submitting ? "Submitting..." : "Submit for Review"}
      </button>
    </form>
  );
}
