import { requireAdmin } from "@/features/auth/server/lib/auth-server";
import { findTopicResponsesForKouchouAi } from "@/features/interview-topics/server/repositories/kouchou-ai-export-repository";
import { buildKouchouAiCsv } from "@/features/interview-topics/shared/build-kouchou-ai-csv";

interface KouchouAiCsvRouteProps {
  params: Promise<{ topicId: string }>;
}

export async function GET(
  _request: Request,
  { params }: KouchouAiCsvRouteProps
) {
  await requireAdmin();
  const { topicId } = await params;
  const result = await findTopicResponsesForKouchouAi(topicId);
  if (!result) return new Response("Not found", { status: 404 });

  const csv = `\uFEFF${buildKouchouAiCsv(result.responses)}`;
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${result.slug}-kouchou-ai.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
