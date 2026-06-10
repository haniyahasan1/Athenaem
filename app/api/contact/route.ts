import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, subject, message } = await req.json();

  if (!name || !message) {
    return NextResponse.json({ error: 'Name and message are required.' }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: 'Athenaem Contact <onboarding@resend.dev>',
    to: 'haniyah710@gmail.com',
    subject: subject ? `[Athenaem] ${subject}` : '[Athenaem] New message',
    text: `From: ${name}\n\n${message}`,
  });

  if (error) {
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
