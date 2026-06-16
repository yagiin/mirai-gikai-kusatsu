import { findPublishedGlossaryTermsByBillId } from "../repositories/glossary-repository";

export async function getBillGlossaryTerms(billId: string) {
  return findPublishedGlossaryTermsByBillId(billId);
}
