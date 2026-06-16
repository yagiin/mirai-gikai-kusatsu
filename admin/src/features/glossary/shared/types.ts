import type { Database } from "@mirai-gikai/supabase";

export type GlossaryTerm =
  Database["public"]["Tables"]["glossary_terms"]["Row"];

export type GlossaryTermWithBills = GlossaryTerm & {
  billIds: string[];
};

export type GlossaryBillOption = {
  id: string;
  name: string;
};

export type SaveGlossaryTermInput = {
  id?: string;
  term: string;
  reading: string;
  slug: string;
  shortDescription: string;
  description: string;
  comparisonNotes: string;
  aliases: string;
  relatedTermSlugs: string;
  sourceUrl: string;
  isPublished: boolean;
  displayOrder: number;
  billIds: string[];
};
