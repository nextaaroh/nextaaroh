import Link from "next/link";

const actions = [
  { href: "/quiz", label: "Take Quiz", emoji: "📝" },
  { href: "/marketplace/sell", label: "Sell Notes", emoji: "🛍️" },
  { href: "/community", label: "Post", emoji: "💬" },
];

export default function QuickActions() {
  return (
    <div className="flex gap-2 px-4 py-3">
      {actions.map((action) => {
        return (
          <Link
            key={action.href}
            href={action.href}
            className="flex-1 flex flex-col items-center gap-1 bg-[#0a1a3a] text-white rounded-xl py-3"
          >
            <span className="text-xl">{action.emoji}</span>
            <span className="text-xs font-medium">{action.label}</span>
          </Link>
        );
      })}
    </div>
  );
}