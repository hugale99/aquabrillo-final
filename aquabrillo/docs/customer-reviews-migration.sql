create table if not exists public.customer_reviews (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text,
  vehicle text,
  service text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  comment text not null,
  publication_consent boolean not null default true,
  status text not null default 'pending' check (status in ('pending', 'approved', 'hidden')),
  source text not null default 'web_review_form',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists customer_reviews_status_idx
  on public.customer_reviews (status, created_at desc);

create index if not exists customer_reviews_public_idx
  on public.customer_reviews (status, publication_consent, created_at desc);

alter table public.customer_reviews enable row level security;

drop policy if exists "Allow public review inserts" on public.customer_reviews;
create policy "Allow public review inserts"
  on public.customer_reviews
  for insert
  to anon
  with check (status = 'pending');

drop policy if exists "Allow public approved review reads" on public.customer_reviews;
create policy "Allow public approved review reads"
  on public.customer_reviews
  for select
  to anon
  using (status = 'approved' and publication_consent = true);

drop policy if exists "Allow authenticated review reads" on public.customer_reviews;
create policy "Allow authenticated review reads"
  on public.customer_reviews
  for select
  to authenticated
  using (true);

drop policy if exists "Allow authenticated review updates" on public.customer_reviews;
create policy "Allow authenticated review updates"
  on public.customer_reviews
  for update
  to authenticated
  using (true)
  with check (true);
