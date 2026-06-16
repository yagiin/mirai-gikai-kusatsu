CREATE TABLE public.glossary_terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term TEXT NOT NULL UNIQUE,
  reading TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  comparison_notes TEXT,
  aliases TEXT[] NOT NULL DEFAULT '{}',
  related_term_slugs TEXT[] NOT NULL DEFAULT '{}',
  source_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE public.bills_glossary_terms (
  bill_id UUID NOT NULL REFERENCES public.bills(id) ON DELETE CASCADE,
  glossary_term_id UUID NOT NULL REFERENCES public.glossary_terms(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (bill_id, glossary_term_id)
);

CREATE INDEX idx_glossary_terms_published
  ON public.glossary_terms (is_published, display_order, reading);
CREATE INDEX idx_bills_glossary_terms_term
  ON public.bills_glossary_terms (glossary_term_id);

CREATE TRIGGER update_glossary_terms_updated_at
  BEFORE UPDATE ON public.glossary_terms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.glossary_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills_glossary_terms ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.glossary_terms IS '市議会用語のやさしい解説';
COMMENT ON TABLE public.bills_glossary_terms IS '議案と用語解説の関連付け';

INSERT INTO public.glossary_terms (
  term,
  reading,
  slug,
  short_description,
  description,
  comparison_notes,
  aliases,
  related_term_slugs,
  is_published,
  display_order
) VALUES
  (
    '専決処分',
    'せんけつしょぶん',
    'senketsu-shobun',
    '議会の議決を待てない事情があるときに、市長が議会に代わって決定することです。',
    '本来は議会の議決が必要な事項について、緊急性が高い場合や議会を招集する時間がない場合などに、市長が先に決定する制度です。専決処分を行った後は、原則として次の議会で報告し、承認を求めます。',
    '「専決」は、この「専決処分」を短く表した言い方として使われることがあります。',
    ARRAY['専決'],
    '{}',
    true,
    10
  ),
  (
    '利用料',
    'りようりょう',
    'riyouryou',
    '施設やサービスを利用する人が支払う費用の一般的な呼び方です。',
    '施設やサービスの利用に応じて支払うお金です。法律上の決まった意味とは限らず、事業や制度ごとに誰が金額を決め、誰が受け取るかが異なります。',
    '「使用料」は自治体が条例に基づいて徴収する正式な名称として使われることがあります。一方、「利用料」は指定管理者など、自治体以外の運営者が受け取る料金を指す場合があります。実際の意味は各条例や制度の定義を優先します。',
    '{}',
    ARRAY['shiyouryou'],
    true,
    20
  ),
  (
    '使用料',
    'しようりょう',
    'shiyouryou',
    '公の施設などを使用する人から、自治体が条例に基づいて徴収するお金です。',
    '地方自治法や条例に基づき、公の施設の利用や行政財産の使用に対して自治体が徴収するお金です。対象、金額、減免などは条例で定められます。',
    '日常的には「利用料」と似た意味で使われますが、「使用料」は法令や条例上の正式な名称であることがあります。「利用料」は指定管理者などが受け取る料金を指す場合があります。',
    '{}',
    ARRAY['riyouryou'],
    true,
    30
  );
