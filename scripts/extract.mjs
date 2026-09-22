// Extract the content out of the nine original games into one JSON file per
// grade. Run it with `node scripts/extract.mjs`; it only reads original/ and
// only writes data/.
//
// Grades 6, 7 and 8 have an English and a Sinhala file with identical activity
// ids, so they merge into {en, si}. Grade 9 English medium has no Sinhala
// twin, so every string there starts as si: null - explicitly empty, so the
// gap is visible to the content task instead of just missing - and is then
// filled from content/grade-9.sinhala.json by apply-sinhala.mjs.

import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { readLessons } from './lib/read-lessons.mjs';
import { readOptionSets } from './lib/read-option-sets.mjs';
import { readScratch } from './lib/read-scratch.mjs';
import { readAdventure } from './lib/read-adventure.mjs';
import { readBonus, BonusError } from './lib/read-bonus.mjs';
import { normalise } from './lib/normalise-adventure.mjs';
import { mergeLang, MergeError } from './lib/merge-lang.mjs';
import { applyAdditions } from './lib/apply-additions.mjs';
import { applyCorrections, applyTermCorrections, correctionsFor } from './lib/apply-corrections.mjs';
import { applySinhala, applyScratchSinhala, applyAdventureSinhala, SinhalaError } from './lib/apply-sinhala.mjs';

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
  const lessonsSi = si ? applyTermCorrections(grade, 'si', applyCorrections(grade, 'si', readLessons(si))) : null;

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
  const optionsSi = si ? applyTermCorrections(grade, 'si', readOptionSets(si)) : null;
  const optionSets = {};
  for (const [id, list] of Object.entries(optionsEn)) {
    optionSets[id] = mergeLang(list, optionsSi?.[id], `optionSets.${id}`, Boolean(optionsSi));
  }

  // Grade 9 has no Sinhala original, so its Sinhala comes from content/
  // instead of from a second HTML file.
  let drafted = null;
  try {
    drafted = applySinhala(grade, merged.lessons, optionSets);
  } catch (err) {
    if (!(err instanceof SinhalaError)) throw err;
    console.error(`grade ${grade}: ${err.message}`);
    failed++;
    continue;
  }

  const out = {
    grade,
    languages: si || drafted?.filled ? ['en', 'si'] : ['en'],
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
  correctionsFor(grade).forEach((c) => console.log(`         corrected ${c.lang} ${c.term ? `every "${c.term}"` : `${c.activity} ${c.path}`}: "${c.term ?? c.from}" -> "${c.to}"`));
  if (drafted?.filled) {
    console.log(`         sinhala: ${drafted.filled} strings filled from content/grade-${grade}.sinhala.json across ${drafted.drafted.length} activities${drafted.draft ? ', all marked siDraft' : ''}`);
  }
}

// The Scratch Code Builder. It belongs to no grade - the originals ship it as
// its own app - so it gets its own file rather than sitting under a grade.
// Only the four copy fields are wrapped for translation: the block text stays
// a plain string, because it is Scratch's own block language and is never
// translated, the same rule the trace activities follow for code.
const SCRATCH = 'original/grade-9/scratch.html';
const copy = (s) => ({ en: s, si: null });
const scratch = {
  languages: ['en'],
  source: { en: SCRATCH },
  structures: readScratch(SCRATCH).map((structure) => ({
    ...structure,
    title: copy(structure.title),
    desc: copy(structure.desc),
    puzzles: structure.puzzles.map((puzzle) => ({
      ...puzzle,
      name: copy(puzzle.name),
      description: copy(puzzle.description),
    })),
  })),
};
const scratchSi = applyScratchSinhala(scratch.structures);
if (scratchSi?.filled) scratch.languages = ['en', 'si'];
writeFileSync('data/scratch.json', JSON.stringify(scratch, null, 2) + '\n');
const puzzleCount = scratch.structures.reduce((n, s) => n + s.puzzles.length, 0);
const blockCount = scratch.structures.reduce((n, s) => n + s.puzzles.reduce((m, p) => {
  let c = 0;
  (function walk(list) { list.forEach((b) => { c++; if (b.body) walk(b.body); }); })(p.order);
  return m + c;
}, 0), 0);
console.log(`scratch: ${scratch.structures.length} structures, ${puzzleCount} puzzles, ${blockCount} blocks -> data/scratch.json`);
if (scratchSi?.filled) console.log(`         sinhala: ${scratchSi.filled} strings filled from content/scratch.sinhala.json across ${scratchSi.drafted.length} structures${scratchSi.draft ? ', all marked siDraft' : ''}`);

// Grade 9's second game, folded in as bonus rounds per gate D3 in redesign-trilingual.
const ADVENTURE = 'original/grade-9/ict-adventure.html';
const adventure = normalise(readAdventure(ADVENTURE));
adventure.source = { en: ADVENTURE };
const adventureSi = applyAdventureSinhala(adventure.lessons);
writeFileSync('data/adventure-9.json', JSON.stringify(adventure, null, 2) + '\n');
const gameCount = adventure.lessons.reduce((n, l) => n + l.games.length, 0);
console.log(`adventure: ${adventure.lessons.length} lessons, ${gameCount} mini games -> data/adventure-9.json`);
if (adventureSi?.filled) console.log(`         sinhala: ${adventureSi.filled} strings filled from content/adventure-9.sinhala.json across ${adventureSi.drafted.length} games${adventureSi.draft ? ', all marked siDraft' : ''}`);

// Bonus mini games for grades 6 to 8, the counterpart to grade 9's ICT
// Adventure set. That set is grade 9 content, so the other grades had nothing
// to offer; these are hand-authored, which is why read-bonus.mjs validates
// them instead of a parity check nothing can provide.
const BONUS = 'content/bonus-games.json';
const lessonsByGrade = {};
for (const g of [6, 7, 8]) {
  lessonsByGrade[g] = JSON.parse(readFileSync(`data/grade-${g}.json`, 'utf8')).lessons.map((l) => l.id);
}
let bonus = null;
try {
  bonus = readBonus(BONUS, lessonsByGrade);
} catch (err) {
  if (!(err instanceof BonusError)) throw err;
  console.error(`bonus: ${err.message}`);
  failed++;
}
if (bonus) {
  writeFileSync('data/bonus.json', `${JSON.stringify({ source: BONUS, ...bonus.meta, grades: bonus.games }, null, 2)}
`);
  const n = Object.values(bonus.games).reduce((a, list) => a + list.length, 0);
  console.log(`bonus:  ${n} mini games across grades ${Object.keys(bonus.games).join(', ')} -> data/bonus.json`);
  console.log(bonus.gaps.length
    ? `         ${bonus.gaps.length} strings with no sinhala yet`
    : '         every string has english and sinhala (drafted, awaiting review)');
}

process.exit(failed ? 1 : 0);
