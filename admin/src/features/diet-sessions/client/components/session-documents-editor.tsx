"use client";

import {
  parseSessionDocuments,
  type SessionDocument,
} from "@mirai-gikai/shared/session-documents";
import { FileText, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveSessionDocuments } from "../../server/actions/save-session-documents";

export function SessionDocumentsEditor({
  sessionId,
  value,
}: {
  sessionId: string;
  value: unknown;
}) {
  const id = useId();
  const router = useRouter();
  const [documents, setDocuments] = useState(() =>
    parseSessionDocuments(value).map((document) => ({
      ...document,
      editorId: crypto.randomUUID(),
    }))
  );
  const [saving, setSaving] = useState(false);
  const update = (index: number, patch: Partial<SessionDocument>) =>
    setDocuments((current) =>
      current.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );

  async function save() {
    setSaving(true);
    try {
      const result = await saveSessionDocuments(sessionId, documents);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("関連資料を保存しました");
        router.refresh();
      }
    } catch {
      toast.error("関連資料の保存に失敗しました");
    } finally {
      setSaving(false);
    }
  }

  return (
    <details className="mt-3 rounded-lg border p-4">
      <summary className="cursor-pointer text-sm font-semibold">
        <FileText className="mr-2 inline h-4 w-4" aria-hidden />
        会期の関連資料（{documents.length}件）
      </summary>
      <p className="mt-3 text-sm text-gray-600">
        所信表明など、議案以外の資料を登録できます。公開にした資料はトップページと会期ページに表示されます。
      </p>
      <div className="mt-4 space-y-4">
        {documents.map((document, index) => (
          <fieldset
            key={document.editorId}
            disabled={saving}
            className="space-y-3 rounded border p-3"
          >
            <legend className="px-1 text-sm">資料 {index + 1}</legend>
            <div>
              <Label htmlFor={`${id}-title-${index}`}>資料名</Label>
              <Input
                id={`${id}-title-${index}`}
                value={document.title}
                maxLength={150}
                onChange={(e) => update(index, { title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor={`${id}-url-${index}`}>原文PDFのリンク</Label>
              <Input
                id={`${id}-url-${index}`}
                value={document.url}
                placeholder="https://..."
                onChange={(e) => update(index, { url: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor={`${id}-date-${index}`}>資料の日付・演説日</Label>
              <Input
                id={`${id}-date-${index}`}
                type="date"
                value={document.date}
                onChange={(e) => update(index, { date: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <Label
                className="flex items-center gap-2"
                htmlFor={`${id}-published-${index}`}
              >
                <input
                  id={`${id}-published-${index}`}
                  type="checkbox"
                  checked={document.is_published}
                  onChange={(e) =>
                    update(index, { is_published: e.target.checked })
                  }
                />
                サイトに掲載する
              </Label>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() =>
                  setDocuments((current) =>
                    current.filter((_, i) => i !== index)
                  )
                }
              >
                <Trash2 className="mr-1 h-4 w-4" aria-hidden />
                削除
              </Button>
            </div>
          </fieldset>
        ))}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={saving || documents.length >= 10}
            onClick={() =>
              setDocuments((current) => [
                ...current,
                {
                  title: "",
                  url: "",
                  date: "",
                  is_published: false,
                  editorId: crypto.randomUUID(),
                },
              ])
            }
          >
            <Plus className="mr-1 h-4 w-4" aria-hidden />
            資料を追加
          </Button>
          <Button type="button" disabled={saving} onClick={save}>
            {saving ? "保存中..." : "関連資料を保存"}
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          最大10件。チェックを外すとサイトの一覧から非表示になります。PDF自体の公開範囲はリンク先の設定に従います。
        </p>
      </div>
    </details>
  );
}
