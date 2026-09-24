import { createAdminClient } from "../shared/helper";
import { R8_SEP_BILLS } from "./r8-sep-bill-data";

async function verifyR8SepBills() {
  const supabase = createAdminClient();
  const { data: session, error: sessionError } = await supabase
    .from("diet_sessions")
    .select("id, is_active")
    .eq("slug", "r8-9-teireikai")
    .single();
  if (sessionError) throw sessionError;
  if (!session.is_active) throw new Error("9月定例会が公開中ではありません");

  const slugs = R8_SEP_BILLS.map((bill) => `r8-9-gidai-${bill.number}`);
  const { data: bills, error: billsError } = await supabase
    .from("bills")
    .select("id, slug, status, publish_status, diet_session_id")
    .in("slug", slugs);
  if (billsError) throw billsError;
  if (bills.length !== R8_SEP_BILLS.length) {
    throw new Error(`議案が${bills.length}件しかありません`);
  }
  for (const bill of bills) {
    if (
      bill.status !== "introduced" ||
      bill.publish_status !== "published" ||
      bill.diet_session_id !== session.id
    ) {
      throw new Error(`議案の公開状態が不正です: ${bill.slug}`);
    }
  }

  const { data: contents, error: contentsError } = await supabase
    .from("bill_contents")
    .select("bill_id, difficulty_level")
    .in(
      "bill_id",
      bills.map((bill) => bill.id)
    );
  if (contentsError) throw contentsError;
  if (contents.length !== R8_SEP_BILLS.length * 2) {
    throw new Error(`議案本文が${contents.length}件しかありません`);
  }
  for (const bill of bills) {
    const levels = contents
      .filter((content) => content.bill_id === bill.id)
      .map((content) => content.difficulty_level)
      .sort();
    if (levels.join(",") !== "hard,normal") {
      throw new Error(`通常版・詳細版がそろっていません: ${bill.slug}`);
    }
  }
  console.log("Verified active September session, 22 published bills, and 44 contents.");
}

verifyR8SepBills().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
