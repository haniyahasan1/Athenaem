import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';
import { fetchArticlesForInterest } from '../../../lib/articles';
import { generateHook } from '../../../lib/claude';
import { sendSMS } from '../../../lib/twilio';

async function runDigest() {

  // Get all users
  const { data: users, error: usersError } = await supabaseAdmin
    .from('users')
    .select('id, phone');

  if (usersError || !users) {
    return NextResponse.json({ error: 'Failed to fetch users.' }, { status: 500 });
  }

  const results = [];

  for (const user of users) {
    try {
      // Get this user's interests
      const { data: interests } = await supabaseAdmin
        .from('user_interests')
        .select('field_id, field_name, sub_topic')
        .eq('user_id', user.id);

      if (!interests || interests.length === 0) continue;

      // Get articles already sent to this user
      const { data: sentArticles } = await supabaseAdmin
        .from('user_articles')
        .select('article_id');

      const sentIds = new Set((sentArticles ?? []).map((r: { article_id: string }) => r.article_id));

      // Pick a random interest to feature this week
      const interest = interests[Math.floor(Math.random() * interests.length)];

      // Fetch candidate articles for that interest
      const candidates = await fetchArticlesForInterest(
        interest.field_id,
        interest.sub_topic ?? undefined
      );

      if (candidates.length === 0) continue;

      // Find an article not already sent, or fall back to any
      const unsent = candidates.filter(a => !sentIds.has(a.url));
      const chosen = unsent.length > 0
        ? unsent[Math.floor(Math.random() * unsent.length)]
        : candidates[0];

      // Generate Claude hook
      const hook = await generateHook(chosen.title, chosen.abstract);

      // Save article to articles table (upsert by url)
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
      if (!savedArticle) { console.error('No savedArticle returned'); continue; }

      // Link article to user
      await supabaseAdmin.from('user_articles').insert({
        user_id: user.id,
        article_id: savedArticle.id,
      });

      // Build and send SMS
      const base = process.env.NEXT_PUBLIC_BASE_URL;
      const articleLink = base ? `\n\n${base}/read/${savedArticle.id}` : '';
      const sms = `Athenaem: ${hook}\n\n"${chosen.title}"${articleLink}`;
      await sendSMS(user.phone, sms);

      results.push({ phone: user.phone, article: chosen.title, status: 'sent' });
    } catch (err) {
      results.push({ phone: user.phone, status: 'error', error: String(err) });
    }
  }

  return NextResponse.json({ success: true, results });
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  return runDigest();
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  return runDigest();
}
