"use client";

import type { InterviewMode } from "@mirai-gikai/shared/interview-prompts/types";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { InterviewQuestion } from "@/features/interview-config/shared/types";
import { routes } from "@/lib/routes";
import {
  createInterviewTopic,
  updateInterviewTopic,
} from "../../server/actions/save-interview-topic";
import {
  DEFAULT_GENERAL_INTERVIEW_QUESTIONS,
  type InterviewTopic,
  type InterviewTopicFormInput,
} from "../../shared/types";

type EditableQuestion = InterviewTopicFormInput["questions"][number] & {
  clientId: string;
};

interface InterviewTopicFormProps {
  topic?: InterviewTopic;
  config?: {
    id: string;
    name: string;
    status: "public" | "closed";
    mode: InterviewMode;
    themes: string[] | null;
    chat_model: string | null;
    estimated_duration: number | null;
  };
  questions?: InterviewQuestion[];
}

export function InterviewTopicForm({
  topic,
  config,
  questions: existingQuestions,
}: InterviewTopicFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState(topic?.title ?? "");
  const [slug, setSlug] = useState(topic?.slug ?? "");
  const [description, setDescription] = useState(topic?.description ?? "");
  const [background, setBackground] = useState(topic?.background ?? "");
  const [purpose, setPurpose] = useState(topic?.purpose ?? "");
  const [configName, setConfigName] = useState(
    config?.name ?? "一般テーマインタビュー"
  );
  const [status, setStatus] = useState<"public" | "closed">(
    config?.status ?? "closed"
  );
  const [mode, setMode] = useState<InterviewMode>(config?.mode ?? "loop");
  const [themesText, setThemesText] = useState(
    config?.themes?.join("\n") ?? ""
  );
  const [estimatedDuration, setEstimatedDuration] = useState(
    String(config?.estimated_duration ?? 10)
  );
  const [questions, setQuestions] = useState<EditableQuestion[]>(
    existingQuestions?.length
      ? existingQuestions.map((question) => ({
          clientId: question.id,
          question: question.question,
          follow_up_guide: question.follow_up_guide ?? undefined,
          quick_replies: question.quick_replies ?? undefined,
          target_audience: question.target_audience ?? undefined,
        }))
      : DEFAULT_GENERAL_INTERVIEW_QUESTIONS.map((question) => ({
          ...question,
          clientId: `default-${question.question}`,
        }))
  );

  const updateQuestion = (
    index: number,
    field: "question" | "follow_up_guide" | "quick_replies",
    value: string
  ) => {
    setQuestions((current) =>
      current.map((question, questionIndex) => {
        if (questionIndex !== index) return question;
        if (field === "quick_replies") {
          return {
            ...question,
            quick_replies: lines(value),
          };
        }
        return { ...question, [field]: value };
      })
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    const input: InterviewTopicFormInput = {
      title,
      slug,
      description,
      background: background || null,
      purpose: purpose || null,
      configName,
      status,
      mode,
      themes: lines(themesText),
      chatModel: config?.chat_model ?? null,
      estimatedDuration: estimatedDuration ? Number(estimatedDuration) : null,
      questions: questions.map(
        ({ clientId: _clientId, ...question }) => question
      ),
    };

    try {
      const result = topic
        ? await updateInterviewTopic(topic.id, input)
        : await createInterviewTopic(input);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(
        topic ? "インタビューを更新しました" : "インタビューを作成しました"
      );
      router.push(routes.interviewTopicEdit(result.data.id));
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>一般テーマ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <Field label="タイトル" required>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </Field>
          <Field
            label="URL識別子"
            description="半角英小文字・数字・ハイフンで入力します"
            required
          >
            <Input
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder="kusatsu-public-transport"
            />
          </Field>
          <Field label="公開ページの概要" required>
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
            />
          </Field>
          <Field
            label="背景情報・参考資料"
            description="AIが質問や深掘りの際に参照します"
          >
            <Textarea
              value={background}
              onChange={(event) => setBackground(event.target.value)}
              rows={8}
            />
          </Field>
          <Field label="目的・回答の活用方法">
            <Textarea
              value={purpose}
              onChange={(event) => setPurpose(event.target.value)}
              rows={4}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>インタビュー設定</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <Field label="設定名" required>
            <Input
              value={configName}
              onChange={(event) => setConfigName(event.target.value)}
            />
          </Field>
          <Field label="公開状態" required>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as "public" | "closed")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="closed">非公開</SelectItem>
                <SelectItem value="public">公開</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="モード" required>
            <Select
              value={mode}
              onValueChange={(value) => setMode(value as InterviewMode)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="loop">逐次深掘り</SelectItem>
                <SelectItem value="bulk">一括回答後に深掘り</SelectItem>
                <SelectItem value="targeted">対象者指定</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="目安時間（分）">
            <Input
              type="number"
              min={1}
              max={180}
              value={estimatedDuration}
              onChange={(event) => setEstimatedDuration(event.target.value)}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="分析テーマ" description="1行につき1テーマ">
              <Textarea
                value={themesText}
                onChange={(event) => setThemesText(event.target.value)}
                rows={5}
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>質問</CardTitle>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setQuestions((current) => [
                ...current,
                { clientId: crypto.randomUUID(), question: "" },
              ])
            }
          >
            <Plus className="size-4" />
            質問を追加
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.map((question, index) => (
            <div
              key={question.clientId}
              className="space-y-3 rounded-lg border p-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">質問 {index + 1}</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={questions.length === 1}
                  onClick={() =>
                    setQuestions((current) =>
                      current.filter(
                        (_, questionIndex) => questionIndex !== index
                      )
                    )
                  }
                  aria-label={`質問${index + 1}を削除`}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <Field label="質問文" required>
                <Textarea
                  value={question.question}
                  onChange={(event) =>
                    updateQuestion(index, "question", event.target.value)
                  }
                  rows={2}
                />
              </Field>
              <Field label="フォローアップ指針">
                <Textarea
                  value={question.follow_up_guide ?? ""}
                  onChange={(event) =>
                    updateQuestion(index, "follow_up_guide", event.target.value)
                  }
                  rows={2}
                />
              </Field>
              <Field label="クイックリプライ" description="1行につき1項目">
                <Textarea
                  value={question.quick_replies?.join("\n") ?? ""}
                  onChange={(event) =>
                    updateQuestion(index, "quick_replies", event.target.value)
                  }
                  rows={3}
                />
              </Field>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(routes.interviews())}
        >
          キャンセル
        </Button>
        <Button type="button" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "保存中..." : topic ? "変更を保存" : "作成"}
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  description,
  required,
  children,
}: {
  label: string;
  description?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required ? " *" : ""}
      </Label>
      {children}
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

function lines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}
