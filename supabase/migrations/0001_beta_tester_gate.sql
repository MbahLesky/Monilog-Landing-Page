-- Beta tester gate: optional org/referral codes + per-code caps, plus a
-- configurable cap for codeless "general" testers.
--
-- Run once in the Supabase SQL editor. Only the service-role key (used by the
-- Next.js API routes) touches these tables; RLS is enabled with no policies so
-- the anon/public key can read nothing here.

-- Codes partners hand to their testers. `code` is the value a tester enters
-- (stored uppercased, e.g. 'LEADERS').
create table if not exists beta_codes (
  code              text primary key,
  organisation_name text not null,
  max_testers       int not null check (max_testers >= 0),
  type              text not null default 'organization', -- 'organization' | 'individual'
  active            boolean not null default true,
  created_at        timestamptz not null default now()
);

-- One registered tester per Firebase user. `code`/`org_name` are null for
-- general (codeless) testers; when set they point at a real code.
create table if not exists testers (
  firebase_uid text primary key,
  email        text not null,
  name         text,
  code         text references beta_codes(code),        -- null = general tester
  org_name     text,                                    -- denormalized snapshot
  provider     text,                                    -- 'password' | 'google'
  created_at   timestamptz not null default now()
);
create unique index if not exists testers_email_unique on testers (lower(email));
create index if not exists testers_code_idx on testers (code);

-- Single-row config for the general (codeless) tester cap, adjustable live.
create table if not exists beta_settings (
  id                  int primary key default 1 check (id = 1),
  general_max_testers int not null,
  created_at          timestamptz not null default now()
);
insert into beta_settings (id, general_max_testers) values (1, 200)
  on conflict (id) do nothing;

-- People who tried to register when a code (or the general pool) was full.
create table if not exists waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  code       text,
  created_at timestamptz not null default now()
);
create unique index if not exists waitlist_email_unique on waitlist (lower(email));

-- Atomic registration: apply the right cap (per-code for coded testers, the
-- general cap for codeless ones) and insert as one serialized unit. The advisory
-- lock makes count-check-then-insert race-free.
--
-- Returns { status, org? } where status is one of
--   'ok' | 'already_registered' | 'invalid_code' | 'full'
create or replace function register_tester(
  p_uid      text,
  p_email    text,
  p_name     text,
  p_code     text,
  p_provider text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code     text := nullif(upper(trim(p_code)), '');
  v_org      text;
  v_max      int;
  v_active   boolean;
  v_count    int;
  v_existing testers%rowtype;
begin
  -- Serialize registrations so cap enforcement is race-free.
  perform pg_advisory_xact_lock(778866);

  -- Idempotent: an already-registered user returns their existing attribution.
  select * into v_existing from testers where firebase_uid = p_uid;
  if found then
    return jsonb_build_object('status', 'already_registered', 'org', v_existing.org_name);
  end if;

  if v_code is null then
    -- General (codeless) tester: enforce the configurable general cap.
    select general_max_testers into v_max from beta_settings where id = 1;
    select count(*) into v_count from testers where code is null;
    if v_max is not null and v_count >= v_max then
      return jsonb_build_object('status', 'full');
    end if;

    insert into testers (firebase_uid, email, name, code, org_name, provider)
    values (p_uid, p_email, p_name, null, null, p_provider);
    return jsonb_build_object('status', 'ok', 'org', null);
  end if;

  -- Coded tester: validate the code, then enforce that code's cap.
  select organisation_name, max_testers, active
    into v_org, v_max, v_active
    from beta_codes
   where code = v_code;

  if v_org is null or not v_active then
    return jsonb_build_object('status', 'invalid_code');
  end if;

  select count(*) into v_count from testers where code = v_code;
  if v_count >= v_max then
    return jsonb_build_object('status', 'full');
  end if;

  insert into testers (firebase_uid, email, name, code, org_name, provider)
  values (p_uid, p_email, p_name, v_code, v_org, p_provider);

  return jsonb_build_object('status', 'ok', 'org', v_org);
end;
$$;

-- Lock the tables down: no policies means no anon/public access. The service
-- role bypasses RLS, so the API routes still work.
alter table beta_codes    enable row level security;
alter table testers       enable row level security;
alter table beta_settings enable row level security;
alter table waitlist      enable row level security;

-- Seed partner codes (edit before running). Example:
-- insert into beta_codes (code, organisation_name, max_testers, type) values
--   ('LEADERS',  'Leaders Book Club', 50, 'organization'),
--   ('BAUHAVEN', 'Bauhaven',          50, 'organization'),
--   ('PARTNER1', 'Jane Doe (partner)', 10, 'individual');
