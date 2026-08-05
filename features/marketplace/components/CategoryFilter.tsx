"use client";

const CATEGORIES = [
  { value: "", label: "All Categories" },
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

type Props = {
  active: string;
  onChange: (value: string) => void;
};

export default function CategoryFilter({ active, onChange }: Props) {
  return (
    <div className="px-4 py-2 space-y-1.5">
      {CATEGORIES.map((cat, index) => {
        const isActive = active === cat.value;
        return (
          <button
            key={cat.value}
            type="button"
            onClick={() => onChange(cat.value)}
            className={
              isActive
                ? "w-full flex items-center gap-3 text-left border-2 border-orange-500 bg-orange-50 rounded-lg px-3 py-2.5"
                : "w-full flex items-center gap-3 text-left border border-gray-100 rounded-lg px-3 py-2.5"
            }
          >
            <span className="text-xs font-bold text-orange-500 w-5">{index + 1}</span>
            <span className="text-sm font-medium flex-1">{cat.label}</span>
            {isActive ? <span className="text-orange-500">✓</span> : null}
          </button>
        );
      })}
    </div>
  );
}
