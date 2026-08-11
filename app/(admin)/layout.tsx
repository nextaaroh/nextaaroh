import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/requireAdmin";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/marketplace/pending", label: "Marketplace Approvals" },
  { href: "/admin/marketplace/all", label: "All Products" },
  { href: "/admin/opportunities/pending", label: "Opportunity Approvals" },
  { href: "/admin/learning", label: "Learning Videos" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/chats", label: "Student Chats" },
  { href: "/admin/website-requests", label: "Website Requests" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { authorized } = await requireAdmin();

  if (!authorized) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white px-4 py-3 flex items-center justify-between">
        <span className="font-bold">
          Next<span className="text-orange-500">Aaroh</span> Admin
        </span>
        <Link href="/" className="text-xs text-gray-400">
          ← Back to site
        </Link>
      </header>
      <div className="flex flex-col sm:flex-row">
        <nav className="sm:w-56 shrink-0 border-b sm:border-b-0 sm:border-r border-gray-200 bg-white p-3 flex sm:flex-col gap-1 overflow-x-auto">
          {NAV_ITEMS.map((item) => {
            return (
              <Link key={item.href} href={item.href} className="shrink-0 text-sm px-3 py-2 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-orange-600 whitespace-nowrap">
                {item.label}
              </Link>
            );
          })}
        </nav>
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
