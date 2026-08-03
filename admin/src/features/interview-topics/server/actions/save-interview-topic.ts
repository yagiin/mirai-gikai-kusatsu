"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/auth/server/lib/auth-server";
import { routes } from "@/lib/routes";
import {
  invalidateWebCache,
  WEB_CACHE_TAGS,
} from "@/lib/utils/cache-invalidation";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import {
  type InterviewTopicFormInput,
  interviewTopicFormSchema,
} from "../../shared/types";
import {
  deleteInterviewTopicRecord,
  findInterviewTopicById,
  insertInterviewTopic,
  insertTopicInterviewConfig,
  insertTopicQuestions,
  replaceTopicQuestions,
  updateInterviewTopicRecord,
  updateTopicConfigRecord,
} from "../repositories/interview-topic-repository";

export type SaveInterviewTopicResult =
  | { success: true; data: { id: string } }
  | { success: false; error: string };

export async function createInterviewTopic(
  input: InterviewTopicFormInput
): Promise<SaveInterviewTopicResult> {
  let createdTopicId: string | null = null;
  try {
    await requireAdmin();
    const data = interviewTopicFormSchema.parse(input);

    const topic = await insertInterviewTopic({
      title: data.title,
      slug: data.slug,
      description: data.description,
      background: data.background || null,
      purpose: data.purpose || null,
    });
    createdTopicId = topic.id;

    const config = await insertTopicInterviewConfig({
      interview_topic_id: topic.id,
      name: data.configName,
      status: data.status,
      mode: data.mode,
      themes: data.themes.length ? data.themes : null,
      chat_model: data.chatModel || null,
      estimated_duration: data.estimatedDuration,
    });
    await insertTopicQuestions(config.id, data.questions);

    await invalidateGeneralInterviewCaches();
    return { success: true, data: { id: topic.id } };
  } catch (error) {
    if (createdTopicId) {
      try {
        await deleteInterviewTopicRecord(createdTopicId);
      } catch (cleanupError) {
        console.error("Failed to clean up interview topic:", cleanupError);
      }
    }
    console.error("Create interview topic error:", error);
    return {
      success: false,
      error: getErrorMessage(
        error,
        "一般テーマ型インタビューの作成中にエラーが発生しました"
      ),
    };
  }
}

export async function updateInterviewTopic(
  topicId: string,
  input: InterviewTopicFormInput
): Promise<SaveInterviewTopicResult> {
  try {
    await requireAdmin();
    const data = interviewTopicFormSchema.parse(input);
    const topic = await findInterviewTopicById(topicId);
    const config = topic?.interview_configs[0];

    if (!topic || !config) {
      return { success: false, error: "インタビューが見つかりません" };
    }

    await updateInterviewTopicRecord(topicId, {
      title: data.title,
      slug: data.slug,
      description: data.description,
      background: data.background || null,
      purpose: data.purpose || null,
    });
    await updateTopicConfigRecord(config.id, {
      name: data.configName,
      status: data.status,
      mode: data.mode,
      themes: data.themes.length ? data.themes : null,
      chat_model: data.chatModel || null,
      estimated_duration: data.estimatedDuration,
    });
    await replaceTopicQuestions(config.id, data.questions);

    await invalidateGeneralInterviewCaches();
    return { success: true, data: { id: topicId } };
  } catch (error) {
    console.error("Update interview topic error:", error);
    return {
      success: false,
      error: getErrorMessage(
        error,
        "一般テーマ型インタビューの更新中にエラーが発生しました"
      ),
    };
  }
}

async function invalidateGeneralInterviewCaches(): Promise<void> {
  revalidatePath(routes.interviews());
  await invalidateWebCache([WEB_CACHE_TAGS.INTERVIEW_CONFIGS]);
}
