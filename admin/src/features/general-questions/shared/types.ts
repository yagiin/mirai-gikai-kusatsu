import type { Database } from "@mirai-gikai/supabase";

export type GeneralQuestion =
  Database["public"]["Tables"]["general_questions"]["Row"];

export type GeneralQuestionWithSession = GeneralQuestion & {
  diet_sessions: {
    id: string;
    name: string;
  } | null;
};

export type DietSessionOption = {
  id: string;
  name: string;
};

export type SaveGeneralQuestionInput = {
  id?: string;
  dietSessionId: string;
  questionerName: string;
  questionerGroup: string;
  questionDate: string;
  title: string;
  summary: string;
  answerSummary: string;
  questionerComment: string;
  transcript: string;
  sourceUrl: string;
  videoUrl: string;
  isPublished: boolean;
  displayOrder: number;
};
