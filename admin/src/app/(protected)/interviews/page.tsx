import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentAdmin } from "@/features/auth/server/lib/auth-server";
import { AllInterviewConfigList } from "@/features/interviews/server/components/all-interview-config-list";
import {
  getAllInterviewConfigs,
  getSessionCountsForConfigs,
} from "@/features/interviews/server/loaders/get-all-interview-configs";
import { routes } from "@/lib/routes";
import { InterviewTopicList } from "@/features/interview-topics/server/components/interview-topic-list";
import { findAllInterviewTopics } from "@/features/interview-topics/server/repositories/interview-topic-repository";

export default async function InterviewsPage() {
  const currentAdmin = await getCurrentAdmin();

  if (!currentAdmin) {
    redirect(routes.login());
  }

  const [configs, topics] = await Promise.all([
    getAllInterviewConfigs(),
    findAllInterviewTopics(),
  ]);
  const sessionCounts = await getSessionCountsForConfigs(
    configs.map((config) => config.id)
  );

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">インタビュー管理</h1>
        <Button asChild>
          <Link href={routes.interviewTopicNew() as Route}>
            <Plus className="size-4" />
            一般テーマを作成
          </Link>
        </Button>
      </div>

      <section className="mb-8 rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">一般テーマ型</h2>
        <InterviewTopicList topics={topics} />
      </section>

      <section className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">議案型</h2>
        <AllInterviewConfigList
          configs={configs}
          sessionCounts={sessionCounts}
        />
      </section>
    </div>
  );
}
