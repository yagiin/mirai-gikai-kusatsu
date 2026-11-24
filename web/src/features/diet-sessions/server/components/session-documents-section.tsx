import "server-only";

import { publishedSessionDocuments } from "@mirai-gikai/shared/session-documents";
import { FileText } from "lucide-react";

type Props = { sessionName: string; documents: unknown };

export function SessionDocumentsSection({ sessionName, documents }: Props) {
  const published = publishedSessionDocuments(documents);
  if (!published.length) return null;

  return (
    <section
      aria-label={`${sessionName}の関連資料`}
      className="rounded-2xl border border-mirai-border-muted bg-white p-5 sm:p-8"
    >
      <p className="text-sm font-semibold text-primary-accent">{sessionName}</p>
      <h2 className="mt-1 text-xl font-bold text-mirai-text">会期の関連資料</h2>
      <ul className="mt-4 space-y-4">
        {published.map((document) => (
          <li
            key={`${document.url}-${document.title}`}
            className="flex items-start gap-3"
          >
            <FileText
              className="mt-1 h-5 w-5 shrink-0 text-primary-accent"
              aria-hidden
            />
            <div>
              <a
                href={document.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary-accent underline underline-offset-4 hover:opacity-80"
              >
                {document.title}（原文PDF・別タブで開きます）
              </a>
              <p className="mt-1 text-sm text-mirai-text-secondary">
                <time dateTime={document.date}>
                  {document.date.replaceAll("-", "/")}
                </time>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
