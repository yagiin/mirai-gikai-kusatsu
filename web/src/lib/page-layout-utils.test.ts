import { describe, expect, it } from "vitest";

import {
  extractBillIdFromPath,
  extractInterviewTopicSlugFromPath,
  isInterviewPage,
  isInterviewSection,
  isMainPage,
} from "./page-layout-utils";

describe("isMainPage", () => {
  it("returns true for the top page", () => {
    expect(isMainPage("/")).toBe(true);
  });

  it("returns true for a bill detail page", () => {
    expect(isMainPage("/bills/abc-123")).toBe(true);
  });

  it("returns false for a bill sub-page", () => {
    expect(isMainPage("/bills/abc-123/interview")).toBe(false);
  });

  it("returns false for an unrelated path", () => {
    expect(isMainPage("/about")).toBe(false);
  });

  it("returns false for the bills list page", () => {
    expect(isMainPage("/bills")).toBe(false);
    expect(isMainPage("/bills/")).toBe(false);
  });
});

describe("isInterviewPage", () => {
  it("returns true for an interview chat page", () => {
    expect(isInterviewPage("/bills/abc-123/interview/chat")).toBe(true);
  });

  it("一般テーマ型のチャットページを判定する", () => {
    expect(isInterviewPage("/interviews/public-transport/chat")).toBe(true);
  });

  it("returns false for an interview page without /chat", () => {
    expect(isInterviewPage("/bills/abc-123/interview")).toBe(false);
  });

  it("returns false for a bill detail page", () => {
    expect(isInterviewPage("/bills/abc-123")).toBe(false);
  });

  it("returns false for the top page", () => {
    expect(isInterviewPage("/")).toBe(false);
  });
});

describe("isInterviewSection", () => {
  it("returns true for the interview LP page", () => {
    expect(isInterviewSection("/bills/abc-123/interview")).toBe(true);
  });

  it("returns true for the interview chat page", () => {
    expect(isInterviewSection("/bills/abc-123/interview/chat")).toBe(true);
  });

  it("一般テーマ型のLPとチャットを判定する", () => {
    expect(isInterviewSection("/interviews/public-transport")).toBe(true);
    expect(isInterviewSection("/interviews/public-transport/chat")).toBe(true);
  });

  it("returns false for a bill detail page", () => {
    expect(isInterviewSection("/bills/abc-123")).toBe(false);
  });

  it("returns false for the top page", () => {
    expect(isInterviewSection("/")).toBe(false);
  });

  it("returns false for unrelated paths", () => {
    expect(isInterviewSection("/about")).toBe(false);
  });
});

describe("extractInterviewTopicSlugFromPath", () => {
  it("一般テーマ型インタビューのslugを抽出する", () => {
    expect(
      extractInterviewTopicSlugFromPath("/interviews/public-transport/chat")
    ).toBe("public-transport");
  });

  it("一般テーマ型以外のパスではnullを返す", () => {
    expect(extractInterviewTopicSlugFromPath("/bills/abc-123")).toBeNull();
  });
});

describe("extractBillIdFromPath", () => {
  it("extracts bill ID from a bill detail path", () => {
    expect(extractBillIdFromPath("/bills/abc-123")).toBe("abc-123");
  });

  it("extracts bill ID from a bill sub-path", () => {
    expect(extractBillIdFromPath("/bills/abc-123/interview/chat")).toBe(
      "abc-123"
    );
  });

  it("returns null when path does not contain /bills/", () => {
    expect(extractBillIdFromPath("/about")).toBeNull();
  });

  it("returns null for the top page", () => {
    expect(extractBillIdFromPath("/")).toBeNull();
  });
});
