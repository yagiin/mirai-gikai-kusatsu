import { Container } from "@/components/layouts/container";
import { About } from "@/components/top/about";
// 市議会運用では当面使わないため非表示。必要になったら下の呼び出しとあわせて戻す。
// import { ComingSoonSection } from "@/components/top/coming-soon-section";
import { Hero } from "@/components/top/hero";
import { TeamMirai } from "@/components/top/team-mirai";
import { BillDisclaimer } from "@/features/bills/client/components/bill-detail/bill-disclaimer";
import { BillsByTagSection } from "@/features/bills/server/components/bills-by-tag-section";
import { FeaturedBillSection } from "@/features/bills/server/components/featured-bill-section";
import { PreviousSessionSection } from "@/features/bills/server/components/previous-session-section";
import { loadHomeData } from "@/features/bills/server/loaders/load-home-data";
import { CurrentDietSession } from "@/features/diet-sessions/client/components/current-diet-session";
import { SessionOverviewSection } from "@/features/diet-sessions/server/components/session-overview-section";
import { getActiveDietSession } from "@/features/diet-sessions/server/loaders/get-active-diet-session";
import { getCurrentDietSession } from "@/features/diet-sessions/server/loaders/get-current-diet-session";
import { HomeGeneralQuestionSection } from "@/features/general-questions/server/components/home-general-question-section";
import { getPublishedGeneralQuestions } from "@/features/general-questions/server/loaders/get-published-general-questions";
import { getJapanTime } from "@/lib/utils/date";

export default async function Home() {
  const { billsByTag, featuredBills, previousSessionData } =
    await loadHomeData();

  // ゆくゆくタグ機能がマージされたらBFFに統合する
  const [currentSession, activeSession] = await Promise.all([
    getCurrentDietSession(getJapanTime()),
    getActiveDietSession(),
  ]);
  const sessionSlug =
    activeSession?.slug ??
    currentSession?.slug ??
    previousSessionData?.session.slug ??
    undefined;
  const displaySession = activeSession ?? currentSession;
  const generalQuestions = displaySession
    ? await getPublishedGeneralQuestions(displaySession.id)
    : [];

  return (
    <>
      <Hero />

      {/* 現在の会期 */}
      <CurrentDietSession session={currentSession} />

      {/* 議案一覧セクション */}
      <Container className="">
        <div className="py-10">
          <main className="flex flex-col gap-16">
            {displaySession && (
              <SessionOverviewSection session={displaySession} />
            )}

            {/* 注目の議案セクション */}
            <FeaturedBillSection
              bills={featuredBills}
              sessionSlug={sessionSlug}
            />

            {/* タグ別議案一覧セクション */}
            <BillsByTagSection billsByTag={billsByTag} />

            {/* 一般質問セクション */}
            {displaySession && (
              <HomeGeneralQuestionSection
                questions={generalQuestions}
                sessionName={displaySession.name}
              />
            )}

            {/* Coming soonセクション: 市議会運用では当面非表示 */}
            {/* <ComingSoonSection bills={comingSoonBills} /> */}
          </main>
        </div>
      </Container>

      {/* 前回の会期（Archive） */}
      {previousSessionData && (
        <div className="bg-mirai-surface-muted py-10">
          <Container>
            <PreviousSessionSection
              session={previousSessionData.session}
              bills={previousSessionData.bills}
              totalBillCount={previousSessionData.totalBillCount}
            />
          </Container>
        </div>
      )}

      <Container>
        {/* みらい議会とは セクション */}
        <About />

        {/* 運営者について */}
        <TeamMirai />

        {/* 免責事項 */}
        <BillDisclaimer />
      </Container>
    </>
  );
}
