import "server-only";

import { generateText, type LanguageModel, Output } from "ai";
import {
  isWithinDailyCostLimit,
  recordChatUsage,
} from "@/features/chat/server/services/cost-tracker";
import { getInterviewConfigByIdAdmin } from "@/features/interview-config/server/loaders/get-interview-config-admin";
import { getInterviewQuestions } from "@/features/interview-config/server/loaders/get-interview-questions";
import { DEFAULT_INTERVIEW_CHAT_MODEL } from "@/lib/ai/models";
import { env } from "@/lib/env";
import { interviewChatTextSchema } from "../../shared/schemas";
import type { InterviewMessage } from "../../shared/types";
import { overrideInitialTopicTitle } from "../../shared/utils/override-initial-topic-title";
import { createInterviewMessage } from "../repositories/interview-session-repository";
import { getInterviewSubject } from "../loaders/get-interview-subject";
import { buildInterviewSystemPrompt } from "../utils/build-interview-system-prompt";

type GenerateInitialQuestionParams = {
  sessionId: string;
  interviewConfigId: string;
  userId: string;
  deps?: GenerateQuestionDeps;
};

/** テスト時にモック注入するための外部依存 */
export type GenerateQuestionDeps = {
  model?: LanguageModel;
};

/**
 * インタビューの最初の質問を生成して保存
 */
export async function generateInitialQuestion({
  sessionId,
  interviewConfigId,
  userId,
  deps,
}: GenerateInitialQuestionParams): Promise<InterviewMessage | null> {
  try {
    const [interviewConfig, questions] = await Promise.all([
      getInterviewConfigByIdAdmin(interviewConfigId),
      getInterviewQuestions(interviewConfigId),
    ]);

    if (!interviewConfig) {
      throw new Error("Interview config not found");
    }
    const subject = await getInterviewSubject(interviewConfig);
    if (!subject) throw new Error("Interview subject not found");

    // プロンプトを構築（初期質問なので currentStage は chat、askedQuestionIds は空）
    const systemPrompt = buildInterviewSystemPrompt({
      bill: subject.bill,
      topic: subject.topic,
      interviewConfig,
      questions,
      currentStage: "chat",
      askedQuestionIds: new Set(),
    });

    // インタビュー開始の指示を追加（最初の質問にはクイックリプライとquestion_idを含める）
    const firstQuestionId = questions[0]?.id;
    const subjectTitle = subject.bill
      ? (subject.bill.bill_content?.title ?? subject.bill.name)
      : subject.topic.title;
    const enhancedSystemPrompt = `${systemPrompt}\n\n## 重要: これはインタビューの開始です。ユーザーからのメッセージはありません。事前定義質問の最初の質問から始めてください。挨拶は温かく丁寧に（2文程度）、「${subjectTitle}」についてのインタビューであることを明確に伝えた上で、すぐに最初の質問をしてください。最初の質問にクイックリプライが設定されている場合は、必ず quick_replies フィールドに含めてください。${firstQuestionId ? `最初の質問は ID: ${firstQuestionId} であり、レスポンスの question_id にこの値を含めてください。` : ""}`;

    // 日次コスト制限チェック（fail-closed: エラー時も生成をブロック）
    try {
      const isWithinLimit = await isWithinDailyCostLimit(
        userId,
        env.chat.dailyUserCostLimitUsd
      );
      if (!isWithinLimit) {
        console.error("Daily cost limit reached for initial question");
        return null;
      }
    } catch (error) {
      console.error("Cost limit check error:", error);
      return null;
    }

    // メッセージ履歴なしで最初の質問を生成（構造化出力）
    const occurredAt = new Date().toISOString();
    const model =
      deps?.model ?? interviewConfig.chat_model ?? DEFAULT_INTERVIEW_CHAT_MODEL;
    const result = await generateText({
      model,
      prompt: enhancedSystemPrompt,
      output: Output.object({ schema: interviewChatTextSchema }),
      experimental_telemetry: {
        isEnabled: true,
        functionId: "interview-initial-question",
        metadata: {
          sessionId,
          subjectType: subject.type,
          subjectId:
            interviewConfig.bill_id ?? interviewConfig.interview_topic_id ?? "",
        },
      },
    });

    // LLM利用コストを記録
    const modelName =
      typeof model === "string" ? model : (model.modelId ?? "unknown");
    try {
      await recordChatUsage({
        userId,
        sessionId,
        promptName: "interview-initial-question",
        model: modelName,
        usage: result.usage,
        occurredAt,
        metadata: {
          pageType: "interview",
          billId: interviewConfig.bill_id ?? undefined,
          interviewTopicId: interviewConfig.interview_topic_id ?? undefined,
          finishReason: result.finishReason ?? null,
          stepCount: 0,
        },
      });
    } catch (usageError) {
      console.error("Failed to record interview usage:", usageError);
    }

    const generatedText = result.text;

    if (!generatedText?.trim()) {
      console.error("Generated question is empty");
      return null;
    }

    // 初回メッセージのtopic_titleを「はじめに」に強制上書き
    const content = overrideInitialTopicTitle(generatedText);

    // 生成した質問を保存
    return await createInterviewMessage({
      sessionId,
      role: "assistant",
      content,
    });
  } catch (error) {
    console.error("Failed to generate initial question:", error);
    return null;
  }
}
