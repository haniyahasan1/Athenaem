import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';
import { sendArticleToUser } from '../../../lib/digest';

const MAX_PUSHES = 5;

export async function POST(req: NextRequest) {
  const userId = req.cookies.get('user_id')?.value;
  if (!userId) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('phone, push_count')
    .eq('id', userId)
    .single();

  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  if ((user.push_count ?? 0) >= MAX_PUSHES) {
    return NextResponse.json({ error: 'You have used all 5 of your push credits.' }, { status: 403 });
  }

  const sent = await sendArticleToUser(userId, user.phone);
  if (!sent) return NextResponse.json({ error: 'No articles available. Try again shortly.' }, { status: 500 });

  await supabaseAdmin
    .from('users')
    .update({ push_count: (user.push_count ?? 0) + 1 })
    .eq('id', userId);

  return NextResponse.json({ success: true, remaining: MAX_PUSHES - (user.push_count ?? 0) - 1 });
}
