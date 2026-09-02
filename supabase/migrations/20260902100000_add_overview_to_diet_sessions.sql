ALTER TABLE public.diet_sessions
  ADD COLUMN overview TEXT
  CONSTRAINT diet_sessions_overview_length
  CHECK (overview IS NULL OR char_length(overview) <= 500);

COMMENT ON COLUMN public.diet_sessions.overview IS
  'トップページに掲載する会期全体の特徴・概要';
