import "server-only";

import { createAdminClient } from "@mirai-gikai/supabase";

const publicTopicSelect =
  "*, interview_configs!inner(id, name, status, mode, themes, chat_model, estimated_duration, updated_at)";

export async function findPublicInterviewTopics() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("interview_topics")
    .select(publicTopicSelect)
    .eq("interview_configs.status", "public")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch interview topics: ${error.message}`);
  }
  return data;
}

export async function findPublicInterviewTopicBySlug(slug: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("interview_topics")
    .select(publicTopicSelect)
    .eq("slug", slug)
    .eq("interview_configs.status", "public")
    .single();

  if (error?.code === "PGRST116") return null;
  if (error) {
    throw new Error(`Failed to fetch interview topic: ${error.message}`);
  }
  return data;
}

export async function findPublicInterviewTopicById(topicId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("interview_topics")
    .select(publicTopicSelect)
    .eq("id", topicId)
    .eq("interview_configs.status", "public")
    .single();

  if (error?.code === "PGRST116") return null;
  if (error) {
    throw new Error(`Failed to fetch interview topic: ${error.message}`);
  }
  return data;
}

export async function findInterviewTopicById(topicId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("interview_topics")
    .select("*")
    .eq("id", topicId)
    .single();

  if (error?.code === "PGRST116") return null;
  if (error) {
    throw new Error(`Failed to fetch interview topic: ${error.message}`);
  }
  return data;
}
