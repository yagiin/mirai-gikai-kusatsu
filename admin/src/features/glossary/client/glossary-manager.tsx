"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { deleteGlossaryTerm } from "../server/actions/delete-glossary-term";
import { detectRelatedBills } from "../server/actions/detect-related-bills";
import { saveGlossaryTerm } from "../server/actions/save-glossary-term";
import type {
  GlossaryBillOption,
  GlossaryGeneralQuestionOption,
  GlossaryTermWithBills,
  SaveGlossaryTermInput,
} from "../shared/types";

type Props = {
  terms: GlossaryTermWithBills[];
  bills: GlossaryBillOption[];
  generalQuestions: GlossaryGeneralQuestionOption[];
};

const emptyTerm: SaveGlossaryTermInput = {
  term: "",
  reading: "",
  slug: "",
  shortDescription: "",
  description: "",
  comparisonNotes: "",
  aliases: "",
  relatedTermSlugs: "",
  sourceUrl: "",
  isPublished: false,
  displayOrder: 0,
  billIds: [],
  generalQuestionIds: [],
};

function toInput(term: GlossaryTermWithBills): SaveGlossaryTermInput {
  return {
    id: term.id,
    term: term.term,
    reading: term.reading,
    slug: term.slug,
    shortDescription: term.short_description,
    description: term.description,
    comparisonNotes: term.comparison_notes ?? "",
    aliases: term.aliases.join("、"),
    relatedTermSlugs: term.related_term_slugs.join("、"),
    sourceUrl: term.source_url ?? "",
    isPublished: term.is_published,
    displayOrder: term.display_order,
    billIds: term.billIds,
    generalQuestionIds: term.generalQuestionIds,
  };
}

function formatDate(date: string | null) {
  if (!date) return "日付未定";
  return date.replaceAll("-", "/");
}

export function GlossaryManager({ terms, bills, generalQuestions }: Props) {
  return (
    <div className="space-y-8">
      <section className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">用語を追加</h2>
        <GlossaryEditor
          initialValue={emptyTerm}
          bills={bills}
          generalQuestions={generalQuestions}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">用語一覧（{terms.length}件）</h2>
        {terms.map((term) => (
          <GlossaryEditor
            key={term.id}
            initialValue={toInput(term)}
            bills={bills}
            generalQuestions={generalQuestions}
          />
        ))}
      </section>
    </div>
  );
}

function GlossaryEditor({
  initialValue,
  bills,
  generalQuestions,
}: {
  initialValue: SaveGlossaryTermInput;
  bills: GlossaryBillOption[];
  generalQuestions: GlossaryGeneralQuestionOption[];
}) {
  const [value, setValue] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(!initialValue.id);
  const [isSaving, setIsSaving] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  const update = <K extends keyof SaveGlossaryTermInput>(
    key: K,
    nextValue: SaveGlossaryTermInput[K]
  ) => setValue((current) => ({ ...current, [key]: nextValue }));

  const toggleBill = (billId: string, checked: boolean) => {
    update(
      "billIds",
      checked
        ? [...value.billIds, billId]
        : value.billIds.filter((id) => id !== billId)
    );
  };

  const toggleGeneralQuestion = (
    generalQuestionId: string,
    checked: boolean
  ) => {
    update(
      "generalQuestionIds",
      checked
        ? [...value.generalQuestionIds, generalQuestionId]
        : value.generalQuestionIds.filter((id) => id !== generalQuestionId)
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = await saveGlossaryTerm(value);
    setIsSaving(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(
      value.id ? "用語解説を更新しました" : "用語解説を追加しました"
    );
    window.location.reload();
  };

  const handleDetectRelatedBills = async () => {
    setIsDetecting(true);
    const result = await detectRelatedBills(value.term, value.aliases);
    setIsDetecting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    const billIds = result.billIds ?? [];
    const generalQuestionIds = result.generalQuestionIds ?? [];
    update("billIds", billIds);
    update("generalQuestionIds", generalQuestionIds);
    toast.success(
      billIds.length + generalQuestionIds.length > 0
        ? `議案${billIds.length}件、一般質問${generalQuestionIds.length}件を自動選択しました`
        : "該当する議案・一般質問は見つかりませんでした"
    );
  };

  const handleDelete = async () => {
    if (!value.id || !window.confirm(`「${value.term}」を削除しますか？`))
      return;
    setIsSaving(true);
    const result = await deleteGlossaryTerm(value.id);
    setIsSaving(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("用語解説を削除しました");
    window.location.reload();
  };

  return (
    <div className="rounded-lg border bg-white p-5">
      {value.id && (
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="flex w-full items-center justify-between text-left"
        >
          <span>
            <span className="font-semibold">{value.term}</span>
            <span className="ml-3 text-sm text-gray-500">{value.reading}</span>
          </span>
          <span className="text-sm text-gray-500">
            {value.isPublished ? "公開中" : "下書き"}・関連議案
            {value.billIds.length}件・関連一般質問
            {value.generalQuestionIds.length}件
          </span>
        </button>
      )}

      {isOpen && (
        <div
          className={value.id ? "mt-5 space-y-5 border-t pt-5" : "space-y-5"}
        >
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="用語">
              <Input
                value={value.term}
                onChange={(event) => update("term", event.target.value)}
              />
            </Field>
            <Field label="読み方">
              <Input
                value={value.reading}
                onChange={(event) => update("reading", event.target.value)}
                placeholder="せんけつしょぶん"
              />
            </Field>
            <Field label="URL用の名前">
              <Input
                value={value.slug}
                onChange={(event) => update("slug", event.target.value)}
                placeholder="senketsu-shobun"
              />
            </Field>
          </div>

          <Field label="ひとことで">
            <Textarea
              value={value.shortDescription}
              onChange={(event) =>
                update("shortDescription", event.target.value)
              }
              rows={2}
            />
          </Field>
          <Field label="もう少し詳しく">
            <Textarea
              value={value.description}
              onChange={(event) => update("description", event.target.value)}
              rows={5}
            />
          </Field>
          <Field label="似た言葉との違い">
            <Textarea
              value={value.comparisonNotes}
              onChange={(event) =>
                update("comparisonNotes", event.target.value)
              }
              rows={4}
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="別名・本文中でリンクする表記">
              <Input
                value={value.aliases}
                onChange={(event) => update("aliases", event.target.value)}
                placeholder="専決、別の呼び方（読点区切り）"
              />
            </Field>
            <Field label="関連する用語のURL名">
              <Input
                value={value.relatedTermSlugs}
                onChange={(event) =>
                  update("relatedTermSlugs", event.target.value)
                }
                placeholder="shiyouryou（読点区切り）"
              />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="出典URL">
              <Input
                type="url"
                value={value.sourceUrl}
                onChange={(event) => update("sourceUrl", event.target.value)}
              />
            </Field>
            <Field label="表示順">
              <Input
                type="number"
                value={value.displayOrder}
                onChange={(event) =>
                  update("displayOrder", Number(event.target.value))
                }
              />
            </Field>
          </div>

          <div className="flex items-center gap-3 rounded-md border p-4">
            <Switch
              checked={value.isPublished}
              onCheckedChange={(checked) => update("isPublished", checked)}
            />
            <div>
              <Label>公開する</Label>
              <p className="text-sm text-gray-500">
                オフの場合、公開サイトには表示されません。
              </p>
            </div>
          </div>

          <details className="rounded-md border p-4">
            <summary className="cursor-pointer font-medium">
              関連する議案を選ぶ（{value.billIds.length}件）
            </summary>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleDetectRelatedBills}
                disabled={isDetecting || !value.term.trim()}
              >
                {isDetecting ? "検索中..." : "本文から自動選択"}
              </Button>
              <p className="text-sm text-gray-500">
                用語と別名を、議案名・タイトル・要約・本文から探します。
              </p>
            </div>
            <div className="mt-4 grid max-h-80 gap-3 overflow-y-auto md:grid-cols-2">
              {bills.map((bill) => (
                <div key={bill.id} className="flex items-start gap-2 text-sm">
                  <Checkbox
                    id={`glossary-${value.id ?? "new"}-bill-${bill.id}`}
                    checked={value.billIds.includes(bill.id)}
                    onCheckedChange={(checked) =>
                      toggleBill(bill.id, checked === true)
                    }
                  />
                  <Label
                    htmlFor={`glossary-${value.id ?? "new"}-bill-${bill.id}`}
                    className="font-normal"
                  >
                    {bill.name}
                  </Label>
                </div>
              ))}
            </div>
          </details>

          <details className="rounded-md border p-4">
            <summary className="cursor-pointer font-medium">
              関連する一般質問を選ぶ（{value.generalQuestionIds.length}件）
            </summary>
            <p className="mt-3 text-sm text-gray-500">
              「本文から自動選択」を押すと、一般質問の質問項目・要約・答弁要約・議事録原文からも探します。
            </p>
            <div className="mt-4 grid max-h-80 gap-3 overflow-y-auto md:grid-cols-2">
              {generalQuestions.map((question) => (
                <div
                  key={question.id}
                  className="flex items-start gap-2 text-sm"
                >
                  <Checkbox
                    id={`glossary-${value.id ?? "new"}-general-question-${question.id}`}
                    checked={value.generalQuestionIds.includes(question.id)}
                    onCheckedChange={(checked) =>
                      toggleGeneralQuestion(question.id, checked === true)
                    }
                  />
                  <Label
                    htmlFor={`glossary-${value.id ?? "new"}-general-question-${question.id}`}
                    className="font-normal"
                  >
                    <span className="font-medium">{question.title}</span>
                    <span className="ml-2 text-gray-500">
                      {formatDate(question.questionDate)} /{" "}
                      {question.questionerName}
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          </details>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "保存中..." : "保存"}
            </Button>
            {value.id && (
              <Button
                variant="outline"
                onClick={handleDelete}
                disabled={isSaving}
              >
                削除
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
