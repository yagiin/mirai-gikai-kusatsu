import type { Database } from "@mirai-gikai/supabase";

export type GlossaryTerm =
  Database["public"]["Tables"]["glossary_terms"]["Row"];

export type GlossaryBill = {
  id: string;
  name: string;
};

export type GlossaryGeneralQuestion = {
  id: string;
  title: string;
  questioner_name: string;
  question_date: string | null;
};

export type GlossaryTermDetail = GlossaryTerm & {
  relatedTerms: GlossaryTerm[];
  relatedBills: GlossaryBill[];
  relatedGeneralQuestions: GlossaryGeneralQuestion[];
};

export type GlossaryLinkTerm = Pick<
  GlossaryTerm,
  "term" | "aliases" | "slug" | "short_description"
>;
