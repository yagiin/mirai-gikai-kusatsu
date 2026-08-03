import "server-only";

import type { BillWithContent } from "@/features/bills/shared/types";
import type { InterviewTopic } from "@/features/interview-topics/shared/types";
import {
  buildGeneralInterviewSystemPrompt,
  buildGeneralSummarySystemPrompt,
} from "@/features/interview-topics/shared/build-general-interview-prompt";
import type { getInterviewConfig } from "@/features/interview-config/server/loaders/get-interview-config";
import type { getInterviewQuestions } from "@/features/interview-config/server/loaders/get-interview-questions";
import { bulkModeLogic } from "./interview-logic/bulk-mode";
import { loopModeLogic } from "./interview-logic/loop-mode";
import { targetedModeLogic } from "./interview-logic/targeted-mode";

const modeLogicMap = {
  bulk: bulkModeLogic,
  loop: loopModeLogic,
  targeted: targetedModeLogic,
} as const;

/**
 * インタビュー用システムプロンプトを構築
 *
 * モードに応じて適切なロジックにルーティングする
 */
export function buildInterviewSystemPrompt({
  bill,
  topic,
  interviewConfig,
  questions,
  nextQuestionId,
  currentStage,
  askedQuestionIds,
  remainingMinutes,
}: {
  bill: BillWithContent | null;
  topic?: InterviewTopic | null;
  interviewConfig: Awaited<ReturnType<typeof getInterviewConfig>>;
  questions: Awaited<ReturnType<typeof getInterviewQuestions>>;
  nextQuestionId?: string;
  currentStage: "chat" | "summary" | "summary_complete";
  askedQuestionIds: Set<string>;
  remainingMinutes?: number | null;
}): string {
  if (topic) {
    return buildGeneralInterviewSystemPrompt({
      topic,
      mode: interviewConfig?.mode ?? "loop",
      themes: interviewConfig?.themes ?? null,
      questions,
      nextQuestionId,
      currentStage,
      askedQuestionIds,
      remainingMinutes,
    });
  }
  // DBの設定からモードを取得
  const mode = interviewConfig?.mode ?? "loop";
  const logic = modeLogicMap[mode] ?? bulkModeLogic;

  return logic.buildSystemPrompt({
    bill,
    interviewConfig,
    questions,
    nextQuestionId,
    currentStage,
    askedQuestionIds,
    remainingMinutes,
  });
}

export { buildSummarySystemPrompt } from "../../shared/utils/build-summary-system-prompt";
export { buildGeneralSummarySystemPrompt };
