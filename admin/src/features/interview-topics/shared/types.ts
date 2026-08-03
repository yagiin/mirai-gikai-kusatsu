import type { Database } from "@mirai-gikai/supabase";
import { INTERVIEW_MODES } from "@mirai-gikai/shared/interview-prompts/types";
import { z } from "zod";
import { interviewQuestionSchema } from "@/features/interview-config/shared/types";
import { isValidChatModel } from "@/features/interview-config/shared/utils/chat-model-options";

export type InterviewTopic =
  Database["public"]["Tables"]["interview_topics"]["Row"];

export const interviewTopicFormSchema = z.object({
  title: z.string().trim().min(1, "タイトルは必須です").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "URL識別子は必須です")
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "半角英小文字・数字・ハイフンで入力してください"
    ),
  description: z.string().trim().min(1, "概要は必須です").max(2000),
  background: z.string().trim().max(20000).nullable(),
  purpose: z.string().trim().max(2000).nullable(),
  configName: z.string().trim().min(1, "設定名は必須です").max(100),
  status: z.enum(["public", "closed"]),
  mode: z.enum(INTERVIEW_MODES),
  themes: z.array(z.string().trim().min(1)).max(20),
  chatModel: z
    .string()
    .nullable()
    .refine((value) => !value || isValidChatModel(value), {
      message: "無効なAIモデルです",
    }),
  estimatedDuration: z.number().int().min(1).max(180).nullable(),
  questions: z
    .array(interviewQuestionSchema)
    .min(1, "質問を1件以上設定してください"),
});

export type InterviewTopicFormInput = z.infer<typeof interviewTopicFormSchema>;

export const DEFAULT_GENERAL_INTERVIEW_QUESTIONS: InterviewTopicFormInput["questions"] =
  [
    {
      question: "このテーマに、どのような関心や関わりがありますか？",
      follow_up_guide: "回答者の経験や立場を1往復まで確認する",
    },
    {
      question: "現在、どのようなことを感じたり経験したりしていますか？",
      follow_up_guide: "具体的な場面や経験を1往復まで確認する",
    },
    {
      question: "特に課題だと感じる点はありますか？",
      follow_up_guide: "生活や仕事への影響を1往復まで確認する",
    },
    {
      question: "どのように改善されるとよいと思いますか？",
      follow_up_guide: "望ましい状態や具体的な提案を1往復まで確認する",
    },
    {
      question: "行政や議会に特に伝えたいことはありますか？",
      follow_up_guide: "回答を受け止め、追加確認は1往復までに留める",
    },
  ];
