import {
  buildBulkModeStageGuidance,
  buildLoopModeStageGuidance,
  buildTimeManagementGuidance,
} from "@mirai-gikai/shared/interview-prompts/stage-transition-guidance";
import type {
  InterviewMode,
  InterviewQuestion,
} from "@mirai-gikai/shared/interview-prompts/types";
import type { InterviewTopic } from "./types";

interface GeneralInterviewPromptInput {
  topic: InterviewTopic;
  mode: InterviewMode;
  themes: string[] | null;
  questions: InterviewQuestion[];
  nextQuestionId?: string;
  currentStage: "chat" | "summary" | "summary_complete";
  askedQuestionIds: Set<string>;
  remainingMinutes?: number | null;
}

export function buildGeneralInterviewSystemPrompt({
  topic,
  mode,
  themes,
  questions,
  nextQuestionId,
  currentStage,
  askedQuestionIds,
  remainingMinutes,
}: GeneralInterviewPromptInput): string {
  const isBulk = mode === "bulk";
  const nextQuestion = nextQuestionId
    ? questions.find((question) => question.id === nextQuestionId)
    : null;
  const questionLines = questions
    .map((question, index) => {
      const details = [
        question.target_audience ? `対象者: ${question.target_audience}` : null,
        question.follow_up_guide
          ? `フォローアップ指針: ${question.follow_up_guide}`
          : null,
        question.quick_replies?.length
          ? `クイックリプライ: ${question.quick_replies.join(", ")}`
          : null,
      ].filter(Boolean);
      return `${index + 1}. [ID: ${question.id}] ${question.question}${details.length ? `\n   ${details.join("\n   ")}` : ""}`;
    })
    .join("\n");
  const remainingQuestions =
    questions.length -
    questions.filter((question) => askedQuestionIds.has(question.id)).length;
  const stageGuidance = isBulk
    ? buildBulkModeStageGuidance({ currentStage, questions, askedQuestionIds })
    : buildLoopModeStageGuidance({ currentStage, questions, askedQuestionIds });
  const timeGuidance = buildTimeManagementGuidance({
    remainingMinutes,
    remainingQuestions,
  });

  return `あなたは、市民の経験・課題・要望・提案を引き出す半構造化デプスインタビューの熟練者です。

## インタビュー対象
- テーマ: ${topic.title}
- 概要: ${topic.description}
- 目的: ${topic.purpose || "市政調査・政策検討に活用する"}

背景情報・参考資料:
<background>
${topic.background || "（背景情報未設定）"}
</background>

## インタビューテーマ
${themes?.length ? themes.map((theme) => `- ${theme}`).join("\n") : "（テーマ未設定）"}

## 進行方針
- 丁寧で親しみやすい口調を使い、回答を評価・誘導しない
- 1つのメッセージでは1つの論点だけを聞く
- 「なぜ」を多用せず、「どのような背景で」「どんな経験から」と柔らかく尋ねる
- 回答から、具体的な経験、困りごと、望ましい状態、改善案を引き出す
- 背景情報にない事実を断定しない。誤解があれば、回答を否定せず背景情報に基づいて簡潔に補足する
- 個人情報や機密情報を尋ねない
${mode === "targeted" ? "- 各質問の対象者条件を確認し、非該当の質問は自然にスキップする" : ""}

## 事前定義質問
${questionLines || "（質問未設定）"}

## モード
${isBulk ? "まず事前定義質問をすべて確認し、その後に有益な回答を深掘りする。" : "各質問への回答を受け、フォローアップ指針の範囲で1〜2往復深掘りしてから次へ進む。"}
${nextQuestion ? `次は必ず [ID: ${nextQuestion.id}] ${nextQuestion.question} を尋ねる。` : ""}

## クイックリプライ
- 事前定義質問を行う場合は question_id を含める
- 設定された選択肢は quick_replies に含める
- 深掘り質問では question_id を含めない
- 1つの質問に対応する短い topic_title を付ける

${timeGuidance}

${stageGuidance}`;
}

export function buildGeneralSummarySystemPrompt({
  topic,
  themes,
  messages,
}: {
  topic: InterviewTopic;
  themes: string[] | null;
  messages: Array<{ role: string; content: string; id?: string }>;
}): string {
  const conversation = messages
    .map((message) =>
      message.role === "user" && message.id
        ? `user [msg_id:${message.id}]: ${message.content}`
        : `${message.role}: ${message.content}`
    )
    .join("\n");

  return `あなたは市民インタビューの内容を、政策検討に役立つ形で正確に整理する編集者です。

## 対象テーマ
- テーマ: ${topic.title}
- 概要: ${topic.description}
- 目的: ${topic.purpose || "市政調査・政策検討に活用する"}

## 分析テーマ
${themes?.length ? themes.map((theme) => `- ${theme}`).join("\n") : "（テーマ未設定）"}

## 会話履歴
${conversation}

## レポート作成ルール
- summary は回答者の主張を100文字程度の自然な話し言葉でまとめる
- 一般テーマには法案への賛否がないため stance は null にする
- role は回答者の立場に最も近い分類を選ぶ
- role_description と10文字以内の role_title を作る
- opinions は、具体的な課題・要望・提案を最大3件、政策検討に有益な順で整理する
- 各 opinion の source_message_id は根拠となるユーザー発言IDを指定する
- contextual_quote は個人名等を除き、単独で意味が通る引用にする
- bill_sentiment は必ず null にする
- 会話にない内容を補わない
- content_richness は既存の出力スキーマに従って評価する

レポートを提示して確認を待つ場合は next_stage を "summary"、同意後は "summary_complete" にする。回答者が再開を希望した場合のみ next_stage を "chat" にし、レポートを省略して質問を1つ提示する。`;
}
