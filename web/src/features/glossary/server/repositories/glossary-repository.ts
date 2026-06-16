import "server-only";

import { createAdminClient } from "@mirai-gikai/supabase";

export async function findPublishedGlossaryTerms() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("glossary_terms")
    .select("*")
    .eq("is_published", true)
    .order("display_order")
    .order("reading");

  if (error) {
    throw new Error(`用語解説の取得に失敗しました: ${error.message}`);
  }

  return data;
}

export async function findPublishedGlossaryTermBySlug(slug: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("glossary_terms")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    throw new Error(`用語解説の取得に失敗しました: ${error.message}`);
  }

  return data;
}

export async function findPublishedGlossaryTermsBySlugs(slugs: string[]) {
  if (slugs.length === 0) return [];

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("glossary_terms")
    .select("*")
    .in("slug", slugs)
    .eq("is_published", true)
    .order("display_order")
    .order("reading");

  if (error) {
    throw new Error(`関連用語の取得に失敗しました: ${error.message}`);
  }

  return data;
}

export async function findPublishedGlossaryTermsByBillId(billId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bills_glossary_terms")
    .select("glossary_terms!inner(*)")
    .eq("bill_id", billId)
    .eq("glossary_terms.is_published", true);

  if (error) {
    throw new Error(`議案の関連用語の取得に失敗しました: ${error.message}`);
  }

  return data
    .map((relation) => relation.glossary_terms)
    .sort(
      (a, b) =>
        a.display_order - b.display_order ||
        a.reading.localeCompare(b.reading, "ja")
    );
}

export async function findPublishedBillsByGlossaryTermId(termId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bills_glossary_terms")
    .select("bills!inner(id, name, publish_status)")
    .eq("glossary_term_id", termId)
    .eq("bills.publish_status", "published");

  if (error) {
    throw new Error(`関連議案の取得に失敗しました: ${error.message}`);
  }

  return data.map((relation) => ({
    id: relation.bills.id,
    name: relation.bills.name,
  }));
}
