import { readFileSync } from 'node:fs';

// grade 9.html ("ICT Adventure") keeps its content in the arguments of 18
// `function gXx(c) { mcQuiz(c, [...], 'id'); }` definitions rather than in one
// literal. So we run those functions with the three game renderers stubbed out
// to record their arguments. Same reason as read-lessons: JS parses its own
// data far more reliably than a regex does.

const FN = /^function (g[A-Za-z0-9]+)\(c\) \{\n([\s\S]*?)\n\}$/gm;

export function readAdventure(file) {
  const src = readFileSync(file, 'utf8');

  const start = src.indexOf('const lessons = [');
  if (start === -1) throw new Error(`no lessons literal in ${file}`);
  const end = src.indexOf('\n];', start);
  if (end === -1) throw new Error(`unterminated lessons literal in ${file}`);
  const lessons = Function(`"use strict"; return (${src.slice(start + 'const lessons = '.length, end + 2)});`)();

  const decls = [...src.matchAll(FN)];
  if (!decls.length) throw new Error(`no game functions in ${file}`);

  const body = decls.map((m) => m[0]).join('\n');
  const calls = decls.map((m) => `${m[1]}(null);`).join('\n');
  const games = Function(`"use strict";
    const out = [];
    function mcQuiz(c, questions, gameId) { out.push({ id: gameId, kind: 'mcQuiz', questions }); }
    function sortGame(c, items, bins, gameId) { out.push({ id: gameId, kind: 'sortGame', items, bins }); }
    function memoryGame(c, pairs, gameId) { out.push({ id: gameId, kind: 'memoryGame', pairs }); }
    ${body}
    ${calls}
    return out;`)();

  return { lessons, games };
}
