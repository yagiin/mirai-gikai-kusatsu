"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAnonymousSupabaseUser } from "@/features/chat/client/hooks/use-anonymous-supabase-user";
import { InterviewSessionErrorView } from "./interview-session-error-view";

interface InterviewSessionAuthRetryProps {
  billId: string;
  previewToken?: string;
}

export function InterviewSessionAuthRetry({
  billId,
  previewToken,
}: InterviewSessionAuthRetryProps) {
  const router = useRouter();
  const userId = useAnonymousSupabaseUser();
  const hasRefreshed = useRef(false);

  useEffect(() => {
    if (!userId || hasRefreshed.current) {
      return;
    }

    hasRefreshed.current = true;
    router.refresh();
  }, [router, userId]);

  if (!userId) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <Loader2 className="size-8 animate-spin text-primary" />
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-800">
            インタビューを準備しています
          </h2>
          <p className="max-w-sm text-gray-600">
            初回アクセスの準備中です。数秒後に自動で再読み込みします。
          </p>
        </div>
      </div>
    );
  }

  return (
    <InterviewSessionErrorView
      billId={billId}
      previewToken={previewToken}
      message="インタビューの準備が完了しました。画面を再読み込みしてもう一度お試しください。"
    />
  );
}
