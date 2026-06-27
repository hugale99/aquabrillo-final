create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  folio text not null unique,
  status text not null default 'preagenda_whatsapp',
  channel text not null default 'web_whatsapp',
  vehicle_id text,
  vehicle_label text,
  services jsonb not null default '[]'::jsonb,
  service_ids text[] not null default '{}'::text[],
  date date,
  date_label text,
  time text,
  estimate_price numeric not null default 0,
  estimate_minutes integer not null default 0,
  address text,
  message text,
  source text not null default 'web',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reservations_date_time_idx
  on public.reservations (date, time);

create index if not exists reservations_status_idx
  on public.reservations (status);

drop index if exists reservations_active_slot_unique_idx;

create or replace function public.create_reservation_with_capacity(
  reservation_payload jsonb,
  wash_slot_capacity integer default 2
)
returns public.reservations
language plpgsql
security definer
set search_path = public
as $$
declare
  new_date date;
  new_time text;
  new_service_ids text[];
  new_is_wash_only boolean;
  active_count integer;
  has_exclusive_reservation boolean;
  inserted_reservation public.reservations;
begin
  new_date := nullif(reservation_payload->>'date', '')::date;
  new_time := nullif(reservation_payload->>'time', '');

  select coalesce(array_agg(value), '{}'::text[])
    into new_service_ids
  from jsonb_array_elements_text(coalesce(reservation_payload->'service_ids', '[]'::jsonb)) as value;

  new_is_wash_only := cardinality(new_service_ids) = 1 and new_service_ids[1] = 'lavado';

  select
    count(*),
    coalesce(bool_or(service_ids <> array['lavado']::text[]), false)
    into active_count, has_exclusive_reservation
  from public.reservations
  where date = new_date
    and time = new_time
    and status in ('preagenda_whatsapp', 'confirmada', 'en_camino', 'en_servicio');

  if new_date is not null and new_time is not null then
    if has_exclusive_reservation
      or (not new_is_wash_only and active_count > 0)
      or (new_is_wash_only and active_count >= wash_slot_capacity) then
      raise exception 'Horario sin cupo disponible'
        using errcode = '23505';
    end if;
  end if;

  insert into public.reservations (
    folio,
    status,
    channel,
    vehicle_id,
    vehicle_label,
    services,
    service_ids,
    date,
    date_label,
    time,
    estimate_price,
    estimate_minutes,
    address,
    message,
    source
  )
  values (
    reservation_payload->>'folio',
    coalesce(reservation_payload->>'status', 'preagenda_whatsapp'),
    coalesce(reservation_payload->>'channel', 'web_whatsapp'),
    reservation_payload->>'vehicle_id',
    reservation_payload->>'vehicle_label',
    coalesce(reservation_payload->'services', '[]'::jsonb),
    new_service_ids,
    new_date,
    reservation_payload->>'date_label',
    new_time,
    coalesce((reservation_payload->>'estimate_price')::numeric, 0),
    coalesce((reservation_payload->>'estimate_minutes')::integer, 0),
    reservation_payload->>'address',
    reservation_payload->>'message',
    coalesce(reservation_payload->>'source', 'web')
  )
  returning * into inserted_reservation;

  return inserted_reservation;
end;
$$;

grant execute on function public.create_reservation_with_capacity(jsonb, integer) to anon;

alter table public.reservations enable row level security;

create policy "Allow public prebooking inserts"
  on public.reservations
  for insert
  to anon
  with check (true);

create policy "Allow public dashboard reads for MVP"
  on public.reservations
  for select
  to anon
  using (true);

create policy "Allow public status updates for MVP"
  on public.reservations
  for update
  to anon
  using (true)
  with check (true);
