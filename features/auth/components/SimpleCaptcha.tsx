"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type Props = {
  onVerified: (verified: boolean) => void;
};

export default function SimpleCaptcha({ onVerified }: Props) {
  const { t } = useLanguage();
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [input, setInput] = useState("");

  function newProblem() {
    setA(Math.floor(Math.random() * 10) + 1);
    setB(Math.floor(Math.random() * 10) + 1);
    setInput("");
    onVerified(false);
  }

  useEffect(() => {
    newProblem();
  }, []);

  function handleChange(value: string) {
    setInput(value);
    onVerified(Number(value) === a + b);
  }

  return (
    <div className="border rounded-lg p-3 bg-gray-50">
      <label className="text-sm font-medium block mb-1">
        {a} + {b} = ?
      </label>
      <input
        type="number"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full border rounded px-3 py-2"
        placeholder={t("captcha.answer_placeholder")}
      />
      <button type="button" onClick={newProblem} className="text-xs text-orange-500 mt-1">
        {t("captcha.new_question")}
      </button>
    </div>
  );
}