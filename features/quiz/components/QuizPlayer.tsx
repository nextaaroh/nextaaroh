"use client";
import { useEffect, useState, useCallback } from "react";
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

  useEffect(() => {
    fetch("/api/v1/quiz/" + params.slug)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setQuestions(data?.questions ?? []))
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false));
  }, [params.slug]);

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

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/quiz/" + params.slug + "/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      router.push("/quiz/" + params.slug + "/result?score=" + (data?.score ?? 0) + "&total=" + total);
    } catch {
      setSubmitting(false);
    }
  }, [answers, params.slug, router, total]);

  if (loading) {
    return <p className="text-center text-gray-400 text-sm py-8">Loading...</p>;
  }
  if (!question) {
    return <p className="text-center text-gray-400 text-sm py-8">यह quiz अभी उपलब्ध नहीं है</p>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
        <div
          className="bg-orange-500 h-2 rounded-full transition-all"
          style={{ width: (((current + 1) / total) * 100) + "%" }}
        />
      </div>
      <p className="text-xs text-gray-400 mb-3">Question {current + 1} of {total}</p>

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