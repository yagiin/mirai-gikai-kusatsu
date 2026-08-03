"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InterviewConsentModal } from "@/features/interview-config/client/components/interview-consent-modal";
import { routes } from "@/lib/routes";

export function GeneralInterviewStartButton({
  topicId,
  slug,
  label = "AIインタビューをはじめる",
}: {
  topicId: string;
  slug: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="h-12 w-full rounded-full border border-black bg-mirai-gradient px-6 font-bold text-black"
      >
        <Image
          src="/icons/messages-square-icon.svg"
          alt=""
          width={24}
          height={24}
        />
        {label}
        <ArrowRight className="size-5" />
      </Button>
      <InterviewConsentModal
        open={open}
        onOpenChange={setOpen}
        billId={topicId}
        destinationHref={routes.interviewTopicChat(slug)}
      />
    </>
  );
}
