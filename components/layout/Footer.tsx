import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0a1a3a] text-white text-sm px-4 py-6 mt-8">
      <div className="flex flex-wrap gap-4 justify-center mb-3">
        <Link href="/blog">Blog</Link>
        <Link href="/legal/privacy-policy">Privacy Policy</Link>
        <Link href="/legal/terms">Terms</Link>
        <Link href="/contact">Contact</Link>
      </div>
      <p className="text-center text-white/60">© {new Date().getFullYear()} NextAaroh</p>
    </footer>
  );
}
