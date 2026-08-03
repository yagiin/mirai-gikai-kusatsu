import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLatestInterviewSession } from "@/features/interview-session/server/loaders/get-latest-interview-session";
import { GeneralInterviewLandingPage } from "@/features/interview-topics/server/components/general-interview-landing-page";
import { findPublicInterviewTopicBySlug } from "@/features/interview-topics/server/repositories/interview-topic-repository";

export const dynamic = "force-dynamic";

interface GeneralInterviewPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: GeneralInterviewPageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = await findPublicInterviewTopicBySlug(slug);
  if (!topic) return { title: "インタビューが見つかりません" };
  return {
    title: `AIインタビュー - ${topic.title}`,
    description: topic.description,
    alternates: { canonical: `/interviews/${topic.slug}` },
  };
}

export default async function GeneralInterviewPage({
  params,
}: GeneralInterviewPageProps) {
  const { slug } = await params;
  const topic = await findPublicInterviewTopicBySlug(slug);
  const config = topic?.interview_configs[0];
  if (!topic || !config) notFound();
  const session = await getLatestInterviewSession(config.id);
  return (
    <GeneralInterviewLandingPage
      topic={topic}
      config={config}
      hasActiveSession={session?.status === "active"}
    />
  );
}
