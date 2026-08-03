import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { findPublicInterviewTopics } from "@/features/interview-topics/server/repositories/interview-topic-repository";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "AIインタビュー",
  description: "草津市のさまざまなテーマについて、AIがご意見を伺います。",
};

export const dynamic = "force-dynamic";

export default async function InterviewTopicsPage() {
  const topics = await findPublicInterviewTopics();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">AIインタビュー</h1>
      <p className="mt-3 leading-7 text-mirai-text-secondary">
        草津市のまちづくりや暮らしについて、あなたの経験やご意見をお聞かせください。
      </p>
      <div className="mt-8 space-y-4">
        {topics.length ? (
          topics.map((topic) => (
            <Link
              key={topic.id}
              href={routes.interviewTopic(topic.slug) as Route}
              className="block rounded-2xl border bg-white p-6 transition-shadow hover:shadow-md"
            >
              <h2 className="text-xl font-bold">{topic.title}</h2>
              <p className="mt-2 leading-7 text-mirai-text-secondary">
                {topic.description}
              </p>
            </Link>
          ))
        ) : (
          <p className="rounded-2xl bg-white p-6 text-mirai-text-secondary">
            現在募集中の一般テーマ型インタビューはありません。
          </p>
        )}
      </div>
    </div>
  );
}
