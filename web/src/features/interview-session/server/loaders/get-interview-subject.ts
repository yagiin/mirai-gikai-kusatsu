import "server-only";

import { getBillByIdAdmin } from "@/features/bills/server/loaders/get-bill-by-id-admin";
import type { BillWithContent } from "@/features/bills/shared/types";
import type { InterviewConfig } from "@/features/interview-config/server/loaders/get-interview-config-admin";
import { findPublicInterviewTopicById } from "@/features/interview-topics/server/repositories/interview-topic-repository";
import type { InterviewTopic } from "@/features/interview-topics/shared/types";

export type InterviewSubject =
  | { type: "bill"; bill: BillWithContent; topic: null }
  | { type: "topic"; bill: null; topic: InterviewTopic };

export async function getInterviewSubject(
  config: InterviewConfig
): Promise<InterviewSubject | null> {
  if (config.bill_id) {
    const bill = await getBillByIdAdmin(config.bill_id);
    return bill ? { type: "bill", bill, topic: null } : null;
  }
  if (config.interview_topic_id) {
    const topic = await findPublicInterviewTopicById(config.interview_topic_id);
    return topic ? { type: "topic", bill: null, topic } : null;
  }
  return null;
}
