import type { BillWithContent } from "@/features/bills/shared/types";

export type StatusFilter = "all" | "enacted" | "rejected" | "other";
export type CommitteeFilter =
  | "all"
  | "総務常任委員会"
  | "産業建設常任委員会"
  | "文教厚生常任委員会"
  | "予算常任委員会"
  | "決算特別委員会";

export const COMMITTEE_FILTERS: {
  key: Exclude<CommitteeFilter, "all">;
  label: string;
}[] = [
  { key: "総務常任委員会", label: "総務" },
  { key: "産業建設常任委員会", label: "産建" },
  { key: "文教厚生常任委員会", label: "文厚" },
  { key: "予算常任委員会", label: "予算" },
  { key: "決算特別委員会", label: "決算" },
];

const COMMITTEE_ALIASES: Record<Exclude<CommitteeFilter, "all">, string[]> = {
  総務常任委員会: ["総務常任委員会"],
  産業建設常任委員会: ["産業建設常任委員会"],
  文教厚生常任委員会: ["文教厚生常任委員会"],
  予算常任委員会: ["予算常任委員会", "予算委員会"],
  決算特別委員会: ["決算特別委員会", "決算委員会"],
};

type BillFilterTarget = Pick<BillWithContent, "status" | "committee_name">;

export function getFilterCounts(bills: readonly BillFilterTarget[]) {
  const enacted = bills.filter((bill) => bill.status === "enacted").length;
  const rejected = bills.filter((bill) => bill.status === "rejected").length;
  const other = bills.length - enacted - rejected;

  return { all: bills.length, enacted, rejected, other };
}

export function filterBillsByStatus<T extends BillFilterTarget>(
  bills: readonly T[],
  filter: StatusFilter
): T[] {
  switch (filter) {
    case "enacted":
      return bills.filter((bill) => bill.status === "enacted");
    case "rejected":
      return bills.filter((bill) => bill.status === "rejected");
    case "other":
      return bills.filter(
        (bill) => bill.status !== "enacted" && bill.status !== "rejected"
      );
    default:
      return bills.slice();
  }
}

export function filterBillsByCommittee<T extends BillFilterTarget>(
  bills: readonly T[],
  filter: CommitteeFilter
): T[] {
  if (filter === "all") {
    return bills.slice();
  }

  const aliases = COMMITTEE_ALIASES[filter];
  return bills.filter(
    (bill) =>
      bill.committee_name != null && aliases.includes(bill.committee_name)
  );
}
