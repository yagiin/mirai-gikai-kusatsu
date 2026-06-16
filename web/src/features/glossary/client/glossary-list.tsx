"use client";

import { Search } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useMemo, useState } from "react";
import { routes } from "@/lib/routes";
import type { GlossaryTerm } from "../shared/types";

type Props = {
  terms: GlossaryTerm[];
};

export function GlossaryList({ terms }: Props) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase("ja");
  const filteredTerms = useMemo(() => {
    if (!normalizedQuery) return terms;

    return terms.filter((term) =>
      [term.term, term.reading, term.short_description, ...term.aliases].some(
        (value) => value.toLocaleLowerCase("ja").includes(normalizedQuery)
      )
    );
  }, [normalizedQuery, terms]);

  return (
    <div className="space-y-6">
      <label className="relative block">
        <span className="sr-only">用語を検索</span>
        <Search
          aria-hidden="true"
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="用語や読み方から検索"
          className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4 text-base outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />
      </label>

      {filteredTerms.length === 0 ? (
        <p className="rounded-xl bg-white p-8 text-center text-gray-600">
          該当する用語が見つかりませんでした。
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredTerms.map((term) => (
            <Link
              key={term.id}
              href={routes.glossaryTerm(term.slug) as Route}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md"
            >
              <p className="text-sm text-gray-500">{term.reading}</p>
              <h2 className="mt-1 text-xl font-bold text-mirai-text">
                {term.term}
              </h2>
              <p className="mt-3 leading-relaxed text-gray-700">
                {term.short_description}
              </p>
              <p className="mt-4 text-sm font-semibold text-emerald-700">
                解説を読む
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
