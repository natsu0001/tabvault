
export type Bookmark = {
  id: string;
  user_id: string;
  title: string;
  url: string;
  description: string | null;
  favicon_url: string | null;
  category_id: string | null;
  collection_id: string | null;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
};

