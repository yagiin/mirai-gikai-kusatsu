import type { Database } from "@mirai-gikai/supabase";
import { createAdminClient } from "../shared/helper";
import { buildR8SepBillRow, R8_SEP_BILLS } from "./r8-sep-bill-data";

type BillInsert = Database["public"]["Tables"]["bills"]["Insert"];
type ContentInsert = Database["public"]["Tables"]["bill_contents"]["Insert"];

const SESSION_SLUG = "r8-9-teireikai";

async function createR8SepBills() {
  const apply = process.argv.includes("--apply");
  const supabase = createAdminClient();
  const slugs = R8_SEP_BILLS.map((bill) => `r8-9-gidai-${bill.number}`);
  const { data: existingBills, error: billsError } = await supabase
    .from("bills")
    .select("id, slug")
    .in("slug", slugs);
  if (billsError) throw billsError;
  if (existingBills.length > 0) {
    throw new Error(`登録済みの9月議案があります: ${existingBills.length}件`);
  }

  const { data: existingSession, error: sessionError } = await supabase
    .from("diet_sessions")
    .select("id")
    .eq("slug", SESSION_SLUG)
    .maybeSingle();
  if (sessionError) throw sessionError;

  console.log(`Validated ${R8_SEP_BILLS.length} new bills.`);
  if (!apply) {
    console.log("Dry run only. Add --apply to insert the session and bills.");
    return;
  }

  let sessionId = existingSession?.id;
  let createdSession = false;
  let insertedBillIds: string[] = [];
  try {
    if (!sessionId) {
      const { data, error } = await supabase
        .from("diet_sessions")
        .insert({
          name: "令和8年9月草津市議会定例会",
          start_date: "2026-09-01",
          end_date: "2026-09-16",
          slug: SESSION_SLUG,
          shugiin_url:
            "https://www.city.kusatsu.shiga.jp/shigikai/hongikai_iinkai/nittei.html",
          is_active: false,
        })
        .select("id")
        .single();
      if (error) throw error;
      sessionId = data.id;
      createdSession = true;
    }

    const rows = R8_SEP_BILLS.map((data) => buildR8SepBillRow(data));
    const bills: BillInsert[] = rows.map((row) => ({
      name: row.name,
      originating_house: "HR",
      status: row.status,
      status_note: row.statusNote,
      submitted_date: row.submittedDate,
      published_at: "2026-09-01T00:00:00+09:00",
      publish_status: row.publishStatus,
      is_featured: row.isFeatured,
      slug: row.slug,
      shugiin_url: row.sourceUrl,
      diet_session_id: sessionId,
    }));
    const { data: insertedBills, error: insertBillsError } = await supabase
      .from("bills")
      .insert(bills)
      .select("id, slug");
    if (insertBillsError) throw insertBillsError;
    insertedBillIds = insertedBills.map((bill) => bill.id);
    const idBySlug = new Map(insertedBills.map((bill) => [bill.slug, bill.id]));
    const contents: ContentInsert[] = rows.flatMap((row) => {
      const billId = idBySlug.get(row.slug);
      if (!billId) throw new Error(`登録結果にslugがありません: ${row.slug}`);
      return [
        {
          bill_id: billId,
          difficulty_level: "normal",
          title: row.normalTitle,
          summary: row.normalSummary,
          content: row.normalContent,
        },
        {
          bill_id: billId,
          difficulty_level: "hard",
          title: row.hardTitle,
          summary: row.hardSummary,
          content: row.hardContent,
        },
      ];
    });
    const { error: contentsError } = await supabase
      .from("bill_contents")
      .insert(contents);
    if (contentsError) throw contentsError;

    const { error: activeError } = await supabase.rpc(
      "set_active_diet_session",
      { target_session_id: sessionId }
    );
    if (activeError) throw activeError;
    console.log(`Inserted ${insertedBills.length} bills and ${contents.length} contents.`);
  } catch (error) {
    if (insertedBillIds.length > 0) {
      await supabase
        .from("bill_contents")
        .delete()
        .in("bill_id", insertedBillIds);
      await supabase.from("bills").delete().in("id", insertedBillIds);
    }
    if (createdSession && sessionId) {
      await supabase.from("diet_sessions").delete().eq("id", sessionId);
    }
    throw error;
  }
}

createR8SepBills().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
