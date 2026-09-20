// Proof run for the 18 ICT Adventure bonus games.
//
// Every game is played to completion from its own answer key, in both
// languages, and the score is compared with 100. The memory games are then
// played badly on purpose, because a memory game that cannot be failed is not
// scoring anything.

import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const BASE = 'http://127.0.0.1:4173';
const ROOT = 'E:/Projects/freelance-projects/ict-game-world';
const SHOTS = `${ROOT}/.claude/tasks/adventure-set/evidence`;

const adv = JSON.parse(readFileSync(`${ROOT}/data/adventure-9.json`, 'utf8'));
const bonusFile = JSON.parse(readFileSync(`${ROOT}/data/bonus.json`, 'utf8'));
const KINDS = { mcQuiz: 'mcquiz', sortGame: 'sortgame', memoryGame: 'memory' };

const games = [];
for (const set of adv.lessons) {
  for (const g of set.games) games.push({ grade: 9, set: set.num, id: 'adv-' + g.id, kind: g.kind, g });
}
for (const [grade, list] of Object.entries(bonusFile.grades)) {
  for (const g of list) games.push({ grade: Number(grade), set: '-', id: 'adv-' + g.id, kind: g.kind, g });
}

const txt = (v, lang) => (typeof v === 'string' ? v : v?.[lang] || v?.en || '');
const log = [];
const say = (l) => { console.log(l); log.push(l); };

async function playQuiz(page, g) {
  for (let i = 0; i < g.questions.length; i++) {
    await page.waitForFunction((n) => document.querySelector('.bar-set')?.getAttribute('aria-valuenow') === n,
      String(i), { timeout: 15000 });
    await page.locator('.quiz-opt').nth(g.questions[i].ans).click();
  }
}

async function playSort(page, g, lang) {
  const binIndex = new Map(g.bins.map((b, i) => [b.id, i]));
  const wanted = new Map(g.items.map((it) => [txt(it.name, lang), binIndex.get(it.bin)]));
  for (let n = 0; n < g.items.length; n++) {
    const chip = page.locator('.chip-pool .chip').first();
    const label = (await chip.textContent()).trim();
    if (!wanted.has(label)) throw new Error(`sort: no bin known for "${label}"`);
    await chip.click();
    await page.locator('.bucket').nth(wanted.get(label)).click();
  }
  await page.locator('.actions button', { hasText: /.+/ }).first().click();
}

async function playMemory(page, g, { badly = false } = {}) {
  const pairOf = async () => page.locator('.mem-card').evaluateAll(
    (els) => els.map((e, i) => ({ i, pair: e.dataset.pair, done: e.disabled })));

  if (badly) {
    // Turn over mismatched cards on purpose to burn turns, then finish.
    for (let round = 0; round < 8; round++) {
      const cards = (await pairOf()).filter((c) => !c.done);
      if (cards.length < 2) break;
      const a = cards[0];
      const b = cards.find((c) => c.pair !== a.pair);
      if (!b) break;
      await page.locator('.mem-card').nth(a.i).click();
      await page.locator('.mem-card').nth(b.i).click();
      await page.waitForTimeout(1300);
    }
  }
  // Now clear it.
  for (let guard = 0; guard < 40; guard++) {
    const cards = (await pairOf()).filter((c) => !c.done);
    if (!cards.length) break;
    const a = cards[0];
    const b = cards.find((c) => c.i !== a.i && c.pair === a.pair);
    await page.locator('.mem-card').nth(a.i).click();
    await page.locator('.mem-card').nth(b.i).click();
    await page.waitForTimeout(650);
  }
}

async function play(page, entry, lang, opts = {}) {
  await page.goto(`${BASE}/#/g${entry.grade}/${entry.id}`);
  const root = { mcquiz: '.quiz-options', sortgame: '.bucket-game', memory: '.mem-grid' }[KINDS[entry.kind]];
  await page.waitForSelector(root, { timeout: 15000 });
  if (entry.kind === 'mcQuiz') await playQuiz(page, entry.g);
  if (entry.kind === 'sortGame') await playSort(page, entry.g, lang);
  if (entry.kind === 'memoryGame') await playMemory(page, entry.g, opts);
  await page.waitForSelector('.result:not([hidden])', { timeout: 20000 });
  return Number((await page.locator('.result-score').textContent()).match(/\d+/)[0]);
}

const browser = await chromium.launch();
const messages = [];
const overflows = [];

async function makePage(w, h, lang) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  await ctx.route('**/supabase.co/**', (r) => r.abort());
  await ctx.addInitScript((l) => {
    localStorage.setItem('igw.lang', l);
    localStorage.setItem('igw.sound', 'off');
    localStorage.setItem('igw.player', JSON.stringify({
      id: 'dddddddd-0004-4000-8000-000000000004', nickname: 'AdvProof', avatar: 'bot', classCode: null,
    }));
  }, lang);
  const page = await ctx.newPage();
  page.on('console', (m) => { if (!(m.location()?.url || '').includes('supabase.co')) messages.push(`${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => messages.push(`pageerror: ${e.message}`));
  return page;
}

const over = async (page, where) => {
  const n = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (n > 1) overflows.push(`${where}: ${n}px`);
};

say('Proof run - the 18 ICT Adventure bonus games');
say(`date: ${new Date().toISOString().slice(0, 10)}`);
say('-'.repeat(71));
say('');
say(`Gate: O1 one set per grade 9 lesson, O2 flip-card grid, O3 they count, O4 English-first.`);
say('');

for (const lang of ['en', 'si']) {
  const page = await makePage(375, 812, lang);
  await page.goto(`${BASE}/#/`);
  await page.evaluate(() => localStorage.removeItem('igw.progress'));
  let pass = 0;
  for (const entry of games) {
    const score = await play(page, entry, lang);
    await over(page, `${lang} ${entry.id}`);
    if (score === 100) pass++; else say(`  NOT 100: ${lang} ${entry.id} ${entry.kind} -> ${score}`);
  }
  say(`${lang} at 375px: ${pass} / ${games.length} played to 100 when answered correctly`);
  await page.context().close();
}

// The memory score has to be a measurement, not a participation trophy.
{
  const page = await makePage(375, 812, 'en');
  await page.goto(`${BASE}/#/`);
  await page.evaluate(() => localStorage.removeItem('igw.progress'));
  say('');
  say('Memory games, played badly on purpose (cleared progress, so best-score cannot mask it):');
  for (const entry of games.filter((e) => e.kind === 'memoryGame')) {
    const score = await play(page, entry, 'en', { badly: true });
    const moves = await page.evaluate(() => document.querySelector('.mem-moves')?.textContent || '');
    say(`  ${entry.id.padEnd(8)} ${String(score).padStart(3)}  (${moves.trim()})`);
  }
  await page.context().close();
}

// Placement: bonus rows in their lesson, and the button above the path.
{
  const page = await makePage(1366, 768, "en");
  say("");
  say("Placement, per grade:");
  for (const g of [6, 7, 8, 9]) {
    await page.goto(BASE + "/#/g" + g);
    await page.waitForSelector(".path-lesson", { timeout: 15000 });
    const r = await page.evaluate(() => ({
      rows: document.querySelectorAll("a.act[href*='/adv-']").length,
      btn: document.querySelector(".grade-links a[href$='/bonus']")?.textContent.trim() || "none",
      inLessons: [...document.querySelectorAll(".path-lesson")].map((l) => l.querySelectorAll("a.act[href*='/adv-']").length).join(","),
    }));
    say("  grade " + g + ": " + String(r.rows).padStart(2) + " bonus rows  button '" + r.btn + "'  per lesson " + r.inLessons);
    await over(page, "1366 g" + g + " path");
  }

  // The bonus screen itself.
  for (const g of [6, 7, 8, 9]) {
    await page.goto(BASE + "/#/g" + g + "/bonus");
    await page.waitForSelector(".act-list", { timeout: 15000 });
    const n = await page.locator(".act-list a.act").count();
    say("  grade " + g + " bonus screen lists " + n);
    await over(page, "1366 g" + g + " bonus");
  }

  for (const entry of games) {
    await page.goto(BASE + "/#/g" + entry.grade + "/" + entry.id);
    await page.waitForSelector(".instruction, .callout", { timeout: 15000 });
    await over(page, "1366 " + entry.id);
  }
  say("  all " + games.length + " render at 1366px");
  await page.context().close();
}

// Screenshots, one per kind, plus the path.
{
  const shots = [["mcquiz-g6","6","adv-bq6","en",375,812],["sortgame-g8","8","adv-bs8","si",375,812],
    ["memory-g7","7","adv-bm7","en",375,812],["bonus-screen-g6","6","bonus","en",375,812],
    ["bonus-screen-g9","9","bonus","en",375,812],["path-g8-bonus","8","","en",375,812]];
  let n = 1;
  for (const [name, grade, id, lang, w, h] of shots) {
    const page = await makePage(w, h, lang);
    await page.goto(BASE + "/#/g" + grade + (id ? "/" + id : ""));
    await page.waitForSelector(id === "bonus" ? ".act-list" : (id ? ".instruction, .callout" : ".path-lesson"), { timeout: 15000 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SHOTS}/${String(n).padStart(2, '0')}-${name}-${w}.png` });
    n++;
    await page.context().close();
  }
  say('');
  say(`Screenshots: ${shots.length} -> .claude/tasks/adventure-set/evidence/`);
}

say('');
say(`Horizontal overflow ......... ${overflows.length ? overflows.join(', ') : '0'}`);
say(`Console messages from the app ${messages.length}`);
messages.slice(0, 8).forEach((m) => say(`  ${m}`));
say('-'.repeat(71));

await browser.close();
const { writeFileSync, mkdirSync } = await import('node:fs');
mkdirSync(SHOTS, { recursive: true });
writeFileSync(`${SHOTS}/proof.txt`, log.join('\n') + '\n');
