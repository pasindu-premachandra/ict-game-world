# redesign-trilingual - ICT Game World redesign (grades 6-9, Sinhala / English, Tamil later)

Mode: `/pt` default (plan, gate, build, prove, hand over). Folder type: freelance-projects = real work, full flow.
Source: `C:\Users\Pasindu Premachandra\Downloads\project zip` (9 HTML files). Owners: Ishini (Pasindu's sister, teaching trainee) and her friend - their final-year project; credit goes to the two of them.
Review surface for the gate: `review/plan.html` (Lavish). Evidence: `evidence/`.

## Gate outcome (2026-09-19, GO)

D1 A static app, no build · D2 A Game Lab · D3 A English-medium base + ICT Adventure as bonus round · **D4 C Sinhala + English only for now** (data model keeps room for `ta`) · D5 A typo fixes from a list Ishini approves · D6 A Supabase class leaderboard · D7 A new dedicated project, scoped MCP (free slots: unknown) · D8 A pause after the design system · D9 PWA offline + self-hosted fonts, daily keep-alive cron · D10 folder `ict-game-world`, integrity confirmed.
Notes: **drop all Ruwanpura NCoE / batch 2022-2024 branding**; credit "Made by Ishini Premachandra & Dilini Wijesooriya" (names confirmed 2026-09-19).
Added mid-turn: **deliver the Open Design design file first** so Ishini can review it before any app code.

## Resume here (handoff 2026-09-20, context compacted)

**State: the design is done and shared. The app has NOT been built yet - no code written.**
Credit line everywhere: "Made by Ishini Premachandra & Dilini Wijesooriya". No NCoE / batch branding.

**Done**
- Design system built in Open Design, project `ict-game-world-design-system` (folder: `%APPDATA%\Open Design\namespaces\release-stable-win\data\projects\ict-game-world-design-system\`): `tokens.css` (360 lines, 4 grade worlds, `:lang()` font switching), `index.html` (1,055-line showcase: components, live motion, screens S1-S6 + desktop D1), `DESIGN.md` (155 lines). Runs `8d0d1e06` (stopped at step 3/5) then `69bcf9fc` (Sonnet, stopped after writing everything).
- Reviewed with Playwright: 7 sections, S1-S6 + D1 present, 0 dashes, no NCoE text, credit correct, 4 fonts load, no overflow at 1366 or 375.
- Screenshots in `review/`: `s1..s6.png`, `d1.png`, `sys-mascot.png`, `sys-grades.png`, `sys-type.png`.
- `review/ishini-design-review.html` - **info-only** showcase for Ishini and Dilini (no questions, no form; Pasindu asked for that). Public link: **https://685247f2.ht-ml.app/**. Do not send the older copies `https://ca24771a.ht-ml.app/` (public) or `https://ef85aea7.ht-ml.app/` (password `ictgw-5501`); they still contain the questions and cannot be deleted from here.

**Known polish items** (listed in the report, fix during the build): phone top bar clips the සිං/EN switch (S2, S3, S6); long Sinhala answers wrap badly in S4; S5 "Try again" button wraps.

**Open decisions, now Pasindu's (were dropped from Ishini's report)**
- D5 Sinhala fixes T1-T5, 44 places: `evidence/sinhala-typo-list.md`.
- G6 activity 1.3 distractor: "Ceramic plate" vs කෑදර පුටුව (cane chair).
- ~~G8 lesson 5 title~~ **settled 2026-09-20 by the syllabus task.** භෞතික ආගණනය is the NIE's own grade 8 wording for "physical computing" and is correct; the English "Logic Gates" is the drift. The lesson is rebuilt as Physical Computing and the gate lab is kept as a bonus round. See `.claude/tasks/syllabus-enrichment/`.
- Robot name (optional). Grade 9 bonus rounds already agreed (gate D3).

**Next, in order**
1. Settle the open decisions above (chat is fine; they are small).
2. Build: Plan steps 1-13 below, starting with `original/` + data extraction + `scripts/check-data.mjs`. Use `tokens.css` and `DESIGN.md` from the OD project as the design source.
3. Supabase - **project created and MCP wired 2026-09-20.** Project ref `vjyypzmnbyfjbudusava`. The server is in `.mcp.json` at the project root, so it exists for this project only and both Claude accounts that open this folder see it. Remaining per account: open Claude Code here, approve the project-scoped server when prompted, then `/mcp` in a regular terminal (not the IDE extension) and pick Authenticate. OAuth, no personal access token needed. Tokens are per account, so the main account and the CCS projects instance each sign in once.
   Two notes on the feature list in the URL: `account` is inert because `project_ref` disables the account tools by design, and `branching` needs a paid plan so those tools will fail on the free project. Neither breaks anything; trim them if you want a smaller surface.
4. Vercel MCP is connected and authenticated. Deploy only when Pasindu says go.

**Notes for the next session**
- Open Design app must be running before its MCP works; it was closed and its MCP shows CONNECT_TIMEOUT in this session. Relaunch `Open Design.exe` from `%LOCALAPPDATA%\Programs\Open Design\`, then `/mcp` reconnect. The design files are plain files on disk, so reviewing them needs no MCP.
- A local Lavish session for the report exists; its background poll exited with code 4 (no feedback delivered). Re-run `npx -y lavish-axi poll review/ishini-design-review.html` only if Pasindu wants to annotate.
- Pasindu asked twice to keep token use low. The two OD design runs were the expensive part; the rest was cheap.
- Pasindu's own offer still open: publishing the full Open Design showcase as a second public link for Ishini.

## Problem

Nine standalone HTML games (grades 6-9 ICT, English + Sinhala per grade) built on four different engines with copy-pasted code.
Asked for: load into Open Design, build a design system there, redesign (responsive, animated, right for ages 11-15), Sinhala + English + Tamil, host on Vercel later.
Content itself is good and on-syllabus - this is a unify-and-redesign job, not a rescue.

## Root cause (why it needs more than a restyle)

- One language per file: `grade 6 english.html` and `grade 6 sinhala.html` are the same game with translated strings (activity ids and answers are 1:1, checked for grades 6-8). A third language would mean a third copy of every file.
- Four engines: grades 6-7 (`match/order/bucket/pick/symmatch/mcq`), grade 8 (`bits/tf/input/trace/gate/hotspot/query`), grade 9 English (`match/tf/bucket/input/hotspot/pick/order` + Scratch hub), grade 9 "ICT Adventure" (`mcQuiz/sortGame/memoryGame`). 15 activity types in total, each re-implemented per file.
- Grade 9 has no Sinhala twin: `grade 9.html` ("ICT Adventure") is a different game with Sinhala sub-titles; `scratch.html` duplicates the Scratch hub already inside `grade 9 english medium.html`.
- Mobile: page-level layout is fine (no horizontal scroll at 375px on any file), but `grade 6 english.html:394` collapses the 3-column symbol match to one column, leaving 15 stacked cards under 3-column headers (`evidence/before/g6-en-symmatch-375.png`).
- Sinhala text has likely legacy-font conversion typos: මාදුකාංග x19, කොවෙනි x10, මුසිකය x10, හාවිත x4, හොතික x1 (to confirm with her).
- Syllabus: content matches NIE grade 6-9 ICT syllabi (nie.lk/pdffiles/tg/eGr06Syl ICT.pdf, eGr07, eGr08, Gr 9 TG). The 2026 junior-secondary reform (modules, ICT as a new grade 6 subject) was postponed to January 2027 (eduwire.lk 2026-08-22, lankaleader.lk 2026-05-06), so the current syllabus still applies.

## Options (decided in review/plan.html)

- D1 Architecture: **A one static trilingual app, shared engine + per-grade data, no build step (pick)** / B same with Vite / C restyle the 9 files in place.
- D2 Design direction: **A Game Lab - chunky gamified, per-grade colour worlds, lesson path map, mascot (pick)** / B Lanka Quest - heavier Sri Lankan motifs / C Clay Pop - soft pastel 3D.
- D3 Grade 9: **A English-medium base + ICT Adventure games folded in as a bonus round per lesson (pick)** / B English-medium only / C keep both games.
- D4 Tamil: **A full Tamil, AI-drafted, cross-checked against NIE Tamil-medium terms, marked beta until reviewed (pick)** / B Tamil UI only / C skip.
- D5 Sinhala typos: **A fix from an approved before/after list (pick)** / B leave as written.
- D6 Leaderboard (added 2026-09-19): **A online class leaderboard on Supabase - nickname + avatar + class code, local-first, synced when online (pick)** / B device-only leaderboard / C none.
- D7 Supabase setup: **A new dedicated free project, MCP scoped to it with `?project_ref=` over OAuth (pick)** / B new schema in an existing project / C Neon Postgres via Vercel instead.
- D8 Checkpoint: **A pause after the Open Design design system for a look (pick)** / B carry straight on.
- D9 Optional extras (opt-in): offline/installable + self-hosted fonts, English term hints, daily keep-alive cron for Supabase.

## Plan (assuming the picks; adjusted after the gate)

1. `ict-game-world/original/` - copy the 9 source files untouched (reference + parity baseline).
2. `data/grade-6.js ... grade-9.js` - extract every lesson/activity from the originals into one data model with `{en, si, ta}` strings, keyed by the original activity ids.
   **Then merge in `content/grade-6..9.additions.js`** (the syllabus-enrichment task): 27 new activities, 5 new lessons, and grade 8 lesson 5 rebuilt as Physical Computing with the old gate lab kept as a bonus round. The new strings arrive `{en, si}` with `siDraft: true` and must keep that flag until Ishini reviews them. Run `node scripts/check-syllabus.mjs` after the merge; it must stay green.
3. `scripts/check-data.mjs` - parity + completeness check: same lessons, activity ids, types and answers as the originals; every string has en/si/ta. This is the test suite (the project has none).
4. Open Design project "ICT Game World - design system": run a design-system skill with the brief (ages 11-15, Sinhala/Tamil/Latin type, per-grade themes, motion rules, reduced motion) -> `DESIGN.md`, `tokens.css`, component showcase. Checkpoint if D6 = A.
5. Open Design mockups: grade picker, lesson path, activity, result - phone and desktop.
6. `index.html`, `css/tokens.css`, `css/app.css`, `js/app.js` (hash router, state, language switch), `js/i18n.js` (UI labels), `js/audio.js` (music + sfx, ported).
7. `js/activities/<type>.js` - port the 15 activity types onto the design system; real buttons (keyboard + screen reader), pointer-event drag with button fallback, symbol match fixed for phones.
8. Motion layer in `css/app.css` + `js/motion.js`: screen transitions (View Transitions with fallback), staggered cards, mascot reactions, drag lift/snap, star/XP reveals, confetti; transform/opacity only; `prefers-reduced-motion` honoured.
9. Translations: Sinhala for grade 9 content, Tamil for everything (per D4), typo fixes (per D5) - each in the data files, with a review list in `evidence/`.
10. Player + leaderboard (D6): first-run "What should we call you?" screen (nickname, avatar, optional class code) in `js/player.js`; points = best score per activity (0-100) summed per grade; `js/leaderboard.js` screen (class / grade tabs, this week / all time, podium, "you" row); scores saved on the device first, synced when online.
10b. Three new app pages from the syllabus task, specced in `content/pages/`: Syllabus Map (`#/syllabus`), Word Bank (`#/words`), Teacher Notes (`#/teacher`). Build them against `tokens.css` like any other screen.
11. Supabase (D7, needs you to create the project and connect the MCP): migration via the MCP - `players`, `scores` (RLS on, no direct anon writes), `submit_score()` validating function, read-only leaderboard views; run the security advisors; publishable key into `js/config.js`.
12. Load the built app into Open Design as "ICT Game World - v2" so it can be browsed and iterated there.
13. Vercel: static deploy config (+ daily keep-alive cron if chosen). Deploy happens once the Vercel MCP is connected and you say go.

## Proof

- `node scripts/check-data.mjs` -> 0 parity diffs vs originals, 0 missing translations.
- Playwright matrix: 4 grades x 3 languages at 375x812 and 1366x768 - home, lesson, every activity type played to completion with correct answers, result screen; 0 console errors; 0 horizontal overflow. Screenshots to `evidence/after/`.
- Same flows with `prefers-reduced-motion: reduce` - no motion, still completable.
- Before/after pairs for the same screens (`evidence/before/` vs `evidence/after/`).
- Leaderboard: two browser profiles with different nicknames play the same grade, both appear ranked correctly; a direct anon `insert` into `scores` is refused (RLS); `submit_score` rejects points > 100 and a 40-char nickname; offline play queues and syncs on reconnect. Supabase security advisors: 0 errors.

## Progress

- [x] Context: 9 files mapped, en/si parity checked (g6-8), syllabus + reform status researched, fonts verified
- [x] Originals loaded into Open Design ("ICT Game World - originals", 9 artifacts)
- [x] Before screenshots (`evidence/before/`)
- [x] Gate: decisions in `review/plan.html` - GO (see Gate outcome)
- [ ] 1 originals copied
- [ ] 2 data extracted
- [ ] 3 check-data script green
- [x] Sinhala typo list for Ishini (`evidence/sinhala-typo-list.md`)
- [x] 4 design system in Open Design - files written (runs 8d0d1e06 + 69bcf9fc) and reviewed with Playwright (all checks passed)
- [x] 5 key screens - S1-S6 + desktop D1 are inside the showcase; no separate mockup pass needed
- [x] 4b Ishini's Lavish report filled with the design (S1-S6, D1, system, before/after), render-checked 1366 + 375, shared 2026-09-19, public at Pasindu's request. **Current (info-only) link: https://685247f2.ht-ml.app/**. Older copies with the questions, not to share: https://ca24771a.ht-ml.app/ (public), https://ef85aea7.ht-ml.app/ (password). Known polish items listed in it: phone top bar clips the සිං/EN switch (S2/S3/S6), long Sinhala wraps in S4, S5 "Try again" wraps.
- [x] 4c Report turned info-only at Pasindu's request (no questions; it just shows Ishini and Dilini the design)
- [ ] 4d Open decisions (G8 lesson 5 title now settled, see above) moved out of Ishini's report, to settle with Pasindu before the build: D5 Sinhala fixes T1-T5 (`evidence/sinhala-typo-list.md`); G6 1.3 distractor ("Ceramic plate" vs කෑදර පුටුව); G8 lesson 5 title ("Logic Gates" vs භෞතික ආගණනය); grade 9 ICT Adventure as bonus rounds (gate D3 already said yes); robot name (optional)
- [ ] 6 app shell
- [ ] 7 activity types ported
- [ ] 8 motion layer
- [ ] 9 translations + typo fixes
- [ ] 10 player + leaderboard screens
- [ ] 11 Supabase schema via MCP
- [ ] 12 v2 loaded into Open Design
- [ ] 13 Vercel config (deploy on your go)
- [ ] Proof run

## Risk

Medium. Nine files become one engine, so a porting slip could change an answer - `check-data.mjs` guards that.
Sinhala for grade 9 is AI-drafted and needs a human teacher's review before real classroom use (Tamil is out of scope for now, gate D4).
It is her assessed final-year project: she must be able to explain it, and her college's rules on outside help apply.
Leaderboard stores data about children: Sri Lanka PDPA No. 9 of 2022 defines a child as under 16 (every grade 6-9 student), so nicknames only, no real names, minimum data, and she can delete rows. Supabase free projects pause after 1 week of low activity (HTTP 540 until restored); the game falls back to the device board.
