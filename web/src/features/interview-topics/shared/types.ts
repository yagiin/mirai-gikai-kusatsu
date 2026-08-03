import type { Database } from "@mirai-gikai/supabase";

export type InterviewTopic =
  Database["public"]["Tables"]["interview_topics"]["Row"];
