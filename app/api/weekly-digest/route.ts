import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';
import { sendArticleToUser } from '../../../lib/digest';

async function runDigest() {
  const { data: users, error: usersError } = await supabaseAdmin
    .from('users')
    .select('id, phone');

  if (usersError || !users) {
    return NextResponse.json({ error: 'Failed to fetch users.' }, { status: 500 });
  }

  const results = [];

  for (const user of users) {
    try {
      const sent = await sendArticleToUser(user.id, user.phone);
      results.push({ userId: user.id, status: sent ? 'sent' : 'skipped' });
    } catch (err) {
      results.push({ userId: user.id, status: 'error', error: String(err) });
    }
  }

  return NextResponse.json({ success: true, results });
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  return runDigest();
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret');
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  return runDigest();
}
