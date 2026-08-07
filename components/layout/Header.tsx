"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Header() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/v1/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setLoggedIn(true);
          setPhotoUrl(data.photo_url ?? null);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-[#0a1a3a] text-white gap-2">
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <Image src="/brand/logo-64.png" alt="NextAaroh" width={32} height={32} />
        <span className="font-bold text-base sm:text-lg whitespace-nowrap">
          Next<span className="text-orange-500">Aaroh</span>
        </span>
      </Link>
      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <Link href="/me" className="flex items-center gap-1.5 text-sm whitespace-nowrap">
          {loggedIn && photoUrl ? (
            <img src={photoUrl} alt="Profile" className="w-7 h-7 rounded-full object-cover ring-1 ring-white/30" />
          ) : loggedIn ? (
            <span className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold">👤</span>
          ) : (
            "Profile"
          )}
        </Link>
      </div>
    </header>
  );
}
