import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '../../../lib/supabase';

export async function GET(req: NextRequest) {
  const userId = req.cookies.get('user_id')?.value;
  if (!userId) return NextResponse.json(null);

  const user = await getUserById(userId);
  if (!user) return NextResponse.json(null);

  return NextResponse.json({ name: user.name ?? null, phone: user.phone });
}
