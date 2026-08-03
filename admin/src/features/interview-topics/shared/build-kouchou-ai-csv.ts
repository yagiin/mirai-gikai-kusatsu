export interface KouchouAiInterviewResponse {
  messages: string[];
}

/**
 * 広聴AIの最小入力形式（comment列）に合わせて、1セッションを1コメントにする。
 */
export function buildKouchouAiCsv(
  responses: KouchouAiInterviewResponse[]
): string {
  const rows = responses
    .map((response) =>
      response.messages.map((message) => message.trim()).filter(Boolean)
    )
    .filter((messages) => messages.length > 0)
    .map((messages) => escapeCsvCell(messages.join("\n")));

  return ["comment", ...rows].join("\r\n");
}

function escapeCsvCell(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}
