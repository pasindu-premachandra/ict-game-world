// Grade 9's Sinhala, which has no original/ file to come from.
//
// Grades 6 to 8 ship two HTML files and merge into {en, si}. Grade 9 English
// medium has no Sinhala twin, so extract.mjs leaves si: null everywhere. This
// fills those nulls from content/grade-9.sinhala.json, keyed by the English
// string, and marks every activity it touches siDraft: true.
//
// A key that matches nothing is a hard error, the same way a stale correction
// is, so the file cannot quietly rot as the English changes underneath it.

import { readFileSync } from 'node:fs';

const FILE = 'content/grade-9.sinhala.json';

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
