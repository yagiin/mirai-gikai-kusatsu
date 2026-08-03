/**
 * ページレイアウトに関するユーティリティ
 */

/** メインページ（TOP、法案詳細）かどうかを判定 */
export function isMainPage(pathname: string): boolean {
  // トップページ
  if (pathname === "/") return true;
  // 法案詳細ページ（/bills/[id]）- サブパスは除外
  if (/\/bills\/[^/]+$/.test(pathname)) return true;
  return false;
}

/** インタビューチャットページかどうかを判定 */
export function isInterviewPage(pathname: string): boolean {
  return (
    /\/bills\/[^/]+\/interview\/chat$/.test(pathname) ||
    /\/interviews\/[^/]+\/chat$/.test(pathname)
  );
}

/** インタビューセクション（LP・チャット含む）かどうかを判定 */
export function isInterviewSection(pathname: string): boolean {
  return (
    /\/bills\/[^/]+\/interview(\/|$)/.test(pathname) ||
    /\/interviews\/[^/]+(\/|$)/.test(pathname)
  );
}

export function extractInterviewTopicSlugFromPath(
  pathname: string
): string | null {
  const match = pathname.match(/\/interviews\/([^/]+)/);
  return match ? match[1] : null;
}

/** インタビューページからbillIdを抽出 */
export function extractBillIdFromPath(pathname: string): string | null {
  const match = pathname.match(/\/bills\/([^/]+)/);
  return match ? match[1] : null;
}
