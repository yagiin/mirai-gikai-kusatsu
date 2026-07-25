"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAnonymousSupabaseUserState } from "@/features/chat/client/hooks/use-anonymous-supabase-user";
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
  const { userId, isLoading, error } = useAnonymousSupabaseUserState();
  const hasRefreshed = useRef(false);

  useEffect(() => {
    if (!userId || hasRefreshed.current) {
      return;
    }

    hasRefreshed.current = true;
    const timer = window.setTimeout(() => {
      router.refresh();
    }, 300);

    return () => window.clearTimeout(timer);
  }, [router, userId]);

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-800">
            インタビューの準備に失敗しました
          </h2>
          <p className="max-w-sm text-gray-600">
            匿名ユーザーの作成に失敗しました。Supabaseの匿名ログイン設定を確認してください。
          </p>
          <p className="max-w-sm break-words rounded-lg bg-red-50 p-3 text-left text-sm text-red-700">
            {error}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="rounded-[100px] border-black font-bold"
          onClick={() => window.location.reload()}
        >
          もう一度試す
        </Button>
      </div>
    );
  }

  if (isLoading || !userId) {
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
