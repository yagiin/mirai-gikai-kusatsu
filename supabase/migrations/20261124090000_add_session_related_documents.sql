ALTER TABLE public.diet_sessions
ADD COLUMN related_documents jsonb NOT NULL DEFAULT '[]'::jsonb
CHECK (jsonb_typeof(related_documents) = 'array');

ALTER TABLE public.diet_sessions ENABLE ROW LEVEL SECURITY;

COMMENT ON COLUMN public.diet_sessions.related_documents
IS '会期に紐づく議案以外の関連資料（資料名、PDFリンク、日付、公開状態）';

-- 2026年11月24日の演説後、原稿の公開許可を得た所信表明。
-- 会期が登録済みの草津市版だけに追加する。他環境に会期を新規作成しない。
UPDATE public.diet_sessions
SET related_documents = related_documents || '[{
  "title": "駒井市長 所信表明",
  "url": "/session-documents/mayor-policy-address-2026-11-24.pdf",
  "date": "2026-11-24",
  "is_published": true
}]'::jsonb
WHERE slug = 'r8-11-teireikai'
  AND NOT related_documents @> '[{"url": "/session-documents/mayor-policy-address-2026-11-24.pdf"}]'::jsonb;
