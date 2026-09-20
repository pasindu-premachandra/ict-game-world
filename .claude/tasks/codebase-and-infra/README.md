# codebase-and-infra - turn ICT Game World into a real codebase with Supabase + Vercel

Mode: `/pt` default (plan, gate, build, prove, hand over). Folder type: freelance-projects = real work, full flow.
Sibling tasks: `redesign-trilingual` (design system, done - do not reopen its gate) and `syllabus-enrichment` (content, in flight).
Review surface for the gate: `review/plan.html` (Lavish). Evidence: `evidence/`.

## RESUME HERE - handoff 4, 2026-09-20, after D3 (the activity types are ported)

**Live: https://ict-game-world.vercel.app** (production, git linked: any push to `master` auto-deploys).
Repo `pasindu-premachandra/ict-game-world`. Supabase project `vjyypzmnbyfjbudusava` (Mumbai).

**Where things stand.** D3 is done. Seven activity types were ported this session, so **111 of the 112 activities are playable** in both languages, where it was 80 before. All four grades work end to end; grade 9's night lab and grade 8's orange world are exercised by real activities for the first time. Both gates are green, the proof run is in `evidence/ported-types-proof.txt`, and F4 went in with it.

| Type | Activities | Where |
|---|---|---|
| `tf` | 10 | g8, g9 |
| `input` | 7 | g8, g9 |
| `hotspot` | 7 | g8, g9 |
| `trace` | 3 | g7, g8, g9 |
| `bits` | 2 | g8 |
| `gate` | 1 | g8 (bonus) |
| `query` | 1 | g8 |
| **total** | **31** | |

**The one thing left unported is `scratch-hub` (g9 3.4), and it is not mechanical.** It is not one activity, it is a nested sub-app: a hub of three control structures, each with its own list of block-dragging puzzles, plus a workspace, a palette and a program checker (`original/grade-9/english-medium.html:1174-1520`). Its content is `SCRATCH_STRUCTURES`, which like the hotspot option sets lives **outside** the `LESSONS` literal, so it is not in `data/` yet either. It needs its own extraction step and its own screen, not a renderer. It is also the one activity the syllabus checker flags as belonging to no competency level, so it is a bonus, not a coverage gap - all 59 levels are still covered without it. Treat it as its own task, roughly the size of this one.

**Deployed and verified on production, 2026-09-20.** Pasindu pushed `68300ba`; all seven types were then played through on the live site and every one scored 100, scores reached Supabase with an empty offline queue, and F4 was proven with two players who share a nickname. `evidence/live-verify-d3.txt`.
One more commit is waiting (`e5def03`, the Sinhala logo fix) and **has not been pushed**. `sw.js` `CACHE` is already bumped to `igw-v5` for it.

**Also open, in priority order.**
- **Clean up the live-verification rows.** The live run wrote two players both nicknamed `LiveCheck`, class code `D3` - ids `aaaaaaaa-0001-...` and `bbbbbbbb-0002-...` - and 9 score rows across grades 7, 8 and 9. They were needed to prove F4 on production and there is no anon delete path, so they need the Supabase MCP or the dashboard: `delete from public.players where class_code = 'D3';` (scores cascade). The pilot's own row (Ishini, owl, 6A) should stay.
- **The Sinhala review list for Ishini and Dilini.** It has grown and still has no single document. It now holds: F3 (`හාවිත` -> `භාවිත`, grade 6 lesson 2 title and activity 2.1), T1-T5 from `redesign-trilingual`, the robot name, the drafted `සෙරමික් පිඟාන` from D2, everything flagged `siDraft` from `syllabus-enrichment`, and **the eleven new UI strings added this session** (marked with a comment in `js/i18n.js`). All of it is her content call, none of it is a code change. It wants one list, not eleven scattered notes.
- **Sinhala coverage.** Grade 9 has 178 strings with no Sinhala, the adventure set 348. The app falls back to English rather than showing a blank.
- **The adventure set has no UI at all.** 18 mini games in `data/adventure-9.json`, three kinds (`mcQuiz` 11, `memoryGame` 3, `sortGame` 4), and nothing routes to them. They are bonus content folded in by gate D3 in `redesign-trilingual`, so they are not counted in the 112.

**Database state.** `players` 3 rows, `scores` 14 rows. One is the pilot's (Ishini, owl, 6A, 5 scores); the other two are the `LiveCheck` pair from the production verification above and should be deleted. The *local* proof run blocked Supabase deliberately, so it wrote nothing; only the live run did.

**Traps that have already cost a session each. Do not rediscover them.**
- **Start Claude from `E:/Projects/freelance-projects/ict-game-world`**, or the Supabase MCP never loads. It lives in the project's own `.mcp.json`, which is only read from the cwd. Starting from `E:/Projects` silently gives you no Supabase tools at all.
- **Content can live outside the `LESSONS` literal.** The hotspot options did, and `SCRATCH_STRUCTURES` still does. If an activity's data looks incomplete, grep the original for a bare `const` before assuming the extraction dropped something.
- **Vercel's API cannot link this GitHub repo** (`namespaceId: null` even after connecting). The browser import flow at vercel.com/new works. Do not burn time on the API path.
- **Commits here are title only.** One short subject line, no body, no `Co-Authored-By`, no trailers. This overrides the harness attribution default.
- **`git config --local user.email` must be `pasindug98@gmail.com`.** The global identity is the Clouda work address, and this is a student's assessed project.
- The Supabase MCP in this project is **project scoped**: `execute_sql` takes no `project_id` argument, and passing one is a Zod error.

## D3, what was built (2026-09-20)

### The hotspot options were missing from the data, not just the UI

`hotspot` could not be ported as written. Seven activities carry a question and an answer key (`ans: 'vga'`) and nothing to click: the originals kept the clickable options in constants **outside** the `LESSONS` literal (`const PORT_OPTIONS=[...]`, `original/grade-8/english.html:937`) and chose one per activity in a switch inside the renderer (`if(a.id==='2.1')return PORT_OPTIONS;`). `readLessons` never saw them, so `data/` never had them.

Hard-coding them in `js/activities/hotspot.js` would have put content in the app. Instead `scripts/lib/read-option-sets.mjs` reads both halves - the constants and the id-to-constant switch - and `extract.mjs` merges English with Sinhala through the same `mergeLang` as everything else. They land as `optionSets`, a **sibling of `lessons`** rather than a field inside an activity, which is what keeps the parity gate honest: it compares activity for activity against the original, and an extra key inside an activity would have failed it.

Six option sets recovered, 28 clickable options: grade 8 ports, word tools and HTML tags; grade 9 charts, sensors and terms.

`js/app.js` resolves them - `activity.options` if the activity carries its own (grade 8 3.3 does, it came from `syllabus-enrichment`), otherwise the grade's `optionSets[id]`. The renderer only ever reads `activity.options`.

### One answer per round, not retry-until-right

The originals let a child retry a wrong answer until they got it. That cannot be scored out of 100 - everyone finishes on 100 and the stars mean nothing. All seven new types take **one answer per round** and then move on, which is what `symmatch` already did. Practising is still free, because `submit_score()` keeps only a student's best.

`js/activities/rounds.js` is the shell all seven share: progress, the body of one round, an `aria-live` feedback line, advance on a timer, score out of the number of rounds, and `selfScoring: true` so the activity screen hides its Check button. `settle()` refuses to fire twice, which matters where both a click and Enter reach the same answer.

### The seven renderers

- **`tf.js`** - one statement, two big targets. On a wrong answer the right one is marked.
- **`input.js`** - a real `<form>`, so Enter submits on a phone keyboard. Answers are things like `read only` and `=SUM(A1:A10)`, so case and repeated spaces are forgiven and nothing else is. The answer is shown after a wrong try.
- **`hotspot.js`** - the option grid, shuffled per round.
- **`trace.js`** - the program in a `<pre>` that scrolls sideways on its own rather than pushing the page wide. Code is never translated. Where the content carries a `note` explaining the bug, it is used as the feedback line.
- **`bits.js`** - place-value switches with a running sum. `bitCount` defaults to 8; grade 8 5.1 uses 4 and calls them LEDs. The row is capped four wide on a phone so eight bits wrap 4 + 4, two nibbles, instead of a ragged 6 + 2.
- **`gate.js`** - the standard AND, OR and NOT symbols as inline SVG on the grade's own colours. The original printed the gate's name in a box; a grade 8 student is taught the symbol too. Same data, same answers.
- **`query.js`** - tiles into a slot, order-insensitive set comparison, Clear. The lesson is keywords over sentences, so the filler words in the pool are the distractor.

Eleven new UI strings in `js/i18n.js`. The Sinhala is drafted, not Ishini's, and is commented as such.

### F4 folded in

The leaderboard decided whose row was whose by matching the **nickname**, so two children called Ishini were each badged "You" on both rows. `js/leaderboard.js` now selects `player_id` - the view already exposed it (`supabase/migrations/0001_init.sql:101`), the client simply never asked - and `js/screens.js:104` compares ids. Two lines, no migration. It was folded in rather than queued because it is a real classroom bug with one obviously correct fix and no tradeoff to weigh.

### Proof

`evidence/ported-types-proof.txt`, and eight screenshots in `evidence/after/`.

Every one of the 31 activities was played to completion **from its own answer key**, in both languages, at 375px:

```
en at 375px: 31 / 31 played to 100 when answered correctly
si at 375px: 31 / 31 played to 100 when answered correctly
```

Scoring discriminates, checked on cleared progress so best-score-only cannot mask it: all seven types answered deliberately wrong score **0**, half of a true/false answered wrong scores **50**, correct scores **100**.

```
Types that already existed, still rendering at 1366px: 80 / 80
New types rendering at 1366px: 31 / 31
scratch-hub (g9 3.4) still not playable, handled cleanly: true
Horizontal overflow at 375 and 1366 .... 0
Console messages from the app .......... 0
```

The run blocked the Supabase host on purpose, so the pilot's rows are untouched and the 70 scores it produced went to the offline queue instead - the local-first path, exercised again for free.

Both gates re-run green after the change: `check-data.mjs` all five sources rebuild byte identically, `check-syllabus.mjs` 59/59 levels with the one pre-existing grade 9 3.4 warning.

**Not deployed.** Committed locally; the live site still runs the old build.


## Handoff 3 (superseded), 2026-09-20, after the pilot and the D1/D2/F2 fixes

**Live: https://ict-game-world.vercel.app** (production, git linked: any push to `master` auto-deploys).
Repo `pasindu-premachandra/ict-game-world`. Supabase project `vjyypzmnbyfjbudusava` (Mumbai).

**Where things stand.** The live site was smoke tested end to end on 2026-09-20 and all five deployment checks passed with zero console messages (see "Pilot run on the live site" below). Three gate answers came back in `review/pilot.html` and all three fixes are done, verified locally and pushed. Grade 6 is complete in both languages.

**The next job is D3: port the remaining activity types.** Grades 7, 8 and 9 have their content extracted and syllabus checked, but only 5 of the 16 activity types have a UI, so most of those grades render as "coming soon". This is the single biggest remaining gap and it is mechanical now the pattern is proven on grade 6.

To start it:
1. `node scripts/check-data.mjs` and `node scripts/check-syllabus.mjs` should both pass before you touch anything. If they do not, stop and read why.
2. The supported list is `const TYPES = ['order', 'match', 'pick', 'bucket', 'symmatch'];` in `js/app.js`. Anything not in it falls through to `notFound()`.
3. Find what is still missing with:
   `node -e "const f=require('fs');const t=new Set();for(const g of [6,7,8,9]) JSON.parse(f.readFileSync('data/grade-'+g+'.json','utf8')).lessons.forEach(l=>l.activities.forEach(a=>t.add(a.type)));console.log([...t].sort().join('\n'))"`
4. Copy the shape of an existing renderer in `js/activities/`. Each exports `render(activity, onDone)` and returns `{ node, check, selfScoring }`. `onDone(points)` is called with 0 to 100. Style comes from `css/tokens.css` only, never raw colours.
5. Every user-visible string goes through `text()` from `js/i18n.js`, **including `icon`** - that was finding F2, see below.
6. **Bump `CACHE` in `sw.js`** on any deploy that changes a precached file, or browsers keep serving the old build and the new code looks broken.

**Also open, in priority order.**
- **F4, the leaderboard "You" badge matches on nickname.** Two lines, no migration, details in the F4 section below. It is a real classroom bug and was never gated because it was found after the report closed. Ask Pasindu whether to fold it in before the porting.
- **F3 and the Sinhala typos.** `හාවිත` should be `භාවිත` in at least the grade 6 lesson 2 title and activity 2.1, plus T1-T5 carried over from `redesign-trilingual`, the robot name, and the drafted `සෙරමික් පිඟාන` wording from D2. All of these are Ishini and Dilini's content calls, not ours. They belong in one list for her, not in a code change.
- **Sinhala coverage.** Grade 9 has 178 strings with no Sinhala and the adventure set has 348. Enrichment Sinhala is AI drafted and flagged `siDraft` until Ishini reviews it. The app falls back to English rather than showing a blank.

**Database state.** `players` has 1 row and `scores` has 5, all from the pilot (Ishini, owl, class 6A, activities 1.2 to 2.2). Everything else has been cleaned up. Truncate with `truncate table public.scores, public.players restart identity;` via the Supabase MCP whenever a clean slate is wanted.

**Traps that have already cost a session each. Do not rediscover them.**
- **Start Claude from `E:/Projects/freelance-projects/ict-game-world`**, or the Supabase MCP never loads. It lives in the project's own `.mcp.json`, which is only read from the cwd. Starting from `E:/Projects` silently gives you no Supabase tools at all.
- **Vercel's API cannot link this GitHub repo** (`namespaceId: null` even after connecting). The browser import flow at vercel.com/new works. Do not burn time on the API path.
- **Commits here are title only.** One short subject line, no body, no `Co-Authored-By`, no trailers. This overrides the harness attribution default.
- **`git config --local user.email` must be `pasindug98@gmail.com`.** The global identity is the Clouda work address, and this is a student's assessed project.
- The Supabase MCP in this project is **project scoped**: `execute_sql` takes no `project_id` argument, and passing one is a Zod error.

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

## Pilot run on the live site, 2026-09-20 (all 5 handoff checks pass)

**Live: https://ict-game-world.vercel.app** - production, READY, git linked to `pasindu-premachandra/ict-game-world` so every push to `master` redeploys.
Vercel project `prj_qqbnuMMLY9guVHKbLAbGlxjcFEcX`, deployment `dpl_Bu7byX9UZfifXBAfHEbDjRdR6zfW`, from commit `5067e90`.

Both Supabase tables were truncated first, then a full play session was driven through Playwright as a student called **Ishini** (owl, class `6A`).

| # | Check | Result |
|---|---|---|
| 1 | Play a grade 6 activity live, 0 console errors, score reaches Supabase | pass - 6 activities played, **0 console messages of any kind** |
| 2 | `SUPABASE_URL` + `SUPABASE_PUBLISHABLE_KEY` on the Vercel project | pass - both present on production and preview |
| 3 | Cron `/api/keep-alive` at `0 2 * * *` | pass - function live; as `vercel-cron/1.0` it returns `{"ok":true,"status":200}`, so it really reaches Supabase and is not the `skipped: supabase not configured yet` fallback |
| 4 | `/api/keep-alive` from a browser returns 401 | pass - 401 |
| 5 | Service worker serves the deployed build | pass - 1 registration, cache `igw-v2`, matches the deploy |

**What the pilot exercised**

- All four grade 6 activity types: order (1.1), match (1.2), pick (1.3), bucket (1.4). All scored 100 / 3 stars.
- Both languages: 2.1 played entirely in Sinhala, `<html lang="si">`, correct fonts and scale.
- Name gate: `#/g6/board` correctly redirected to `#/name`, then returned to the board after saving.
- Leaderboard read from Supabase (`leaderboard_class` 200), own row marked, class filter `6A` applied.
- **Best score is protected:** replayed 1.2 deliberately wrong, scored 0. The server row stayed at 100 with its original `updated_at`, so `greatest()` in `submit_score()` rejected it. A student can never lose points by practising.
- **Offline proven live:** network killed, page reloaded fully from cache, activity 2.2 played and scored while offline, the score queued in `igw.pending`. Reconnecting flushed the queue automatically and 2.2 appeared in Supabase. Queue emptied to `[]`.

**Final state:** `players` = 1 row (Ishini, owl, 6A), `scores` = 5 rows (1.2, 1.3, 1.4, 2.1, 2.2), all 100.

### Gate answers, 2026-09-20 (review/pilot.html)

- **D1 scores earned before naming: ask for the name before the first activity.** Done.
- **D2 the grade 6 1.3 distractor: make both languages the ceramic plate.** Done, and the rendering bug is fixed regardless.
- **D3 what next: fix the findings first, then start porting the remaining activity types.** Fixes done; porting not started.

### What was changed for D1, D2 and F2

**D1, the name gate.** One guard in the activity branch of the router in `js/app.js`, mirroring the one the leaderboard already had:

```js
if (!hasPlayer()) { setGrade(grade); location.hash = '#/name'; return; }
```

Browsing stays open: the grade picker and the lesson path still render without a name, so a child only meets the form when they actually start an activity, and only once. `setGrade` is called first so the name screen appears in that grade's colour world rather than the default.
Verified on a cleared profile: clicking activity 1.1 redirects to `#/name`, and saving the name returns to `#/g6/1.1`, the activity that was asked for, not the lesson list. Playing it then put **activity 1.1** into Supabase with 100 points and an empty queue, which is exactly the score the pilot lost.

**F2, the icon that printed as `[object Object]`.** The four renderers passed `icon` straight into a text node. All four now route it through the existing `text()` helper, the same one already used for every other translatable value:

`js/activities/pick.js:19`, `js/activities/match.js:18`, `js/activities/order.js:19`, `js/app.js:81`.

This is the fix that matters longer term: it is no longer possible for a differing icon to print as text, whatever the content does later.

**D2, the distractor itself, and a new corrections seam.** The Sinhala side of grade 6 activity 1.3 item 6 now reads the ceramic plate, so the two languages ask the same question and the icon collapses back to a plain string. There are now **zero non-string icons in all five data files**.

Correcting an original needed somewhere honest to live, because the parity gate exists precisely to stop the originals drifting. It follows the pattern `replaced` already set:

- `content/corrections.json` holds every deliberate change, each with `from`, `to` and a `why`.
- `scripts/lib/apply-corrections.mjs` applies them, and **throws if `from` no longer matches the original**, so a correction that goes stale fails loudly instead of quietly masking a real change.
- `scripts/extract.mjs` and `scripts/check-data.mjs` apply the identical list to the identical files, and both print every correction on every run. Grade 6 also carries them in `data/grade-6.json` under `corrections` as provenance.

Proven by breaking it on purpose: a wrong `from` exits 1 with
`CorrectionError: grade 6 si: 1.3 items.6.text is "කෑදර පුටුව", correction expects "..."`.

The Sinhala wording `සෙරමික් පිඟාන` is drafted, not Ishini's. It is flagged `"draft": true` and the checker prints "(drafted, awaiting review)" every run, so it cannot quietly become permanent.

**Gates after the change:** `check-data.mjs` all five sources match, `check-syllabus.mjs` 59/59 levels with the one pre-existing grade 9 3.4 warning. `sw.js` `CACHE` bumped `igw-v2` to `igw-v3`, required because both `data/` and `js/` changed.

**Not deployed.** Everything above is local and uncommitted; the live site still runs the old build.

### F4, found after the report was written, still open

The leaderboard decides which row is yours by **matching the nickname**, at `js/screens.js:102`:

```js
list.replaceChildren(...rows.map((r, i) => row(r, i + 1, r.nickname === player?.nickname)));
```

Seen live: two different students both called Ishini were each badged "You" on both rows. In a class where two children pick the same nickname, both see themselves marked on the other's row.
The fix needs no migration, because `leaderboard_grade` already selects `p.id as player_id` (`supabase/migrations/0001_init.sql:101`). The client simply never asks for it: add `player_id` to the select in `js/leaderboard.js` and compare `r.player_id === player?.id`. Two lines. Not done, because it arrived after the gate closed and was never one of the options.

### Two findings from the pilot

**F1 - Scores earned before naming are silently lost (behaviour decision for Pasindu).**
`pushScore()` in `js/leaderboard.js:57` starts `if (!getPlayer()) return;`, so an activity finished before the student picks a nickname is never sent *and never queued*. It is kept in `igw.progress` on the device, so the topbar star count includes it, but the leaderboard cannot.
Observed: Ishini played 1.1 first, then named herself. Topbar read **600** while the leaderboard read **500** - a visible 100 point gap on the same screen, and 1.1 is absent from `scores`.
It matters because the app does not ask for a name up front: the grade picker is the landing screen, so playing first and naming later is the natural path, not an edge case.
Three ways out, all small: gate the first activity behind the name screen; queue pre-name scores and attribute them on naming; or show the device total on the leaderboard with a "not counted yet" note. Not changed - this is a product call.

**F2 - Grade 6 activity 1.3 renders an icon as `[object Object]` (real bug, one line).**
On screen the "Ceramic plate" option shows the literal text `[object Object]` where its emoji should be.
Root cause: the two source files disagree on that distractor - English has "Ceramic plate" with `icon` 🍽, Sinhala has a different word with `icon` 🪑. Because the icons differ, the lockstep merge correctly wrapped the field as `{en, si}`, and it is the only non-string `icon` in all five data files (`data/grade-6.json`, lesson 1, activity 1.3, item 6).
The four renderers pass `icon` straight into a text node without translating it: `js/activities/pick.js:19`, `js/activities/match.js:18`, `js/activities/order.js:19`, `js/app.js:81`. The fix is to route it through the existing `text()` helper in `js/i18n.js:82`, which already handles exactly this shape.
Underneath it is the content mismatch carried over from `redesign-trilingual` (the Sinhala distractor is a chair, the English one is a plate). That half is Ishini and Dilini's call; the `[object Object]` half is ours and should be fixed regardless, since any future differing icon would break the same way.

**F3 (minor, content) - Sinhala typo in the originals.** හාවිත appears where භාවිත is meant (හ typed for භ), in at least the lesson 2 title and inside activity 2.1. It is faithful to the source files, so the parity gate will not flag it. Belongs on the typo list for Ishini alongside T1-T5.

**State of the work**
- Repo public at https://github.com/pasindu-premachandra/ict-game-world, 2 commits, both title only, contributors shows only Pasindu.
- README with 6 screenshots is on the repo root; screenshots live in `docs/screenshots/`.
- Supabase project `vjyypzmnbyfjbudusava` (Mumbai): schema applied, RLS proven, tables currently empty (test rows cleaned up).
- Grade 6 is playable end to end in both languages. Grades 7-9 have data but 10 of the 16 activity types have no UI, so they render as "coming soon". That is the next build task, and it is mechanical now the pattern exists.

**Traps that already cost time, do not rediscover them**
- Start Claude from `E:/Projects/freelance-projects/ict-game-world` or the Supabase MCP never loads (the project `.mcp.json` is only read from the cwd).
- Bump `CACHE` in `sw.js` on any deploy that changes a precached file, or browsers keep running the old build.
- Vercel's API could not link the GitHub repo (`namespaceId: null`); the browser import flow worked. Use the UI if the API refuses again.

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
- [x] D3 hotspot option sets recovered from the originals into `data/` (`scripts/lib/read-option-sets.mjs`)
- [x] D3 seven activity types ported - tf, input, hotspot, trace, bits, gate, query. 111 of 112 activities playable
- [x] F4 leaderboard "You" badge matches on player id, not nickname
- [x] D3 proof run - `evidence/ported-types-proof.txt`, 31 activities x 2 languages, 0 console messages, 0 overflow
- [ ] `scratch-hub` (g9 3.4) - its own task, see handoff 4
- [ ] The adventure set's 18 mini games - no UI yet

## Release step, learned the hard way

`sw.js` serves cache first, so **bump `CACHE` in `sw.js` on every deploy that changes any precached file**.
During this build the browser kept running an old `app.js` and the new routes looked broken; nothing was wrong with the code, the old worker was simply still serving `igw-v1`. Now on `igw-v4`.
The seven new activity modules are in `PRECACHE` too, or grades 7 to 9 would work online and break offline - the one failure mode a school lab would find first.

## Risk

Medium. The extraction is the dangerous step: a slip changes an answer in a game children are graded on, so `check-data.mjs` runs against `original/` and gates everything after it.
Grade 9 has no Sinhala source, so those strings stay empty until `syllabus-enrichment` or a teacher fills them - the app must show English rather than a blank. Measured after extraction: **grade 9 has 306 strings with no Sinhala and the adventure set 348**, and grades 6/7/8 have 6/29/4 strings identical in both languages that may or may not be genuinely untranslated. `check-data.mjs` prints all of this on every run, so the content task has a live worklist.
Leaderboard stores data about children: Sri Lanka PDPA No. 9 of 2022 puts the child threshold at 16, which is every student here, so nicknames only, no real names, and Ishini can delete rows.
Carried over and still open from `redesign-trilingual`: Sinhala typo fixes T1-T5, the G6 1.3 distractor, and the G8 lesson 5 title. They are content, they belong to `syllabus-enrichment`, and the data files can absorb them after extraction.
