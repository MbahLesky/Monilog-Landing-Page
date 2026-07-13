import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../../lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Soft pre-check for the signup form. With a code it reports whether that code is
// valid and still has room; without one it reports whether the general (codeless)
// pool is still open. The authoritative, race-free check happens in the
// register_tester RPC — this only powers instant UI feedback and never exposes
// raw counts or the code list.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get('code');
  const code = raw && raw.trim() ? raw.trim().toUpperCase() : null;

  const supabase = getSupabaseAdmin();

  if (!code) {
    const { data: settings, error: settingsError } = await supabase
      .from('beta_settings')
      .select('general_max_testers')
      .eq('id', 1)
      .maybeSingle();

    if (settingsError) {
      console.error('beta-status settings lookup failed', settingsError);
      return NextResponse.json({ general: null, error: true }, { status: 500 });
    }

    const max = settings?.general_max_testers ?? null;
    if (max == null) {
      return NextResponse.json({ general: { open: true } });
    }

    const { count, error: countError } = await supabase
      .from('testers')
      .select('firebase_uid', { count: 'exact', head: true })
      .is('code', null);

    if (countError) {
      console.error('beta-status general count failed', countError);
      return NextResponse.json({ general: null, error: true }, { status: 500 });
    }

    return NextResponse.json({ general: { open: (count ?? 0) < max } });
  }

  const { data: codeRow, error: codeError } = await supabase
    .from('beta_codes')
    .select('organisation_name, max_testers, active')
    .eq('code', code)
    .maybeSingle();

  if (codeError) {
    console.error('beta-status lookup failed', codeError);
    return NextResponse.json({ code: null, error: true }, { status: 500 });
  }

  if (!codeRow || !codeRow.active) {
    return NextResponse.json({ code: { valid: false, org: null, open: false } });
  }

  const { count, error: countError } = await supabase
    .from('testers')
    .select('firebase_uid', { count: 'exact', head: true })
    .eq('code', code);

  if (countError) {
    console.error('beta-status count failed', countError);
    return NextResponse.json({ code: null, error: true }, { status: 500 });
  }

  const open = (count ?? 0) < codeRow.max_testers;
  return NextResponse.json({
    code: { valid: true, org: codeRow.organisation_name, open }
  });
}
