import Link from "next/link";

const LINKS = [
  { href: "/blog", label: "Blog", emoji: "📰" },
  { href: "/scholarships", label: "Scholarships", emoji: "🎓" },
  { href: "/workplace", label: "Workplace", emoji: "💼" },
];

export default function QuickLinksGrid() {
  return (
    <div className="px-4 my-4">
      <div className="grid grid-cols-3 gap-2">
        {LINKS.map((link) => {
          return (
            <Link key={link.href} href={link.href} className="flex flex-col items-center gap-1 bg-white border border-gray-200 rounded-xl py-3">
              <span className="text-xl">{link.emoji}</span>
              <span className="text-[10px] font-medium text-gray-700 text-center">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
