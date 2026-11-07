import "server-only";

import { createAdminClient } from "@mirai-gikai/supabase";

export async function findPublishedGeneralQuestions(dietSessionId?: string) {
  const supabase = createAdminClient();
  let query = supabase
    .from("general_questions")
    .select("*, diet_sessions(id, name, slug)")
    .eq("is_published", true);

  if (dietSessionId) {
    query = query.eq("diet_session_id", dietSessionId);
  }

  const { data, error } = await query
    .order("question_date", { ascending: false, nullsFirst: false })
    .order("display_order");

  if (error) {
    throw new Error(`一般質問の取得に失敗しました: ${error.message}`);
  }

  return data;
}

export async function findPublishedGeneralQuestionById(id: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("general_questions")
    .select("*, diet_sessions(id, name, slug)")
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    throw new Error(`一般質問の取得に失敗しました: ${error.message}`);
  }

  return data;
}
