import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { GeneralQuestionWithSession } from "../../shared/types";
import { findPublishedGeneralQuestions } from "../repositories/general-question-repository";

export async function getPublishedGeneralQuestions(
  dietSessionId?: string
): Promise<GeneralQuestionWithSession[]> {
  return _getCachedPublishedGeneralQuestions(dietSessionId);
}

const _getCachedPublishedGeneralQuestions = unstable_cache(
  async (dietSessionId?: string): Promise<GeneralQuestionWithSession[]> => {
    return findPublishedGeneralQuestions(dietSessionId);
  },
  ["published-general-questions"],
  {
    revalidate: 600,
    tags: [CACHE_TAGS.GENERAL_QUESTIONS],
  }
);
