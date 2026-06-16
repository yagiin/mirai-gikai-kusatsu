import { findGeneralQuestionManagementData } from "../repositories/general-question-repository";

export async function loadGeneralQuestionManagementData() {
  return findGeneralQuestionManagementData();
}
