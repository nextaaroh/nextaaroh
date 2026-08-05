"use client";
import { useEffect, useState } from "react";
import QuizListCard from "@/features/quiz/components/QuizListCard";

type Quiz = {
  id: string;
  slug: string;
  title: string;
  subject: string | null;
  difficulty: string | null;
  type: string;
};

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/quiz")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setQuizzes(data?.data ?? []))
      .catch(() => setQuizzes([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 pt-4 pb-6">
      <h1 className="text-lg font-bold mb-3">Quiz</h1>
      {loading ? <p className="text-center text-gray-400 text-sm py-8">Loading...</p> : null}
      {!loading && quizzes.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-8">अभी कोई quiz उपलब्ध नहीं है</p>
      ) : null}
      <div className="space-y-3">
        {quizzes.map((quiz) => {
          return <QuizListCard key={quiz.id} quiz={quiz} />;
        })}
      </div>
    </div>
  );
}