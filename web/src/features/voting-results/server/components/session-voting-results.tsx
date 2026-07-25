import "server-only";

import { ExternalLink } from "lucide-react";
import type {
  SessionVotingResults as SessionVotingResultsData,
  VoteMark,
} from "../../shared/voting-results";

type Props = {
  data: SessionVotingResultsData;
};

const voteLabels: Record<VoteMark, { symbol: string; label: string }> = {
  for: { symbol: "○", label: "賛成" },
  against: { symbol: "×", label: "賛成でない" },
  absent: { symbol: "欠", label: "欠席" },
  abstain: { symbol: "－", label: "棄権" },
  excluded: { symbol: "除", label: "除斥" },
  chair: { symbol: "／", label: "議長のため表決なし" },
};

function formatVotedOn(value: string) {
  const [, month, day] = value.split("-");
  return `${Number(month)}月${Number(day)}日`;
}

export function SessionVotingResults({ data }: Props) {
  const caucuses = data.members.reduce<{ name: string; memberCount: number }[]>(
    (groups, member) => {
      const lastGroup = groups.at(-1);
      if (lastGroup?.name === member.caucus) {
        lastGroup.memberCount += 1;
        return groups;
      }
      groups.push({ name: member.caucus, memberCount: 1 });
      return groups;
    },
    []
  );

  return (
    <section aria-labelledby="voting-results-heading">
      <div className="mb-5 flex flex-col gap-2">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-primary-accent">
              議員別の賛否
            </p>
            <h2
              id="voting-results-heading"
              className="text-[22px] font-bold leading-[1.48] text-black"
            >
              議決結果
            </h2>
          </div>
          <a
            href={data.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-mirai-text underline underline-offset-4"
          >
            草津市議会の公式資料
            <ExternalLink className="size-4" aria-hidden="true" />
          </a>
        </div>
        <p className="text-sm leading-6 text-mirai-text">
          ○は賛成、×は賛成でない、欠は欠席、－は棄権、除は除斥、／は議長のため表決なしを表します。
        </p>
        <p className="text-xs text-muted-foreground">
          表は横にスクロールできます。
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-mirai-border bg-white">
        <table className="w-max min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-mirai-surface-warm">
              <th
                rowSpan={2}
                className="sticky left-0 z-20 w-[280px] min-w-[280px] border-r border-b border-mirai-border bg-mirai-surface-warm px-4 py-3 text-left md:w-[360px] md:min-w-[360px]"
              >
                議案・議決結果
              </th>
              {caucuses.map((caucus) => (
                <th
                  key={caucus.name}
                  colSpan={caucus.memberCount}
                  className="border-r border-b border-mirai-border px-2 py-2 text-center text-xs font-bold"
                >
                  {caucus.name}
                </th>
              ))}
            </tr>
            <tr className="bg-mirai-surface-muted">
              {data.members.map((member) => (
                <th
                  key={member.name}
                  className="h-28 w-11 min-w-11 border-r border-b border-mirai-border px-1 py-2 text-center align-bottom text-xs font-medium"
                  title={member.caucus}
                >
                  <span className="[writing-mode:vertical-rl]">
                    {member.name.replace(" ", "")}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.results.map((result) => (
              <tr
                key={result.proposalNumber}
                className="odd:bg-white even:bg-mirai-surface-muted"
              >
                <th
                  scope="row"
                  className="sticky left-0 z-10 border-r border-b border-mirai-border bg-inherit px-4 py-3 text-left"
                >
                  <span className="mb-1 block font-bold text-primary-accent">
                    {result.proposalNumber}
                  </span>
                  <span className="block font-medium leading-5 text-black">
                    {result.title}
                  </span>
                  <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-normal text-mirai-text">
                    <span className="font-bold">{result.outcome}</span>
                    <time dateTime={result.votedOn}>
                      {formatVotedOn(result.votedOn)}
                    </time>
                  </span>
                </th>
                {result.votes.map((vote, index) => {
                  const voteLabel = voteLabels[vote];
                  const member = data.members[index];
                  return (
                    <td
                      key={member.name}
                      className="border-r border-b border-mirai-border px-1 py-3 text-center text-base font-bold"
                      aria-label={`${member.name}：${voteLabel.label}`}
                      title={`${member.name}：${voteLabel.label}`}
                    >
                      {voteLabel.symbol}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
