import Link from "next/link";

type Quiz = {
  id: string;
  slug: string;
  title: string;
  subject: string | null;
  difficulty: string | null;
  type: string;
};

export default function QuizListCard({ quiz }: { quiz: Quiz }) {
  const isLive = quiz.type === "friday_live";

  return (
    <Link href={"/quiz/" + quiz.slug} className="block border border-gray-200 rounded-xl p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-sm">{quiz.title}</p>
          {quiz.subject ? <p className="text-xs text-gray-500 mt-1">{quiz.subject}</p> : null}
        </div>
        {isLive ? (
          <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full shrink-0">
            LIVE
          </span>
        ) : null}
      </div>
      {quiz.difficulty ? (
        <span className="inline-block mt-2 text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
          {quiz.difficulty}
        </span>
      ) : null}
    </Link>
  );
}