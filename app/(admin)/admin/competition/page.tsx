"use client";
import { useEffect, useState, useCallback } from "react";

type Competition = { id: string; title: string; status: string; quiz_id: string | null };
type Registration = { id: string; payment_status: string; profiles: { username: string; full_name: string } | null };
type Result = { correct_count: number; total_questions: number; profiles: { username: string; full_name: string } | null };

export default function AdminCompetitionPage() {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(() => {
    fetch("/api/v1/admin/competition")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setCompetition(data?.competition ?? null);
        setRegistrations(data?.registrations ?? []);
        setResults(data?.results ?? []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function markPaid(regId: string) {
    await fetch("/api/v1/admin/competition/mark-paid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registration_id: regId }),
    });
    load();
  }

  async function generateQuiz() {
    if (!competition) return;
    setGenerating(true);
    setMessage("");
    try {
      const res = await fetch("/api/v1/admin/competition/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ competition_id: competition.id }),
      });
      const data = await res.json();
      setMessage(data.message ?? data.error?.message ?? "Done");
      load();
    } finally {
      setGenerating(false);
    }
  }

  const paidCount = registrations.filter((r) => r.payment_status === "paid").length;
  const top3 = results.slice(0, 3);

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">Quiz Competition</h1>

      {!competition ? <p className="text-gray-400 text-sm">कोई competition नहीं है</p> : null}

      {competition ? (
        <>
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <p className="font-medium">{competition.title}</p>
            <p className="text-xs text-gray-400">Status: {competition.status} · Registrations: {registrations.length} ({paidCount} paid)</p>
            {!competition.quiz_id ? (
              <button type="button" onClick={generateQuiz} disabled={generating} className="mt-2 bg-purple-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg disabled:opacity-50">
                {generating ? "Generating..." : "✨ AI से 15-question Competition Quiz बनाएं"}
              </button>
            ) : (
              <p className="text-xs text-green-600 mt-2">✓ Quiz बन चुका है</p>
            )}
            {message ? <p className="text-xs text-orange-600 mt-2">{message}</p> : null}
          </div>

          {top3.length > 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
              <p className="text-sm font-semibold mb-2">🏆 Top 3 (Winners)</p>
              {top3.map((r, i) => {
                return (
                  <div key={i} className="flex items-center justify-between text-sm py-1">
                    <span>{i + 1}. {r.profiles?.full_name} (@{r.profiles?.username})</span>
                    <span className="font-bold">{r.correct_count}/{r.total_questions}</span>
                  </div>
                );
              })}
            </div>
          ) : null}

          <p className="text-sm font-medium mb-2">Registrations</p>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden overflow-x-auto mb-4">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs">
                <tr>
                  <th className="text-left px-3 py-2">Name</th>
                  <th className="text-left px-3 py-2">Username</th>
                  <th className="text-left px-3 py-2">Payment</th>
                  <th className="text-left px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((r) => {
                  return (
                    <tr key={r.id} className="border-t border-gray-100">
                      <td className="px-3 py-2">{r.profiles?.full_name}</td>
                      <td className="px-3 py-2">@{r.profiles?.username}</td>
                      <td className="px-3 py-2">
                        <span className={r.payment_status === "paid" ? "text-green-600" : "text-yellow-600"}>{r.payment_status}</span>
                      </td>
                      <td className="px-3 py-2">
                        {r.payment_status !== "paid" ? (
                          <button type="button" onClick={() => markPaid(r.id)} className="text-xs text-blue-600">Mark Paid</button>
                        ) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-sm font-medium mb-2">All Results</p>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs">
                <tr>
                  <th className="text-left px-3 py-2">Name</th>
                  <th className="text-left px-3 py-2">Correct</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => {
                  return (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="px-3 py-2">{r.profiles?.full_name} (@{r.profiles?.username})</td>
                      <td className="px-3 py-2">{r.correct_count}/{r.total_questions}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  );
}
