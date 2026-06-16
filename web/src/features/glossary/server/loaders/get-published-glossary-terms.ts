import { findPublishedGlossaryTerms } from "../repositories/glossary-repository";

export async function getPublishedGlossaryTerms() {
  return findPublishedGlossaryTerms();
}
