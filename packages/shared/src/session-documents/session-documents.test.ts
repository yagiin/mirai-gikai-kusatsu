import { describe, expect, it } from "vitest";
import { parseSessionDocuments, publishedSessionDocuments, sessionDocumentsSchema } from "./session-documents";

const document = {
  title: "市長所信表明",
  url: "/session-documents/mayor-policy-address-2026-11-24.pdf",
  date: "2026-11-24",
  is_published: true,
};

describe("session documents", () => {
  it("accepts hosted PDFs and HTTPS links", () => {
    expect(parseSessionDocuments([document])).toEqual([document]);
    expect(sessionDocumentsSchema.safeParse([{ ...document, url: "https://www.city.kusatsu.shiga.jp/address.pdf" }]).success).toBe(true);
  });

  it("rejects unsafe URLs and paths", () => {
    for (const url of ["javascript:alert(1)", "data:text/html,example", "http://example.com/a.pdf", "//example.com/a.pdf", "/session-documents/../private.pdf"]) {
      expect(sessionDocumentsSchema.safeParse([{ ...document, url }]).success).toBe(false);
    }
  });

  it("validates title, calendar date and list length", () => {
    expect(sessionDocumentsSchema.safeParse([{ ...document, title: " " }]).success).toBe(false);
    expect(sessionDocumentsSchema.safeParse([{ ...document, date: "2026-02-30" }]).success).toBe(false);
    expect(sessionDocumentsSchema.safeParse(Array(11).fill(document)).success).toBe(false);
  });

  it("hides unpublished entries and handles older session data", () => {
    expect(publishedSessionDocuments([document, { ...document, is_published: false }])).toEqual([document]);
    expect(publishedSessionDocuments(undefined)).toEqual([]);
    expect(publishedSessionDocuments(null)).toEqual([]);
    expect(parseSessionDocuments("invalid")).toEqual([]);
  });
});
