import Link from "next/link";

type Props = {
  title: string;
  description: string;
  href: string;
  emoji: string;
};

export default function DashboardCard({ title, description, href, emoji }: Props) {
  return (
    <Link href={href} className="block border border-gray-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{emoji}</span>
        <div>
          <p className="font-medium text-sm">{title}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
    </Link>
  );
}