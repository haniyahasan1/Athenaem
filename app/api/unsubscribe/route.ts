import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';

export async function DELETE(req: NextRequest) {
  const userId = req.cookies.get('user_id')?.value;
  if (!userId) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  await supabaseAdmin.from('users').delete().eq('id', userId);

  const res = NextResponse.json({ success: true });
  res.cookies.set('user_id', '', { maxAge: 0 });
  return res;
}
