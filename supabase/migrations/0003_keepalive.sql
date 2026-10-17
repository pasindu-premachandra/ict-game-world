create table public.keepalive (
  id smallint primary key default 1 check (id = 1),
  pinged_at timestamptz not null default now()
);

alter table public.keepalive enable row level security;

revoke all on table public.keepalive from anon, authenticated;
grant all on table public.keepalive to service_role;
