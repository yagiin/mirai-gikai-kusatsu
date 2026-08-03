import { describe, expect, it } from "vitest";
import {
  buildGeneralInterviewSystemPrompt,
  buildGeneralSummarySystemPrompt,
} from "./build-general-interview-prompt";

const topic = {
  id: "topic-1",
  slug: "public-transport",
  title: "草津市の公共交通",
  description: "移動の困りごとを伺います",
  background: "市内のバス路線について検討しています",
  purpose: "交通政策の検討",
  created_at: "2026-08-03T00:00:00Z",
  updated_at: "2026-08-03T00:00:00Z",
};

describe("一般テーマ型インタビュープロンプト", () => {
  it("法案ではなく一般テーマの背景と質問を使用する", () => {
    const prompt = buildGeneralInterviewSystemPrompt({
      topic,
      mode: "loop",
      themes: ["移動手段"],
      questions: [{ id: "q1", question: "普段の移動手段は？" }],
      currentStage: "chat",
      askedQuestionIds: new Set(),
    });
    expect(prompt).toContain("草津市の公共交通");
    expect(prompt).toContain("普段の移動手段は？");
    expect(prompt).not.toContain("法案に関する質問のみに集中");
  });

  it("要約では賛否と期待・懸念を付けない", () => {
    const prompt = buildGeneralSummarySystemPrompt({
      topic,
      themes: null,
      messages: [{ id: "m1", role: "user", content: "夜のバスが必要です" }],
    });
    expect(prompt).toContain("stance は null");
    expect(prompt).toContain("bill_sentiment は必ず null");
    expect(prompt).toContain("msg_id:m1");
  });
});
