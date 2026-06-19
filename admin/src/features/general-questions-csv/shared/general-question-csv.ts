import { parse } from "csv-parse/sync";

export const GENERAL_QUESTION_CSV_COLUMNS = [
  "id",
  "session_slug",
  "questioner_name",
  "questioner_group",
  "question_date",
  "title",
  "summary",
  "answer_summary",
  "questioner_comment",
  "transcript",
  "source_url",
  "video_url",
  "is_published",
  "display_order",
] as const;

export interface GeneralQuestionCsvRow {
  id: string | null;
  sessionSlug: string;
  questionerName: string;
  questionerGroup: string | null;
  questionDate: string | null;
  title: string;
  summary: string;
  answerSummary: string;
  questionerComment: string | null;
  transcript: string | null;
  sourceUrl: string | null;
  videoUrl: string | null;
  isPublished: boolean;
  displayOrder: number;
}

function required(value: string | undefined, column: string, row: number) {
  const normalized = value?.trim();
  if (!normalized) {
    throw new Error(`${row}行目: ${column}は必須です`);
  }
  return normalized;
}

function nullable(value: string | undefined) {
  const normalized = value?.trim();
  return normalized || null;
}

function parseBoolean(value: string | undefined, column: string, row: number) {
  const normalized = value?.trim().toLowerCase();
  if (normalized === "true" || normalized === "1") return true;
  if (normalized === "false" || normalized === "0") return false;
  throw new Error(
    `${row}行目: ${column}はtrue/falseまたは1/0にしてください`
  );
}

function normalizeDate(value: string | null, column: string, row: number) {
  if (!value) return null;

  const match = value.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (!match) {
    throw new Error(
      `${row}行目: ${column}はYYYY-MM-DDまたはYYYY/MM/DD形式にしてください`
    );
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error(`${row}行目: ${column}に存在しない日付があります`);
  }

  return `${String(year).padStart(4, "0")}-${String(month).padStart(
    2,
    "0"
  )}-${String(day).padStart(2, "0")}`;
}

function parseDisplayOrder(value: string | undefined, row: number) {
  const normalized = value?.trim();
  if (!normalized) return 0;

  const order = Number(normalized);
  if (!Number.isInteger(order)) {
    throw new Error(`${row}行目: display_orderは整数にしてください`);
  }
  return order;
}

export function parseGeneralQuestionCsv(
  csv: string
): GeneralQuestionCsvRow[] {
  const records = parse(csv, {
    bom: true,
    columns: true,
    skip_empty_lines: true,
    trim: false,
  }) as Record<string, string>[];

  if (records.length === 0) {
    throw new Error("CSVに一般質問がありません");
  }

  const ids = new Set<string>();
  return records.map((record, index) => {
    const row = index + 2;
    const id = nullable(record.id);
    if (id) {
      if (ids.has(id)) {
        throw new Error(`${row}行目: idが重複しています: ${id}`);
      }
      ids.add(id);
    }

    return {
      id,
      sessionSlug: required(record.session_slug, "session_slug", row),
      questionerName: required(
        record.questioner_name,
        "questioner_name",
        row
      ),
      questionerGroup: nullable(record.questioner_group),
      questionDate: normalizeDate(
        nullable(record.question_date),
        "question_date",
        row
      ),
      title: required(record.title, "title", row),
      summary: required(record.summary, "summary", row),
      answerSummary: required(record.answer_summary, "answer_summary", row),
      questionerComment: nullable(record.questioner_comment),
      transcript: nullable(record.transcript),
      sourceUrl: nullable(record.source_url),
      videoUrl: nullable(record.video_url),
      isPublished: parseBoolean(record.is_published, "is_published", row),
      displayOrder: parseDisplayOrder(record.display_order, row),
    };
  });
}

function escapeCsvValue(value: string | number | boolean | null) {
  if (value === null) return "";
  const text = String(value);
  if (!/[",\r\n]/.test(text)) return text;
  return `"${text.replaceAll('"', '""')}"`;
}

export function serializeGeneralQuestionCsv(rows: GeneralQuestionCsvRow[]) {
  const lines = rows.map((row) =>
    [
      row.id,
      row.sessionSlug,
      row.questionerName,
      row.questionerGroup,
      row.questionDate,
      row.title,
      row.summary,
      row.answerSummary,
      row.questionerComment,
      row.transcript,
      row.sourceUrl,
      row.videoUrl,
      row.isPublished,
      row.displayOrder,
    ]
      .map(escapeCsvValue)
      .join(",")
  );

  return `\uFEFF${GENERAL_QUESTION_CSV_COLUMNS.join(",")}\n${lines.join("\n")}\n`;
}
