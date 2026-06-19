import { requireAdmin } from "@/features/auth/server/lib/auth-server";
import { findGeneralQuestionsForCsv } from "@/features/general-questions-csv/server/general-question-csv-repository";
import {
  type GeneralQuestionCsvRow,
  serializeGeneralQuestionCsv,
} from "@/features/general-questions-csv/shared/general-question-csv";

export async function GET() {
  await requireAdmin();

  const questions = await findGeneralQuestionsForCsv();
  const rows: GeneralQuestionCsvRow[] = questions.map((question) => ({
    id: question.id,
    sessionSlug: question.diet_sessions?.slug ?? "",
    questionerName: question.questioner_name,
    questionerGroup: question.questioner_group,
    questionDate: question.question_date?.slice(0, 10) ?? null,
    title: question.title,
    summary: question.summary,
    answerSummary: question.answer_summary,
    questionerComment: question.questioner_comment,
    transcript: question.transcript,
    sourceUrl: question.source_url,
    videoUrl: question.video_url,
    isPublished: question.is_published,
    displayOrder: question.display_order,
  }));

  return new Response(serializeGeneralQuestionCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition":
        'attachment; filename="kusatsu-city-council-general-questions.csv"',
      "Cache-Control": "no-store",
    },
  });
}
