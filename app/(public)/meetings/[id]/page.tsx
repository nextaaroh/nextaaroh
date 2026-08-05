"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";

type Meeting = {
  title: string;
  description: string | null;
  scheduled_at: string;
  stream_embed_url: string | null;
  recording_url: string | null;
};

type Question = {
  id: string;
  question_text: string;
  upvote_count: number;
};

export default function MeetingDetailPage() {
  const params = useParams<{ id: string }>();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [rsvped, setRsvped] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionText, setQuestionText] = useState("");

  const loadQuestions = useCallback(() => {
    fetch("/api/v1/meetings/" + params.id + "/questions")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setQuestions(data?.data ?? []))
      .catch(() => setQuestions([]));
  }, [params.id]);

  useEffect(() => {
    fetch("/api/v1/meetings")
      .then((res) => (res.ok ? res.json() : null))
      .then(() => {})
      .catch(() => {});
    loadQuestions();
  }, [params.id, loadQuestions]);

  async function handleRsvp() {
    setRsvped(true);
    try {
      await fetch("/api/v1/meetings/" + params.id + "/rsvp", { method: "POST" });
    } catch {
      // silently ignore for now
    }
  }

  async function handleAskQuestion() {
    if (!questionText.trim()) return;
    try {
      await fetch("/api/v1/meetings/" + params.id + "/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question_text: questionText }),
      });
      setQuestionText("");
      loadQuestions();
    } catch {
      // silently ignore for now
    }
  }

  if (!meeting) {
    return (
      <div className="max-w-md mx-auto p-4">
        <p className="text-center text-gray-400 text-sm py-8">Loading...</p>
        <button
          type="button"
          onClick={handleRsvp}
          disabled={rsvped}
          className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg disabled:opacity-50"
        >
          {rsvped ? "RSVP'd ✓" : "RSVP for this session"}
        </button>

        <div className="mt-6">
          <h2 className="text-sm font-semibold mb-2">Questions</h2>
          <div className="flex gap-2 mb-3">
            <input
              className="input"
              placeholder="अपना सवाल लिखें..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
            <button type="button" onClick={handleAskQuestion} className="shrink-0 bg-orange-500 text-white text-sm px-4 rounded-lg">
              Ask
            </button>
          </div>
          <div className="space-y-2">
            {questions.map((q) => {
              return (
                <div key={q.id} className="border border-gray-100 rounded-lg px-3 py-2 flex justify-between text-sm">
                  <span>{q.question_text}</span>
                  <span className="text-orange-500 text-xs">👍 {q.upvote_count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}