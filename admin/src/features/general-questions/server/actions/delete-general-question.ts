"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/auth/server/lib/auth-server";
import { routes } from "@/lib/routes";
import {
  invalidateWebCache,
  WEB_CACHE_TAGS,
} from "@/lib/utils/cache-invalidation";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import { deleteGeneralQuestionRecord } from "../repositories/general-question-repository";

export async function deleteGeneralQuestion(id: string) {
  try {
    await requireAdmin();
    await deleteGeneralQuestionRecord(id);
    revalidatePath(routes.generalQuestions());
    await invalidateWebCache([WEB_CACHE_TAGS.GENERAL_QUESTIONS]);
    return { success: true };
  } catch (error) {
    console.error("Delete general question error:", error);
    return {
      error: getErrorMessage(error, "一般質問の削除中にエラーが発生しました"),
    };
  }
}
