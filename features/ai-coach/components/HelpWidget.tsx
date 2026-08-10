"use client";

import { useState } from "react";
import { MessageCircleQuestion, ArrowLeft } from "lucide-react";
import ChatBox from "./ChatBox";

export default function HelpWidget() {
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col bg-white dark:bg-neutral-900">
        <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Help
          </span>
        </div>
        <div className="flex-1 overflow-hidden p-3">
          <ChatBox
            coach="help"
            greeting="नमस्ते! मैं NextAaroh Help Assistant हूं। Website से जुड़ा कोई भी सवाल पूछिए।"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 right-5 z-50">
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-lg hover:bg-indigo-700"
      >
        <MessageCircleQuestion size={18} />
        Help
      </button>
    </div>
  );
}
