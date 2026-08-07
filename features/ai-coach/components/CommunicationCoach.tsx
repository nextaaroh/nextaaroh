"use client";
import { useState } from "react";

const PROMPTS = [
  "अपने बारे में 1 मिनट में परिचय दीजिए, जैसे किसी interview में देंगे",
  "आपकी सबसे बड़ी strength क्या है? एक उदाहरण के साथ बताइए",
  "आपने हाल ही में सामना की गई एक चुनौती के बारे में बताइए, और आपने उसे कैसे हल किया",
  "5 साल बाद खुद को कहां देखते हैं?",
  "किसी team project में आपका role क्या रहा?",
];

const CHECKLIST = [
  "आवाज़ साफ और आत्मविश्वास से भरी थी?",
  "बीच में बहुत ज़्यादा 'उम्म', 'तो' नहीं बोला?",
  "जवाब structured था (शुरुआत-बीच-अंत)?",
  "eye contact जैसा माहौल बना (camera की तरफ देखा)?",
];

export default function CommunicationCoach() {
  const [promptIndex, setPromptIndex] = useState(0);
  const [checked, setChecked] = useState<boolean[]>(new Array(CHECKLIST.length).fill(false));
  const [recording, setRecording] = useState(false);

  function newPrompt() {
    setPromptIndex((i) => (i + 1) % PROMPTS.length);
    setChecked(new Array(CHECKLIST.length).fill(false));
    setRecording(false);
  }

  function toggleCheck(index: number) {
    setChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }

  const score = checked.filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm font-semibold mb-1">🎤 Communication Practice</p>
        <p className="text-xs text-gray-500">रोज़ एक prompt पर practice करें, खुद को phone में record करके सुनें</p>
      </div>

      <div className="border border-gray-200 rounded-xl p-4">
        <p className="text-xs text-gray-400 mb-1">आज का Prompt</p>
        <p className="text-sm font-medium">{PROMPTS[promptIndex]}</p>
        <button type="button" onClick={() => setRecording(!recording)} className="mt-3 w-full bg-orange-500 text-white text-sm font-medium py-2.5 rounded-lg">
          {recording ? "⏹ Practice खत्म करें" : "🎙 Practice शुरू करें"}
        </button>
      </div>

      {recording ? (
        <div className="border border-gray-200 rounded-xl p-4">
          <p className="text-sm font-medium mb-2">बोलने के बाद खुद को check करें:</p>
          <div className="space-y-2">
            {CHECKLIST.map((item, i) => {
              return (
                <label key={i} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={checked[i]} onChange={() => toggleCheck(i)} />
                  {item}
                </label>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-3">Self-score: {score} / {CHECKLIST.length}</p>
        </div>
      ) : null}

      <button type="button" onClick={newPrompt} className="w-full border border-gray-300 text-gray-600 text-sm font-medium py-2.5 rounded-lg">
        नया Prompt लें
      </button>
    </div>
  );
}
