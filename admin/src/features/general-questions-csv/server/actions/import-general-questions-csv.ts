"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/auth/server/lib/auth-server";
import { routes } from "@/lib/routes";
import {
  invalidateWebCache,
  WEB_CACHE_TAGS,
} from "@/lib/utils/cache-invalidation";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import { parseGeneralQuestionCsv } from "../../shared/general-question-csv";
import {
  findGeneralQuestionCsvImportReferences,
  importGeneralQuestions,
} from "../general-question-csv-repository";

export type ImportGeneralQuestionsCsvResult =
  | { success: true; created: number; updated: number }
  | { success: false; error: string };

const MAX_CSV_SIZE = 10 * 1024 * 1024;

export async function importGeneralQuestionsCsv(
  formData: FormData
): Promise<ImportGeneralQuestionsCsvResult> {
  try {
    await requireAdmin();

    const file = formData.get("file");
    if (!(file instanceof File)) {
      return { success: false, error: "CSVファイルを選択してください" };
    }
    if (file.size > MAX_CSV_SIZE) {
      return { success: false, error: "CSVファイルは10MB以内にしてください" };
    }

    const rows = parseGeneralQuestionCsv(await file.text());
    const requestedIds = rows
      .map((row) => row.id)
      .filter((id): id is string => id !== null);
    const { sessions, existingIds } =
      await findGeneralQuestionCsvImportReferences(requestedIds);

    const missingIds = requestedIds.filter((id) => !existingIds.includes(id));
    if (missingIds.length > 0) {
      throw new Error(`DBに存在しないidがあります: ${missingIds.join(", ")}`);
    }

    const sessionBySlug = new Map(
      sessions
        .filter((session) => session.slug)
        .map((session) => [session.slug as string, session.id])
    );
    const unknownSessions = [
      ...new Set(
        rows
          .map((row) => row.sessionSlug)
          .filter((slug) => !sessionBySlug.has(slug))
      ),
    ];
    if (unknownSessions.length > 0) {
      throw new Error(
        `登録されていないsession_slugがあります: ${unknownSessions.join(", ")}`
      );
    }

    const now = new Date().toISOString();
    const ids = rows.map((row) => row.id ?? randomUUID());
    const importRows = rows.map((row, index) => ({
      id: ids[index],
      diet_session_id: sessionBySlug.get(row.sessionSlug) as string,
      questioner_name: row.questionerName,
      questioner_group: row.questionerGroup,
      question_date: row.questionDate,
      title: row.title,
      summary: row.summary,
      answer_summary: row.answerSummary,
      questioner_comment: row.questionerComment,
      transcript: row.transcript,
      source_url: row.sourceUrl,
      video_url: row.videoUrl,
      is_published: row.isPublished,
      display_order: row.displayOrder,
      updated_at: now,
    }));

    await importGeneralQuestions(importRows);
    revalidatePath(routes.generalQuestions());
    await invalidateWebCache([
      WEB_CACHE_TAGS.GENERAL_QUESTIONS,
      WEB_CACHE_TAGS.DIET_SESSIONS,
    ]);

    return {
      success: true,
      created: rows.length - existingIds.length,
      updated: existingIds.length,
    };
  } catch (error) {
    console.error("General questions CSV import error:", error);
    return {
      success: false,
      error: getErrorMessage(error, "CSVの取り込みに失敗しました"),
    };
  }
}
