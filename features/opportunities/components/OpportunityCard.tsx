"use client";

type Opportunity = { id: string; title: string; organization: string; category: string; last_date: string; apply_link: string };
const LABELS: Record<string, string> = { job: "Job", internship: "Internship", scholarship: "Scholarship", competition: "Competition", other: "Other" };

export default function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  function trackClick() {
    fetch("/api/v1/track/apply-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content_type: "opportunity", content_id: opportunity.id }),
    }).catch(() => {});
  }

  return (
    <a href={opportunity.apply_link} target="_blank" rel="noopener noreferrer" onClick={trackClick} className="block border border-gray-200 rounded-xl p-4">
      <div className="flex items-start justify-between mb-1">
        <p className="font-medium text-sm">{opportunity.title}</p>
        <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full shrink-0 ml-2">{LABELS[opportunity.category] ?? opportunity.category}</span>
      </div>
      <p className="text-xs text-gray-500">{opportunity.organization}</p>
      <p className="text-xs text-gray-400 mt-1">Last date: {opportunity.last_date}</p>
    </a>
  );
}
