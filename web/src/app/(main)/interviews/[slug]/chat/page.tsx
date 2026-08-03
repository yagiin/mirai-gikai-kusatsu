import { notFound } from "next/navigation";
import { getInterviewQuestions } from "@/features/interview-config/server/loaders/get-interview-questions";
import { InterviewChatClient } from "@/features/interview-session/client/components/interview-chat-client";
import { InterviewSessionAuthRetry } from "@/features/interview-session/client/components/interview-session-auth-retry";
import { InterviewSessionErrorView } from "@/features/interview-session/client/components/interview-session-error-view";
import { initializeInterviewChat } from "@/features/interview-session/server/loaders/initialize-interview-chat";
import { findPublicInterviewTopicBySlug } from "@/features/interview-topics/server/repositories/interview-topic-repository";
import { routes } from "@/lib/routes";

export const dynamic = "force-dynamic";

interface GeneralInterviewChatPageProps {
  params: Promise<{ slug: string }>;
}

function isAuthInitializationError(error: unknown): boolean {
  return (
    error instanceof Error && error.message.startsWith("Failed to get user:")
  );
}

export default async function GeneralInterviewChatPage({
  params,
}: GeneralInterviewChatPageProps) {
  const { slug } = await params;
  const topic = await findPublicInterviewTopicBySlug(slug);
  const config = topic?.interview_configs[0];
  if (!topic || !config) notFound();

  const questions =
    config.mode === "loop" || config.mode === "targeted"
      ? await getInterviewQuestions(config.id)
      : [];
  const landingHref = routes.interviewTopic(slug);

  try {
    const { session, messages } = await initializeInterviewChat(
      topic.id,
      config.id
    );
    return (
      <InterviewChatClient
        billId={topic.id}
        interviewConfigId={config.id}
        billTitle={topic.title}
        subjectHref={landingHref}
        exitHref={landingHref}
        introText="一般テーマについてのAIインタビューを開始します。"
        sessionId={session.id}
        initialMessages={messages}
        mode={config.mode}
        totalQuestions={questions.length}
        estimatedDuration={config.estimated_duration}
        sessionStartedAt={session.started_at}
        hasRated={session.rating != null}
      />
    );
  } catch (error) {
    console.error("Failed to initialize general interview session:", error);
    if (isAuthInitializationError(error)) {
      return (
        <InterviewSessionAuthRetry billId={topic.id} returnHref={landingHref} />
      );
    }
    return (
      <InterviewSessionErrorView billId={topic.id} returnHref={landingHref} />
    );
  }
}
