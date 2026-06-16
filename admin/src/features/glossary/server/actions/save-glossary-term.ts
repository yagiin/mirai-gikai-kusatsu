"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/auth/server/lib/auth-server";
import { routes } from "@/lib/routes";
import {
  invalidateWebCache,
  WEB_CACHE_TAGS,
} from "@/lib/utils/cache-invalidation";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import type { SaveGlossaryTermInput } from "../../shared/types";
import { saveGlossaryTermRecord } from "../repositories/glossary-repository";

export async function saveGlossaryTerm(input: SaveGlossaryTermInput) {
  try {
    await requireAdmin();

    if (
      !input.term.trim() ||
      !input.reading.trim() ||
      !input.shortDescription.trim() ||
      !input.description.trim()
    ) {
      return { error: "用語、読み方、短い説明、詳しい説明は必須です" };
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug.trim())) {
      return {
        error: "URL用の名前は半角英小文字・数字・ハイフンで入力してください",
      };
    }

    await saveGlossaryTermRecord(input);
    revalidatePath(routes.glossary());
    await invalidateWebCache([WEB_CACHE_TAGS.GLOSSARY, WEB_CACHE_TAGS.BILLS]);
    return { success: true };
  } catch (error) {
    console.error("Save glossary term error:", error);
    return {
      error: getErrorMessage(error, "用語解説の保存中にエラーが発生しました"),
    };
  }
}
