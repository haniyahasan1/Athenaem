import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';

export async function POST(req: NextRequest) {
  const userId = req.cookies.get('user_id')?.value;

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  const { name } = await req.json();

  if (!name || name.trim().length === 0) {
    return NextResponse.json({ error: 'Name cannot be empty.' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('users')
    .update({ name: name.trim() })
    .eq('id', userId);

  if (error) {
    return NextResponse.json({ error: 'Failed to save name.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
