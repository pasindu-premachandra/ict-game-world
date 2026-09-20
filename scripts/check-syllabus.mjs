/* Checks the game's content against the NIE syllabus map.
   Run: node scripts/check-syllabus.mjs
   Fails if a competency level has no activity, if an activity claims an id that does not exist,
   or if a new string is missing its Sinhala. */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];

const syllabus = JSON.parse(await readFile(join(root, 'content/syllabus-map.json'), 'utf8'));

const additions = {};
const built = {};
for (const g of [6, 7, 8, 9]) {
  additions[g] = await import(`file://${join(root, `content/grade-${g}.additions.js`).replace(/\\/g, '/')}`);
  built[g] = JSON.parse(await readFile(join(root, `data/grade-${g}.json`), 'utf8'));
}

/* Read the built data rather than re-deriving the merge: data/*.json is what
   the app actually ships, and check-data.mjs has already proved the original
   part of it is bit-identical to the source games. */
function allActivities(grade) {
  const out = new Map();
  for (const lesson of built[grade].lessons) {
    for (const a of lesson.activities) {
      const source = !a.origin ? 'original' : a.keptFrom || a.bonus ? 'kept-bonus' : 'new';
      out.set(a.id, { ...a, source });
    }
  }
  return out;
}

/* The original games' activity count, for the before column. */
function originalCount(grade) {
  return built[grade].lessons.reduce(
    (n, lesson) => n + lesson.activities.filter((a) => !a.origin).length,
    0
  ) + (built[grade].replaced ?? []).reduce((n, r) => n + (r.droppedActivities ?? 0), 0);
}

/* Walk every {en, si} pair and flag a missing or empty side. */
function checkStrings(node, path, grade) {
  if (node === null || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    node.forEach((child, i) => checkStrings(child, `${path}[${i}]`, grade));
    return;
  }
  const keys = Object.keys(node);
  if (keys.includes('en') || keys.includes('si')) {
    if (!node.en || !String(node.en).trim()) errors.push(`grade ${grade} ${path}: missing en`);
    if (!node.si || !String(node.si).trim()) errors.push(`grade ${grade} ${path}: missing si`);
    return;
  }
  for (const k of keys) checkStrings(node[k], `${path}.${k}`, grade);
}

const rows = [];
let totalActivities = 0;
let totalNew = 0;

for (const grade of [6, 7, 8, 9]) {
  const acts = allActivities(grade);
  const levels = syllabus.levels.filter(l => l.grade === grade);

  for (const level of levels) {
    if (!level.coveredBy || level.coveredBy.length === 0) {
      errors.push(`grade ${grade} competency ${level.level} has no activity`);
      continue;
    }
    for (const id of level.coveredBy) {
      if (!acts.has(id)) {
        errors.push(`grade ${grade} competency ${level.level} points at activity ${id}, which does not exist`);
      }
    }
  }

  /* Every non-bonus activity should claim a competency that exists. */
  const known = new Set(levels.map(l => l.level));
  const claimed = new Set(levels.flatMap(l => l.coveredBy));
  for (const [id, a] of acts) {
    if (a.bonus) continue;
    if (!claimed.has(id)) {
      warnings.push(`grade ${grade} activity ${id} is not listed under any competency`);
    }
    if (a.competency && !known.has(a.competency)) {
      errors.push(`grade ${grade} activity ${id} claims competency ${a.competency}, which is not in the syllabus`);
    }
  }

  const mod = additions[grade];
  checkStrings(mod.lessons ?? [], 'lessons', grade);
  checkStrings(mod.additionsToExistingLessons ?? [], 'additionsToExistingLessons', grade);
  checkStrings(mod.replacedLessons ?? [], 'replacedLessons', grade);

  const newCount = [...acts.values()].filter(a => a.source === 'new').length;
  const periods = levels.reduce((s, l) => s + l.periods, 0);
  const coveredPeriods = levels.filter(l => l.coveredBy.length > 0).reduce((s, l) => s + l.periods, 0);

  rows.push({
    grade,
    levels: levels.length,
    periods,
    coveredPeriods,
    before: originalCount(grade),
    after: acts.size,
    added: newCount
  });
  totalActivities += acts.size;
  totalNew += newCount;
}

const pad = (v, n) => String(v).padEnd(n);
const padS = (v, n) => String(v).padStart(n);

console.log('');
console.log('NIE syllabus coverage');
console.log('---------------------------------------------------------------------');
console.log(`${pad('Grade', 8)}${padS('Levels', 8)}${padS('Periods', 9)}${padS('Covered', 9)}${padS('Before', 8)}${padS('After', 7)}${padS('Added', 7)}`);
for (const r of rows) {
  console.log(
    `${pad(r.grade, 8)}${padS(r.levels, 8)}${padS(r.periods, 9)}${padS(r.coveredPeriods, 9)}${padS(r.before, 8)}${padS(r.after, 7)}${padS(r.added, 7)}`
  );
}
const t = rows.reduce((a, r) => ({
  levels: a.levels + r.levels, periods: a.periods + r.periods, covered: a.covered + r.coveredPeriods,
  before: a.before + r.before
}), { levels: 0, periods: 0, covered: 0, before: 0 });
console.log('---------------------------------------------------------------------');
console.log(`${pad('Total', 8)}${padS(t.levels, 8)}${padS(t.periods, 9)}${padS(t.covered, 9)}${padS(t.before, 8)}${padS(totalActivities, 7)}${padS(totalNew, 7)}`);
console.log('');

if (warnings.length) {
  console.log(`Warnings (${warnings.length}):`);
  for (const w of warnings) console.log(`  - ${w}`);
  console.log('');
}

if (errors.length) {
  console.error(`FAIL: ${errors.length} problem${errors.length === 1 ? '' : 's'}`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`PASS: all ${t.levels} competency levels have at least one activity, all ids resolve, every new string has en and si.`);
