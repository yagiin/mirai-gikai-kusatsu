import { describe, expect, it } from "vitest";
import { validateOverview } from "./validate-overview";

describe("validateOverview", () => {
  it.each([
    null,
    "",
    "決算議会です。",
    "あ".repeat(500),
  ])("500文字以内ならエラーを返さない", (overview) => {
    expect(validateOverview(overview)).toBeNull();
  });

  it("501文字以上ならエラーを返す", () => {
    expect(validateOverview("あ".repeat(501))).toBe(
      "この議会の特徴・概要は500文字以内で入力してください"
    );
  });
});
