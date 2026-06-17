import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Metadata, Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layouts/container";
import { getPublishedGeneralQuestionById } from "@/features/general-questions/server/loaders/get-published-general-question-by-id";
import { parseMarkdown } from "@/lib/markdown";
import { routes } from "@/lib/routes";

type Props = {
  params: Promise<{ id: string }>;
};

function formatDate(date: string | null) {
  if (!date) return "日付未定";
  return date.replaceAll("-", "/");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const question = await getPublishedGeneralQuestionById(id);

  if (!question) return { title: "一般質問が見つかりません" };

  return {
    title: `${question.title} | 一般質問 | みらい議会＠草津市`,
    description: question.summary,
  };
}

export default async function GeneralQuestionDetailPage({ params }: Props) {
  const { id } = await params;
  const question = await getPublishedGeneralQuestionById(id);
  if (!question) notFound();

  const [summary, answerSummary, questionerComment, transcript] =
    await Promise.all([
      parseMarkdown(question.summary, { billEnhancements: false }),
      parseMarkdown(question.answer_summary, { billEnhancements: false }),
      question.questioner_comment
        ? parseMarkdown(question.questioner_comment, {
            billEnhancements: false,
          })
        : null,
      question.transcript
        ? parseMarkdown(question.transcript, { billEnhancements: false })
        : null,
    ]);

  return (
    <div className="bg-mirai-surface-muted py-12 pt-28 md:pt-12">
      <Container>
        <Link
          href={routes.generalQuestions() as Route}
          className="inline-flex items-center gap-2 font-semibold text-emerald-800"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          一般質問一覧へ戻る
        </Link>

        <article className="mt-6 rounded-2xl bg-white p-6 shadow-sm md:p-9">
          <p className="text-sm font-semibold text-emerald-700">
            {question.diet_sessions?.name ?? "会期未設定"} /{" "}
            {formatDate(question.question_date)}
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-relaxed md:text-4xl">
            {question.title}
          </h1>
          <p className="mt-3 text-gray-600">
            質問者：{question.questioner_name}
            {question.questioner_group
              ? `（${question.questioner_group}）`
              : ""}
          </p>

          <section className="mt-8 rounded-xl bg-emerald-50 p-5">
            <h2 className="text-xl font-bold">ひとことで言うと</h2>
            <div className="markdown-content mt-3 leading-8 text-gray-800 [&_a]:underline [&_a]:underline-offset-4 [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-4 [&_p:last-child]:mb-0">
              {summary}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-bold">市の答弁要約</h2>
            <div className="markdown-content mt-3 leading-8 text-gray-800 [&_a]:underline [&_a]:underline-offset-4 [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-4 [&_p:last-child]:mb-0">
              {answerSummary}
            </div>
          </section>

          {questionerComment && (
            <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
              <h2 className="text-xl font-bold">質問者によるコメント</h2>
              <div className="markdown-content mt-3 leading-8 text-gray-800 [&_a]:underline [&_a]:underline-offset-4 [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-4 [&_p:last-child]:mb-0">
                {questionerComment}
              </div>
            </section>
          )}

          {transcript && (
            <section className="mt-8">
              <h2 className="text-xl font-bold">議事録原文</h2>
              <div className="markdown-content mt-3 rounded-xl border bg-gray-50 p-5 leading-8 text-gray-800 [&_a]:underline [&_a]:underline-offset-4 [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-4 [&_p:last-child]:mb-0">
                {transcript}
              </div>
            </section>
          )}

          {(question.source_url || question.video_url) && (
            <section className="mt-8 border-t pt-5">
              <h2 className="text-xl font-bold">関連リンク</h2>
              <div className="mt-3 flex flex-wrap gap-3">
                {question.source_url && (
                  <a
                    href={question.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 font-semibold underline underline-offset-4"
                  >
                    議事録・資料
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                )}
                {question.video_url && (
                  <a
                    href={question.video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 font-semibold underline underline-offset-4"
                  >
                    動画を見る
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                )}
              </div>
            </section>
          )}
        </article>
      </Container>
    </div>
  );
}
