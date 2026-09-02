import type { DietSession } from "../../shared/types";
import { findActiveDietSession } from "../repositories/diet-session-repository";

/**
 * アクティブな国会会期を取得
 * is_active = true の会期を返す
 * アクティブな会期がない場合は null を返す
 */
export async function getActiveDietSession(): Promise<DietSession | null> {
  // 管理画面で更新した会期の概要をトップページへ即時反映するため、
  // アクティブ会期はリクエストごとに最新値を取得する。
  return findActiveDietSession();
}
