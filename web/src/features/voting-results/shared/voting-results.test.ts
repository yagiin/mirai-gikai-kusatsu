import { describe, expect, it } from "vitest";
import { getVotingResultsBySessionSlug } from "./voting-results";

describe("getVotingResultsBySessionSlug", () => {
  it.each([
    ["r8-2-teireikai", 41],
    ["r8-6-teireikai", 17],
  ])("%s の公式表決結果を返す", (slug, resultCount) => {
    const session = getVotingResultsBySessionSlug(slug);

    expect(session).not.toBeNull();
    expect(session?.members).toHaveLength(24);
    expect(session?.results).toHaveLength(resultCount);
    expect(session?.results.every((result) => result.votes.length === 24)).toBe(
      true
    );
  });

  it("未登録の会期では表示データを返さない", () => {
    expect(getVotingResultsBySessionSlug("unknown")).toBeNull();
  });

  it("2月定例会の議第11号の反対者を保持する", () => {
    const session = getVotingResultsBySessionSlug("r8-2-teireikai");
    const result = session?.results.find(
      (item) => item.proposalNumber === "議第11号"
    );
    const against = result?.votes
      .map((vote, index) => (vote === "against" ? index : -1))
      .filter((index) => index >= 0);

    expect(against).toEqual([12, 13, 14, 15, 21, 22]);
  });

  it("6月定例会の意見書第7号の賛成者を保持する", () => {
    const session = getVotingResultsBySessionSlug("r8-6-teireikai");
    const result = session?.results.find(
      (item) => item.proposalNumber === "意見書第7号"
    );
    const support = result?.votes
      .map((vote, index) => (vote === "for" ? index : -1))
      .filter((index) => index >= 0);

    expect(support).toEqual([21, 22]);
  });
});
