import { readFileSync } from 'node:fs';

// content/bonus-games.json is hand-authored, unlike everything else in data/,
// which is lifted out of the original games and proved against them. Nothing
// upstream can catch a mistake in it, so it is validated here instead: a wrong
// `ans` index or a bin nobody sorts into would otherwise ship as a game a child
// cannot win.

const KINDS = new Set(['mcQuiz', 'sortGame', 'memoryGame']);

// submit_score() accepts "adv-" plus this, see supabase/migrations/0002.
const ID = /^[a-z]{1,3}[0-9]{1,2}$/;

export class BonusError extends Error {}

const fail = (where, message) => { throw new BonusError(`${where}: ${message}`); };

const isPair = (v) => v && typeof v === 'object' && !Array.isArray(v) && 'en' in v;

// A string a child reads is either {en, si} or a plain string when it says the
// same thing in both languages ("Ctrl+C", "1010", "Windows").
function copy(value, where, gaps) {
  if (typeof value === 'string') {
    if (!value.trim()) fail(where, 'is empty');
    return;
  }
  if (!isPair(value)) fail(where, 'must be a string or {en, si}');
  if (typeof value.en !== 'string' || !value.en.trim()) fail(where, 'has no english');
  if (value.si === null || value.si === undefined || !String(value.si).trim()) gaps.push(where);
}

export function readBonus(file, lessonsByGrade = null) {
  const doc = JSON.parse(readFileSync(file, 'utf8'));
  const seen = new Set();
  const gaps = [];
  const out = {};

  for (const [grade, games] of Object.entries(doc.grades)) {
    if (!Array.isArray(games) || !games.length) fail(`grade ${grade}`, 'has no games');
    out[grade] = games;

    for (const game of games) {
      const at = `grade ${grade} ${game.id}`;
      if (!ID.test(game.id ?? '')) fail(at, `id must match ${ID} so submit_score accepts "adv-${game.id}"`);
      if (seen.has(game.id)) fail(at, 'duplicate id');
      seen.add(game.id);
      if (!KINDS.has(game.kind)) fail(at, `unknown kind "${game.kind}"`);
      copy(game.name, `${at}.name`, gaps);
      copy(game.desc, `${at}.desc`, gaps);
      if (typeof game.icon !== 'string' || !game.icon) fail(at, 'needs an icon');

      // The lesson it is a bonus round for has to exist in that grade.
      const lessons = lessonsByGrade?.[grade];
      if (lessons && !lessons.includes(game.lesson)) {
        fail(at, `lesson ${game.lesson} is not a grade ${grade} lesson (have ${lessons.join(', ')})`);
      }

      if (game.kind === 'mcQuiz') {
        if (!game.questions?.length) fail(at, 'has no questions');
        game.questions.forEach((q, i) => {
          copy(q.q, `${at}.questions[${i}].q`, gaps);
          if (!Array.isArray(q.opts) || q.opts.length < 2) fail(`${at}.questions[${i}]`, 'needs at least 2 options');
          q.opts.forEach((o, j) => copy(o, `${at}.questions[${i}].opts[${j}]`, gaps));
          if (!Number.isInteger(q.ans) || q.ans < 0 || q.ans >= q.opts.length) {
            fail(`${at}.questions[${i}]`, `ans ${q.ans} is not one of its ${q.opts.length} options`);
          }
        });
      }

      if (game.kind === 'sortGame') {
        if (!game.bins?.length) fail(at, 'has no bins');
        const bins = new Set();
        game.bins.forEach((b, i) => {
          if (!b.id) fail(`${at}.bins[${i}]`, 'needs an id');
          if (bins.has(b.id)) fail(`${at}.bins[${i}]`, `duplicate bin id "${b.id}"`);
          bins.add(b.id);
          copy(b.name, `${at}.bins[${i}].name`, gaps);
        });
        if (!game.items?.length) fail(at, 'has no items');
        const used = new Set();
        game.items.forEach((item, i) => {
          if (!bins.has(item.bin)) fail(`${at}.items[${i}]`, `bin "${item.bin}" is not one of its bins`);
          used.add(item.bin);
          copy(item.name, `${at}.items[${i}].name`, gaps);
        });
        // A bin nobody sorts into is a distractor with no answer behind it.
        for (const id of bins) if (!used.has(id)) fail(at, `nothing sorts into bin "${id}"`);
      }

      if (game.kind === 'memoryGame') {
        if (!game.pairs || game.pairs.length < 2) fail(at, 'needs at least 2 pairs');
        game.pairs.forEach((p, i) => {
          copy(p.a, `${at}.pairs[${i}].a`, gaps);
          copy(p.b, `${at}.pairs[${i}].b`, gaps);
        });
      }
    }
  }

  return { games: out, gaps, meta: { origin: doc.origin, drafted: doc.drafted, siDraft: Boolean(doc.siDraft) } };
}
