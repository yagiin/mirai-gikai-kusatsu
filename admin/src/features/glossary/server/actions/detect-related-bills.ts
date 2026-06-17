"use server";

import { requireAdmin } from "@/features/auth/server/lib/auth-server";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import {
  findBillIdsContainingGlossaryLabels,
  findGeneralQuestionIdsContainingGlossaryLabels,
} from "../repositories/glossary-repository";

function splitAliases(value: string) {
  return value
    .split(/[,、\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function detectRelatedBills(term: string, aliases: string) {
  try {
    await requireAdmin();

    const labels = [term.trim(), ...splitAliases(aliases)].filter(Boolean);
    if (labels.length === 0) {
      return { error: "先に用語を入力してください" };
    }

    const [billIds, generalQuestionIds] = await Promise.all([
      findBillIdsContainingGlossaryLabels(labels),
      findGeneralQuestionIdsContainingGlossaryLabels(labels),
    ]);
    return { billIds, generalQuestionIds };
  } catch (error) {
    console.error("Detect related bills error:", error);
    return {
      error: getErrorMessage(
        error,
        "関連議案の自動検索中にエラーが発生しました"
      ),
    };
  }
}
