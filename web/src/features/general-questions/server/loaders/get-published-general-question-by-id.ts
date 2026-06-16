import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { GeneralQuestionWithSession } from "../../shared/types";
import { findPublishedGeneralQuestionById } from "../repositories/general-question-repository";

export async function getPublishedGeneralQuestionById(
  id: string
): Promise<GeneralQuestionWithSession | null> {
  return _getCachedPublishedGeneralQuestionById(id);
}

const _getCachedPublishedGeneralQuestionById = unstable_cache(
  async (id: string): Promise<GeneralQuestionWithSession | null> => {
    return findPublishedGeneralQuestionById(id);
  },
  ["published-general-question-by-id"],
  {
    revalidate: 600,
    tags: [CACHE_TAGS.GENERAL_QUESTIONS],
  }
);
