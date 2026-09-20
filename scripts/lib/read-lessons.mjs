import { readFileSync } from 'node:fs';

// The source games each hold their content as one `const LESSONS=[...]` literal
// inside a <script> tag. It is pure data, so Node parses it instead of us: a
// regex over this is exactly how an answer would get changed by accident.
export function readLessons(file) {
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  const start = lines.findIndex((l) => /^const LESSONS\s*=\s*\[/.test(l));
  if (start === -1) throw new Error(`no LESSONS literal in ${file}`);

  let end = -1;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^\];/.test(lines[i])) { end = i; break; }
  }
  if (end === -1) throw new Error(`unterminated LESSONS literal in ${file}`);

  const literal = [lines[start].replace(/^const LESSONS\s*=\s*/, ''), ...lines.slice(start + 1, end), ']']
    .join('\n');
  return Function(`"use strict"; return (${literal});`)();
}
