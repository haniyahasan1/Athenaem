import { NextRequest, NextResponse } from 'next/server';
import { getUserById, getUserArticles } from '../../../lib/supabase';

export async function GET(req: NextRequest) {
  const userId = req.cookies.get('user_id')?.value;

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  const user = await getUserById(userId);
  const articles = await getUserArticles(userId);

  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  }

  return NextResponse.json({ user, articles });
}
