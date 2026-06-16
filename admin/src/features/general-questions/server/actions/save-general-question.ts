"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/auth/server/lib/auth-server";
import { routes } from "@/lib/routes";
import {
  invalidateWebCache,
  WEB_CACHE_TAGS,
} from "@/lib/utils/cache-invalidation";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import type { SaveGeneralQuestionInput } from "../../shared/types";
import { saveGeneralQuestionRecord } from "../repositories/general-question-repository";

export async function saveGeneralQuestion(input: SaveGeneralQuestionInput) {
  try {
    await requireAdmin();

    if (
      !input.dietSessionId ||
      !input.questionerName.trim() ||
      !input.title.trim() ||
      !input.summary.trim() ||
      !input.answerSummary.trim()
    ) {
      return {
        error: "会期、質問者、質問項目、要約、市の答弁要約は必須です",
      };
    }

    await saveGeneralQuestionRecord(input);
    revalidatePath(routes.generalQuestions());
    await invalidateWebCache([
      WEB_CACHE_TAGS.GENERAL_QUESTIONS,
      WEB_CACHE_TAGS.DIET_SESSIONS,
    ]);
    return { success: true };
  } catch (error) {
    console.error("Save general question error:", error);
    return {
      error: getErrorMessage(error, "一般質問の保存中にエラーが発生しました"),
    };
  }
}
