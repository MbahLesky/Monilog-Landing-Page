import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../../lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Captures an email when a code is already full (the signup form switches to a
// waitlist view before any account is created).
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid request body.' }, { status: 400 });
  }

  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const code = typeof body?.code === 'string' && body.code.trim() ? body.code.trim().toUpperCase() : null;

  if (!email || !/.+@.+\..+/.test(email)) {
    return NextResponse.json({ ok: false, message: 'Please enter a valid email address.' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('waitlist').insert({ email, code });

  // 23505 = unique violation (already on the waitlist) — treat as success.
  if (error && error.code !== '23505') {
    console.error('waitlist insert failed', error);
    return NextResponse.json(
      { ok: false, message: 'Could not add you right now. Please try again.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
