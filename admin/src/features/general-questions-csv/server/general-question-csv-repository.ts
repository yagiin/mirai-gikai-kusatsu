import "server-only";

import { createAdminClient } from "@mirai-gikai/supabase";

export async function findGeneralQuestionsForCsv() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("general_questions")
    .select("*, diet_sessions(slug)")
    .order("question_date", { ascending: true, nullsFirst: false })
    .order("display_order");

  if (error) throw error;
  return data ?? [];
}

export async function findGeneralQuestionCsvImportReferences(ids: string[]) {
  const supabase = createAdminClient();
  const [
    { data: sessions, error: sessionsError },
    { data: existingQuestions, error: questionsError },
  ] = await Promise.all([
    supabase.from("diet_sessions").select("id, slug"),
    ids.length > 0
      ? supabase.from("general_questions").select("id").in("id", ids)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (sessionsError) throw sessionsError;
  if (questionsError) throw questionsError;

  return {
    sessions: sessions ?? [],
    existingIds: (existingQuestions ?? []).map((question) => question.id),
  };
}

export async function importGeneralQuestions(
  rows: Array<{
    id: string;
    diet_session_id: string;
    questioner_name: string;
    questioner_group: string | null;
    question_date: string | null;
    title: string;
    summary: string;
    answer_summary: string;
    questioner_comment: string | null;
    transcript: string | null;
    source_url: string | null;
    video_url: string | null;
    is_published: boolean;
    display_order: number;
    updated_at: string;
  }>
) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("general_questions")
    .upsert(rows, { onConflict: "id" });

  if (error) throw error;
}
