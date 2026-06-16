"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/auth/server/lib/auth-server";
import { routes } from "@/lib/routes";
import {
  invalidateWebCache,
  WEB_CACHE_TAGS,
} from "@/lib/utils/cache-invalidation";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import { deleteGlossaryTermRecord } from "../repositories/glossary-repository";

export async function deleteGlossaryTerm(id: string) {
  try {
    await requireAdmin();
    await deleteGlossaryTermRecord(id);
    revalidatePath(routes.glossary());
    await invalidateWebCache([WEB_CACHE_TAGS.GLOSSARY, WEB_CACHE_TAGS.BILLS]);
    return { success: true };
  } catch (error) {
    console.error("Delete glossary term error:", error);
    return {
      error: getErrorMessage(error, "用語解説の削除中にエラーが発生しました"),
    };
  }
}
