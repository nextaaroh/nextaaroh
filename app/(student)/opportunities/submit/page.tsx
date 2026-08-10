"use client";
import { useState } from "react";

export default function SubmitOpportunityPage() {
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [description, setDescription] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [lastDate, setLastDate] = useState("");
  const [applyLink, setApplyLink] = useState("");
  const [category, setCategory] = useState("job");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
        setTitle(""); setOrganization(""); setDescription(""); setEligibility(""); setLastDate(""); setApplyLink("");
      } else {
        setMessage("कुछ गलत हो गया");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold">Submit an Opportunity</h1>
      <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="input" placeholder="Organization" value={organization} onChange={(e) => setOrganization(e.target.value)} />
      <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="job">Job</option>
        <option value="internship">Internship</option>
        <option value="scholarship">Scholarship</option>
        <option value="competition">Competition</option>
        <option value="other">Other</option>
      </select>
      <textarea className="input resize-none" rows={3} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <textarea className="input resize-none" rows={2} placeholder="Eligibility" value={eligibility} onChange={(e) => setEligibility(e.target.value)} />
      <input className="input" type="date" value={lastDate} onChange={(e) => setLastDate(e.target.value)} />
      <input className="input" placeholder="Apply Link" value={applyLink} onChange={(e) => setApplyLink(e.target.value)} />
      {message ? <p className="text-sm text-orange-600">{message}</p> : null}
      <button type="submit" disabled={submitting} className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg disabled:opacity-50">
        {submitting ? "Submitting..." : "Submit for Review"}
      </button>
    </form>
  );
}
