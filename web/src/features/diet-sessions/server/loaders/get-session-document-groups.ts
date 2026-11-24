import "server-only";

import { publishedSessionDocuments } from "@mirai-gikai/shared/session-documents";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { findDietSessions } from "../repositories/diet-session-repository";

export const getSessionDocumentGroups = unstable_cache(
  async () => {
    const sessions = await findDietSessions();
    return sessions.filter(
      (session) =>
        publishedSessionDocuments(session.related_documents).length > 0
    );
  },
  ["session-document-groups"],
  { revalidate: 3600, tags: [CACHE_TAGS.DIET_SESSIONS] }
);
