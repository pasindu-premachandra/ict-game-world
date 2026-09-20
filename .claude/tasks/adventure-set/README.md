# adventure-set - give the 18 ICT Adventure mini games a screen

Mode: `/pt` (plan, gate, build, prove, hand over). Folder type: freelance-projects = real work, full flow.
Parent: `codebase-and-infra` (the app, the data pipeline, the infra). Design: `redesign-trilingual`.
Running in parallel, do not touch their files: `scratch-builder` (g9 3.4) and the Sinhala translation pass.
Review surface for the gate: `review/plan.html` (Lavish). Evidence: `evidence/`.

## Problem

`data/adventure-9.json` holds 18 mini games, extracted from `original/grade-9/ict-adventure.html`, parity
checked on every run since the first build, and **reachable from nowhere**. Nothing in `js/app.js` routes to
them; the router only knows `data/grade-N.json`. They are the last block of extracted content with no UI now
that the 12 activity types are ported, apart from `scratch-hub` which another session has.

They are bonus content: gate D3 in `redesign-trilingual` chose "English-medium base + ICT Adventure folded in
as a bonus round per lesson", and they sit outside the NIE competency levels, so syllabus coverage is 59/59
without them. Nothing is broken while they stay hidden - this is reach, not repair.

## What the data actually is

Six themed sets, three games each. Verified from `data/adventure-9.json`:

```
set  theme     emoji  title (en)               games  kinds
01   cpu       computer  Computer & Peripheral  3      sort, sort, quiz
02   sheet     chart     Spreadsheets           3      quiz, quiz, quiz
03   code      gear      Programming            3      quiz, memory, quiz
04   micro     wrench    Microcontrollers       3      quiz, memory, quiz
05   net       globe     Networking             3      sort, quiz, quiz
06   society   earth     ICT & Society          3      quiz, sort, memory
```

`mcQuiz` 11, `sortGame` 4, `memoryGame` 3.

The structure is its own shape, not the `lessons[].activities[]` shape the rest of the app uses: the top
level is `lessons[]` with `num`, `theme`, `emoji`, `title`, and each carries `games[]` with `id`, `icon`,
`name`, `desc`, `kind` and then a kind-specific payload.

| kind | payload | count |
|---|---|---|
| `mcQuiz` | `questions[]` of `{ q, opts[], ans }` where `ans` is an index | 11 |
| `sortGame` | flat `items[]` of `{ name, bin }` plus `bins[]` of `{ id, name, emoji }` | 4 |
| `memoryGame` | `pairs[]` of `{ a, b, key }`, 5 pairs so 10 cards | 3 |

### Sinhala coverage is the thin part

| Field | Has Sinhala |
|---|---|
| Set titles | 6 / 6 |
| Game `name` and `desc` | **0 / 18** |
| `mcQuiz` question text | most |
| `mcQuiz` answer options | **0** |
| `sortGame` items and bins | **0** |
| `memoryGame` pairs | **0** |

348 strings with no Sinhala, which is the number `check-data.mjs` has been printing all along. The original
game was English with Sinhala sub-titles on some questions only, so this is faithful extraction, not loss.
`text()` in `js/i18n.js` already falls back to English rather than showing a blank, so the set is shippable
in this state - it will simply read mostly English to a Sinhala student.

## Two of the three kinds are already built

This is why the set is worth doing now rather than later.

- **`mcQuiz`** is a question, four options and a correct index. That is `trace` without the code block.
  `js/activities/rounds.js` already provides the whole shell: progress, one answer per round, the feedback
  line, scoring out of the round count, `selfScoring`.
- **`sortGame`** is chips into labelled buckets. `js/activities/bucket.js` already does exactly that,
  including the pick-a-chip-then-pick-a-bucket interaction the originals used. The only difference is shape:
  `bucket.js` reads `activity.buckets[].items[]`, the adventure data keeps a flat `items[]` with a `bin` key
  and a separate `bins[]`. That is an adapter, not a renderer.
- **`memoryGame`** is genuinely new. A shuffled deck of 10 cards, flip two, keep them if the `key` matches,
  flip them back if not, count moves.

## What the design system covers, and what it does not

From `DESIGN.md` in the Open Design project `ict-game-world-design-system`, read 2026-09-20:

**Covered, so build straight to it**
- "Answer option: idle, selected, correct, wrong. Correct and wrong add a tick or a cross and a word." -> `mcQuiz`
- "Sort bucket with chips: the bucket under a held chip turns solid." -> `sortGame`
- Feedback colours, lift tokens, the Sinhala type rules, the 44px target minimum, no sideways scroll at 360px

**Not covered anywhere - no component, no screen, no mention**
- **A memory / flip-card grid.** Not in the component list, not in `index.html`, and `search_files` for
  "memory" and "adventure" across the whole design project returns nothing.
- **How the bonus set is entered.** Gate D3 said "as a bonus round per lesson" but no screen was drawn for
  it. The six sets are thematic (`cpu`, `code`, `net`) and do not line up with grade 9's seven lessons.
- A destination for the **trophy button**, which `DESIGN.md` puts in the top bar and which currently has
  nowhere to go (see `BACKLOG.md` item 2.7).

Those three gaps are the reason this task has a gate rather than going straight to code.

## Decisions for the gate

Asked in `review/plan.html`.

**O1 - where the 18 games live.** A bonus lesson at the end of the grade 9 path / one set appended per
grade 9 lesson / a separate Game Lab screen reached from the designed-but-dead trophy button.

**O2 - the memory card grid**, which has no design. Card count per row on a 375px phone, and what the face
down side shows.

**O3 - do bonus scores reach the class leaderboard.** `scores` is unique on
`(player_id, grade, activity_id)` and the adventure ids (`c1`, `p2`) do not collide with the `1.1` ids, so
either answer works without a migration. The question is whether a student should be able to climb the class
board on bonus games instead of syllabus work.

**O4 - ship English-first or wait for Sinhala.** The fallback already works, so shipping now is safe and the
set improves by itself when the parallel translation session reaches it.

## Plan (pending the gate)

1. `js/adventure.js` - load `data/adventure-9.json`, list the six sets and their three games, route into one.
2. `js/activities/mcquiz.js` - `rounds.js` plus an option list. Shares the option-row CSS with `trace`.
3. `js/activities/sortgame.js` - adapt `items[] + bins[]` into the bucket interaction rather than
   re-implementing it, so a fix to one fixes both.
4. `js/activities/memory.js` - the flip-card grid, to whatever O2 settles.
5. Scoring: `mcQuiz` and `sortGame` score as their siblings do. `memoryGame` scores off moves against the
   perfect run (5 pairs is 5 moves), so a child who remembers gets three stars and a child who brute forces
   does not.
6. Progress and leaderboard wiring per O3, reusing `store.js` and `leaderboard.js` untouched.
7. `sw.js` - add every new module to `PRECACHE` **and** bump `CACHE`, or grades work online and break
   offline. `data/adventure-9.json` is already precached.
8. Strings through `text()` and `t()`, including `icon`, per the F2 finding in `codebase-and-infra`.

## Proof

- Every one of the 18 games played to completion from its own answer key, both languages, 375px and 1366px,
  scores compared against 100 - the same method as `evidence/ported-types-proof.txt`.
- Deliberately wrong and half-right runs, on cleared progress, to show the score discriminates.
- `memoryGame` specifically: a perfect run scores 100 and a brute-forced run scores less.
- 0 console messages, 0 horizontal overflow, reduced-motion pass still completable.
- `check-data.mjs` and `check-syllabus.mjs` green, and the adventure parity check still byte-identical.
- Read at Sinhala size, per the `BACKLOG.md` item the logo bug produced.

## Risk

Low for the app, because nothing routes here yet, so a mistake cannot break a screen a child already uses.
The real risks are scope and consistency: re-implementing the bucket interaction instead of reusing it, and
inventing a memory-card look that does not match a design system nobody has drawn for it. O2 exists to stop
the second one being decided silently by me.

## Progress

- [x] Context: data shapes, kind counts, Sinhala coverage, mapping to the built renderers
- [x] Design system read - what it covers and the three things it does not (`DESIGN.md`, Open Design)
- [ ] Gate: `review/plan.html`
- [ ] 1 adventure hub + routing
- [ ] 2 mcQuiz renderer
- [ ] 3 sortGame adapter
- [ ] 4 memoryGame renderer
- [ ] 5 scoring
- [ ] 6 progress and leaderboard
- [ ] 7 service worker
- [ ] Proof run
