// The publishable key is meant to be in client code. It is not a secret: what
// protects the data is row level security plus submit_score(), both of which
// are in supabase/migrations/0001_init.sql. The service role key must never
// appear anywhere in this folder.

export const SUPABASE_URL = 'https://vjyypzmnbyfjbudusava.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_kRkFrHQhutA4Nt5tg_ZLwQ_Q6aNZguE';

export const AVATARS = ['bot', 'cat', 'owl', 'fox', 'star', 'rocket', 'leaf', 'wave'];
