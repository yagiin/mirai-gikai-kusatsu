import { createAdminClient } from "../shared/helper";
import { buildR8SepBillRow, R8_SEP_BILLS } from "./r8-sep-bill-data";

const SESSION_SLUG = "r8-9-teireikai";

async function finalizeR8SepBills() {
  const supabase = createAdminClient();
  const { data: session, error: sessionError } = await supabase
    .from("diet_sessions")
    .select("id, is_active")
    .eq("slug", SESSION_SLUG)
    .single();
  if (sessionError) throw sessionError;
  if (!session.is_active) {
    throw new Error("9月定例会が公開中ではないため更新を中止しました");
  }

  const rows = R8_SEP_BILLS.map(buildR8SepBillRow);
  const { data: bills, error: billsError } = await supabase
    .from("bills")
    .select("id, slug, diet_session_id, publish_status")
    .in(
      "slug",
      rows.map((row) => row.slug)
    );
  if (billsError) throw billsError;
  if (bills.length !== rows.length) {
    throw new Error(`対象議案が${bills.length}件のため更新を中止しました`);
  }
  if (
    bills.some(
      (bill) =>
        bill.diet_session_id !== session.id ||
        bill.publish_status !== "published"
    )
  ) {
    throw new Error("対象外または未公開の議案があるため更新を中止しました");
  }

  const billBySlug = new Map(bills.map((bill) => [bill.slug, bill]));
  for (const row of rows) {
    const bill = billBySlug.get(row.slug);
    if (!bill) throw new Error(`議案が見つかりません: ${row.slug}`);
    const { error } = await supabase
      .from("bills")
      .update({ status: row.status, status_note: row.statusNote })
      .eq("id", bill.id);
    if (error) throw error;

    const difficultyContents = [
      { difficulty_level: "normal", content: row.normalContent },
      { difficulty_level: "hard", content: row.hardContent },
    ] as const;
    for (const content of difficultyContents) {
      const { error: contentError } = await supabase
        .from("bill_contents")
        .update({ content: content.content })
        .eq("bill_id", bill.id)
        .eq("difficulty_level", content.difficulty_level);
      if (contentError) throw contentError;
    }
  }

  console.log(`Finalized ${rows.length} published September bills.`);
}

finalizeR8SepBills().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
