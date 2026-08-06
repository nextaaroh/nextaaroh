"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

type Option = { id: string; text: string };
type Question = { id: string; question_text: string; options: Option[] };
type Answer = { question_id: string; selected_option_id: string };

export default function QuizPlayer() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isTimed, setIsTimed] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const answersRef = useRef<Answer[]>([]);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    fetch("/api/v1/quiz/" + params.slug)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setQuestions(data?.questions ?? []);
        setIsTimed(!!data?.is_timed);
        if (data?.is_timed && data?.time_limit_seconds) {
          setSecondsLeft(data.time_limit_seconds);
        }
      })
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false));
  }, [params.slug]);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/quiz/" + params.slug + "/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answersRef.current }),
      });
      const data = await res.json();
      router.push("/quiz/" + params.slug + "/result?score=" + (data?.score ?? 0) + "&total=" + questions.length);
    } catch {
      setSubmitting(false);
    }
  }, [params.slug, router, questions.length]);

  useEffect(() => {
    if (!isTimed || secondsLeft === null || loading) return;
    if (secondsLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => (s !== null ? s - 1 : null)), 1000);
    return () => clearTimeout(timer);
  }, [isTimed, secondsLeft, loading, handleSubmit]);

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

  if (loading) {
    return <p className="text-center text-gray-400 text-sm py-8">Loading...</p>;
  }
  if (!question) {
    return <p className="text-center text-gray-400 text-sm py-8">यह quiz अभी उपलब्ध नहीं है</p>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-400">Question {current + 1} of {total}</p>
        {isTimed && secondsLeft !== null ? (
          <span className={"text-xs font-bold px-2 py-1 rounded-full " + (secondsLeft < 60 ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600")}>
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
              className={
                isSelected
                  ? "w-full text-left border-2 border-orange-500 bg-orange-50 rounded-lg px-4 py-3 text-sm"
                  : "w-full text-left border border-gray-200 rounded-lg px-4 py-3 text-sm"
              }
            >
              {option.text}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={goNext}
        disabled={!selectedForCurrent || submitting}
        className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg disabled:opacity-50"
      >
        {submitting ? "Submitting..." : current < total - 1 ? "Next" : "Submit Quiz"}
      </button>
    </div>
  );
}
