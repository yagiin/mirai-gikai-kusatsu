import "server-only";

import { getSessionDocumentGroups } from "../loaders/get-session-document-groups";
import { SessionDocumentsSection } from "./session-documents-section";

export async function HomeSessionDocuments() {
  const sessions = await getSessionDocumentGroups();
  if (!sessions.length) return null;
  return (
    <div className="space-y-6">
      {sessions.map((session) => (
        <SessionDocumentsSection
          key={session.id}
          sessionName={session.name}
          documents={session.related_documents}
        />
      ))}
    </div>
  );
}
