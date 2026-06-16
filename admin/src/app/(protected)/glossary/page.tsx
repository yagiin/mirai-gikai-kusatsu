import { GlossaryManager } from "@/features/glossary/client/glossary-manager";
import { loadGlossaryManagementData } from "@/features/glossary/server/loaders/load-glossary-management-data";

export default async function GlossaryPage() {
  const data = await loadGlossaryManagementData();

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-2 text-2xl font-bold">用語解説管理</h1>
      <p className="mb-8 text-sm text-gray-600">
        市議会で使われる言葉をやさしく説明し、関連する議案を設定します。
      </p>
      <GlossaryManager terms={data.terms} bills={data.bills} />
    </div>
  );
}
