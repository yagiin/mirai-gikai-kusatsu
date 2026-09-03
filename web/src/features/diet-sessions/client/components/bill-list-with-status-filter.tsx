"use client";

import type { Route } from "next";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CompactBillCard } from "@/features/bills/client/components/bill-list/compact-bill-card";
import type { BillWithContent } from "@/features/bills/shared/types";
import { routes } from "@/lib/routes";
import {
  COMMITTEE_FILTERS,
  type CommitteeFilter,
  filterBillsByCommittee,
  filterBillsByStatus,
  getFilterCounts,
  type StatusFilter,
} from "../../shared/utils/bill-list-filters";

type Props = {
  bills: BillWithContent[];
};

function getFilterButtonClass(isActive: boolean) {
  return `h-[29px] rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${
    isActive
      ? "bg-mirai-gradient text-black hover:bg-mirai-gradient"
      : "bg-mirai-surface-grouped text-mirai-text-muted hover:bg-mirai-surface-muted"
  }`;
}

export function BillListWithStatusFilter({ bills }: Props) {
  const [activeStatusFilter, setActiveStatusFilter] =
    useState<StatusFilter>("all");
  const [activeCommitteeFilter, setActiveCommitteeFilter] =
    useState<CommitteeFilter>("all");
  const counts = getFilterCounts(bills);
  const filteredBills = filterBillsByCommittee(
    filterBillsByStatus(bills, activeStatusFilter),
    activeCommitteeFilter
  );

  const statusFilters: { key: StatusFilter; label: string; count: number }[] = [
    { key: "all", label: "ALL", count: counts.all },
    { key: "enacted", label: "可決", count: counts.enacted },
    { key: "rejected", label: "否決", count: counts.rejected },
    { key: "other", label: "その他", count: counts.other },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* フィルターボタン */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-3">
          {statusFilters.map((filter) => (
            <Button
              key={filter.key}
              variant="ghost"
              onClick={() => setActiveStatusFilter(filter.key)}
              className={getFilterButtonClass(
                activeStatusFilter === filter.key
              )}
            >
              {filter.label} {filter.count}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-bold text-mirai-text-muted">
            所管委員会
          </span>
          <Button
            variant="ghost"
            onClick={() => setActiveCommitteeFilter("all")}
            className={getFilterButtonClass(activeCommitteeFilter === "all")}
          >
            すべて
          </Button>
          {COMMITTEE_FILTERS.map((filter) => (
            <Button
              key={filter.key}
              variant="ghost"
              onClick={() => setActiveCommitteeFilter(filter.key)}
              className={getFilterButtonClass(
                activeCommitteeFilter === filter.key
              )}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* 議案リスト */}
      {filteredBills.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">
          該当する議案がありません
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredBills.map((bill) => (
            <Link key={bill.id} href={routes.billDetail(bill.id) as Route}>
              <CompactBillCard bill={bill} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
