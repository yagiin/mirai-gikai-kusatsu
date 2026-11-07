import { describe, expect, it } from "vitest";
import {
  filterBillsByCommittee,
  filterBillsByStatus,
  getFilterCounts,
} from "./bill-list-filters";

const bills = [
  { status: "enacted", committee_name: "総務常任委員会" },
  { status: "rejected", committee_name: "予算委員会" },
  { status: "introduced", committee_name: "決算特別委員会" },
] as const;

describe("bill list filters", () => {
  it("counts bills by status", () => {
    expect(getFilterCounts(bills)).toEqual({
      all: 3,
      enacted: 1,
      rejected: 1,
      other: 1,
    });
  });

  it("filters bills by status", () => {
    expect(filterBillsByStatus(bills, "enacted")).toHaveLength(1);
    expect(filterBillsByStatus(bills, "other")).toHaveLength(1);
  });

  it("filters bills by committee short-name target", () => {
    expect(filterBillsByCommittee(bills, "予算常任委員会")).toHaveLength(1);
    expect(filterBillsByCommittee(bills, "決算特別委員会")).toHaveLength(1);
    expect(filterBillsByCommittee(bills, "all")).toHaveLength(3);
  });
});
