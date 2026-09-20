// Extract the content out of the nine original games into one JSON file per
// grade. Run it with `node scripts/extract.mjs`; it only reads original/ and
// only writes data/.
//
// Grades 6, 7 and 8 have an English and a Sinhala file with identical activity
// ids, so they merge into {en, si}. Grade 9 English medium has no Sinhala
// twin, so every string there gets si: null - explicitly empty, so the gap is
// visible to the content task instead of just missing.

import { mkdirSync, writeFileSync } from 'node:fs';
import { readLessons } from './lib/read-lessons.mjs';
import { readOptionSets } from './lib/read-option-sets.mjs';
import { readAdventure } from './lib/read-adventure.mjs';
import { normalise } from './lib/normalise-adventure.mjs';
import { mergeLang, MergeError } from './lib/merge-lang.mjs';
import { applyAdditions } from './lib/apply-additions.mjs';
import { applyCorrections, correctionsFor } from './lib/apply-corrections.mjs';

const GRADES = [
  { grade: 6, en: 'original/grade-6/english.html', si: 'original/grade-6/sinhala.html' },
  { grade: 7, en: 'original/grade-7/english.html', si: 'original/grade-7/sinhala.html' },
  { grade: 8, en: 'original/grade-8/english.html', si: 'original/grade-8/sinhala.html' },
  { grade: 9, en: 'original/grade-9/english-medium.html', si: null },
];

mkdirSync('data', { recursive: true });

let failed = 0;
for (const { grade, en, si } of GRADES) {
  const lessonsEn = applyCorrections(grade, 'en', readLessons(en));
  const lessonsSi = si ? applyCorrections(grade, 'si', readLessons(si)) : null;

  if (lessonsSi && lessonsEn.length !== lessonsSi.length) {
    console.error(`grade ${grade}: ${lessonsEn.length} lessons in english, ${lessonsSi.length} in sinhala`);
    failed++;
    continue;
  }

  let lessons;
  try {
    lessons = lessonsEn.map((lesson, i) => mergeLang(lesson, lessonsSi?.[i], `lesson[${i}]`, Boolean(lessonsSi)));
  } catch (err) {
    if (!(err instanceof MergeError)) throw err;
    console.error(`grade ${grade}: ${err.message}`);
    failed++;
    continue;
  }

  const merged = await applyAdditions(grade, lessons);

  // Hotspot options live outside the LESSONS literal in the originals. They are
  // content, so they travel with the data rather than with the renderer, and
  // they sit beside `lessons` rather than inside an activity so the parity gate
  // still compares activity for activity against the original.
  const optionsEn = readOptionSets(en);
  const optionsSi = si ? readOptionSets(si) : null;
  const optionSets = {};
  for (const [id, list] of Object.entries(optionsEn)) {
    optionSets[id] = mergeLang(list, optionsSi?.[id], `optionSets.${id}`, Boolean(optionsSi));
  }

  const out = {
    grade,
    languages: si ? ['en', 'si'] : ['en'],
    source: si ? { en, si } : { en },
    replaced: merged.replaced,
    corrections: correctionsFor(grade),
    optionSets,
    lessons: merged.lessons,
  };
  writeFileSync(`data/grade-${grade}.json`, JSON.stringify(out, null, 2) + '\n');

  const activities = merged.lessons.reduce((n, l) => n + l.activities.length, 0);
  const extra = merged.added.activities
    ? ` (+${merged.added.activities} from syllabus-enrichment)`
    : '';
  const optCount = Object.keys(optionSets).length;
  const opts = optCount ? `, ${optCount} hotspot option set(s)` : '';
  console.log(`grade ${grade}: ${merged.lessons.length} lessons, ${activities} activities${extra}${opts} -> data/grade-${grade}.json`);
  merged.replaced.forEach((r) => console.log(`         lesson ${r.id} replaced: "${r.was}" -> "${r.now}"`));
  correctionsFor(grade).forEach((c) => console.log(`         corrected ${c.lang} ${c.activity} ${c.path}: "${c.from}" -> "${c.to}"`));
}

// Grade 9's second game, folded in as bonus rounds per gate D3 in redesign-trilingual.
const ADVENTURE = 'original/grade-9/ict-adventure.html';
const adventure = normalise(readAdventure(ADVENTURE));
adventure.source = { en: ADVENTURE };
writeFileSync('data/adventure-9.json', JSON.stringify(adventure, null, 2) + '\n');
const gameCount = adventure.lessons.reduce((n, l) => n + l.games.length, 0);
console.log(`adventure: ${adventure.lessons.length} lessons, ${gameCount} mini games -> data/adventure-9.json`);

process.exit(failed ? 1 : 0);
