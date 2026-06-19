import type { Database } from "@mirai-gikai/supabase";
import { parse } from "csv-parse/sync";

type BillStatus = Database["public"]["Enums"]["bill_status_enum"];
type PublishStatus = Database["public"]["Enums"]["bill_publish_status"];
type OriginatingHouse = Database["public"]["Enums"]["house_enum"];

const BILL_COMMITTEE_NAMES = new Set<string>([
  "総務常任委員会",
  "文教厚生常任委員会",
  "産業建設常任委員会",
  "予算委員会",
  "決算委員会",
  "委員会審査なし",
]);

export const BILL_CSV_COLUMNS = [
  "id",
  "name",
  "status",
  "status_note",
  "committee_name",
  "submitted_date",
  "publish_status",
  "is_featured",
  "is_review_completed",
  "originating_type",
  "session_slug",
  "slug",
  "source_url",
  "normal_title",
  "normal_summary",
  "normal_content",
  "hard_title",
  "hard_summary",
  "hard_content",
] as const;

export interface BillCsvRow {
  id: string | null;
  name: string;
  status: BillStatus;
  statusNote: string | null;
  committeeName: string | null;
  submittedDate: string | null;
  publishStatus: PublishStatus;
  isFeatured: boolean;
  isReviewCompleted: boolean;
  originatingHouse: OriginatingHouse;
  sessionSlug: string;
  slug: string | null;
  sourceUrl: string | null;
  normalTitle: string;
  normalSummary: string;
  normalContent: string;
  hardTitle: string;
  hardSummary: string;
  hardContent: string;
}

const BILL_STATUSES = new Set<BillStatus>([
  "preparing",
  "introduced",
  "in_originating_house",
  "in_receiving_house",
  "enacted",
  "rejected",
]);

const PUBLISH_STATUSES = new Set<PublishStatus>([
  "draft",
  "published",
  "coming_soon",
]);

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

function parseStatus(value: string | undefined, row: number) {
  const status = required(value, "status", row) as BillStatus;
  if (!BILL_STATUSES.has(status)) {
    throw new Error(`${row}行目: statusの値が不正です: ${status}`);
  }
  return status;
}

function parsePublishStatus(value: string | undefined, row: number) {
  const status = required(value, "publish_status", row) as PublishStatus;
  if (!PUBLISH_STATUSES.has(status)) {
    throw new Error(`${row}行目: publish_statusの値が不正です: ${status}`);
  }
  return status;
}

function parseOriginatingHouse(value: string | undefined, row: number) {
  const type = required(value, "originating_type", row);
  if (type === "mayor") return "HR" as const;
  if (type === "member") return "HC" as const;
  throw new Error(
    `${row}行目: originating_typeはmayorまたはmemberにしてください`
  );
}

function parseCommitteeName(value: string | undefined, row: number) {
  const committeeName = nullable(value);
  if (!committeeName) return null;
  if (!BILL_COMMITTEE_NAMES.has(committeeName)) {
    throw new Error(
      `${row}行目: committee_nameは指定された委員会名または空欄にしてください`
    );
  }
  return committeeName;
}

function normalizeDate(value: string | null, row: number) {
  if (!value) return null;

  const match = value.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (!match) {
    throw new Error(
      `${row}行目: submitted_dateはYYYY-MM-DDまたはYYYY/MM/DD形式にしてください`
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
    throw new Error(`${row}行目: submitted_dateに存在しない日付があります`);
  }

  return `${String(year).padStart(4, "0")}-${String(month).padStart(
    2,
    "0"
  )}-${String(day).padStart(2, "0")}`;
}

export function parseBillCsv(csv: string): BillCsvRow[] {
  const records = parse(csv, {
    bom: true,
    columns: true,
    skip_empty_lines: true,
    trim: false,
  }) as Record<string, string>[];

  if (records.length === 0) {
    throw new Error("CSVに議案がありません");
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

    const normalTitle = required(record.normal_title, "normal_title", row);
    const normalSummary = record.normal_summary?.trim() ?? "";
    const normalContent = record.normal_content?.trim() ?? "";

    return {
      id,
      name: required(record.name, "name", row),
      status: parseStatus(record.status, row),
      statusNote: nullable(record.status_note),
      committeeName: parseCommitteeName(record.committee_name, row),
      submittedDate: normalizeDate(nullable(record.submitted_date), row),
      publishStatus: parsePublishStatus(record.publish_status, row),
      isFeatured: parseBoolean(record.is_featured, "is_featured", row),
      isReviewCompleted: parseBoolean(
        record.is_review_completed,
        "is_review_completed",
        row
      ),
      originatingHouse: parseOriginatingHouse(record.originating_type, row),
      sessionSlug: required(record.session_slug, "session_slug", row),
      slug: nullable(record.slug),
      sourceUrl: nullable(record.source_url),
      normalTitle,
      normalSummary,
      normalContent,
      hardTitle: nullable(record.hard_title) ?? normalTitle,
      hardSummary: nullable(record.hard_summary) ?? normalSummary,
      hardContent: nullable(record.hard_content) ?? normalContent,
    };
  });
}

function escapeCsvValue(value: string | boolean | null) {
  if (value === null) return "";
  const text = String(value);
  if (!/[",\r\n]/.test(text)) return text;
  return `"${text.replaceAll('"', '""')}"`;
}

export function serializeBillCsv(rows: BillCsvRow[]) {
  const lines = rows.map((row) =>
    [
      row.id,
      row.name,
      row.status,
      row.statusNote,
      row.committeeName,
      row.submittedDate,
      row.publishStatus,
      row.isFeatured,
      row.isReviewCompleted,
      row.originatingHouse === "HR" ? "mayor" : "member",
      row.sessionSlug,
      row.slug,
      row.sourceUrl,
      row.normalTitle,
      row.normalSummary,
      row.normalContent,
      row.hardTitle,
      row.hardSummary,
      row.hardContent,
    ]
      .map(escapeCsvValue)
      .join(",")
  );

  return `\uFEFF${BILL_CSV_COLUMNS.join(",")}\n${lines.join("\n")}\n`;
}
