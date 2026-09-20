# syllabus-enrichment - fill the NIE syllabus gaps and add the new pages

Mode: `/pt` default (context, plan, **gate**, build, prove, hand over). Folder: `freelance-projects` = real work, full flow.
Owners: Ishini Premachandra and Dilini Wijesooriya. Credit them; no college or batch branding anywhere.
Sibling task: `.claude/tasks/redesign-trilingual/` owns the redesign and the app build. **This task owns the content only.** Its output is what that task's step 2 (`data/grade-6..9.js`) will consume, so nothing here is thrown away.

Gate surface: `review/plan.html`. Evidence: `evidence/`.

## Problem

The game teaches 86 activities across 25 lessons, and every one of them is on-syllabus.
But measured against the four official NIE ICT syllabi, roughly a quarter of the prescribed content has no activity at all, and one grade 8 lesson teaches a grade 10 topic in place of its own.
Ishini will be assessed on this, so the gap is worth closing before the redesign puts a coat of paint on it.

## Root cause

Not a bug. The content was written from the textbooks and lesson experience rather than from the syllabus grid, so the competency levels that are easy to make into a game got activities and the rest did not.
The full mapping, with grep evidence per claim, is in `evidence/syllabus-gap-map.md`.

The four things that matter:

- **Grade 8 competency 5**, `eGr08Syl-ICT.pdf` p.2, is "Uses a software package for physical computing", 5 of 30 periods: LEDs, controllable devices, two logic levels. The game's lesson 5 is an AND / OR / NOT truth table lab, which is O/L material. `LED`, `sensor`, `actuator`, `physical comput` return zero hits in `grade 8 english.html`.
  This also answers the open question in the other task: the Sinhala title `භෞතික ආගණනය` means "physical computing" and was correct; the English "Logic Gates" is the drift.
- **Grade 7 competency 5.3 and 5.4**, variables and bugs, 3 periods, zero activities. `\bvariable\b` and `\bbug\b` return zero hits.
- **Grade 7 competency 7.4**, hacking, piracy, cyber bullying, 2 periods, zero activities. `cyber`, `piracy`, `hacking` return zero hits.
- **Grade 6 competency 1.3, 1.4 and 4.2**, software, where computers are used, and audio and video software, about 5 periods, zero activities.

The 2018 syllabi are still the live ones. The junior secondary reform moved to January 2027, and the Ministry told schools to teach the previous syllabus through 2026 (sources in the gap map).

## Gate outcome (2026-09-20, GO)

Answered in `review/plan.html`, every question option A, no extra notes.
**O1** rebuild grade 8 lesson 5 as Physical Computing and keep the gate lab as a bonus round.
**O2** both new lesson pages and new app pages.
**O3** Syllabus Map, Word Bank, Teacher Notes.
**O4** close every gap, about 24 activities, 86 becomes about 110.
**O5** I draft the Sinhala, flagged as draft until Ishini reviews.

**Concurrent build, noted 2026-09-20 07:56.** While this task was running, another session started the redesign task's build in the same folder: `original/` copied, `data/grade-6..9.json` + `adventure-9.json` extracted, `scripts/extract.mjs`, `scripts/check-data.mjs` and `scripts/lib/` written, the app shell begun (`index.html`, `css/`, `js/app.js`, `js/activities/`), and git initialised on `master` with no commits yet.
Nothing here collides with it: this task only added `content/`, `scripts/check-syllabus.mjs` and its own task folder.
One follow-up for whoever merges: `content/baseline-activities.json` was regex-extracted from the originals before `data/*.json` existed. That extraction is reversibility-checked and therefore stronger, so `check-syllabus.mjs` should read `data/` and `baseline-activities.json` should go. It was left alone rather than edited under a running build.

## Options (decided at the gate)

- **O1 Grade 8 lesson 5.** **A rebuild it as Physical Computing and keep the gate lab as a bonus round (pick)** - syllabus is covered, nothing she already built is thrown away, and the gate lab becomes a stretch activity. / B replace the gate lab outright - cleaner, loses working work. / C rename only - dishonest, the content still does not match.
- **O2 What "a few pages" means.** **A both: new lesson pages for the uncovered competencies, plus three new app pages (pick)** / B new lesson pages only / C new app pages only.
- **O3 The three new app pages.** **A Syllabus Map, Word Bank, Teacher Notes (pick)** - the Syllabus Map shows every competency level against the activity that covers it, which is the single most useful page she can put in front of an examiner; Word Bank is the ICT terms in English and Sinhala side by side; Teacher Notes is a one-page printable per grade. / B Syllabus Map only. / C a plain progress page instead.
- **O4 How much new content.** **A close every gap: about 24 new activities and 5 new lessons, taking 86 to about 110 (pick)** / B close only the zero-coverage gaps, about 16 activities / C close only grade 8.
- **O5 Sinhala for the new content.** **A I draft it, Ishini reviews before it ships, marked draft in the data until she signs off (pick)** / B English first, Sinhala later / C leave the new content English only.

## Plan

1. `evidence/syllabus-gap-map.md` - done, the mapping and its evidence.
2. `content/syllabus-map.json` - every competency level from the four PDFs as rows (`grade`, `competency`, `level`, `content`, `periods`), the machine-readable spine for the check script and the Syllabus Map page.
3. `content/grade-6.additions.js` - lesson 7 "Software Around Us" (C1.3, C1.4) and lesson 8 "Sound and Video" (C4.2), 6 activities, reusing the existing `bucket`, `match`, `pick` and `order` engines only.
4. `content/grade-7.additions.js` - lesson 2 gains file properties; lesson 5 gains variables and a find-the-bug; new lesson 8 "Safe, Legal and Kind Online" (C7.1b, C7.2b, C7.4), 7 activities.
5. `content/grade-8.additions.js` - lesson 5 rebuilt as Physical Computing (LED on and off, LED pattern order, sensor and actuator match, the existing gate lab kept as a bonus round); lesson 3 gains a table-insert round; new lesson 7 "Apps on Phones and Smart Devices" (C4.1b), 6 activities.
6. `content/grade-9.additions.js` - lesson 2 gains COUNT, COUNTA and data sorting; lesson 3 gains a nested-iteration trace and an array-variable input; new lesson 7 "ICT All Around Us" (C6.1: e-Commerce, m-Commerce, e-Health, e-Government, office automation, digital divide), 5 activities.
7. Sinhala for every new string, in the same file, `{en, si}` shaped, with `siDraft: true` until Ishini reviews. Terms read off `evidence/syllabus/si-pages/*.png`, never machine-extracted (the PDFs' text layer is broken, see the gap map).
8. `scripts/check-syllabus.mjs` - joins `syllabus-map.json` to every activity and fails if a competency level has no activity, if an activity claims a level that does not exist, or if a string is missing `si`.
9. The three new app pages, specified as content and structure in `content/pages/*.md` so the redesign task can build them against `tokens.css`: Syllabus Map, Word Bank, Teacher Notes.
10. Update `redesign-trilingual/README.md` step 2 to read from `content/` and tick its open decision on the grade 8 title.

## Proof

- `node scripts/check-syllabus.mjs` prints a per-grade table and exits 0: every competency level in all four syllabi has at least one activity, every activity maps to a real level, every new string has `en` and `si`.
- Counts before and after, from the same extractor used for the baseline: 86 activities and 25 lessons in, about 110 and 30 out, with the delta listed per grade.
- Every new activity's answer key spot-checked against the syllabus line it claims, recorded in `evidence/new-content-review.md` so Ishini can check the content without reading code.
- Sinhala page images for the terms used, in `evidence/syllabus/si-pages/`.
- No app code runs in this task, so there is no Playwright pass here. The playable proof belongs to the redesign task's build.

## Progress

- [x] Syllabus PDFs downloaded, 8 files, `evidence/syllabus/`
- [x] Reform status confirmed: 2018 syllabus still live through 2026
- [x] Gap map with grep evidence per claim (`evidence/syllabus-gap-map.md`)
- [x] Sinhala syllabus pages rendered to images (text layer is broken)
- [x] Gate: `review/plan.html` - GO, all option A (render-checked 1366 and 375, `evidence/gate-*.png`)
- [x] 2 `content/syllabus-map.json` - 59 competency levels, all four grades, 120 periods
- [x] 3 grade 6 additions - lessons 7 and 8, 6 activities (C1.3, C1.4, C4.2)
- [x] 4 grade 7 additions - 2.5, 5.5, 5.6 and lesson 8, 7 activities (C2.4, C5.3, C5.4, C7.1, C7.2, C7.4)
- [x] 5 grade 8 additions - lesson 5 rebuilt as Physical Computing (gate lab kept as 5.4-5.6 bonus), 3.3 table, lesson 7, 7 activities (C3.1, C4.1, C5.1)
- [x] 6 grade 9 additions - 2.4, 2.5, 3.4, 3.5 and lesson 7, 7 activities (C2.4, C3.3, C3.4, C6.1)
- [x] 7 Sinhala for all new content, `siDraft: true`, terms read off the NIE Sinhala syllabus page images
- [x] 8 `node scripts/check-syllabus.mjs` green - 59/59 levels, 120/120 periods, 86 to 113 activities; guard proven by breaking the map on purpose (exit 1)
- [x] 9 three page specs in `content/pages/` - syllabus-map, word-bank (48 seed terms), teacher-notes
- [x] 10 sibling README updated - step 2 merges `content/`, step 10b adds the three pages, G8 title decision closed

## Risk

Medium.
The grade 8 change is the only one that touches work Ishini already built, and O1 keeps it rather than deleting it.
New Sinhala is AI-drafted and must be reviewed by her before classroom use; it stays flagged in the data until then.
This is her assessed final-year project, so she has to be able to explain every new activity, which is why the answer keys are written out in plain language in `evidence/new-content-review.md` rather than only living in code.
Low technical risk: no app code changes here, and `check-syllabus.mjs` is the guard.
