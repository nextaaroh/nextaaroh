"use client";
import { useEffect, useRef, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const trappedRef = useRef(false);

  useEffect(() => {
    function handleBeforeInstall(e: Event) {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
      window.history.pushState({ nsiTrap: true }, "");
    }

    function handlePopState() {
      if (deferredPromptRef.current && !trappedRef.current) {
        trappedRef.current = true;
        setVisible(true);
        window.history.pushState({ nsiTrap: true }, "");
      }
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  async function handleInstall() {
    const promptEvent = deferredPromptRef.current;
    if (!promptEvent) {
      setVisible(false);
      return;
    }
    await promptEvent.prompt();
    await promptEvent.userChoice;
    deferredPromptRef.current = null;
    setVisible(false);
  }

  function handleDismiss() {
    setVisible(false);
    window.history.back();
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[9999] bg-white border-t border-gray-200 p-4 shadow-2xl">
      <div className="max-w-md mx-auto flex items-center gap-3">
        <img src="/brand/logo-64.png" alt="NextAaroh" className="w-12 h-12 rounded-xl" />
        <div className="flex-1">
          <p className="text-sm font-semibold">NextAaroh Install करें</p>
          <p className="text-xs text-gray-500">तेज़ी से खोलें, offline भी काम करे</p>
        </div>
      </div>
      <div className="max-w-md mx-auto flex gap-2 mt-3">
        <button type="button" onClick={handleInstall} className="flex-1 bg-orange-500 text-white text-sm font-semibold py-2.5 rounded-lg">
          Install NextAaroh
        </button>
        <button type="button" onClick={handleDismiss} className="px-4 text-gray-500 text-sm">
          Skip
        </button>
      </div>
    </div>
  );
}
