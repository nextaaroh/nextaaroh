"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, BookOpen, PlayCircle, ShoppingBag, User } from "lucide-react";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/community", label: "Community", icon: Users },
  { href: "/quiz", label: "Quiz", icon: BookOpen },
  { href: "/learning", label: "Learning", icon: PlayCircle },
  { href: "/marketplace", label: "Market", icon: ShoppingBag },
  { href: "/me", label: "Profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-white border-t md:hidden">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center py-2 px-2 text-[10px] ${
              active ? "text-orange-500" : "text-gray-500"
            }`}
          >
            <Icon size={20} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
