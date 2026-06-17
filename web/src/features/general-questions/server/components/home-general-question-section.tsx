import { CalendarDays, ChevronRight, UserRound } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { routes } from "@/lib/routes";
import type { GeneralQuestionWithSession } from "../../shared/types";

type Props = {
  questions: GeneralQuestionWithSession[];
};

const VISIBLE_QUESTIONS = 3;

function formatDate(date: string | null) {
  if (!date) return "日付未定";
  return date.replaceAll("-", "/");
}

export function HomeGeneralQuestionSection({ questions }: Props) {
  const visibleQuestions = questions.slice(0, VISIBLE_QUESTIONS);

  if (visibleQuestions.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-primary-accent">
              市議会で何が問われたか
            </p>
            <h2 className="text-[28px] font-bold leading-[1.45]">一般質問</h2>
          </div>
          <Link
            href={routes.generalQuestions() as Route}
            className="group hidden items-center gap-1 text-sm font-bold text-emerald-800 underline-offset-4 hover:underline sm:flex"
          >
            一覧を見る
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <p className="text-sm leading-relaxed text-mirai-text">
          議員が市政について質問し、市が答弁した内容を紹介します
        </p>
      </div>

      <div className="grid gap-3">
        {visibleQuestions.map((question) => (
          <Link
            key={question.id}
            href={routes.generalQuestionDetail(question.id) as Route}
            className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md"
          >
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                {formatDate(question.question_date)}
              </span>
              <span className="inline-flex items-center gap-1">
                <UserRound className="h-4 w-4" aria-hidden="true" />
                {question.questioner_name}
              </span>
            </div>
            <div className="mt-3 flex items-start justify-between gap-4">
              <h3 className="text-lg font-bold leading-relaxed text-black">
                {question.title}
              </h3>
              <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-gray-500 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>

      <Link
        href={routes.generalQuestions() as Route}
        className="inline-flex items-center justify-center gap-1 rounded-full border border-mirai-text bg-white px-5 py-3 text-sm font-bold hover:bg-gray-50 sm:hidden"
      >
        一般質問の一覧を見る
        <ChevronRight className="h-4 w-4" />
      </Link>
    </section>
  );
}
