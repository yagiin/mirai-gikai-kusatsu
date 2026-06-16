import type { Database } from "@mirai-gikai/supabase";

export type GeneralQuestion =
  Database["public"]["Tables"]["general_questions"]["Row"];

export type GeneralQuestionWithSession = GeneralQuestion & {
  diet_sessions: {
    id: string;
    name: string;
    slug: string | null;
  } | null;
};
