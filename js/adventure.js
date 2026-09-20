// Bonus mini games, for every grade.
//
// Grade 9's come from the ICT Adventure game (six themed sets, 18 games) that
// was folded in as bonus rounds by gate D3 in redesign-trilingual. Grades 6 to
// 8 have their own, in content/bonus-games.json, because the adventure set is
// grade 9 content and there was nothing spare to give them.
//
// The two files have different shapes and neither matches the
// lessons[].activities[] shape the rest of the app speaks, so both are
// normalised into an activity here. Everything downstream - the activity
// screen, store.js, leaderboard.js, the reward layer - then works on them
// without knowing where they came from.

const ADVENTURE_FILE = 'data/adventure-9.json';
const BONUS_FILE = 'data/bonus.json';

const KINDS = { mcQuiz: 'mcquiz', sortGame: 'sortgame', memoryGame: 'memory' };

// Adventure ids are c1, p2, so3; the authored ones are bq6, bs7, bm8. Prefixed,
// none can be confused with a numbered competency activity, in a URL or in the
// scores table. The prefix is also what submit_score() allows, see
// supabase/migrations/0002.
export const PREFIX = 'adv-';

const cache = new Map();

async function load(file) {
  if (!cache.has(file)) {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`cannot load ${file}`);
    cache.set(file, await res.json());
  }
  return cache.get(file);
}

function toActivity(game, set) {
  const { id, kind, name, desc, icon, lesson, ...payload } = game;
  return {
    ...payload,
    id: PREFIX + id,
    type: KINDS[kind],
    name,
    instruction: desc,
    icon,
    // Which lesson this is a bonus round for. The adventure sets carry it as
    // their set number - set 01 belongs to grade 9 lesson 1 - and the authored
    // games say so outright.
    lesson: set ? Number(set.num) : lesson,
    bonus: true,
    setTitle: set?.title ?? null,
  };
}

// Every bonus game a grade has, in activity shape, each carrying its lesson.
export async function bonusGames(grade) {
  if (grade === 9) {
    const data = await load(ADVENTURE_FILE);
    return data.lessons.flatMap((set) => set.games.map((game) => toActivity(game, set)));
  }
  const data = await load(BONUS_FILE);
  return (data.grades?.[String(grade)] ?? []).map((game) => toActivity(game, null));
}

export async function findBonus(grade, id) {
  return (await bonusGames(grade)).find((activity) => activity.id === id) ?? null;
}
