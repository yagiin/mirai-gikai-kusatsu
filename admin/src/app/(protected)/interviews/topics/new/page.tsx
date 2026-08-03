import { ArrowLeft } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { InterviewTopicForm } from "@/features/interview-topics/client/components/interview-topic-form";
import { routes } from "@/lib/routes";

export default function NewInterviewTopicPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Link
        href={routes.interviews() as Route}
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="size-4" />
        インタビュー管理に戻る
      </Link>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">一般テーマ型インタビューを作成</h1>
        <p className="mt-2 text-gray-600">
          議案に紐づかないテーマを設定し、市民の経験や提案をAIが深掘りします。
        </p>
      </div>
      <InterviewTopicForm />
    </div>
  );
}
