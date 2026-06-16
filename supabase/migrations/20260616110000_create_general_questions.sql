CREATE TABLE public.general_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diet_session_id UUID NOT NULL REFERENCES public.diet_sessions(id) ON DELETE CASCADE,
  questioner_name TEXT NOT NULL,
  questioner_group TEXT,
  question_date DATE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  answer_summary TEXT NOT NULL,
  questioner_comment TEXT,
  transcript TEXT,
  source_url TEXT,
  video_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_general_questions_session
  ON public.general_questions (diet_session_id, is_published, question_date, display_order);
CREATE INDEX idx_general_questions_published
  ON public.general_questions (is_published, question_date, display_order);

CREATE TRIGGER update_general_questions_updated_at
  BEFORE UPDATE ON public.general_questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.general_questions ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.general_questions IS '市議会の一般質問とやさしい要約';
