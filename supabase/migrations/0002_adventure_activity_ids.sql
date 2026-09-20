-- Gate O3 in the adventure-set task: bonus games count toward the class
-- leaderboard like any other activity.
--
-- submit_score() validates the activity id against '^[0-9]{1,2}\.[0-9]{1,2}$',
-- which every syllabus activity matches ("1.2") and no adventure game does.
-- Their ids are letters plus a digit - c1, p2, so3 - and the client sends them
-- prefixed, as "adv-c1", so they are obvious in the table and can never be
-- mistaken for a numbered competency activity.
--
-- Without this the insert is refused, pushScore() queues the score, and it
-- retries forever. The scores table itself needs no change: activity_id is
-- already text with char_length <= 12, and "adv-so3" is 7.

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
  if p_avatar is null or char_length(p_avatar) > 16 then
    raise exception 'avatar key is required';
  end if;
  if v_class is not null and char_length(v_class) > 12 then
    raise exception 'class code must be 12 characters or fewer';
  end if;
  if p_grade is null or p_grade < 6 or p_grade > 9 then
    raise exception 'grade must be between 6 and 9';
  end if;
  -- "1.2" for a syllabus activity, "adv-c1" for an ICT Adventure bonus game.
  if p_activity is null
     or p_activity !~ '^([0-9]{1,2}\.[0-9]{1,2}|adv-[a-z]{1,3}[0-9]{1,2})$' then
    raise exception 'activity id must look like 1.2 or adv-c1';
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
