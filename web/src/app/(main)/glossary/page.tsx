import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layouts/container";
import { GlossaryList } from "@/features/glossary/client/glossary-list";
import { getPublishedGlossaryTerms } from "@/features/glossary/server/loaders/get-published-glossary-terms";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "用語解説 | みらい議会＠草津市",
  description: "草津市議会の議案に出てくる用語を、やさしい言葉で説明します。",
};

export default async function GlossaryPage() {
  const terms = await getPublishedGlossaryTerms();

  return (
    <div className="bg-mirai-surface-muted py-12 pt-28 md:pt-12">
      <Container>
        <div className="mb-8">
          <p className="text-sm font-semibold text-emerald-700">
            市議会のことばをやさしく
          </p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">用語解説</h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-gray-700">
            議案や市議会の資料に出てくる、少しむずかしい言葉を説明します。
            議案本文で下線の付いた用語からも、このページへ移動できます。
          </p>
        </div>

        <GlossaryList terms={terms} />

        <nav className="mt-10">
          <Link
            href={routes.home()}
            className="font-semibold underline underline-offset-4"
          >
            TOPへ戻る
          </Link>
        </nav>
      </Container>
    </div>
  );
}
