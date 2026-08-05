type Opportunity = {
  id: string;
  title: string;
  organization: string;
  category: string;
  last_date: string;
  apply_link: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  job: "Job",
  internship: "Internship",
  scholarship: "Scholarship",
  competition: "Competition",
  other: "Other",
};

export default function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  return (
    <a href={opportunity.apply_link} target="_blank" rel="noopener noreferrer" className="block border border-gray-200 rounded-xl p-4">
      <div className="flex items-start justify-between mb-1">
        <p className="font-medium text-sm">{opportunity.title}</p>
        <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full shrink-0 ml-2">
          {CATEGORY_LABELS[opportunity.category] ?? opportunity.category}
        </span>
      </div>
      <p className="text-xs text-gray-500">{opportunity.organization}</p>
      <p className="text-xs text-gray-400 mt-1">Last date: {opportunity.last_date}</p>
    </a>
  );
}