// The test suite. Run it with `node scripts/check-data.mjs`.
//
// The real check is reversibility: rebuild each language's view out of the
// merged JSON and deep-compare it against the original file it came from. If
// the rebuilt tree is identical, extraction cannot have dropped or altered a
// lesson, an activity, an option or an answer. Everything else here is a
// report, not a gate.

import { readFileSync } from 'node:fs';
import { readLessons } from './lib/read-lessons.mjs';
import { readAdventure } from './lib/read-adventure.mjs';
import { denormalise } from './lib/normalise-adventure.mjs';
import { applyCorrections, correctionsFor } from './lib/apply-corrections.mjs';

const GRADES = [
  { grade: 6, en: 'original/grade-6/english.html', si: 'original/grade-6/sinhala.html' },
  { grade: 7, en: 'original/grade-7/english.html', si: 'original/grade-7/sinhala.html' },
  { grade: 8, en: 'original/grade-8/english.html', si: 'original/grade-8/sinhala.html' },
  { grade: 9, en: 'original/grade-9/english-medium.html', si: null },
];

// Keys whose value is human copy. Used only to spot strings that look
// untranslated, never to decide what gets merged.
const COPY_KEYS = new Set(['title', 'name', 'instruction', 'text', 'l', 'r', 'meaning', 'q', 's', 'hint']);

const isPair = (v) => v && typeof v === 'object' && !Array.isArray(v)
  && Object.keys(v).length === 2 && 'en' in v && 'si' in v;

function view(node, lang) {
  if (isPair(node)) return node[lang];
  if (Array.isArray(node)) return node.map((v) => view(v, lang));
  if (node && typeof node === 'object') {
    return Object.fromEntries(
      Object.entries(node)
        .filter(([k]) => k !== 'siDraft')
        .map(([k, v]) => [k, view(v, lang)]),
    );
  }
  return node;
}

function diff(a, b, path = '', out = []) {
  if (out.length >= 10) return out;
  const ta = Array.isArray(a) ? 'array' : a === null ? 'null' : typeof a;
  const tb = Array.isArray(b) ? 'array' : b === null ? 'null' : typeof b;
  if (ta !== tb) { out.push(`${path}: rebuilt is ${ta}, original is ${tb}`); return out; }
  if (ta === 'array') {
    if (a.length !== b.length) out.push(`${path}: rebuilt has ${a.length} items, original has ${b.length}`);
    for (let i = 0; i < Math.min(a.length, b.length); i++) diff(a[i], b[i], `${path}[${i}]`, out);
    return out;
  }
  if (ta === 'object') {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      if (!(k in a)) { out.push(`${path}.${k}: missing from rebuilt`); continue; }
      if (!(k in b)) { out.push(`${path}.${k}: not in original`); continue; }
      diff(a[k], b[k], path ? `${path}.${k}` : k, out);
    }
    return out;
  }
  if (a !== b) out.push(`${path}: rebuilt ${JSON.stringify(a)}, original ${JSON.stringify(b)}`);
  return out;
}

function scanStrings(node, path, gaps, suspect, key = null) {
  if (isPair(node)) {
    if (node.si === null) gaps.push(path);
    else if (node.en === node.si) suspect.push(`${path} = ${JSON.stringify(node.en).slice(0, 60)}`);
    return;
  }
  if (Array.isArray(node)) return node.forEach((v, i) => scanStrings(v, `${path}[${i}]`, gaps, suspect, key));
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) scanStrings(v, path ? `${path}.${k}` : k, gaps, suspect, k);
    return;
  }
  if (typeof node === 'string' && COPY_KEYS.has(key) && node.trim()) {
    suspect.push(`${path} = ${JSON.stringify(node).slice(0, 60)}`);
  }
}

let failures = 0;
const notes = [];

for (const { grade, en, si } of GRADES) {
  const data = JSON.parse(readFileSync(`data/grade-${grade}.json`, 'utf8'));
  const langs = si ? ['en', 'si'] : ['en'];
  const sources = { en, si };
  const problems = [];

  // Anything syllabus-enrichment added or replaced is stripped before the
  // comparison, so this still proves every original activity is untouched.
  const replacedIds = new Set((data.replaced ?? []).map((r) => r.id));
  const untouched = data.lessons
    .filter((l) => !l.origin && !replacedIds.has(l.id))
    .map((l) => ({ ...l, activities: l.activities.filter((a) => !a.origin) }));

  for (const lang of langs) {
    const rebuilt = view(untouched, lang);
    // The same corrections extract.mjs applied, so the gate compares against
    // what we deliberately changed and still catches everything we did not.
    const original = applyCorrections(grade, lang, readLessons(sources[lang]))
      .filter((l) => !replacedIds.has(l.id));
    const d = diff(rebuilt, original, `grade-${grade}.${lang}`);
    if (d.length) problems.push(...d);
  }

  const activities = data.lessons.reduce((n, l) => n + l.activities.length, 0);
  const ids = data.lessons.flatMap((l) => l.activities.map((a) => a.id));
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) problems.push(`duplicate activity ids: ${[...new Set(dupes)].join(', ')}`);

  const gaps = [];
  const suspect = [];
  scanStrings(data.lessons, 'lessons', gaps, suspect);
  scanStrings(data.optionSets ?? {}, 'optionSets', gaps, suspect);

  if (problems.length) {
    failures++;
    console.log(`FAIL  grade ${grade}  ${problems.length} parity problem(s)`);
    problems.slice(0, 10).forEach((p) => console.log(`        ${p}`));
  } else {
    const added = data.lessons.reduce((n, l) => n + l.activities.filter((a) => a.origin).length, 0);
    const kept = activities - added;
    console.log(`ok    grade ${grade}  ${data.lessons.length} lessons, ${activities} activities (${kept} original + ${added} new), ${langs.join(' + ')} original rebuild matches exactly`);
    (data.replaced ?? []).forEach((r) => console.log(`        lesson ${r.id} deliberately replaced: "${r.was}" -> "${r.now}"`));
    correctionsFor(grade).forEach((c) => console.log(`        ${c.lang} ${c.activity} ${c.path} deliberately corrected: "${c.from}" -> "${c.to}"${c.draft ? ' (drafted, awaiting review)' : ''}`));
  }
  if (gaps.length) notes.push(`grade ${grade}: ${gaps.length} strings have no Sinhala yet`);
  if (suspect.length) notes.push(`grade ${grade}: ${suspect.length} strings read the same in both languages (may be untranslated, may just be a term like "CPU")`);
}

// ICT Adventure: same reversibility check, against the shape readAdventure returns.
{
  const data = JSON.parse(readFileSync('data/adventure-9.json', 'utf8'));
  const d = diff(denormalise(data), readAdventure('original/grade-9/ict-adventure.html'), 'adventure');
  const games = data.lessons.reduce((n, l) => n + l.games.length, 0);
  if (d.length) {
    failures++;
    console.log(`FAIL  adventure  ${d.length} parity problem(s)`);
    d.slice(0, 10).forEach((p) => console.log(`        ${p}`));
  } else {
    console.log(`ok    adventure  ${data.lessons.length} lessons, ${games} mini games, rebuild matches original exactly`);
  }
  const gaps = [];
  const suspect = [];
  scanStrings(data.lessons, 'lessons', gaps, suspect);
  if (gaps.length) notes.push(`adventure: ${gaps.length} strings have no Sinhala yet`);
}

if (notes.length) {
  console.log('\nTranslation notes (not failures):');
  notes.forEach((n) => console.log(`  - ${n}`));
}

console.log(failures ? `\n${failures} grade(s) failed parity.` : '\nAll grades match their originals.');
process.exit(failures ? 1 : 0);
