import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layouts/container";
import { GeneralQuestionCard } from "@/features/general-questions/server/components/general-question-card";
import { getPublishedGeneralQuestions } from "@/features/general-questions/server/loaders/get-published-general-questions";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "一般質問 | みらい議会＠草津市",
  description:
    "草津市議会の一般質問を、質問項目・要約・市の答弁要約で紹介します。",
};

export default async function GeneralQuestionsPage() {
  const questions = await getPublishedGeneralQuestions();

  return (
    <div className="bg-mirai-surface-muted py-12 pt-28 md:pt-12">
      <Container>
        <div className="mb-8">
          <p className="text-sm font-semibold text-emerald-700">
            市議会で何が問われたか
          </p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">一般質問</h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-gray-700">
            議員が市政について質問し、市が答弁した内容を、やさしい要約で紹介します。
          </p>
        </div>

        {questions.length === 0 ? (
          <p className="rounded-xl bg-white p-8 text-center text-gray-600">
            現在、公開中の一般質問はありません。
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {questions.map((question) => (
              <GeneralQuestionCard key={question.id} question={question} />
            ))}
          </div>
        )}

        <nav className="mt-10">
          <Link
            href={routes.home()}
            className="font-semibold underline underline-offset-4"
          >
            TOPへ戻る
          </Link>
        </nav>
      </Container>
    </div>
  );
}
