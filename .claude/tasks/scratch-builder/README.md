# scratch-builder - lift the Scratch Code Builder out of grade 9 and onto the home page

Mode: `/pt` default (plan, gate, build, prove, hand over). Folder type: freelance-projects = real work, full flow.
Parent task: `codebase-and-infra` (handoff 4 left this as the one unported activity type, and said to treat it as its own task).
Review surface for the gate: `review/plan.html` (Lavish). Evidence: `evidence/`.

## Why this task exists

Two reasons arrived together on 2026-09-20.

1. **It is the last unported type.** 111 of 112 activities are playable. Grade 9 `3.4` (`type: "scratch-hub"`) still renders as "coming soon", and the handoff notes it is not a renderer but a nested sub-app: a hub of three control structures, each with a list of block-dragging puzzles, plus a workspace, a tray and a program checker.
2. **Ishini says it belongs to every grade, not to grade 9.** Pasindu relayed it on 2026-09-20: "sister said its common for all grades and its easier that way". That is also how the originals treat it - `original/grade-9/scratch.html` is a whole standalone app, separate from the grade 9 game that embeds a copy of it.

So the job is not only "port the type". It is "move it to the home page as a thing of its own", and the grade 9 lesson path keeps a door into it.

## What is already true (verified, 2026-09-20)

- `data/grade-9.json` activity `3.4` carries a name and an instruction and nothing else. Its content was never extracted, because like the hotspot option sets it lives **outside** the `LESSONS` literal.
- Two copies of that content exist and they are the same puzzles:
  - `original/grade-9/english-medium.html:858` - `const SCRATCH_STRUCTURES`
  - `original/grade-9/scratch.html:608` - `const STRUCTURES`, the standalone app
  Diffed block for block: **identical**. They differ only in 3 structure titles ("Sequence Programs" vs "Sequence"), 2 structure descriptions and 1 puzzle name.
- The content is 3 structures, 14 puzzles, 99 blocks, 7 Scratch categories, 10 C-blocks, 4 `else` blocks, nesting never deeper than one level.
- `check-syllabus.mjs` already warns `grade 9 activity 3.4 is not listed under any competency`, and all 59 competency levels are covered without it. It is bonus content, so moving it off the grade 9 path costs no coverage.
- The design system already specifies the Scratch block. `css/tokens.css:81-89` ships the seven category colours and `--radius-block: 6px`, both unused so far, and the Open Design showcase carries the component (`.sbk`, `.sbk--hat`, `.sbk--bool`, `.sbc` with head / body / foot, `.sbcat`). Source: `AppData/Roaming/Open Design/.../projects/ict-game-world-design-system/index.html:358-374`.
- The design system's rule for this family of interaction: "Order item: drag handle plus up and down buttons, so dragging is never the only way." (`DESIGN.md`, Components.)
- Re-checked live through the Open Design MCP (project `ict-game-world-design-system`) once it connected: the block component and the seven tokens are all it holds for Scratch. **There is no Scratch builder screen in the design system**, so the three screens are ours to lay out from its components.

## The hard constraint nothing else in the app has hit

`submit_score()` validates its arguments (`supabase/migrations/0001_init.sql:74-79`):

```sql
if p_grade is null or p_grade < 6 or p_grade > 9 then ... end if;
if p_activity is null or p_activity !~ '^[0-9]{1,2}\.[0-9]{1,2}$' then ... end if;
```

A puzzle id like `seq1` cannot reach the database, and a builder that belongs to no grade has no grade to file under. So "does the builder feed the leaderboard" is a real decision with a migration behind one of its answers, not a detail. It is question 1 at the gate.

## Gate

`review/plan.html`, four questions: scoring and the leaderboard, one attempt or fiddle until it runs, whether the workspace shows the real nested shape, and how far the Sinhala goes.

## Gate answers, 2026-09-20 (all four came back A)

| | Question | Answer |
|---|---|---|
| Q1 | Does the builder feed the leaderboard? | **A - local only.** A built program is a tick on the device. Nothing reaches Supabase, no migration. |
| Q2 | One attempt, or fiddle until it runs? | **A - fiddle until it runs.** Unlimited runs, wrong blocks shake and stay put, the program records built or not built. |
| Q3 | Does a loop hold its blocks? | **A - nested.** A C-block's mouth is its own drop target and the program is compared as a tree. |
| Q4 | How far does the Sinhala go? | **A - chrome translated, block text stays English.** The 34 content strings go on Ishini's list with English fallback. |

## DONE, 2026-09-20. All eight steps built and proven locally, not yet pushed

**The builder is live in the working tree.** 14 programs, 99 blocks, three screens, two doors into it, and both gates green. Full measurements in `evidence/proof.txt`, six screenshots beside it.

Headline numbers: **14 / 14 programs built from their own answer key in English and in Sinhala at 375px**, all 14 render at 1366px, a deliberately wrong program is **rejected** with 6 blocks marked, 0 horizontal overflow, 0 console messages, 0 tap targets under 40px.

### What shipped, file by file

| File | |
|---|---|
| `scripts/lib/read-scratch.mjs` | new - reads `const STRUCTURES` from the standalone `original/grade-9/scratch.html` |
| `scripts/extract.mjs` | writes `data/scratch.json`; only 4 copy fields wrapped, block `text` stays plain |
| `scripts/check-data.mjs` | the same reversibility check the grades get |
| `js/scratch.js` | new - hub, structure list, workspace, the tree compare |
| `js/store.js` | `isBuilt` / `markBuilt` / `builtCount` on their own `igw.scratch` key |
| `js/app.js` | the `#/scratch` routes, the home card, grade 9 3.4 as a door, the old-bookmark redirect |
| `css/app.css` | the Scratch block components on the tokens `tokens.css` already shipped |
| `js/i18n.js` | 18 strings, drafted Sinhala, commented as drafted |
| `sw.js` | `js/scratch.js` + `data/scratch.json` precached, `CACHE` `igw-v8` -> `igw-v9` |

### One bug found and fixed during the proof run

An old bookmark of `#/g9/3.4` hit the `hasPlayer()` name gate before reaching the builder, so a child who had never entered a nickname was asked for one to open something that scores nothing. `route()` now resolves the builder door before the gate, by looking the activity type up in the already-cached grade data. A real activity is still gated, which the proof run checks explicitly.

### Then: the Sinhala was written, 2026-09-20

Pasindu asked for the "මෙයට සිංහල තවම ලියැවෙමින් පවතී." note to be fixed everywhere, then "do the sinhala properly". **That reverses gate answer Q4 A** and extends the job past this task into the adventure set.

**382 strings written**, through the same overlay pipeline grade 9 already used, all marked `siDraft`:

| | | |
|---|---|---|
| `content/scratch.sinhala.json` | new | 34 - 3 structures, 14 programs |
| `content/adventure-9.sinhala.json` | new | 348 - 18 games |
| `scripts/lib/apply-sinhala.mjs` | `applyScratchSinhala` + `applyAdventureSinhala`, sharing one `fillOrThrow` | |
| `scripts/extract.mjs` | applies both and reports the counts | |
| `js/i18n.js` | 8 strings corrected to the word bank | |

Terms come from `content/pages/word-bank.md`, the NIE Sinhala-medium list, so the builder and the bonus games cannot drift from the lessons: Sequence = අනුක්‍රමය, Selection = තේරීම, Repetition = පුනර්කරණය, control structure = පාලන ව්‍යූහය, program = වැඩසටහන. **My first drafts were wrong on two of these** and are fixed: I had used ක්‍රමලේඛ (programming, the subject) where the word bank says වැඩසටහන (a program, the thing you build), and ව්‍යුහය where the NIE writes ව්‍යූහය.

**Left in English on purpose**, each with its reason recorded in the overlay's own `notes` block: all 99 Scratch block texts, product and standard names (VGA, RJ45, micro:bit, Arduino, ATMEGA328p...), spreadsheet functions and operators (SUM, AVERAGE, `= + - * /`), cell addresses, bare numbers, and the acronym-expansion distractors in `n2` (NIC) and `n3` (CLI), where translating an option would destroy the question.

**Proof:** 0 untranslated strings left in any of the six data files; 130 activities across all four grades plus all 17 builder screens opened in Sinhala with 0 fallback notes and 0 English titles or instructions; parity gate still rebuilds all six sources byte identically. `evidence/proof.txt` addendum, and `07-si-adventure-quiz-375.png`.

It is still a **draft**. Ishini corrects rather than composes, and nothing reads English-only to a Sinhala-medium child while she does.

### Left deliberately undone

- **Not pushed.** No commit, no deploy. `CACHE` is bumped and waiting.
- **Drag not driven by a test.** The tap route is proven end to end; the HTML5 drag route shares the same `place()` path but wants one manual check on a lab PC.
- **No reward tie-in.** The reward layer that landed in parallel gives stars, combo and confetti to scored activities. The builder scores nothing by Q1 A, so it calls none of it. Whether a built program should still fire confetti is Pasindu's call, and it is a small change if he wants it.
- ~~**The 34 Sinhala strings** are on Ishini's list, unwritten.~~ Done, see above, along with the adventure set's 348.

## History - paused mid-build, 2026-09-20

**Why it stopped.** Another session was writing to this same working tree at the same time, building a reward layer: new `js/audio.js`, `js/motion.js`, `js/reward.js`, and edits to `js/app.js`, `js/i18n.js`, `js/activities/rounds.js`, `css/app.css`, `index.html` and `sw.js` (it bumped `CACHE` `igw-v5` -> `igw-v6` -> `igw-v7`). Its last write landed 25 seconds before the check. Pasindu chose to pause this task rather than race it. **Before resuming, confirm the reward-layer session has finished.**

### Done and verified (4 of 8 steps, none of it in a contested file)

1. **`scripts/lib/read-scratch.mjs`** - reads `const STRUCTURES` out of `original/grade-9/scratch.html`, the standalone app, the same way `read-lessons.mjs` reads a `LESSONS` literal. The standalone copy is the source rather than the one embedded in the grade 9 game, because that is what the builder now is.
2. **`scripts/extract.mjs`** - writes `data/scratch.json`. Only four fields are wrapped `{en, si: null}` for translation: structure `title` and `desc`, puzzle `name` and `description`. **Block `text` stays a plain string** per Q4, so it can never show the "Sinhala still being written" note. Output: `3 structures, 14 puzzles, 99 blocks`.
3. **`scripts/check-data.mjs`** - the same reversibility check the grades get. Green: `ok scratch 3 structures, 14 puzzles, rebuild matches original exactly`, and it independently confirms the `34 strings have no Sinhala yet` figure quoted at the gate.
4. **`js/scratch.js`** (new) and **`js/store.js`** (added `isBuilt` / `markBuilt` / `builtCount` on their own `igw.scratch` key, deliberately not a prefix inside `igw.progress` where `totalFor()` would sweep it into a grade's XP). Both pass `node --check`.

### Still to do (4 steps, all in files the other session was editing)

5. **`js/app.js`** - routes `#/scratch`, `#/scratch/<structure>`, `#/scratch/<structure>/<program>`; the home page card in `gradePicker()`; and grade 9 `3.4` changed from a dead `is-soon` row into a link to `#/scratch`. Put the scratch branch **before** the `hasPlayer()` redirect in `route()`, or the builder will demand a nickname it never uses. Do not call `setGrade()`, so the child keeps their own colour world, and call `showXp(null)`, since nothing here scores.
6. **`css/app.css`** - the Scratch block components, ported from the Open Design showcase onto the tokens `css/tokens.css:81-89` already ships. Classes `js/scratch.js` expects: `.sb-block` with `.sb-<category>` for the seven types, `.is-hat`, `.is-mouth`, `.is-placed`, `.is-wrong-place`; `.sb-c` / `.sb-c-body` / `.sb-c-foot`; `.sb-pill` with `.is-name`, `.is-value`, `.is-purple`, `.is-blue`, `.is-green`; `.sb-zone`, `.sb-tray`, `.sb-tray-empty`, `.sb-slot` (`.is-chosen`, `.is-over`), `.sb-row`, `.sb-moves`, `.sb-legend`, `.sb-label`; `.struct-grid`, `.struct-card`, `.struct-top`, `.struct-icon`, `.struct-title`, `.struct-desc`, `.struct-count`, `.struct-bar`, `.struct-fill`; `.act-num` and `.act.is-built`.
7. **`js/i18n.js`** - 19 strings, listed in the block below. Drafted Sinhala, comment them as drafted. **Re-add after the reward layer's `combo` / `soundOn` / `soundOff` block, do not replace it.**
8. **`sw.js`** - add `js/scratch.js` and `data/scratch.json` to `PRECACHE` and bump `CACHE` again from whatever the reward layer left it on (`igw-v7` at the time of writing).

Then the proof run: all 14 programs built from their own answer key at 375px and 1366px in both languages, deliberately wrong placements shown to be caught, zero console messages, zero horizontal overflow, both gates green.

### The i18n strings step 7 needs

```
scratchTitle  Scratch Code Builder          scriptArea    Script area
scratchLead   Pick a control structure...   blockTray     Block tray
forEveryGrade For every grade               placeHere     Put the next block here
programsBuilt programs built                insideLoop    Put it inside this one
programs      programs                      placed        placed
built         Built                         addBlock      Add block
removeBlock   Take block out                runProgram    Run the program
reset         Start over                    trayEmpty     Every block is placed...
notYet        Not yet. The blocks that shake are in the wrong place.
programRuns   The program runs!             nextProgram   Next program
```

### Two decisions taken while building, worth knowing

- **`else` opens a mouth.** The originals keep `else` as a bare marker block with its branch sitting as the next sibling, because they never nest anything. With Q3 = A that branch has to go somewhere, so `toTree()` in `js/scratch.js` gives the marker a mouth and puts what follows it inside. In all four selection puzzles the `else` is followed by exactly one block and it is the last, so this is unambiguous. **No content changed** - the same blocks in the same order, shaped the way Scratch shapes them, and the parity gate still compares against the untouched original.
- **Drag is mouse only; tap is everywhere.** HTML5 drag from the tray to a slot for lab PCs, and tap-a-block-then-tap-a-slot plus up/down buttons for phones, keyboards and screen readers, which is the design system's "dragging is never the only way". The originals' custom pointer-drag ghost for touch is deliberately not ported: tapping beats dragging a ghost on a phone, and that code was the fiddliest part of the original.

## Status

Built and proven locally. Not committed, not pushed, not deployed.
