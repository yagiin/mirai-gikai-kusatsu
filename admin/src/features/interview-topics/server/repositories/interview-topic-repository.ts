import "server-only";

import type { InterviewMode } from "@mirai-gikai/shared/interview-prompts/types";
import { createAdminClient } from "@mirai-gikai/supabase";
import type { InterviewQuestion } from "@/features/interview-config/shared/types";
import type { InterviewTopic } from "../../shared/types";

export type InterviewTopicWithConfig = InterviewTopic & {
  interview_configs: Array<{
    id: string;
    name: string;
    status: "public" | "closed";
    mode: InterviewMode;
    themes: string[] | null;
    chat_model: string | null;
    estimated_duration: number | null;
    created_at: string;
  }>;
};

export async function findAllInterviewTopics(): Promise<
  InterviewTopicWithConfig[]
> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("interview_topics")
    .select("*, interview_configs(*)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch interview topics: ${error.message}`);
  }

  return data as InterviewTopicWithConfig[];
}

export async function findInterviewTopicById(
  topicId: string
): Promise<InterviewTopicWithConfig | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("interview_topics")
    .select("*, interview_configs(*)")
    .eq("id", topicId)
    .single();

  if (error?.code === "PGRST116") return null;
  if (error) {
    throw new Error(`Failed to fetch interview topic: ${error.message}`);
  }

  return data as InterviewTopicWithConfig;
}

export async function findQuestionsByConfigId(
  configId: string
): Promise<InterviewQuestion[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("interview_questions")
    .select("*")
    .eq("interview_config_id", configId)
    .order("question_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch interview questions: ${error.message}`);
  }
  return data;
}

export async function insertInterviewTopic(params: {
  title: string;
  slug: string;
  description: string;
  background: string | null;
  purpose: string | null;
}): Promise<InterviewTopic> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("interview_topics")
    .insert(params)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create interview topic: ${error.message}`);
  }
  return data;
}

export async function insertTopicInterviewConfig(params: {
  interview_topic_id: string;
  name: string;
  status: "public" | "closed";
  mode: InterviewMode;
  themes: string[] | null;
  chat_model: string | null;
  estimated_duration: number | null;
}): Promise<{ id: string }> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("interview_configs")
    .insert(params)
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to create interview config: ${error.message}`);
  }
  return data;
}

export async function insertTopicQuestions(
  configId: string,
  questions: Array<{
    question: string;
    follow_up_guide?: string;
    quick_replies?: string[];
    target_audience?: string;
  }>
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("interview_questions").insert(
    questions.map((question, index) => ({
      interview_config_id: configId,
      question: question.question,
      follow_up_guide: question.follow_up_guide || null,
      quick_replies: question.quick_replies?.length
        ? question.quick_replies
        : null,
      target_audience: question.target_audience || null,
      question_order: index + 1,
    }))
  );

  if (error) {
    throw new Error(`Failed to create interview questions: ${error.message}`);
  }
}

export async function updateInterviewTopicRecord(
  topicId: string,
  params: {
    title: string;
    slug: string;
    description: string;
    background: string | null;
    purpose: string | null;
  }
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("interview_topics")
    .update(params)
    .eq("id", topicId);
  if (error) {
    throw new Error(`Failed to update interview topic: ${error.message}`);
  }
}

export async function updateTopicConfigRecord(
  configId: string,
  params: {
    name: string;
    status: "public" | "closed";
    mode: InterviewMode;
    themes: string[] | null;
    chat_model: string | null;
    estimated_duration: number | null;
  }
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("interview_configs")
    .update(params)
    .eq("id", configId);
  if (error) {
    throw new Error(`Failed to update interview config: ${error.message}`);
  }
}

export async function replaceTopicQuestions(
  configId: string,
  questions: Parameters<typeof insertTopicQuestions>[1]
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("interview_questions")
    .delete()
    .eq("interview_config_id", configId);
  if (error) {
    throw new Error(`Failed to delete interview questions: ${error.message}`);
  }
  await insertTopicQuestions(configId, questions);
}

export async function deleteInterviewTopicRecord(
  topicId: string
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("interview_topics")
    .delete()
    .eq("id", topicId);
  if (error) {
    throw new Error(`Failed to delete interview topic: ${error.message}`);
  }
}
