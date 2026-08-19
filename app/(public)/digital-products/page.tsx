import Link from "next/link";

const CATEGORIES = [
  { value: "ebooks_guides", label: "E-Books & Guides", emoji: "📖" },
  { value: "templates", label: "Templates", emoji: "📝" },
  { value: "ai_prompts", label: "AI Prompts", emoji: "🤖" },
  { value: "study_materials", label: "Study Materials", emoji: "📚" },
  { value: "career_resources", label: "Career Resources", emoji: "💼" },
  { value: "skill_workbooks", label: "Skill Workbooks", emoji: "📓" },
  { value: "planners_trackers", label: "Planners & Trackers", emoji: "🗓️" },
  { value: "courses", label: "Courses & Mini Courses", emoji: "🎓" },
  { value: "tools_calculators", label: "Tools & Calculators", emoji: "🧮" },
  { value: "bundles_kits", label: "Bundles & Kits", emoji: "🎁" },
];

export default function DigitalProductsPage() {
  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-lg font-bold mb-1">Digital Products</h1>
      <p className="text-sm text-gray-500 mb-4">Free और Paid resources — अपनी category चुनो</p>
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map((c) => {
          return (
            <Link
              key={c.value}
              href={`/digital-products/${c.value}`}
              className="border border-gray-200 rounded-xl p-4 text-center hover:border-orange-400 transition-colors"
            >
              <p className="text-3xl mb-2">{c.emoji}</p>
              <p className="text-xs font-semibold">{c.label}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
