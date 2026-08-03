import { Clock3, MessageSquareText, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { GeneralInterviewStartButton } from "../../client/components/general-interview-start-button";
import type { InterviewTopic } from "../../shared/types";

export function GeneralInterviewLandingPage({
  topic,
  config,
  hasActiveSession,
}: {
  topic: InterviewTopic;
  config: {
    estimated_duration: number | null;
    themes: string[] | null;
  };
  hasActiveSession: boolean;
}) {
  return (
    <div className="bg-mirai-light-gradient px-4 py-10">
      <div className="mx-auto flex max-w-[640px] flex-col gap-8">
        <section className="space-y-5 text-center">
          <span className="inline-flex rounded-full bg-primary px-5 py-1 text-sm font-medium text-white">
            一般テーマ型AIインタビュー
          </span>
          <h1 className="text-3xl font-bold leading-relaxed text-mirai-text">
            {topic.title}
          </h1>
          <p className="text-base leading-8 text-mirai-text-secondary">
            {topic.description}
          </p>
          <GeneralInterviewStartButton
            topicId={topic.id}
            slug={topic.slug}
            label={hasActiveSession ? "AIインタビューを再開する" : undefined}
          />
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <Feature
            icon={<MessageSquareText className="size-6" />}
            text="AIが回答を丁寧に深掘り"
          />
          <Feature
            icon={<ShieldCheck className="size-6" />}
            text="個人情報は入力しないでください"
          />
          <Feature
            icon={<Clock3 className="size-6" />}
            text={
              config.estimated_duration
                ? `目安 ${config.estimated_duration}分`
                : "ご自身のペースで回答"
            }
          />
        </section>

        {topic.purpose ? (
          <InfoSection title="インタビューの目的">
            <p>{topic.purpose}</p>
          </InfoSection>
        ) : null}

        {config.themes?.length ? (
          <InfoSection title="お伺いするテーマ">
            <ul className="list-disc space-y-2 pl-5">
              {config.themes.map((theme) => (
                <li key={theme}>{theme}</li>
              ))}
            </ul>
          </InfoSection>
        ) : null}

        <InfoSection title="回答の取り扱い">
          <p>
            回答は、みらいと維新の風の市政調査・政策検討に活用します。回答後に公開を許可するか選択できます。
          </p>
        </InfoSection>
      </div>
    </div>
  );
}

function Feature({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm font-medium sm:flex-col sm:text-center">
      <span className="text-primary">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function InfoSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white p-6">
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      <div className="leading-8 text-mirai-text-secondary">{children}</div>
    </section>
  );
}
