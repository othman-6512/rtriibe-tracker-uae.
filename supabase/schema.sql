-- rTriibe Ops Command Board — Supabase schema
-- Run this in Supabase: SQL Editor -> New query -> paste -> Run

create table if not exists schools (
  id bigint generated always as identity primary key,
  name text not null,
  group_name text default '—',
  contact text,
  status text default 'Pending' check (status in ('Signed','Pending')),
  created_at timestamptz default now()
);

create table if not exists vacancies (
  id bigint generated always as identity primary key,
  school text not null,
  group_name text default '—',
  role text not null,
  contact text,
  status text default 'Open' check (status in ('Open','Filled','On Hold','Closed')),
  date_added date default current_date,
  created_at timestamptz default now()
);

create table if not exists pipeline (
  id bigint generated always as identity primary key,
  school text not null,
  candidate text not null,
  role text not null,
  type text default 'Permanent' check (type in ('Permanent','Supply')),
  stage text default 'Sourcing' check (stage in ('Sourcing','Submitted','Interview','Offer','Placed','Rejected')),
  note text,
  created_at timestamptz default now()
);

create table if not exists daily_log (
  id bigint generated always as identity primary key,
  log_date date default current_date,
  entry text not null,
  created_at timestamptz default now()
);

-- Row Level Security
-- This is an internal tool gated by a shared password at the app layer (not Supabase Auth),
-- so policies below allow the anon key full read/write. Anyone with your Supabase URL + anon
-- key (both public in the deployed frontend) can read/write this data. That's an acceptable
-- trade-off for a small internal desk tool, but do not put anything in here you wouldn't want
-- publicly reachable. If that trade-off is not acceptable, swap this for real Supabase Auth.

alter table schools enable row level security;
alter table vacancies enable row level security;
alter table pipeline enable row level security;
alter table daily_log enable row level security;

create policy "public read/write schools" on schools for all using (true) with check (true);
create policy "public read/write vacancies" on vacancies for all using (true) with check (true);
create policy "public read/write pipeline" on pipeline for all using (true) with check (true);
create policy "public read/write daily_log" on daily_log for all using (true) with check (true);
