drop policy if exists "Allow public dashboard reads for MVP" on public.reservations;
drop policy if exists "Allow public status updates for MVP" on public.reservations;

create policy "Allow authenticated dashboard reads"
  on public.reservations
  for select
  to authenticated
  using (true);

create policy "Allow authenticated reservation updates"
  on public.reservations
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Allow public event inserts for MVP" on public.reservation_events;
drop policy if exists "Allow public event reads for MVP" on public.reservation_events;

create policy "Allow authenticated event inserts"
  on public.reservation_events
  for insert
  to authenticated
  with check (true);

create policy "Allow authenticated event reads"
  on public.reservation_events
  for select
  to authenticated
  using (true);
