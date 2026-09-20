// Grade 9's Sinhala, which has no original/ file to come from.
//
// Grades 6 to 8 ship two HTML files and merge into {en, si}. Grade 9 English
// medium has no Sinhala twin, so extract.mjs leaves si: null everywhere. This
// fills those nulls from content/grade-9.sinhala.json, keyed by the English
// string, and marks every activity it touches siDraft: true.
//
// A key that matches nothing is a hard error, the same way a stale correction
// is, so the file cannot quietly rot as the English changes underneath it.

import { existsSync, readFileSync } from 'node:fs';

const FILE = 'content/grade-9.sinhala.json';
const SCRATCH_FILE = 'content/scratch.sinhala.json';
const ADVENTURE_FILE = 'content/adventure-9.sinhala.json';

export class SinhalaError extends Error {}

const isPair = (v) => v && typeof v === 'object' && !Array.isArray(v) && 'en' in v && 'si' in v;

function fill(node, table, used) {
  if (node === null || typeof node !== 'object') return 0;
  if (Array.isArray(node)) return node.reduce((n, v) => n + fill(v, table, used), 0);
  if (isPair(node)) {
    if (node.si !== null) return 0;
    const si = table[node.en];
    if (si === undefined) return 0;
    node.si = si;
    used.add(node.en);
    return 1;
  }
  return Object.values(node).reduce((n, v) => n + fill(v, table, used), 0);
}

export function sinhalaFor(grade) {
  if (grade !== 9) return null;
  return JSON.parse(readFileSync(FILE, 'utf8'));
}

// The same check every table gets: fill what it can, then refuse a key that
// matched nothing, so the file cannot rot as the English changes underneath it.
function fillOrThrow(node, table, file, what) {
  const used = new Set();
  const n = fill(node, table, used);
  const stale = Object.keys(table).filter((k) => !used.has(k));
  if (stale.length) {
    throw new SinhalaError(
      `${file}: ${what} has ${stale.length} key(s) matching no untranslated string: ${stale.map((s) => JSON.stringify(s.slice(0, 40))).join(', ')}`
    );
  }
  return n;
}

// Fills lessons in place and returns what it did, so extract.mjs can report it.
export function applySinhala(grade, lessons, optionSets) {
  const overlay = sinhalaFor(grade);
  if (!overlay) return null;

  const activities = lessons.flatMap((l) => l.activities);
  let filled = 0;
  const drafted = [];

  for (const [id, title] of Object.entries(overlay.lessons ?? {})) {
    const lesson = lessons.find((l) => String(l.id) === id);
    if (!lesson) throw new SinhalaError(`${FILE}: no lesson ${id}`);
    if (!isPair(lesson.title)) throw new SinhalaError(`${FILE}: lesson ${id} title is not an {en, si} pair`);
    if (lesson.title.si === null) { lesson.title.si = title; filled++; }
  }

  for (const [id, table] of Object.entries(overlay.activities ?? {})) {
    const activity = activities.find((a) => a.id === id);
    if (!activity) throw new SinhalaError(`${FILE}: no activity ${id}`);
    const used = new Set();
    const n = fill(activity, table, used);
    const stale = Object.keys(table).filter((k) => !used.has(k));
    if (stale.length) {
      throw new SinhalaError(
        `${FILE}: activity ${id} has ${stale.length} key(s) matching no untranslated string: ${stale.map((s) => JSON.stringify(s.slice(0, 40))).join(', ')}`
      );
    }
    if (n) { filled += n; drafted.push(id); activity.siDraft = true; }
  }

  for (const [id, table] of Object.entries(overlay.optionSets ?? {})) {
    const list = optionSets[id];
    if (!list) throw new SinhalaError(`${FILE}: no option set ${id}`);
    const used = new Set();
    filled += fill(list, table, used);
    const stale = Object.keys(table).filter((k) => !used.has(k));
    if (stale.length) {
      throw new SinhalaError(
        `${FILE}: optionSets ${id} has ${stale.length} key(s) matching no untranslated string: ${stale.map((s) => JSON.stringify(s.slice(0, 40))).join(', ')}`
      );
    }
  }

  return { filled, drafted, draft: overlay.draft === true };
}

// The Scratch Code Builder, which has no Sinhala original either. Keyed by
// structure id, one flat table per structure covering its own title and desc
// and every puzzle name and description inside it. The block text is not in
// the overlay at all: it is Scratch's own block language and stays English.
export function applyScratchSinhala(structures) {
  if (!existsSync(SCRATCH_FILE)) return null;
  const overlay = JSON.parse(readFileSync(SCRATCH_FILE, 'utf8'));

  let filled = 0;
  const drafted = [];
  for (const [id, table] of Object.entries(overlay.structures ?? {})) {
    const structure = structures.find((s) => s.id === id);
    if (!structure) throw new SinhalaError(`${SCRATCH_FILE}: no structure ${id}`);
    const n = fillOrThrow(structure, table, SCRATCH_FILE, `structure ${id}`);
    if (n) { filled += n; drafted.push(id); structure.siDraft = true; }
  }
  return { filled, drafted, draft: overlay.draft === true };
}

// The ICT Adventure set. Its originals carry Sinhala for the lesson titles and
// the quiz questions but not for anything a child answers with, so the options,
// the sort items, the bin labels and the memory pairs come from here. Keyed by
// game id; the overlay says which strings it deliberately leaves in English.
export function applyAdventureSinhala(lessons) {
  if (!existsSync(ADVENTURE_FILE)) return null;
  const overlay = JSON.parse(readFileSync(ADVENTURE_FILE, 'utf8'));

  const games = lessons.flatMap((l) => l.games);
  let filled = 0;
  const drafted = [];
  for (const [id, table] of Object.entries(overlay.games ?? {})) {
    const game = games.find((g) => g.id === id);
    if (!game) throw new SinhalaError(`${ADVENTURE_FILE}: no game ${id}`);
    const n = fillOrThrow(game, table, ADVENTURE_FILE, `game ${id}`);
    if (n) { filled += n; drafted.push(id); game.siDraft = true; }
  }
  return { filled, drafted, draft: overlay.draft === true };
}
