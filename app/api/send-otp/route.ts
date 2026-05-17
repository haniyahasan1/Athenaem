import { NextRequest, NextResponse } from 'next/server';
import { sendOTP } from '../../../lib/twilio';

const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 3;

export async function POST(req: NextRequest) {
  const { phone } = await req.json();

  if (!phone) {
    return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 });
  }

  const normalized = '+' + phone.replace(/\D/g, '');

  const now = Date.now();
  const entry = attempts.get(normalized);

  if (entry && now < entry.resetAt) {
    if (entry.count >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { error: 'Too many attempts. Please wait 10 minutes and try again.' },
        { status: 429 }
      );
    }
    entry.count++;
  } else {
    attempts.set(normalized, { count: 1, resetAt: now + WINDOW_MS });
  }

  try {
    await sendOTP(normalized);
    return NextResponse.json({ success: true, phone: normalized });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to send code.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
