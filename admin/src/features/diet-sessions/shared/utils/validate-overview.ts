const MAX_OVERVIEW_LENGTH = 500;

export function validateOverview(overview: string | null): string | null {
  if (overview && overview.trim().length > MAX_OVERVIEW_LENGTH) {
    return `この議会の特徴・概要は${MAX_OVERVIEW_LENGTH}文字以内で入力してください`;
  }

  return null;
}
