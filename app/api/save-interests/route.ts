import { NextRequest, NextResponse } from 'next/server';
import { saveUserInterests, getUserById } from '../../../lib/supabase';
import { sendArticleToUser } from '../../../lib/digest';

export async function POST(req: NextRequest) {
  const userId = req.cookies.get('user_id')?.value;

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  const { selections } = await req.json();

  if (!selections || selections.length === 0) {
    return NextResponse.json({ error: 'No interests provided.' }, { status: 400 });
  }

  const { error } = await saveUserInterests(userId, selections) ?? {};

  if (error) {
    return NextResponse.json({ error: 'Failed to save interests.' }, { status: 500 });
  }

  const user = await getUserById(userId);
  if (user?.phone) {
    sendArticleToUser(userId, user.phone).catch(console.error);
  }

  return NextResponse.json({ success: true });
}
