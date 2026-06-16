import type { GlossaryTermDetail } from "../../shared/types";
import {
  findPublishedBillsByGlossaryTermId,
  findPublishedGlossaryTermBySlug,
  findPublishedGlossaryTermsBySlugs,
} from "../repositories/glossary-repository";

export async function getGlossaryTermBySlug(
  slug: string
): Promise<GlossaryTermDetail | null> {
  const term = await findPublishedGlossaryTermBySlug(slug);
  if (!term) return null;

  const [relatedTerms, relatedBills] = await Promise.all([
    findPublishedGlossaryTermsBySlugs(term.related_term_slugs),
    findPublishedBillsByGlossaryTermId(term.id),
  ]);

  return {
    ...term,
    relatedTerms,
    relatedBills,
  };
}
