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

export async function findPublishedGlossaryTermsByGeneralQuestionId(
  generalQuestionId: string
) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("general_questions_glossary_terms")
    .select("glossary_terms!inner(*)")
    .eq("general_question_id", generalQuestionId)
    .eq("glossary_terms.is_published", true);

  if (error) {
    throw new Error(`一般質問の関連用語の取得に失敗しました: ${error.message}`);
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

export async function findPublishedGeneralQuestionsByGlossaryTermId(
  termId: string
) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("general_questions_glossary_terms")
    .select(
      "general_questions!inner(id, title, questioner_name, question_date, is_published)"
    )
    .eq("glossary_term_id", termId)
    .eq("general_questions.is_published", true);

  if (error) {
    throw new Error(`関連一般質問の取得に失敗しました: ${error.message}`);
  }

  return data
    .map((relation) => ({
      id: relation.general_questions.id,
      title: relation.general_questions.title,
      questioner_name: relation.general_questions.questioner_name,
      question_date: relation.general_questions.question_date,
    }))
    .sort((a, b) => {
      const dateA = a.question_date ?? "";
      const dateB = b.question_date ?? "";
      return dateB.localeCompare(dateA) || a.title.localeCompare(b.title, "ja");
    });
}
