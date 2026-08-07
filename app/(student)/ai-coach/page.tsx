"use client";
import { useState } from "react";
import CareerCoach from "@/features/ai-coach/components/CareerCoach";
import CommunicationCoach from "@/features/ai-coach/components/CommunicationCoach";

export default function AiCoachPage() {
  const [tab, setTab] = useState<"career" | "communication">("career");

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-lg font-bold mb-1">AI Coach</h1>
      <p className="text-xs text-gray-400 mb-4">आपकी Career और Communication skills बढ़ाने के लिए</p>

      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setTab("career")}
          className={tab === "career" ? "flex-1 bg-orange-500 text-white text-sm font-medium py-2 rounded-lg" : "flex-1 bg-gray-100 text-gray-600 text-sm font-medium py-2 rounded-lg"}
        >
          🎯 Career Coach
        </button>
        <button
          type="button"
          onClick={() => setTab("communication")}
          className={tab === "communication" ? "flex-1 bg-orange-500 text-white text-sm font-medium py-2 rounded-lg" : "flex-1 bg-gray-100 text-gray-600 text-sm font-medium py-2 rounded-lg"}
        >
          🎤 Communication
        </button>
      </div>

      {tab === "career" ? <CareerCoach /> : <CommunicationCoach />}
    </div>
  );
}
