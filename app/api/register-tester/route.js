import { NextResponse } from 'next/server';
import { getAdminAuth } from '../../../lib/firebaseAdmin';
import { getSupabaseAdmin } from '../../../lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Only roll back (delete) a Firebase account that was created moments ago, so we
// never wipe a pre-existing user who is merely being back-filled into the roster.
const JUST_CREATED_MS = 5 * 60 * 1000;

function mapProvider(userRecord) {
  const providers = userRecord.providerData?.map((p) => p.providerId) ?? [];
  if (providers.includes('google.com')) return 'google';
  if (providers.includes('password')) return 'password';
  return providers[0] ?? 'unknown';
}

function wasJustCreated(userRecord) {
  const created = Date.parse(userRecord.metadata?.creationTime ?? '');
  if (Number.isNaN(created)) return false;
  return Date.now() - created < JUST_CREATED_MS;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ status: 'error', message: 'Invalid request body.' }, { status: 400 });
  }

  const { idToken, code } = body ?? {};
  if (!idToken || typeof idToken !== 'string') {
    return NextResponse.json({ status: 'error', message: 'Missing auth token.' }, { status: 401 });
  }

  const auth = getAdminAuth();
  const supabase = getSupabaseAdmin();

  let decoded;
  try {
    decoded = await auth.verifyIdToken(idToken);
  } catch {
    return NextResponse.json({ status: 'error', message: 'Invalid or expired session.' }, { status: 401 });
  }

  const uid = decoded.uid;

  let userRecord;
  try {
    userRecord = await auth.getUser(uid);
  } catch {
    return NextResponse.json({ status: 'error', message: 'Account not found.' }, { status: 404 });
  }

  const email = userRecord.email ?? decoded.email ?? '';
  const name = userRecord.displayName ?? decoded.name ?? null;
  const provider = mapProvider(userRecord);
  const normalizedCode = typeof code === 'string' && code.trim() ? code.trim().toUpperCase() : null;

  const { data, error } = await supabase.rpc('register_tester', {
    p_uid: uid,
    p_email: email,
    p_name: name,
    p_code: normalizedCode,
    p_provider: provider
  });

  if (error) {
    console.error('register_tester RPC failed', error);
    return NextResponse.json(
      { status: 'error', message: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }

  const status = data?.status;
  const org = data?.org ?? null;

  if (status === 'ok' || status === 'already_registered') {
    // Stamp attribution onto the Firebase account so it travels into the app.
    // Merge with existing claims so a returning user keeps theirs; general
    // (codeless) testers just get { beta: true }.
    try {
      const claims = { ...(userRecord.customClaims ?? {}), beta: true };
      if (org) claims.org = org;
      if (normalizedCode) claims.code = normalizedCode;
      await auth.setCustomUserClaims(uid, claims);
    } catch (claimError) {
      console.error('Failed to set custom claims', claimError);
      // Best-effort: the tester row already exists; claims can be re-applied later.
    }
    return NextResponse.json({ status: 'ok', org });
  }

  // invalid_code or full: remove the just-created account so no orphan remains.
  const deleted = wasJustCreated(userRecord);
  if (deleted) {
    try {
      await auth.deleteUser(uid);
    } catch (deleteError) {
      console.error('Failed to delete rejected user', deleteError);
    }
  }

  if (status === 'full') {
    if (email) {
      const { error: waitlistError } = await supabase
        .from('waitlist')
        .insert({ email, code: normalizedCode });
      // 23505 = unique violation (already on the waitlist); anything else we log.
      if (waitlistError && waitlistError.code !== '23505') {
        console.error('Failed to add to waitlist', waitlistError);
      }
    }
    return NextResponse.json({ status: 'full', org, deleted });
  }

  return NextResponse.json({ status: 'invalid_code', deleted });
}
