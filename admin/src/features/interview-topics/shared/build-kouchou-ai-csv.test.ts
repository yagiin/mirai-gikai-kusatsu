import { describe, expect, it } from "vitest";
import { buildKouchouAiCsv } from "./build-kouchou-ai-csv";

describe("buildKouchouAiCsv", () => {
  it("1セッションの回答を改行で結合し、1コメントとして出力する", () => {
    expect(
      buildKouchouAiCsv([
        { messages: ["交通が不便です", "夜の便を増やしてほしいです"] },
      ])
    ).toBe('comment\r\n"交通が不便です\n夜の便を増やしてほしいです"');
  });

  it("ダブルクォートをエスケープし、空回答を除外する", () => {
    expect(
      buildKouchouAiCsv([
        { messages: ["「予約制」がよい"] },
        { messages: ["  "] },
        { messages: ['"乗合"も検討してほしい'] },
      ])
    ).toBe('comment\r\n"「予約制」がよい"\r\n"""乗合""も検討してほしい"');
  });
});
