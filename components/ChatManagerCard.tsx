"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ChatManagerCard() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/v1/me")
      .then((res) => setLoggedIn(res.ok))
      .catch(() => setLoggedIn(false));
  }, []);

  if (!loggedIn) return null;

  return (
    <div className="px-4 my-4">
      <Link href="/chat" className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4">
        <span className="text-2xl">💬</span>
        <div className="flex-1">
          <p className="text-sm font-semibold">Chat to Support Team</p>
          <p className="text-xs text-gray-500">Registration, courses या sessions में मदद चाहिए?</p>
        </div>
        <span className="text-gray-300">›</span>
      </Link>
    </div>
  );
}
