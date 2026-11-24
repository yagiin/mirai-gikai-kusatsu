"use server";

import "server-only";
import { sessionDocumentsSchema } from "@mirai-gikai/shared/session-documents";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/auth/server/lib/auth-server";
import { routes } from "@/lib/routes";
import {
  invalidateWebCache,
  WEB_CACHE_TAGS,
} from "@/lib/utils/cache-invalidation";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import { updateSessionDocumentsRecord } from "../repositories/diet-session-repository";

export async function saveSessionDocuments(id: string, input: unknown) {
  try {
    await requireAdmin();
    const result = sessionDocumentsSchema.safeParse(input);
    if (!result.success) {
      return {
        error:
          result.error.issues[0]?.message ?? "資料の入力内容を確認してください",
      };
    }
    await updateSessionDocumentsRecord(id, result.data);
    revalidatePath(routes.dietSessions());
    await invalidateWebCache([WEB_CACHE_TAGS.DIET_SESSIONS]);
    return { success: true };
  } catch (error) {
    return { error: getErrorMessage(error, "関連資料の保存に失敗しました") };
  }
}
