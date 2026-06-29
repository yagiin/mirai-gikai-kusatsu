"use client";

import { Download, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { importBillsCsv } from "../server/actions/import-bills-csv";

const ALL_SESSIONS_VALUE = "__all_sessions__";

interface BillsCsvPanelProps {
  sessions: Array<{
    id: string;
    name: string;
    slug: string | null;
  }>;
}

export function BillsCsvPanel({ sessions }: BillsCsvPanelProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedSessionSlug, setSelectedSessionSlug] =
    useState(ALL_SESSIONS_VALUE);

  const downloadHref =
    selectedSessionSlug === ALL_SESSIONS_VALUE
      ? "/api/bills/csv"
      : `/api/bills/csv?session_slug=${encodeURIComponent(
          selectedSessionSlug
        )}`;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !window.confirm("CSVの内容で議案を一括登録・更新します。よろしいですか？")
    ) {
      return;
    }
    setIsImporting(true);

    try {
      const result = await importBillsCsv(new FormData(event.currentTarget));
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(
        `CSVを反映しました（新規${result.created}件・更新${result.updated}件）`
      );
      formRef.current?.reset();
      router.refresh();
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <section className="mb-6 rounded-lg border bg-white p-5">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold">CSV一括登録・更新</h2>
          <p className="mt-1 text-sm text-gray-600">
            CSVをダウンロードして編集し、アップロードすると一括反映できます。
            idが空欄の行は新規登録、idがある行は更新されます。
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="w-full sm:w-72">
              <label
                htmlFor="bills-csv-session"
                className="mb-1 block text-sm font-medium"
              >
                ダウンロードする会期
              </label>
              <Select
                value={selectedSessionSlug}
                onValueChange={setSelectedSessionSlug}
              >
                <SelectTrigger id="bills-csv-session">
                  <SelectValue placeholder="会期を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_SESSIONS_VALUE}>
                    すべての会期
                  </SelectItem>
                  {sessions
                    .filter((session) => session.slug)
                    .map((session) => (
                      <SelectItem key={session.id} value={session.slug ?? ""}>
                        {session.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" asChild className="lg:w-fit">
              <a href={downloadHref} download>
                <Download className="mr-2 size-4" />
                議案CSVをダウンロード
              </a>
            </Button>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-end"
          >
            <div className="flex-1">
              <label
                htmlFor="bills-csv-file"
                className="mb-1 block text-sm font-medium"
              >
                編集したCSV
              </label>
              <Input
                id="bills-csv-file"
                name="file"
                type="file"
                accept=".csv,text/csv"
                required
                disabled={isImporting}
              />
            </div>
            <Button type="submit" disabled={isImporting}>
              <Upload className="mr-2 size-4" />
              {isImporting ? "確認・反映中..." : "CSVをアップロード"}
            </Button>
          </form>
        </div>

        <div className="rounded-md bg-gray-50 p-3 text-xs leading-5 text-gray-600">
          <p>
            originating_typeは市長提出ならmayor、議員提出ならmemberを入力します。
          </p>
          <p>
            session_slugには会期管理で設定した値（例:
            r8-6-teireikai）を入力します。
          </p>
          <p>
            submitted_dateは2026-06-08または2026/6/8の形式で入力できます。
          </p>
          <p>
            committee_nameには所管委員会名を入力します。未設定の場合は空欄にしてください。
          </p>
          <p>
            is_featuredとis_review_completedはtrue/false、TRUE/FALSE、1/0を入力できます。
          </p>
          <p>
            初回登録は、ダウンロードしたCSVのidを空欄にして行を追加してください。
          </p>
          <p>CSVに含まれていない既存の議案は削除されません。</p>
        </div>
      </div>
    </section>
  );
}
