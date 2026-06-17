import { findPublishedGlossaryTermsByGeneralQuestionId } from "../repositories/glossary-repository";

export async function getGeneralQuestionGlossaryTerms(
  generalQuestionId: string
) {
  return findPublishedGlossaryTermsByGeneralQuestionId(generalQuestionId);
}
