import { readFileSync } from 'node:fs';

// Three of the original games put the clickable options for their `hotspot`
// activities in constants *outside* the LESSONS literal
// (`const PORT_OPTIONS=[...]`), and picked one per activity in a switch inside
// the renderer (`if(a.id==='2.1')return PORT_OPTIONS;`). readLessons therefore
// never saw them, and a hotspot activity on its own carries a question and an
// answer key with nothing to click.
//
// This reads both halves and returns them keyed by activity id, so the data
// file can carry the options next to the lessons instead of the app hard
// coding a list that belongs to the content.

const DECL = /^const (\w+_OPTIONS)\s*=\s*\[/;
const PICK = /if\s*\(\s*a\.id\s*===\s*'([^']+)'\s*\)\s*return\s+(\w+_OPTIONS)\s*;/g;

export function readOptionSets(file) {
  const source = readFileSync(file, 'utf8');
  const lines = source.split(/\r?\n/);

  const sets = {};
  for (let i = 0; i < lines.length; i++) {
    const name = (lines[i].match(DECL) || [])[1];
    if (!name) continue;
    let end = -1;
    for (let j = i + 1; j < lines.length; j++) {
      if (/^\];/.test(lines[j])) { end = j; break; }
    }
    if (end === -1) throw new Error(`unterminated ${name} literal in ${file}`);
    const literal = [lines[i].replace(/^const \w+_OPTIONS\s*=\s*/, ''), ...lines.slice(i + 1, end), ']'].join('\n');
    sets[name] = Function(`"use strict"; return (${literal});`)();
    i = end;
  }

  const byActivity = {};
  for (const [, id, name] of source.matchAll(PICK)) {
    if (!sets[name]) throw new Error(`${file}: activity ${id} wants ${name}, which is not declared`);
    byActivity[id] = sets[name];
  }
  return byActivity;
}
