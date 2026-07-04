create table if not exists public.reservation_payments (
  id uuid primary key default gen_random_uuid(),
  reservation_folio text not null,
  amount_mxn numeric not null default 0,
  method text not null default 'efectivo',
  reference text,
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  notes text,
  created_by text,
  paid_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists reservation_payments_folio_idx
  on public.reservation_payments (reservation_folio, paid_at desc);

create index if not exists reservation_payments_paid_at_idx
  on public.reservation_payments (paid_at desc);

alter table public.reservation_payments
  add column if not exists stripe_checkout_session_id text,
  add column if not exists stripe_payment_intent_id text;

alter table public.reservation_payments enable row level security;

drop policy if exists "Allow authenticated payment inserts" on public.reservation_payments;
create policy "Allow authenticated payment inserts"
  on public.reservation_payments
  for insert
  to authenticated
  with check (true);

drop policy if exists "Allow authenticated payment reads" on public.reservation_payments;
create policy "Allow authenticated payment reads"
  on public.reservation_payments
  for select
  to authenticated
  using (true);
