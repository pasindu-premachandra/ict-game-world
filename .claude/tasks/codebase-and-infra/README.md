# codebase-and-infra - turn ICT Game World into a real codebase with Supabase + Vercel

Mode: `/pt` default (plan, gate, build, prove, hand over). Folder type: freelance-projects = real work, full flow.
Sibling tasks: `redesign-trilingual` (design system, done - do not reopen its gate) and `syllabus-enrichment` (content, in flight).
Review surface for the gate: `review/plan.html` (Lavish). Evidence: `evidence/`.

## Problem

The design system is finished and signed off, but no app code exists.
The content still lives inside 9 standalone HTML files that each carry their own copy of the engine, and a second task is enriching that content right now against the NIE syllabi.
We need a real codebase, a place for the enriched content to land, and the Supabase + Vercel infra under it.

## Root cause (why this is not just "make a repo")

- **No repo at all.** `E:\Projects\freelance-projects\ict-game-world\` holds only `.claude\`. Not a git work tree, no remote, no history.
- **Content and engine are fused.** In `grade 6 english.html:570` the whole game is a `const LESSONS=[...]` literal inside a `<script>`, next to its own CSS and its own renderer. Same again in eight other files. There is no seam a content task can write to.
- **Language is a file, not a field.** `grade 6 english.html` and `grade 6 sinhala.html` are the same game with translated strings. Verified: activity ids are identical sets in grades 6, 7 and 8 (22 / 29 / 17 ids, exact match). Grade 9 English medium has 19 activities and no Sinhala twin; `grade 9.html` is a different game (18 mini games) and `scratch.html` duplicates the Scratch hub already inside the English-medium file.
- **The design system is not wired to anything.** `tokens.css` and `DESIGN.md` sit in the Open Design project folder; the showcase pulls all four fonts off the Google Fonts CDN, which gate D9 (offline PWA, old lab PCs) rules out.

Totals to port: **87 activities + 18 adventure mini games, across 15 activity types.**

## Infra facts that shape the plan

- **Supabase Free**: 2 active projects max across every org where Pasindu is Owner or Admin; paused projects do not count. Paused after 1 week of inactivity, and the guidance is "a few user requests to the database each day over the previous week". 500 MB database (read-only above it), 50k MAU, 5 GB egress. Mumbai `ap-south-1` is available. (context7 `/supabase/supabase`; supabase.com/docs/guides/platform/regions)
- **Vercel Hobby crons**: 100 per project, but **minimum interval once per day**, and a more frequent expression *fails the deploy*. Precision is per-hour, ±59 min. A cron only fires a Vercel Function, so the keep-alive needs one `api/` file - which does not force a build step. Cron requests carry `vercel-cron/1.0` and an `x-vercel-cron-schedule` header, so the endpoint can reject anyone else. (vercel.com/docs/cron-jobs/usage-and-pricing)
- **Consequence worth knowing**: one ping a day is the *most* Hobby allows and sits at the low end of Supabase's "a few requests a day". The keep-alive reduces the chance of a pause, it does not remove it. The device-local leaderboard fallback stays the real protection.

## Gate outcome (2026-09-20, GO)

Answered in `review/plan.html`, session ended by Pasindu.

**O1 A** prove the architecture on grade 6, live · **O2 A** JSON per grade with `{en, si}` inline · **O3 A** git init locally, no remote yet · **O4 B** create the Supabase project first, build against the real schema (not my pick, which was the stub).

Note on O4 B: it governs *the leaderboard*, not the whole task. Steps 1-8 have no Supabase dependency and proceed now.
It also does not remove local-first caching - gate D6 in `redesign-trilingual` requires local-first with sync when online, and free projects pause after a week idle, so the device cache is the offline path regardless. What B removes is a throwaway stub backend.
**Done 2026-09-20:** project `vjyypzmnbyfjbudusava` created (Mumbai `ap-south-1`), MCP scoped to it in the project's own `.mcp.json`, schema applied and proven.
**Gotcha for next session:** that `.mcp.json` is project scoped, so Claude must be started from `E:/Projects/freelance-projects/ict-game-world`. Starting from `E:/Projects` loads the empty `E:/Projects/.mcp.json` and the Supabase tools never appear.

## Options

**O1 - How far this task goes.** Pick in `review/plan.html`.
- **A (pick) Prove the architecture on grade 6, live.** Repo, all 87+18 activities extracted and parity-checked, app shell, the 5 grade 6 activity types, Supabase schema applied, Vercel deployed. The remaining 10 types and 3 grades become mechanical repetition in a follow-up task.
- B Everything in one task - all 4 grades, all 15 types, leaderboard, PWA, deploy. One gate, a very long run, nothing playable until late.
- C Foundation only - repo, data, checker, no infra. Defers every Supabase and Vercel unknown.

**O2 - Data model shape** (this is the seam `syllabus-enrichment` writes into).
- **A (pick) `data/grade-N.json`, strings inline as `{en, si}`** with room for `ta`. One file per grade is the single source of truth for structure *and* strings; loads only the grade in play; a content task or a teacher can edit it without touching JS; a stray character cannot break the app, and `check-data.mjs` validates it.
- B `data/grade-N.js` ES modules, same shape. Slightly faster to import, but content edits happen in executable code.
- C JSON structure + separate `i18n/<lang>.json` catalogues keyed by path. Cleanest for handing a translator one file, but every string needs a stable key and two files must stay in sync. Pays off only with a real translator workflow; we do not have one yet.

**O3 - Git and GitHub.** It is Ishini and Dilini's assessed final-year project.
- **A (pick) `git init` locally now, no remote yet.** History from line one, nothing published while her college's rules on outside help are unconfirmed.
- B Local + a private GitHub repo under Pasindu's account.
- C Local + a private repo under Ishini's account, so the commit history is hers.

**O4 - Supabase timing.** Creating the project needs Pasindu (free slots unknown).
- **A (pick) Build against a local storage adapter now**, wire Supabase when the project exists. Nothing blocks; the leaderboard is device-local until then, which is the offline fallback we need anyway.
- B Stop here until the Supabase project is created.

## Plan (assuming the picks)

1. `git init`; `.gitignore` (`.claude/`, `node_modules`, `.env*`, `.DS_Store`, `._*`).
2. `original/` - the 9 source files copied untouched, as the parity baseline.
3. `scripts/extract.mjs` - parse the `LESSONS` literals out of all 9 files, pair English with Sinhala by activity id, emit `data/grade-6..9.json` and `data/adventure-9.json`. Grade 9 Sinhala and Tamil stay `null`, not missing.
4. `scripts/check-data.mjs` - the test suite. Same lessons, activity ids, types and answers as `original/`; every string has `en`; report every `si` gap as a named list rather than a failure. **Green before any UI work.**
5. `css/tokens.css` - copied from the Open Design project. `fonts/` - the four families self-hosted, weights cut to what `DESIGN.md` actually uses.
6. `index.html`, `css/app.css`, `js/app.js` (hash router, state, language switch), `js/i18n.js`, `js/audio.js`, `js/motion.js`. Screens: grade picker, lesson path, activity, result.
7. `js/activities/{order,match,pick,bucket,symmatch}.js` - the 5 grade 6 types on the design system. Real buttons, keyboard and screen reader, pointer drag with a button fallback, and the 3-column symbol match fixed for phones (`grade 6 english.html:394`).
8. `js/player.js` + `js/leaderboard.js` against a storage adapter with two backends: `local` now, `supabase` later.
9. `supabase/migrations/0001_init.sql` - `players`, `scores`, RLS on both with no anon write, `submit_score()` SECURITY DEFINER validating 0-100 and upserting best score, read-only leaderboard views. Applied via the scoped MCP once the project exists.
10. `manifest.webmanifest` + `sw.js` - installable, offline, cache-first on data and fonts.
11. `vercel.json` + `api/keep-alive.js` - static deploy, one daily cron, endpoint rejects anything without the cron user agent.
12. Deploy to Vercel on Pasindu's go.

## Proof

- `node scripts/check-data.mjs` -> 0 parity diffs against `original/`, and a named list of the known Sinhala gaps (grade 9), not a silent pass.
- Playwright: grade 6, both languages, 375x812 and 1366x768 - grade picker to lesson path to all 5 activity types played to completion, result screen. 0 console errors, 0 horizontal overflow. Screenshots to `evidence/after/`.
- Same run with `prefers-reduced-motion: reduce` - no motion, still completable.
- Supabase: a direct anon `insert` into `scores` is refused; `submit_score` rejects 101 points and a 40-char nickname; security advisors 0 errors.
- Keep-alive: the deployed `api/keep-alive` returns 200 for the cron user agent and 401 otherwise.

## Progress

- [x] Context: 9 files mapped, id parity re-verified (g6/7/8 exact), totals counted, infra limits confirmed
- [x] Gate: decisions in `review/plan.html` - O1 A, O2 A, O3 A, O4 B
- [x] 1 git init + `.gitignore` (no commit yet - not asked for)
- [x] 2 originals copied to `original/grade-{6,7,8,9}/`, verified byte identical
- [x] 3 extract script + data files: `data/grade-6..9.json` + `data/adventure-9.json`. 87 activities + 18 mini games
- [x] 4 check-data green - every grade and the adventure set rebuild byte identically from the JSON (`evidence/check-data.txt`). Verified the gate actually bites by flipping one answer: it failed with the exact path, in both languages
- [x] 4b syllabus-enrichment content merged in: +27 activities, 87 -> 112 (+18 adventure mini games). `check-syllabus.mjs` repointed at `data/`, `baseline-activities.json` removed as its README asked
- [x] 5 `css/tokens.css` copied; 4 font families self-hosted, subsetted to latin + sinhala, 12 files / 829 KB (250 KB English, 579 KB Sinhala)
- [x] 6 app shell - hash router, language switch, grade picker, lesson path, activity, result
- [x] 7 grade 6 activity types - order, match, pick, bucket, symmatch. Symmatch rebuilt one symbol at a time, which fixes the phone bug structurally
- [x] 8 player + leaderboard screens, local first with an offline queue
- [x] 9 Supabase schema applied (`supabase/migrations/0001_init.sql`, migration `init_leaderboard`) and attacked as the anon role - `evidence/supabase-proof.txt`
- [x] 10 PWA - `sw.js` + `manifest.webmanifest` + icons, 38 files precached, offline proven twice with the server killed
- [x] 11 `vercel.json` + `api/keep-alive.js` (daily cron, rejects anything without the cron user agent)
- [ ] 12 deploy (on your go)
- [x] Proof run - `evidence/playwright-proof.txt` and `evidence/supabase-proof.txt`

## Release step, learned the hard way

`sw.js` serves cache first, so **bump `CACHE` in `sw.js` on every deploy that changes any precached file**.
During this build the browser kept running an old `app.js` and the new routes looked broken; nothing was wrong with the code, the old worker was simply still serving `igw-v1`. Now on `igw-v2`.

## Risk

Medium. The extraction is the dangerous step: a slip changes an answer in a game children are graded on, so `check-data.mjs` runs against `original/` and gates everything after it.
Grade 9 has no Sinhala source, so those strings stay empty until `syllabus-enrichment` or a teacher fills them - the app must show English rather than a blank. Measured after extraction: **grade 9 has 306 strings with no Sinhala and the adventure set 348**, and grades 6/7/8 have 6/29/4 strings identical in both languages that may or may not be genuinely untranslated. `check-data.mjs` prints all of this on every run, so the content task has a live worklist.
Leaderboard stores data about children: Sri Lanka PDPA No. 9 of 2022 puts the child threshold at 16, which is every student here, so nicknames only, no real names, and Ishini can delete rows.
Carried over and still open from `redesign-trilingual`: Sinhala typo fixes T1-T5, the G6 1.3 distractor, and the G8 lesson 5 title. They are content, they belong to `syllabus-enrichment`, and the data files can absorb them after extraction.
