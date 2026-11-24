import { SessionBillsPage } from "@/features/diet-sessions/server/components/session-bills-page";
import { getDietSessionBySlug } from "@/features/diet-sessions/server/loaders/get-diet-session-by-slug";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const session = await getDietSessionBySlug(slug);

  if (!session) {
    return { title: "市議会の会期が見つかりません" };
  }

  return {
    title: `${session.name}の議案一覧 | みらい議会＠草津市`,
    description: `${session.name}（${session.start_date}〜${session.end_date}）に提出された議案の一覧です。`,
  };
}

export default async function DietSessionBillsPage({ params }: Props) {
  const { slug } = await params;
  return <SessionBillsPage slug={slug} />;
}
