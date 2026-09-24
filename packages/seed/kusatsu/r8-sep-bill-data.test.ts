import { describe, expect, it } from "vitest";
import type { BillUpdateRow } from "./bill-update-csv";
import {
  applyR8SepOfficialData,
  R8_SEP_BILLS,
} from "./r8-sep-bill-data";

function createRow(number: number, name: string): BillUpdateRow {
  return {
    id: `00000000-0000-0000-0000-${String(number).padStart(12, "0")}`,
    name: `議第${number}号　${name}`,
    status: "preparing",
    statusNote: null,
    submittedDate: null,
    publishStatus: "draft",
    isFeatured: false,
    slug: null,
    sourceUrl: null,
    normalTitle: "仮タイトル",
    normalSummary: "仮概要",
    normalContent: "仮本文",
    hardTitle: "仮タイトル",
    hardSummary: "仮概要",
    hardContent: "仮本文",
  };
}

describe("令和8年9月定例会の配布資料データ", () => {
  it("開会日追加提案を含む議第52号から73号までを重複なく定義する", () => {
    expect(R8_SEP_BILLS.map((bill) => bill.number)).toEqual(
      Array.from({ length: 22 }, (_, index) => index + 52)
    );
  });

  it("全議案を公開データへ変換できる", () => {
    const updated = R8_SEP_BILLS.map((bill) =>
      applyR8SepOfficialData(createRow(bill.number, bill.name))
    );

    expect(updated).toHaveLength(22);
    expect(updated.every((row) => row.status === "introduced")).toBe(true);
    expect(updated.every((row) => row.publishStatus === "published")).toBe(
      true
    );
    expect(
      updated.every((row) => row.sourceUrl?.includes("city.kusatsu.shiga.jp"))
    ).toBe(true);
    expect(updated.map((row) => row.slug)).toContain("r8-9-gidai-73");
  });

  it("開会日追加提案の市長選挙経費を反映する", () => {
    const bill = R8_SEP_BILLS.find(({ number }) => number === 73);
    if (!bill) throw new Error("議第73号がありません");

    const updated = applyR8SepOfficialData(createRow(73, bill.name));

    expect(updated.normalSummary).toContain("7,772万4千円");
    expect(updated.normalContent).toContain("市長選挙執行費");
    expect(updated.normalContent).toContain("開会日追加提案");
  });

  it("配布資料と件名が一致しない行を拒否する", () => {
    expect(() =>
      applyR8SepOfficialData(createRow(73, "誤った議案件名"))
    ).toThrow("件名が配布資料と一致しません");
  });
});
