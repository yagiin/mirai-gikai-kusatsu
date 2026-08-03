import "server-only";

import { createAdminClient } from "@mirai-gikai/supabase";
import type { KouchouAiInterviewResponse } from "../../shared/build-kouchou-ai-csv";

export async function findTopicResponsesForKouchouAi(topicId: string): Promise<{
  slug: string;
  responses: KouchouAiInterviewResponse[];
} | null> {
  const supabase = createAdminClient();
  const { data: topic, error: topicError } = await supabase
    .from("interview_topics")
    .select("slug, interview_configs(id)")
    .eq("id", topicId)
    .single();

  if (topicError?.code === "PGRST116") return null;
  if (topicError) {
    throw new Error(`Failed to fetch interview topic: ${topicError.message}`);
  }

  const configIds = topic.interview_configs.map((config) => config.id);
  if (configIds.length === 0) return { slug: topic.slug, responses: [] };

  const { data: sessions, error: sessionsError } = await supabase
    .from("interview_sessions")
    .select("id")
    .in("interview_config_id", configIds)
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: true });

  if (sessionsError) {
    throw new Error(
      `Failed to fetch interview sessions: ${sessionsError.message}`
    );
  }
  if (sessions.length === 0) return { slug: topic.slug, responses: [] };

  const sessionIds = sessions.map((session) => session.id);
  const { data: messages, error: messagesError } = await supabase
    .from("interview_messages")
    .select("interview_session_id, content, created_at")
    .in("interview_session_id", sessionIds)
    .eq("role", "user")
    .order("created_at", { ascending: true });

  if (messagesError) {
    throw new Error(
      `Failed to fetch interview messages: ${messagesError.message}`
    );
  }

  const messagesBySession = new Map<string, string[]>();
  for (const message of messages) {
    const values = messagesBySession.get(message.interview_session_id) ?? [];
    values.push(message.content);
    messagesBySession.set(message.interview_session_id, values);
  }

  return {
    slug: topic.slug,
    responses: sessions.map((session) => ({
      messages: messagesBySession.get(session.id) ?? [],
    })),
  };
}
