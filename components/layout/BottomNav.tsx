"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlayCircle, Users, PhoneCall, ShoppingBag, User } from "lucide-react";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/learning", label: "Learning", icon: PlayCircle },
  { href: "/community", label: "Community", icon: Users },
  { href: "/call-and-earn", label: "Call & Earn", icon: PhoneCall },
  { href: "/marketplace", label: "Market", icon: ShoppingBag },
  { href: "/me", label: "Profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-stretch justify-around bg-white border-t border-gray-200 shadow-[0_-1px_8px_rgba(0,0,0,0.04)] md:hidden">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] leading-tight transition-colors ${
              active ? "text-orange-500" : "text-gray-500"
            }`}
          >
            <Icon size={19} strokeWidth={active ? 2.4 : 2} />
            <span className="truncate max-w-[52px]">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
