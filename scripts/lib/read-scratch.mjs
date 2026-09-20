import { readFileSync } from 'node:fs';

// The Scratch Code Builder's content, which like the hotspot option sets lives
// outside the LESSONS literal and so was never extracted with the lessons.
//
// It exists twice in the originals and the two copies hold identical blocks:
// `SCRATCH_STRUCTURES` embedded in the grade 9 game, and `STRUCTURES` in
// original/grade-9/scratch.html, which is a whole app of its own. We read the
// standalone one, because that is what the builder is: its own thing, common
// to every grade, rather than a grade 9 activity.
export function readScratch(file, name = 'STRUCTURES') {
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  const start = lines.findIndex((l) => new RegExp(`^const ${name}\\s*=\\s*\\[`).test(l));
  if (start === -1) throw new Error(`no ${name} literal in ${file}`);

  let end = -1;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^\];/.test(lines[i])) { end = i; break; }
  }
  if (end === -1) throw new Error(`unterminated ${name} literal in ${file}`);

  const literal = [lines[start].replace(new RegExp(`^const ${name}\\s*=\\s*`), ''), ...lines.slice(start + 1, end), ']']
    .join('\n');
  return Function(`"use strict"; return (${literal});`)();
}
