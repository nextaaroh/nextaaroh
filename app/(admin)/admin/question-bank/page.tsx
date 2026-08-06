"use client";
import { useEffect, useState, useCallback } from "react";

type BankQuestion = { id: string; question_text: string; subject: string | null; difficulty: string; used_count: number };

export default function AdminQuestionBankPage() {
  const [questions, setQuestions] = useState<BankQuestion[]>([]);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [genMessage, setGenMessage] = useState("");
  const [generating, setGenerating] = useState(false);

  const load = useCallback(() => {
    fetch("/api/v1/admin/question-bank")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setQuestions(data?.data ?? []))
      .catch(() => setQuestions([]));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function updateOption(index: number, value: string) {
    setOptions((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  async function handleAdd() {
    setMessage("");
    if (!questionText.trim() || options.some((o) => !o.trim())) {
      setMessage("Question और सारे options भरें");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/admin/question-bank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question_text: questionText, options, correct_index: correctIndex, subject, difficulty }),
      });
      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error?.message ?? "कुछ गलत हो गया");
        return;
      }
      setQuestionText("");
      setOptions(["", "", "", ""]);
      setCorrectIndex(0);
      setMessage("Question जुड़ गया ✓");
      load();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGenerate() {
    setGenMessage("");
    setGenerating(true);
    try {
      const res = await fetch("/api/v1/admin/quiz/generate-daily", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setGenMessage(data.error?.message ?? "कुछ गलत हो गया");
        return;
      }
      setGenMessage(data.message ?? "आज के 3 quizzes बन गए!");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div>
      <h1 className="text-lg font-bold mb-1">Question Bank</h1>
      <p className="text-xs text-gray-400 mb-4">यहां सैकड़ों questions जमा करें — रोज़ इन्हीं में से अपने आप 3 quiz (10-10 questions) बन जाएंगे।</p>

      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 max-w-md">
        <p className="text-sm font-medium mb-2">आज के 3 Quiz अभी Generate करें</p>
        <p className="text-xs text-gray-500 mb-3">Bank में कम से कम 30 questions होने चाहिए। Deployment के बाद यह अपने आप रोज़ चलेगा (cron job से) — अभी manual button है testing के लिए।</p>
        <button type="button" onClick={handleGenerate} disabled={generating} className="bg-orange-500 text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-50">
          {generating ? "Generating..." : "Generate आज के Quiz"}
        </button>
        {genMessage ? <p className="text-xs mt-2 text-gray-700">{genMessage}</p> : null}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 max-w-md space-y-2">
        <p className="text-sm font-medium mb-1">नया Question जोड़ें</p>
        <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Question text" value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
        {options.map((opt, i) => {
          return (
            <div key={i} className="flex items-center gap-2">
              <input type="radio" name="bank-correct" checked={correctIndex === i} onChange={() => setCorrectIndex(i)} />
              <input className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm" placeholder={"Option " + (i + 1)} value={opt} onChange={(e) => updateOption(i, e.target.value)} />
            </div>
          );
        })}
        <div className="grid grid-cols-2 gap-2">
          <input className="border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Subject (optional)" value={subject} onChange={(e) => setSubject(e.target.value)} />
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        {message ? <p className="text-xs text-orange-600">{message}</p> : null}
        <button type="button" onClick={handleAdd} disabled={submitting} className="w-full bg-orange-500 text-white text-sm font-medium py-2 rounded-lg disabled:opacity-50">
          {submitting ? "Adding..." : "Add to Bank"}
        </button>
      </div>

      <p className="text-sm font-medium mb-2">Bank में Questions ({questions.length})</p>
      <div className="space-y-1.5">
        {questions.map((q) => {
          return (
            <div key={q.id} className="bg-white border border-gray-200 rounded-lg px-3 py-2 flex items-center justify-between text-sm">
              <span className="line-clamp-1">{q.question_text}</span>
              <span className="text-xs text-gray-400 shrink-0 ml-2">used {q.used_count}x</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
