import { ArrowLeft } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InterviewTopicForm } from "@/features/interview-topics/client/components/interview-topic-form";
import {
  findInterviewTopicById,
  findQuestionsByConfigId,
} from "@/features/interview-topics/server/repositories/interview-topic-repository";
import { routes } from "@/lib/routes";

interface EditInterviewTopicPageProps {
  params: Promise<{ topicId: string }>;
}

export default async function EditInterviewTopicPage({
  params,
}: EditInterviewTopicPageProps) {
  const { topicId } = await params;
  const topic = await findInterviewTopicById(topicId);
  const config = topic?.interview_configs[0];
  if (!topic || !config) notFound();

  const questions = await findQuestionsByConfigId(config.id);

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
        <h1 className="text-2xl font-bold">一般テーマ型インタビューを編集</h1>
        <p className="mt-2 text-gray-600">{topic.title}</p>
      </div>
      <InterviewTopicForm topic={topic} config={config} questions={questions} />
    </div>
  );
}
