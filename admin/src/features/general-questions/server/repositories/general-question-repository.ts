import "server-only";

import { createAdminClient } from "@mirai-gikai/supabase";
import type { SaveGeneralQuestionInput } from "../../shared/types";

export async function findGeneralQuestionManagementData() {
  const supabase = createAdminClient();
  const [questionsResult, sessionsResult] = await Promise.all([
    supabase
      .from("general_questions")
      .select("*, diet_sessions(id, name)")
      .order("question_date", { ascending: false, nullsFirst: false })
      .order("display_order"),
    supabase
      .from("diet_sessions")
      .select("id, name")
      .order("start_date", { ascending: false }),
  ]);

  if (questionsResult.error) {
    throw new Error(
      `一般質問の取得に失敗しました: ${questionsResult.error.message}`
    );
  }
  if (sessionsResult.error) {
    throw new Error(
      `会期の取得に失敗しました: ${sessionsResult.error.message}`
    );
  }

  return {
    questions: questionsResult.data,
    sessions: sessionsResult.data,
  };
}

export async function saveGeneralQuestionRecord(
  input: SaveGeneralQuestionInput
) {
  const supabase = createAdminClient();
  const record = {
    diet_session_id: input.dietSessionId,
    questioner_name: input.questionerName.trim(),
    questioner_group: input.questionerGroup.trim() || null,
    question_date: input.questionDate || null,
    title: input.title.trim(),
    summary: input.summary.trim(),
    answer_summary: input.answerSummary.trim(),
    questioner_comment: input.questionerComment.trim() || null,
    transcript: input.transcript.trim() || null,
    source_url: input.sourceUrl.trim() || null,
    video_url: input.videoUrl.trim() || null,
    is_published: input.isPublished,
    display_order: input.displayOrder,
  };

  const result = input.id
    ? await supabase
        .from("general_questions")
        .update(record)
        .eq("id", input.id)
        .select("id")
        .single()
    : await supabase
        .from("general_questions")
        .insert(record)
        .select("id")
        .single();

  if (result.error) {
    throw new Error(`一般質問の保存に失敗しました: ${result.error.message}`);
  }

  return result.data.id;
}

export async function deleteGeneralQuestionRecord(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("general_questions")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`一般質問の削除に失敗しました: ${error.message}`);
  }
}
