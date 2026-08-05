"use client";
import { useState } from "react";

const CATEGORY_OPTIONS = [
  { value: "job", label: "Job" },
  { value: "internship", label: "Internship" },
  { value: "scholarship", label: "Scholarship" },
  { value: "competition", label: "Competition" },
  { value: "other", label: "Other" },
];

export default function SubmitOpportunityForm() {
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [description, setDescription] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [lastDate, setLastDate] = useState("");
  const [applyLink, setApplyLink] = useState("");
  const [category, setCategory] = useState("job");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!title.trim() || !organization.trim() || !lastDate || !applyLink.trim()) {
      setMessage("सारी ज़रूरी fields भरें");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/opportunities/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, organization, description, eligibility, last_date: lastDate, apply_link: applyLink, category }),
      });
      if (res.ok) {
        setMessage("Submit हो गया! Admin approval के बाद live होगा।");
        setTitle("");
        setOrganization("");
        setDescription("");
        setEligibility("");
        setLastDate("");
        setApplyLink("");
      } else {
        setMessage("कुछ गलत हो गया, फिर कोशिश करें");
      }
    } catch {
      setMessage("Network error — इंटरनेट चेक करें");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold">Submit an Opportunity</h1>
      <p className="text-xs text-gray-400">कोई job, internship, scholarship या competition जानते हैं? यहां share करें — दूसरे students को मदद मिलेगी।</p>

      <div>
        <label className="text-sm font-medium block mb-1">Title</label>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="जैसे: Data Entry Internship" />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Organization</label>
        <input className="input" value={organization} onChange={(e) => setOrganization(e.target.value)} />
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
        <label className="text-sm font-medium block mb-1">Description</label>
        <textarea className="input resize-none" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Eligibility</label>
        <textarea className="input resize-none" rows={2} value={eligibility} onChange={(e) => setEligibility(e.target.value)} />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Last Date to Apply</label>
        <input className="input" type="date" value={lastDate} onChange={(e) => setLastDate(e.target.value)} />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Apply Link</label>
        <input className="input" value={applyLink} onChange={(e) => setApplyLink(e.target.value)} placeholder="https://..." />
      </div>

      {message ? <p className="text-sm text-orange-600">{message}</p> : null}

      <button type="submit" disabled={submitting} className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg disabled:opacity-50">
        {submitting ? "Submitting..." : "Submit for Review"}
      </button>
    </form>
  );
}