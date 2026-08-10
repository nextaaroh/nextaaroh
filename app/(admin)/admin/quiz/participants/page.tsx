"use client";
import { useEffect, useState } from "react";

type Quiz = { id: string; title: string; slug: string; type: string };
type Attempt = {
  id: string;
  profile_id: string;
  score: number;
  correct_count: number;
  total_questions: number;
  submitted_at: string;
  profiles: { username: string; full_name: string } | null;
};

export default function AdminQuizParticipantsPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/admin/quiz/participants")
      .then((res) => (res.ok ? res.json() : { quizzes: [] }))
      .then((data) => setQuizzes(data?.quizzes ?? []))
      .catch(() => setQuizzes([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedQuizId) return;
    fetch("/api/v1/admin/quiz/participants?quiz_id=" + selectedQuizId)
      .then((res) => (res.ok ? res.json() : { attempts: [] }))
      .then((data) => setAttempts(data?.attempts ?? []))
      .catch(() => setAttempts([]));
  }, [selectedQuizId]);

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">Quiz Participants</h1>

      {loading ? <p className="text-gray-400 text-sm">Loading...</p> : null}

      <select className="w-full max-w-sm border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4" value={selectedQuizId} onChange={(e) => setSelectedQuizId(e.target.value)}>
        <option value="">-- Quiz चुनें --</option>
        {quizzes.map((q) => {
          return <option key={q.id} value={q.id}>{q.title} ({q.type})</option>;
        })}
      </select>

      {selectedQuizId ? (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs">
              <tr>
                <th className="text-left px-3 py-2">Name</th>
                <th className="text-left px-3 py-2">Username</th>
                <th className="text-left px-3 py-2">Correct</th>
                <th className="text-left px-3 py-2">Coins Earned</th>
                <th className="text-left px-3 py-2">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((a) => {
                return (
                  <tr key={a.id} className="border-t border-gray-100">
                    <td className="px-3 py-2">{a.profiles?.full_name ?? "—"}</td>
                    <td className="px-3 py-2">@{a.profiles?.username ?? "—"}</td>
                    <td className="px-3 py-2">{a.correct_count} / {a.total_questions}</td>
                    <td className="px-3 py-2 text-orange-600 font-medium">🪙 {a.score}</td>
                    <td className="px-3 py-2 text-xs text-gray-400">{new Date(a.submitted_at).toLocaleString("en-IN")}</td>
                  </tr>
                );
              })}
              {attempts.length === 0 ? (
                <tr><td colSpan={5} className="px-3 py-4 text-center text-gray-400">अभी किसी ने attempt नहीं किया</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
