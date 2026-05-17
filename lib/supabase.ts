import { createClient } from '@supabase/supabase-js';

// Server-side only — uses service role key, bypasses all security rules
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getUserByPhone(phone: string) {
  const { data } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('phone', phone)
    .single();
  return data;
}

export async function getUserById(id: string) {
  const { data } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  return data;
}

export async function saveUserInterests(
  userId: string,
  selections: { fieldId: string; fieldName: string; subTopic?: string }[]
) {
  // Clear old interests first so re-saves don't duplicate
  await supabaseAdmin.from('user_interests').delete().eq('user_id', userId);

  if (selections.length === 0) return;

  const rows = selections.map(s => ({
    user_id: userId,
    field_id: s.fieldId,
    field_name: s.fieldName,
    sub_topic: s.subTopic ?? null,
  }));

  return supabaseAdmin.from('user_interests').insert(rows);
}

export async function getUserInterests(userId: string) {
  const { data } = await supabaseAdmin
    .from('user_interests')
    .select('*')
    .eq('user_id', userId);
  return data ?? [];
}

export async function getUserArticles(userId: string) {
  const { data } = await supabaseAdmin
    .from('user_articles')
    .select('*, articles(*)')
    .eq('user_id', userId)
    .order('sent_at', { ascending: false });
  return data ?? [];
}
