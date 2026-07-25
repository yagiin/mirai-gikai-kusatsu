"use client";

import { MessageSquareMore } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExpertRegistrationBannerProps {
  onRegisterClick: () => void;
}

export function ExpertRegistrationBanner({
  onRegisterClick,
}: ExpertRegistrationBannerProps) {
  return (
    <div className="bg-mirai-light-gradient rounded-2xl border border-primary p-6 flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <span className="inline-flex items-center justify-center rounded-2xl bg-primary text-white px-4 py-2 text-sm font-medium w-fit">
          議案に詳しい方へ
        </span>
        <div className="flex flex-col gap-2.5">
          <h3 className="text-lg font-bold text-gray-800">
            有識者リストにご登録ください
          </h3>
          <p className="text-[15px] text-gray-800">
            現場の知見を議案に活かすため、登録をいただいた方には、今後みらいと維新の風から追加のインタビューをお願いする場合があります。
          </p>
        </div>
      </div>
      <Button variant="outline" onClick={onRegisterClick} className="w-full">
        <MessageSquareMore className="size-6" />
        有識者リストに登録する
      </Button>
    </div>
  );
}
