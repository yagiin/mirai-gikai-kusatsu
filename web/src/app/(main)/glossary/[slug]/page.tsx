import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Metadata, Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layouts/container";
import { getGlossaryTermBySlug } from "@/features/glossary/server/loaders/get-glossary-term-by-slug";
import { routes } from "@/lib/routes";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const term = await getGlossaryTermBySlug(slug);

  if (!term) return { title: "用語が見つかりません" };

  return {
    title: `${term.term}とは | 用語解説 | みらい議会＠草津市`,
    description: term.short_description,
  };
}

export default async function GlossaryTermPage({ params }: Props) {
  const { slug } = await params;
  const term = await getGlossaryTermBySlug(slug);
  if (!term) notFound();

  return (
    <div className="bg-mirai-surface-muted py-12 pt-28 md:pt-12">
      <Container>
        <Link
          href={routes.glossary() as Route}
          className="inline-flex items-center gap-2 font-semibold text-emerald-800"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          用語一覧へ戻る
        </Link>

        <article className="mt-6 rounded-2xl bg-white p-6 shadow-sm md:p-9">
          <p className="text-gray-500">{term.reading}</p>
          <h1 className="mt-1 text-3xl font-bold md:text-4xl">{term.term}</h1>

          <p className="mt-6 rounded-xl bg-emerald-50 p-5 text-lg font-semibold leading-relaxed">
            {term.short_description}
          </p>

          <section className="mt-8">
            <h2 className="text-xl font-bold">もう少し詳しく</h2>
            <p className="mt-3 whitespace-pre-wrap leading-8 text-gray-800">
              {term.description}
            </p>
          </section>

          {term.comparison_notes && (
            <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
              <h2 className="text-xl font-bold">似た言葉との違い</h2>
              <p className="mt-3 whitespace-pre-wrap leading-8 text-gray-800">
                {term.comparison_notes}
              </p>
            </section>
          )}

          {term.relatedTerms.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-bold">関連する用語</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {term.relatedTerms.map((relatedTerm) => (
                  <Link
                    key={relatedTerm.id}
                    href={routes.glossaryTerm(relatedTerm.slug) as Route}
                    className="rounded-full border border-emerald-600 px-4 py-2 font-semibold text-emerald-800"
                  >
                    {relatedTerm.term}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {term.relatedBills.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-bold">この用語が出てくる議案</h2>
              <ul className="mt-3 space-y-2">
                {term.relatedBills.map((bill) => (
                  <li key={bill.id}>
                    <Link
                      href={routes.billDetail(bill.id)}
                      className="font-semibold text-emerald-800 underline underline-offset-4"
                    >
                      {bill.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {term.source_url && (
            <p className="mt-8 border-t pt-5 text-sm">
              <a
                href={term.source_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 font-semibold underline underline-offset-4"
              >
                参考資料を確認する
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </p>
          )}
        </article>
      </Container>
    </div>
  );
}
