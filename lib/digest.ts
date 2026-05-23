import { supabaseAdmin } from './supabase';
import { fetchArticlesForInterest } from './articles';
import { generateHook } from './claude';
import { sendSMS } from './twilio';

export async function sendArticleToUser(userId: string, phone: string): Promise<boolean> {
  const { data: interests } = await supabaseAdmin
    .from('user_interests')
    .select('field_id, field_name, sub_topic')
    .eq('user_id', userId);

  if (!interests || interests.length === 0) return false;

  const { data: sentArticles } = await supabaseAdmin
    .from('user_articles')
    .select('article_id')
    .eq('user_id', userId);

  const sentIds = new Set((sentArticles ?? []).map((r: { article_id: string }) => r.article_id));

  const interest = interests[Math.floor(Math.random() * interests.length)];

  const candidates = await fetchArticlesForInterest(
    interest.field_id,
    interest.sub_topic ?? undefined
  );

  if (candidates.length === 0) return false;

  const unsent = candidates.filter(a => !sentIds.has(a.url));
  const chosen = unsent.length > 0
    ? unsent[Math.floor(Math.random() * unsent.length)]
    : candidates[0];

  const hook = await generateHook(chosen.title, chosen.abstract);

  const { data: savedArticle, error: upsertError } = await supabaseAdmin
    .from('articles')
    .upsert(
      {
        title: chosen.title,
        url: chosen.url,
        field: interest.field_name,
        sub_topic: interest.sub_topic ?? null,
        source: chosen.source,
        abstract: chosen.abstract,
        ai_hook: hook,
        published_at: chosen.publishedAt?.match(/^\d{4}-\d{2}/) ? chosen.publishedAt : null,
      },
      { onConflict: 'url' }
    )
    .select('id')
    .single();

  if (upsertError) console.error('Upsert error:', upsertError);
  if (!savedArticle) return false;

  await supabaseAdmin.from('user_articles').insert({
    user_id: userId,
    article_id: savedArticle.id,
  });

  const base = process.env.NEXT_PUBLIC_BASE_URL;
  const articleLink = base ? `\n\n${base}/read/${savedArticle.id}` : '';
  const sms = `Athenaem: ${hook}\n\n"${chosen.title}"${articleLink}`;
  await sendSMS(phone, sms);

  return true;
}
