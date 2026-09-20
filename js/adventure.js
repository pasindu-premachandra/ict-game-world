// The 18 ICT Adventure mini games, folded into the grade 9 lesson path as
// bonus rounds (gate D3 in redesign-trilingual, gate O1 in adventure-set).
//
// The adventure file keeps its own shape - lessons[].games[] with a `kind` -
// while the rest of the app speaks lessons[].activities[] with a `type`.
// Rather than teach the router a second shape, each game is normalised into an
// activity here, so the existing screen, scoring and reward code all work on it
// without knowing it came from a different file.

const FILE = 'data/adventure-9.json';

const KINDS = { mcQuiz: 'mcquiz', sortGame: 'sortgame', memoryGame: 'memory' };

// Adventure ids are c1, p2, so3. Prefixed, they can never be confused with a
// numbered competency activity, in a URL or in the scores table. The prefix is
// also what submit_score() allows, see supabase/migrations/0002.
export const PREFIX = 'adv-';

let cache = null;

export async function loadAdventure() {
  if (!cache) {
    const res = await fetch(FILE);
    if (!res.ok) throw new Error('cannot load the adventure set');
    cache = await res.json();
  }
  return cache;
}

function toActivity(game, set) {
  const { id, kind, name, desc, icon, ...payload } = game;
  return {
    ...payload,
    id: PREFIX + id,
    type: KINDS[kind],
    name,
    instruction: desc,
    icon,
    // Read by the lesson path to mark the row, and by nothing else.
    bonus: true,
    setTitle: set.title,
  };
}

// Set 01 belongs to grade 9 lesson 1, set 02 to lesson 2, and so on - the six
// themes line up with the first six lessons exactly. Lesson 7, "ICT All Around
// Us", has no set, so it gets nothing rather than a leftover.
export function bonusFor(data, lessonId) {
  const set = data.lessons.find((l) => Number(l.num) === lessonId);
  return set ? set.games.map((g) => toActivity(g, set)) : [];
}

export function findActivity(data, id) {
  for (const set of data.lessons) {
    const hit = set.games.find((g) => PREFIX + g.id === id);
    if (hit) return toActivity(hit, set);
  }
  return null;
}
