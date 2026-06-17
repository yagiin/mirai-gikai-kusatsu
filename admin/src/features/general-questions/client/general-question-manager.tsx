"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { deleteGeneralQuestion } from "../server/actions/delete-general-question";
import { saveGeneralQuestion } from "../server/actions/save-general-question";
import type {
  DietSessionOption,
  GeneralQuestionWithSession,
  SaveGeneralQuestionInput,
} from "../shared/types";

type Props = {
  questions: GeneralQuestionWithSession[];
  sessions: DietSessionOption[];
};

const emptyQuestion: SaveGeneralQuestionInput = {
  dietSessionId: "",
  questionerName: "",
  questionerGroup: "",
  questionDate: "",
  title: "",
  summary: "",
  answerSummary: "",
  questionerComment: "",
  transcript: "",
  sourceUrl: "",
  videoUrl: "",
  isPublished: false,
  displayOrder: 0,
};

function toInput(
  question: GeneralQuestionWithSession
): SaveGeneralQuestionInput {
  return {
    id: question.id,
    dietSessionId: question.diet_session_id,
    questionerName: question.questioner_name,
    questionerGroup: question.questioner_group ?? "",
    questionDate: question.question_date ?? "",
    title: question.title,
    summary: question.summary,
    answerSummary: question.answer_summary,
    questionerComment: question.questioner_comment ?? "",
    transcript: question.transcript ?? "",
    sourceUrl: question.source_url ?? "",
    videoUrl: question.video_url ?? "",
    isPublished: question.is_published,
    displayOrder: question.display_order,
  };
}

export function GeneralQuestionManager({ questions, sessions }: Props) {
  return (
    <div className="space-y-8">
      <section className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">一般質問を追加</h2>
        <GeneralQuestionEditor
          initialValue={{
            ...emptyQuestion,
            dietSessionId: sessions[0]?.id ?? "",
          }}
          sessions={sessions}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">
          一般質問一覧（{questions.length}件）
        </h2>
        {questions.map((question) => (
          <GeneralQuestionEditor
            key={question.id}
            initialValue={toInput(question)}
            sessions={sessions}
            sessionName={question.diet_sessions?.name ?? ""}
          />
        ))}
      </section>
    </div>
  );
}

function GeneralQuestionEditor({
  initialValue,
  sessions,
  sessionName,
}: {
  initialValue: SaveGeneralQuestionInput;
  sessions: DietSessionOption[];
  sessionName?: string;
}) {
  const [value, setValue] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(!initialValue.id);
  const [isSaving, setIsSaving] = useState(false);

  const update = <K extends keyof SaveGeneralQuestionInput>(
    key: K,
    nextValue: SaveGeneralQuestionInput[K]
  ) => setValue((current) => ({ ...current, [key]: nextValue }));

  const handleSave = async () => {
    setIsSaving(true);
    const result = await saveGeneralQuestion(value);
    setIsSaving(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(
      value.id ? "一般質問を更新しました" : "一般質問を追加しました"
    );
    window.location.reload();
  };

  const handleDelete = async () => {
    if (!value.id || !window.confirm(`「${value.title}」を削除しますか？`))
      return;
    setIsSaving(true);
    const result = await deleteGeneralQuestion(value.id);
    setIsSaving(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("一般質問を削除しました");
    window.location.reload();
  };

  return (
    <div className="rounded-lg border bg-white p-5">
      {value.id && (
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="flex w-full items-center justify-between gap-4 text-left"
        >
          <span>
            <span className="font-semibold">{value.title}</span>
            <span className="ml-3 text-sm text-gray-500">
              {value.questionerName} / {sessionName}
            </span>
          </span>
          <span className="shrink-0 text-sm text-gray-500">
            {value.isPublished ? "公開中" : "下書き"}
          </span>
        </button>
      )}

      {isOpen && (
        <div
          className={value.id ? "mt-5 space-y-5 border-t pt-5" : "space-y-5"}
        >
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="会期">
              <Select
                value={value.dietSessionId}
                onValueChange={(nextValue) =>
                  update("dietSessionId", nextValue)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="会期を選択" />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map((session) => (
                    <SelectItem key={session.id} value={session.id}>
                      {session.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="質問者">
              <Input
                value={value.questionerName}
                onChange={(event) =>
                  update("questionerName", event.target.value)
                }
              />
            </Field>
            <Field label="会派">
              <Input
                value={value.questionerGroup}
                onChange={(event) =>
                  update("questionerGroup", event.target.value)
                }
              />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Field label="質問日">
              <Input
                type="date"
                value={value.questionDate}
                onChange={(event) => update("questionDate", event.target.value)}
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
          </div>

          <Field label="質問項目">
            <Input
              value={value.title}
              onChange={(event) => update("title", event.target.value)}
              placeholder="例：子育て支援について"
            />
          </Field>

          <Field label="やさしい要約">
            <MarkdownHelp />
            <Textarea
              value={value.summary}
              onChange={(event) => update("summary", event.target.value)}
              rows={4}
            />
          </Field>

          <Field label="市の答弁要約">
            <MarkdownHelp />
            <Textarea
              value={value.answerSummary}
              onChange={(event) => update("answerSummary", event.target.value)}
              rows={4}
            />
          </Field>

          <Field label="質問者コメント">
            <MarkdownHelp />
            <Textarea
              value={value.questionerComment}
              onChange={(event) =>
                update("questionerComment", event.target.value)
              }
              rows={4}
            />
          </Field>

          <Field label="議事録原文">
            <MarkdownHelp />
            <Textarea
              value={value.transcript}
              onChange={(event) => update("transcript", event.target.value)}
              rows={8}
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="議事録・資料URL">
              <Input
                type="url"
                value={value.sourceUrl}
                onChange={(event) => update("sourceUrl", event.target.value)}
              />
            </Field>
            <Field label="動画URL">
              <Input
                type="url"
                value={value.videoUrl}
                onChange={(event) => update("videoUrl", event.target.value)}
              />
            </Field>
          </div>

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

function MarkdownHelp() {
  return (
    <p className="text-xs text-gray-500">
      太字は **強調したい文字**
      のように入力できます。HTMLタグは使用しないでください。
    </p>
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
