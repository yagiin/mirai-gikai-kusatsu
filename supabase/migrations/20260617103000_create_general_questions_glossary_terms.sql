CREATE TABLE public.general_questions_glossary_terms (
  general_question_id UUID NOT NULL REFERENCES public.general_questions(id) ON DELETE CASCADE,
  glossary_term_id UUID NOT NULL REFERENCES public.glossary_terms(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (general_question_id, glossary_term_id)
);

CREATE INDEX idx_general_questions_glossary_terms_term
  ON public.general_questions_glossary_terms (glossary_term_id);

ALTER TABLE public.general_questions_glossary_terms ENABLE ROW LEVEL SECURITY;

GRANT ALL PRIVILEGES ON TABLE public.general_questions_glossary_terms TO service_role;

COMMENT ON TABLE public.general_questions_glossary_terms IS '一般質問と用語解説の関連付け';
