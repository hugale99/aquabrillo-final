create table if not exists public.reservation_events (
  id uuid primary key default gen_random_uuid(),
  reservation_folio text not null,
  event_type text not null,
  channel text not null default 'manual_whatsapp',
  delivery_status text not null default 'manual_opened',
  customer_phone text,
  message text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists reservation_events_folio_idx
  on public.reservation_events (reservation_folio, created_at desc);

create index if not exists reservation_events_type_idx
  on public.reservation_events (event_type);

create index if not exists reservation_events_delivery_status_idx
  on public.reservation_events (delivery_status);

alter table public.reservation_events enable row level security;

drop policy if exists "Allow public event inserts for MVP" on public.reservation_events;
create policy "Allow public event inserts for MVP"
  on public.reservation_events
  for insert
  to anon
  with check (true);

drop policy if exists "Allow public event reads for MVP" on public.reservation_events;
create policy "Allow public event reads for MVP"
  on public.reservation_events
  for select
  to anon
  using (true);
