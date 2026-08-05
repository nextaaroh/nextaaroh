import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Header() {
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
        <Link href="/me" className="text-sm whitespace-nowrap">
          Profile
        </Link>
      </div>
    </header>
  );
}
