import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP } from '../../../lib/twilio';
import { sendSMS } from '../../../lib/twilio';
import { supabaseAdmin } from '../../../lib/supabase';

export async function POST(req: NextRequest) {
  const { phone, code } = await req.json();

  if (!phone || !code) {
    return NextResponse.json({ error: 'Phone and code are required.' }, { status: 400 });
  }

  try {
    const result = await verifyOTP(phone, code);

    if (result.status !== 'approved') {
      return NextResponse.json({ error: 'Incorrect code. Please try again.' }, { status: 400 });
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('phone', phone)
      .single();

    let userId: string;
    let isNewUser: boolean;

    if (existingUser) {
      userId = existingUser.id;
      isNewUser = false;
    } else {
      const { count } = await supabaseAdmin
        .from('users')
        .select('*', { count: 'exact', head: true });

      if ((count ?? 0) >= 100) {
        return NextResponse.json({ error: 'We\'re at capacity right now. Stay tuned.' }, { status: 403 });
      }

      const { data: newUser, error } = await supabaseAdmin
        .from('users')
        .insert({ phone })
        .select('id')
        .single();

      if (error || !newUser) {
        return NextResponse.json({ error: 'Failed to create account.' }, { status: 500 });
      }

      userId = newUser.id;
      isNewUser = true;

      sendSMS(phone, `Welcome to Athenaem. Your first article arrives this week — expect something that makes you think differently.\n\nathenaem.app`).catch(() => {});
    }

    const response = NextResponse.json({ success: true, isNewUser });

    response.cookies.set('user_id', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Verification failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
