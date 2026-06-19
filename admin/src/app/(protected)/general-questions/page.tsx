import { GeneralQuestionsCsvPanel } from "@/features/general-questions-csv/client/general-questions-csv-panel";
import { GeneralQuestionManager } from "@/features/general-questions/client/general-question-manager";
import { loadGeneralQuestionManagementData } from "@/features/general-questions/server/loaders/load-general-question-management-data";

export default async function GeneralQuestionsPage() {
  const data = await loadGeneralQuestionManagementData();

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-2 text-2xl font-bold">一般質問管理</h1>
      <p className="mb-8 text-sm text-gray-600">
        市議会の一般質問を、質問項目・要約・市の答弁要約・質問者コメントとして登録します。
      </p>
      <GeneralQuestionsCsvPanel />
      <GeneralQuestionManager
        questions={data.questions}
        sessions={data.sessions}
      />
    </div>
  );
}
