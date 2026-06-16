import { CalendarDays, UserRound } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { routes } from "@/lib/routes";
import type { GeneralQuestionWithSession } from "../../shared/types";

type Props = {
  question: GeneralQuestionWithSession;
};

function formatDate(date: string | null) {
  if (!date) return "日付未定";
  return date.replaceAll("-", "/");
}

export function GeneralQuestionCard({ question }: Props) {
  return (
    <Link
      href={routes.generalQuestionDetail(question.id) as Route}
      className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md"
    >
      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          {formatDate(question.question_date)}
        </span>
        <span className="inline-flex items-center gap-1">
          <UserRound className="h-4 w-4" aria-hidden="true" />
          {question.questioner_name}
          {question.questioner_group ? `（${question.questioner_group}）` : ""}
        </span>
      </div>
      <p className="mt-3 text-sm font-semibold text-emerald-700">
        {question.diet_sessions?.name ?? "会期未設定"}
      </p>
      <h2 className="mt-2 text-xl font-bold leading-relaxed">
        {question.title}
      </h2>
      <p className="mt-3 line-clamp-3 leading-relaxed text-gray-700">
        {question.summary}
      </p>
      <p className="mt-4 text-sm font-semibold text-emerald-800">詳細を見る</p>
    </Link>
  );
}
