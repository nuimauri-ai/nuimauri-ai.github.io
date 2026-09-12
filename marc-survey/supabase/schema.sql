-- MARC survey — Supabase setup. Paste this whole file into the SQL editor of your project and run it once.
-- It creates: the responses table, a policy that lets the public page INSERT (never read) responses,
-- and a small aggregate view the page reads to show "other doctors so far".

create table if not exists public.responses (
  id            bigint generated always as identity primary key,
  created_at    timestamptz not null default now(),
  session_id    text,
  submitted_at  timestamptz,
  q1_items      integer,
  q2_minutes    integer,
  q3_percent    integer,
  q3_label      text,
  q4_frustrations text,
  q4_other      text,
  q5_matters    text,
  q5_other      text,
  complete      boolean,
  beta          boolean,
  beta_name     text,
  beta_email    text,
  beta_role     text,
  seconds_taken integer,
  device        text,
  viewport      text,
  referrer      text,
  user_agent    text
);

alter table public.responses enable row level security;

-- the anonymous key used by the page may add rows, but cannot read, change or delete them
drop policy if exists "public can submit a response" on public.responses;
create policy "public can submit a response"
  on public.responses for insert
  to anon
  with check (true);

-- what the page is allowed to read: only these averages, never individual rows
create or replace view public.response_stats
  with (security_invoker = false) as
  select
    count(*)                       as n,
    round(avg(q1_items))           as items,
    round(avg(q2_minutes))         as minutes,
    round(avg(q3_percent))         as percent
  from public.responses
  where q1_items is not null;

grant select on public.response_stats to anon;
grant insert on public.responses to anon;
