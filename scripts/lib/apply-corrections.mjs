// Deliberate fixes to what the original games say, kept in one reviewable list.
//
// A correction changes the baseline itself, so it is the one thing the parity
// gate cannot prove on its own. extract.mjs and check-data.mjs apply the same
// list to the same files, and `from` must still match the original exactly, so
// a correction that goes stale fails loudly instead of hiding a real change.

import { readFileSync } from 'node:fs';

const FILE = 'content/corrections.json';
const ALL = JSON.parse(readFileSync(FILE, 'utf8'));

export class CorrectionError extends Error {}

export function correctionsFor(grade, lang = null) {
  return ALL.filter((c) => c.grade === grade && (lang === null || c.lang === lang));
}

export function applyCorrections(grade, lang, lessons) {
  for (const c of correctionsFor(grade, lang)) {
    const activity = lessons.flatMap((l) => l.activities).find((a) => a.id === c.activity);
    if (!activity) throw new CorrectionError(`grade ${grade} ${lang}: no activity ${c.activity}`);

    const keys = c.path.split('.');
    const leaf = keys.pop();
    const node = keys.reduce((o, k) => (o == null ? o : o[k]), activity);
    if (node == null) throw new CorrectionError(`grade ${grade} ${lang}: ${c.activity} has no ${c.path}`);
    if (node[leaf] !== c.from) {
      throw new CorrectionError(
        `grade ${grade} ${lang}: ${c.activity} ${c.path} is ${JSON.stringify(node[leaf])}, correction expects ${JSON.stringify(c.from)}`
      );
    }
    node[leaf] = c.to;
  }
  return lessons;
}
