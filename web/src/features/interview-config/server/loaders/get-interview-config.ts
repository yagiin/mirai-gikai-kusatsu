import type { Database } from "@mirai-gikai/supabase";
import { findPublicInterviewConfigByBillId } from "../repositories/interview-config-repository";

export type InterviewConfig =
  Database["public"]["Tables"]["interview_configs"]["Row"];

export async function getInterviewConfig(
  billId: string
): Promise<InterviewConfig | null> {
  const { data, error } = await findPublicInterviewConfigByBillId(billId);

  if (error) {
    // レコードが存在しない場合はnullを返す（エラーではない）
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Failed to fetch interview config:", error);
    return null;
  }

  return data;
}
