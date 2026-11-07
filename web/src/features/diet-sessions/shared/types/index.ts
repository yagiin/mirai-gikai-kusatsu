export type DietSession = {
  id: string;
  name: string;
  slug: string | null;
  shugiin_url: string | null;
  start_date: string;
  end_date: string;
  is_active: boolean;
  overview: string | null;
  created_at: string;
  updated_at: string;
};
