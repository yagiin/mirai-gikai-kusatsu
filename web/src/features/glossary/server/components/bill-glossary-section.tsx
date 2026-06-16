import { BookOpen } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { routes } from "@/lib/routes";
import type { GlossaryTerm } from "../../shared/types";

type Props = {
  terms: GlossaryTerm[];
};

export function BillGlossarySection({ terms }: Props) {
  if (terms.length === 0) return null;

  return (
    <section className="my-8 rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 md:p-6">
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-emerald-700" aria-hidden="true" />
        <h2 className="text-xl font-bold">この議案に出てくる用語</h2>
      </div>
      <p className="mt-2 text-sm text-gray-600">
        むずかしい言葉を、やさしく説明しています。
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {terms.map((term) => (
          <Link
            key={term.id}
            href={routes.glossaryTerm(term.slug) as Route}
            className="rounded-lg border border-emerald-100 bg-white p-4 transition hover:border-emerald-500"
          >
            <p className="font-bold">{term.term}</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-700">
              {term.short_description}
            </p>
          </Link>
        ))}
      </div>
      <Link
        href={routes.glossary() as Route}
        className="mt-4 inline-block text-sm font-semibold text-emerald-800 underline underline-offset-4"
      >
        用語解説をすべて見る
      </Link>
    </section>
  );
}
