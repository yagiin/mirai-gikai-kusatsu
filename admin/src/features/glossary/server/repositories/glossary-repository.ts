import "server-only";

import { createAdminClient } from "@mirai-gikai/supabase";
import type { SaveGlossaryTermInput } from "../../shared/types";

export async function findGlossaryManagementData() {
  const supabase = createAdminClient();
  const [termsResult, billsResult, generalQuestionsResult] = await Promise.all([
    supabase
      .from("glossary_terms")
      .select(
        "*, bills_glossary_terms(bill_id), general_questions_glossary_terms(general_question_id)"
      )
      .order("display_order")
      .order("reading"),
    supabase
      .from("bills")
      .select("id, name")
      .order("submitted_date", { ascending: false, nullsFirst: false }),
    supabase
      .from("general_questions")
      .select("id, title, questioner_name, question_date")
      .order("question_date", { ascending: false, nullsFirst: false })
      .order("display_order"),
  ]);

  if (termsResult.error) {
    throw new Error(
      `用語解説の取得に失敗しました: ${termsResult.error.message}`
    );
  }
  if (billsResult.error) {
    throw new Error(`議案の取得に失敗しました: ${billsResult.error.message}`);
  }
  if (generalQuestionsResult.error) {
    throw new Error(
      `一般質問の取得に失敗しました: ${generalQuestionsResult.error.message}`
    );
  }

  return {
    terms: termsResult.data.map(
      ({
        bills_glossary_terms,
        general_questions_glossary_terms,
        ...term
      }) => ({
        ...term,
        billIds: bills_glossary_terms.map((relation) => relation.bill_id),
        generalQuestionIds: general_questions_glossary_terms.map(
          (relation) => relation.general_question_id
        ),
      })
    ),
    bills: billsResult.data,
    generalQuestions: generalQuestionsResult.data.map((question) => ({
      id: question.id,
      title: question.title,
      questionerName: question.questioner_name,
      questionDate: question.question_date,
    })),
  };
}

function splitList(value: string) {
  return value
    .split(/[,、\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function findBillIdsContainingGlossaryLabels(labels: string[]) {
  const searchLabels = [...new Set(labels.map((label) => label.trim()))].filter(
    Boolean
  );
  if (searchLabels.length === 0) return [];

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bills")
    .select("id, name, bill_contents(title, summary, content)");

  if (error) {
    throw new Error(`議案本文の検索に失敗しました: ${error.message}`);
  }

  return data
    .filter((bill) => {
      const searchableText = [
        bill.name,
        ...bill.bill_contents.flatMap((content) => [
          content.title,
          content.summary,
          content.content,
        ]),
      ].join("\n");

      return searchLabels.some((label) => searchableText.includes(label));
    })
    .map((bill) => bill.id);
}

export async function findGeneralQuestionIdsContainingGlossaryLabels(
  labels: string[]
) {
  const searchLabels = [...new Set(labels.map((label) => label.trim()))].filter(
    Boolean
  );
  if (searchLabels.length === 0) return [];

  const supabase = createAdminClient();
  const { data, error } = await supabase.from("general_questions").select(`
    id,
    title,
    summary,
    answer_summary,
    questioner_comment,
    transcript
  `);

  if (error) {
    throw new Error(`一般質問本文の検索に失敗しました: ${error.message}`);
  }

  return data
    .filter((question) => {
      const searchableText = [
        question.title,
        question.summary,
        question.answer_summary,
        question.questioner_comment,
        question.transcript,
      ].join("\n");

      return searchLabels.some((label) => searchableText.includes(label));
    })
    .map((question) => question.id);
}

export async function saveGlossaryTermRecord(input: SaveGlossaryTermInput) {
  const supabase = createAdminClient();
  const record = {
    term: input.term.trim(),
    reading: input.reading.trim(),
    slug: input.slug.trim(),
    short_description: input.shortDescription.trim(),
    description: input.description.trim(),
    comparison_notes: input.comparisonNotes.trim() || null,
    aliases: splitList(input.aliases),
    related_term_slugs: splitList(input.relatedTermSlugs),
    source_url: input.sourceUrl.trim() || null,
    is_published: input.isPublished,
    display_order: input.displayOrder,
  };

  const termResult = input.id
    ? await supabase
        .from("glossary_terms")
        .update(record)
        .eq("id", input.id)
        .select("id")
        .single()
    : await supabase
        .from("glossary_terms")
        .insert(record)
        .select("id")
        .single();

  if (termResult.error) {
    throw new Error(
      `用語解説の保存に失敗しました: ${termResult.error.message}`
    );
  }

  const termId = termResult.data.id;
  const deleteResult = await supabase
    .from("bills_glossary_terms")
    .delete()
    .eq("glossary_term_id", termId);
  if (deleteResult.error) {
    throw new Error(
      `議案との関連解除に失敗しました: ${deleteResult.error.message}`
    );
  }

  if (input.billIds.length > 0) {
    const relationResult = await supabase.from("bills_glossary_terms").insert(
      input.billIds.map((billId) => ({
        bill_id: billId,
        glossary_term_id: termId,
      }))
    );
    if (relationResult.error) {
      throw new Error(
        `議案との関連付けに失敗しました: ${relationResult.error.message}`
      );
    }
  }

  const deleteGeneralQuestionResult = await supabase
    .from("general_questions_glossary_terms")
    .delete()
    .eq("glossary_term_id", termId);
  if (deleteGeneralQuestionResult.error) {
    throw new Error(
      `一般質問との関連解除に失敗しました: ${deleteGeneralQuestionResult.error.message}`
    );
  }

  if (input.generalQuestionIds.length > 0) {
    const relationResult = await supabase
      .from("general_questions_glossary_terms")
      .insert(
        input.generalQuestionIds.map((generalQuestionId) => ({
          general_question_id: generalQuestionId,
          glossary_term_id: termId,
        }))
      );
    if (relationResult.error) {
      throw new Error(
        `一般質問との関連付けに失敗しました: ${relationResult.error.message}`
      );
    }
  }

  return termId;
}

export async function deleteGlossaryTermRecord(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("glossary_terms").delete().eq("id", id);
  if (error) {
    throw new Error(`用語解説の削除に失敗しました: ${error.message}`);
  }
}
