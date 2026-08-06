"use client";
import { useEffect, useState, useCallback } from "react";

type QuestionInput = {
  question_text: string;
  options: string[];
  correct_index: number;
};

type Quiz = { id: string; title: string; subject: string | null; created_at: string };

function emptyQuestion(): QuestionInput {
  return { question_text: "", options: ["", "", "", ""], correct_index: 0 };
}

export default function AdminQuizPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [questions, setQuestions] = useState<QuestionInput[]>([emptyQuestion()]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(() => {
    fetch("/api/v1/admin/quiz")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setQuizzes(data?.data ?? []))
      .catch(() => setQuizzes([]));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function updateQuestion(index: number, field: string, value: string | number) {
    setQuestions((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function updateOption(qIndex: number, oIndex: number, value: string) {
    setQuestions((prev) => {
      const next = [...prev];
      const opts = [...next[qIndex].options];
      opts[oIndex] = value;
      next[qIndex] = { ...next[qIndex], options: opts };
      return next;
    });
  }

  function addQuestion() {
    setQuestions((prev) => [...prev, emptyQuestion()]);
  }

  function removeQuestion(index: number) {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    setMessage("");
    if (!title.trim()) {
      setMessage("Quiz title ज़रूरी है");
      return;
    }
    const invalid = questions.some((q) => !q.question_text.trim() || q.options.some((o) => !o.trim()));
    if (invalid) {
      setMessage("हर question और सारे 4 options भरें");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/admin/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, subject, questions }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error?.message ?? "कुछ गलत हो गया");
        return;
      }
      setMessage("Quiz बन गया!");
      setTitle("");
      setSubject("");
      setQuestions([emptyQuestion()]);
      load();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">Quiz Manager</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 max-w-lg space-y-3">
        <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Quiz Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Subject (optional)" value={subject} onChange={(e) => setSubject(e.target.value)} />

        {questions.map((q, qIndex) => {
          return (
            <div key={qIndex} className="border border-gray-100 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-500">Question {qIndex + 1}</p>
                {questions.length > 1 ? (
                  <button type="button" onClick={() => removeQuestion(qIndex)} className="text-xs text-red-500">
                    Remove
                  </button>
                ) : null}
              </div>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                placeholder="Question text"
                value={q.question_text}
                onChange={(e) => updateQuestion(qIndex, "question_text", e.target.value)}
              />
              {q.options.map((opt, oIndex) => {
                return (
                  <div key={oIndex} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={"correct-" + qIndex}
                      checked={q.correct_index === oIndex}
                      onChange={() => updateQuestion(qIndex, "correct_index", oIndex)}
                    />
                    <input
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                      placeholder={"Option " + (oIndex + 1)}
                      value={opt}
                      onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                    />
                  </div>
                );
              })}
              <p className="text-[10px] text-gray-400">Radio button से सही जवाब चुनें</p>
            </div>
          );
        })}

        <button type="button" onClick={addQuestion} className="text-sm text-orange-500 font-medium">
          + एक और Question जोड़ें
        </button>

        {message ? <p className="text-xs text-orange-600">{message}</p> : null}

        <button type="button" onClick={handleSubmit} disabled={submitting} className="w-full bg-orange-500 text-white text-sm font-medium py-2.5 rounded-lg disabled:opacity-50">
          {submitting ? "Creating..." : "Create Quiz"}
        </button>
      </div>

      <p className="text-sm font-medium mb-2">सारे Quizzes ({quizzes.length})</p>
      <div className="space-y-2">
        {quizzes.map((quiz) => {
          return (
            <div key={quiz.id} className="bg-white border border-gray-200 rounded-xl p-3">
              <p className="text-sm font-medium">{quiz.title}</p>
              {quiz.subject ? <p className="text-xs text-gray-400">{quiz.subject}</p> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
