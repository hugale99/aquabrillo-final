alter table public.reservations
  add column if not exists customer_name text,
  add column if not exists customer_phone text,
  add column if not exists notes text,
  add column if not exists payment_status text not null default 'pendiente',
  add column if not exists assigned_to text;

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
    customer_name,
    customer_phone,
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
    coverage,
    notes,
    payment_status,
    assigned_to,
    message,
    source
  )
  values (
    reservation_payload->>'folio',
    coalesce(reservation_payload->>'status', 'preagenda_whatsapp'),
    coalesce(reservation_payload->>'channel', 'web_whatsapp'),
    reservation_payload->>'customer_name',
    reservation_payload->>'customer_phone',
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
    coalesce(reservation_payload->'coverage', '{}'::jsonb),
    reservation_payload->>'notes',
    coalesce(reservation_payload->>'payment_status', 'pendiente'),
    reservation_payload->>'assigned_to',
    reservation_payload->>'message',
    coalesce(reservation_payload->>'source', 'web')
  )
  returning * into inserted_reservation;

  return inserted_reservation;
end;
$$;

grant execute on function public.create_reservation_with_capacity(jsonb, integer) to anon;
