"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, PlayCircle, ShoppingBag, Store, Video, User } from "lucide-react";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/learning", label: "Learning", icon: PlayCircle },
  { href: "/digital-products", label: "Products", icon: ShoppingBag },
  { href: "/shop", label: "Shop", icon: Store },
  { href: "/creator-club/apply", label: "Creator", icon: Video },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/v1/me")
      .then((res) => setLoggedIn(res.ok))
      .catch(() => setLoggedIn(false));
  }, []);

  const profileHref = loggedIn === false ? "/login" : "/me";
  const allItems = [...items, { href: profileHref, label: "Profile", icon: User }];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 flex items-stretch justify-around bg-[#0a1a3a] border-t border-[#0a1a3a] shadow-[0_-1px_8px_rgba(0,0,0,0.2)] md:hidden">
      {allItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (label === "Profile" && pathname === "/me");
        return (
          <Link
            key={label}
            href={href}
            style={active ? { background: "linear-gradient(135deg, #ffffff 50%, #f97316 50%)" } : undefined}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] leading-tight transition-colors ${
              active ? "text-[#0a1a3a] font-semibold" : "text-white/70"
            }`}
          >
            <Icon size={24} strokeWidth={active ? 2.4 : 2} />
            <span className="truncate max-w-[56px]">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
