"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

type Option = { id: string; text: string };
type Question = { id: string; question_text: string; options: Option[] };
type Answer = { question_id: string; selected_option_id: string };

export default function CompetitionQuizPlayer() {
  const router = useRouter();
  const [quizId, setQuizId] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [violations, setViolations] = useState(0);
  const [error, setError] = useState("");
  const answersRef = useRef<Answer[]>([]);
  const violationsRef = useRef(0);
  const submittedRef = useRef(false);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);
  useEffect(() => {
    violationsRef.current = violations;
  }, [violations]);

  useEffect(() => {
    fetch("/api/v1/competition/start", { method: "POST" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setError(data.error?.message ?? "शुरू नहीं हो पाया");
          return;
        }
        setQuizId(data.quiz_id);
        setQuestions(data.questions);
        const deadline = new Date(data.deadline_at).getTime();
        setSecondsLeft(Math.max(Math.floor((deadline - Date.now()) / 1000), 0));
      })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/competition/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quiz_id: quizId, answers: answersRef.current, violation_count: violationsRef.current }),
      });
      const data = await res.json();
      router.push("/competition/result?correct=" + (data.correct_count ?? 0) + "&total=" + (data.total_questions ?? 25));
    } catch {
      setSubmitting(false);
      submittedRef.current = false;
    }
  }, [quizId, router]);

  useEffect(() => {
    if (secondsLeft === null || loading || error) return;
    if (secondsLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => (s !== null ? s - 1 : null)), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, loading, error, handleSubmit]);

  // Anti-cheat: tab switch / minimize detection
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "hidden" && !submittedRef.current) {
        setViolations((v) => {
          const next = v + 1;
          if (next >= 3) {
            handleSubmit();
          }
          return next;
        });
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [handleSubmit]);

  // Anti-cheat: block copy, right-click, text selection
  useEffect(() => {
    function blockAction(e: Event) {
      e.preventDefault();
    }
    document.addEventListener("contextmenu", blockAction);
    document.addEventListener("copy", blockAction);
    document.addEventListener("cut", blockAction);
    return () => {
      document.removeEventListener("contextmenu", blockAction);
      document.removeEventListener("copy", blockAction);
      document.removeEventListener("cut", blockAction);
    };
  }, []);

  const question = questions[current];
  const total = questions.length;
  const selectedForCurrent = answers.find((a) => a.question_id === question?.id)?.selected_option_id;

  function selectOption(optionId: string) {
    if (!question) return;
    setAnswers((prev) => {
      const withoutCurrent = prev.filter((a) => a.question_id !== question.id);
      return [...withoutCurrent, { question_id: question.id, selected_option_id: optionId }];
    });
  }

  function goNext() {
    if (current < total - 1) {
      setCurrent((c) => c + 1);
    } else {
      handleSubmit();
    }
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }

  if (loading) return <p className="text-center text-gray-400 text-sm py-8">शुरू हो रहा है...</p>;
  if (error) return <p className="text-center text-red-600 text-sm py-8">{error}</p>;
  if (!question) return <p className="text-center text-gray-400 text-sm py-8">Questions नहीं मिले</p>;

  return (
    <div className="max-w-md mx-auto p-4 select-none" style={{ userSelect: "none" }}>
      {violations > 0 ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-3 text-xs text-red-600 text-center">
          ⚠️ Tab switch detected ({violations}/3) — 3 बार होने पर auto-submit हो जाएगा
        </div>
      ) : null}

      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-400">Question {current + 1} of {total}</p>
        {secondsLeft !== null ? (
          <span className={"text-xs font-bold px-2 py-1 rounded-full " + (secondsLeft < 120 ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600")}>
            ⏱ {formatTime(secondsLeft)}
          </span>
        ) : null}
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
        <div className="bg-orange-500 h-2 rounded-full transition-all" style={{ width: (((current + 1) / total) * 100) + "%" }} />
      </div>

      <h2 className="text-base font-semibold mb-4">{question.question_text}</h2>

      <div className="space-y-2 mb-6">
        {question.options.map((option) => {
          const isSelected = selectedForCurrent === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => selectOption(option.id)}
              className={isSelected ? "w-full text-left border-2 border-orange-500 bg-orange-50 rounded-lg px-4 py-3 text-sm" : "w-full text-left border border-gray-200 rounded-lg px-4 py-3 text-sm"}
            >
              {option.text}
            </button>
          );
        })}
      </div>

      <button type="button" onClick={goNext} disabled={!selectedForCurrent || submitting} className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg disabled:opacity-50">
        {submitting ? "Submitting..." : current < total - 1 ? "Next" : "Submit"}
      </button>

      <p className="text-[10px] text-gray-400 text-center mt-3">पीछे जाने का option नहीं है — ध्यान से जवाब दें</p>
    </div>
  );
}
