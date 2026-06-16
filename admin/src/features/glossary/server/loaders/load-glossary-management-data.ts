import { findGlossaryManagementData } from "../repositories/glossary-repository";

export async function loadGlossaryManagementData() {
  return findGlossaryManagementData();
}
