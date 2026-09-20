-- ICT Game World - class leaderboard.
--
-- Every player here is a schoolchild under 16, which is the child threshold in
-- Sri Lanka's PDPA No. 9 of 2022, so this stores a nickname, an avatar key and
-- an optional class code, and nothing else. No real names, no contact details,
-- no device fingerprint beyond an id the browser makes up for itself.
--
-- Anonymous callers can read the leaderboard and nothing else. They cannot
-- insert, update or delete: every write goes through submit_score(), which
-- validates its arguments and keeps only a player's best score per activity.

create table public.players (
  id          uuid primary key,
  nickname    text not null check (char_length(nickname) between 1 and 20),
  avatar      text not null check (avatar in ('bot','cat','owl','fox','star','rocket','leaf','wave')),
  class_code  text check (class_code is null or char_length(class_code) between 1 and 12),
  created_at  timestamptz not null default now()
);

create table public.scores (
  player_id   uuid not null references public.players (id) on delete cascade,
  grade       smallint not null check (grade between 6 and 9),
  activity_id text not null check (char_length(activity_id) <= 12),
  points      smallint not null check (points between 0 and 100),
  updated_at  timestamptz not null default now(),
  primary key (player_id, grade, activity_id)
);

create index scores_grade_idx on public.scores (grade);
create index players_class_idx on public.players (class_code) where class_code is not null;

alter table public.players enable row level security;
alter table public.scores  enable row level security;

-- Read is open: a leaderboard is meant to be seen, and it holds nothing beyond
-- what it displays. Write is closed - there is deliberately no insert, update
-- or delete policy, so the only way in is submit_score() below.
create policy players_read on public.players for select to anon, authenticated using (true);
create policy scores_read  on public.scores  for select to anon, authenticated using (true);

create or replace function public.submit_score(
  p_player     uuid,
  p_nickname   text,
  p_avatar     text,
  p_class_code text,
  p_grade      int,
  p_activity   text,
  p_points     int
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_nickname text := nullif(btrim(p_nickname), '');
  v_class    text := nullif(btrim(upper(coalesce(p_class_code, ''))), '');
begin
  if p_player is null then
    raise exception 'player id is required';
  end if;
  if v_nickname is null or char_length(v_nickname) > 20 then
    raise exception 'nickname must be 1 to 20 characters';
  end if;
  if p_avatar not in ('bot','cat','owl','fox','star','rocket','leaf','wave') then
    raise exception 'unknown avatar';
  end if;
  if v_class is not null and char_length(v_class) > 12 then
    raise exception 'class code must be 12 characters or fewer';
  end if;
  if p_grade is null or p_grade < 6 or p_grade > 9 then
    raise exception 'grade must be between 6 and 9';
  end if;
  if p_activity is null or p_activity !~ '^[0-9]{1,2}\.[0-9]{1,2}$' then
    raise exception 'activity id must look like 1.2';
  end if;
  if p_points is null or p_points < 0 or p_points > 100 then
    raise exception 'points must be between 0 and 100';
  end if;

  insert into public.players (id, nickname, avatar, class_code)
  values (p_player, v_nickname, p_avatar, v_class)
  on conflict (id) do update
    set nickname = excluded.nickname,
        avatar = excluded.avatar,
        class_code = excluded.class_code;

  -- Best score only, so replaying an activity can never lose a student points.
  insert into public.scores (player_id, grade, activity_id, points)
  values (p_player, p_grade::smallint, p_activity, p_points::smallint)
  on conflict (player_id, grade, activity_id) do update
    set points = greatest(public.scores.points, excluded.points),
        updated_at = now()
    where excluded.points > public.scores.points;
end;
$$;

revoke all on function public.submit_score(uuid, text, text, text, int, text, int) from public;
grant execute on function public.submit_score(uuid, text, text, text, int, text, int) to anon, authenticated;

create view public.leaderboard_grade with (security_invoker = true) as
  select p.id as player_id,
         p.nickname,
         p.avatar,
         p.class_code,
         s.grade,
         sum(s.points)::int as points,
         count(*)::int as activities_done,
         max(s.updated_at) as last_played
  from public.players p
  join public.scores s on s.player_id = p.id
  group by p.id, p.nickname, p.avatar, p.class_code, s.grade;

create view public.leaderboard_class with (security_invoker = true) as
  select * from public.leaderboard_grade where class_code is not null;

grant select on public.leaderboard_grade, public.leaderboard_class to anon, authenticated;
