import "server-only";

import { Landmark } from "lucide-react";
import type { DietSession } from "../../shared/types";

type SessionOverviewSectionProps = {
  session: DietSession;
};

export function SessionOverviewSection({
  session,
}: SessionOverviewSectionProps) {
  if (!session.overview) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-mirai-border bg-mirai-surface-warm p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-white p-3 text-primary-accent shadow-sm">
          <Landmark className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-primary-accent">
            {session.name}
          </p>
          <h2 className="mt-1 text-[22px] font-bold leading-[1.48] text-mirai-text">
            今回の議会について
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-mirai-text-secondary sm:text-base">
            {session.overview}
          </p>
        </div>
      </div>
    </section>
  );
}
