import "server-only";

import { createAdminClient } from "@mirai-gikai/supabase";

export async function findPublishedGeneralQuestions() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("general_questions")
    .select("*, diet_sessions(id, name, slug)")
    .eq("is_published", true)
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
