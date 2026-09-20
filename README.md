<h1 align="center">ICT Game World</h1>

<p align="center">
  <b>ICT games for Sri Lankan school students, in Sinhala and English.</b><br/>
  Grades 6 to 9, built on the NIE syllabus, playable on a phone or an old lab PC.
</p>

<p align="center">
  <img alt="activities" src="https://img.shields.io/badge/activities-112-007e74?style=flat" />
  <img alt="mini games" src="https://img.shields.io/badge/bonus%20mini%20games-18-4f4cda?style=flat" />
  <img alt="grades" src="https://img.shields.io/badge/grades-6%20to%209-c43f00?style=flat" />
  <img alt="languages" src="https://img.shields.io/badge/languages-%E0%B7%83%E0%B7%92%E0%B6%82%20%C2%B7%20EN-43d0f9?style=flat" />
  <img alt="syllabus coverage" src="https://img.shields.io/badge/NIE%20coverage-59%2F59%20levels-03a14a?style=flat" />
  <img alt="build step" src="https://img.shields.io/badge/build%20step-none-555?style=flat" />
  <img alt="offline" src="https://img.shields.io/badge/offline-PWA-f2b036?style=flat" />
</p>

<p align="center">
  <sub>Made by <b>Ishini Premachandra</b> and <b>Dilini Wijesooriya</b></sub>
</p>

---

## What this is

Sri Lanka's junior secondary ICT syllabus is taught in schools where the computer lab is often old, the
connection is often gone, and most students read Sinhala before they read English. This is a set of
practice games for that room.

It started as nine separate HTML files, one per grade and language, each with its own copy of the game
engine glued to its own copy of the content. This repository is those nine files rebuilt as **one app**:
a shared engine, one bilingual data file per grade, and a design system that changes colour for each
grade. It installs to a phone, works with the network off, and keeps a class leaderboard when the
network comes back.

Every activity maps to a numbered competency level in the National Institute of Education syllabus, and
a script checks that mapping on every run.

---

## A look at it

<table>
<tr>
<td width="33%" valign="top">
<img src="docs/screenshots/grade-picker.png" alt="Grade picker showing four cards, one per grade, each in its own colour" /><br/>
<sub><b>Pick a grade</b> - each grade is its own colour world. Grade 9 is a dark night lab, so it feels older than grade 6.</sub>
</td>
<td width="33%" valign="top">
<img src="docs/screenshots/lesson-path.png" alt="Grade 6 lesson list with activities grouped under each lesson" /><br/>
<sub><b>Work through the lessons</b> - activities grouped by lesson, with stars for a best score.</sub>
</td>
<td width="33%" valign="top">
<img src="docs/screenshots/activity-sinhala.png" alt="Flow chart symbol matching activity rendered in Sinhala on a phone" /><br/>
<sub><b>Play in Sinhala or English</b> - one tap switches the language, fonts and type scale together.</sub>
</td>
</tr>
<tr>
<td width="33%" valign="top">
<img src="docs/screenshots/name-entry.png" alt="Name entry screen with a nickname field, eight avatars and a class code field" /><br/>
<sub><b>Pick a nickname</b> - a nickname, a buddy and an optional class code. No real names are ever collected.</sub>
</td>
<td width="33%" valign="top">
<img src="docs/screenshots/leaderboard.png" alt="Class leaderboard with My class and Everyone tabs and the player's own row highlighted" /><br/>
<sub><b>Compare with the class</b> - your own row is marked. Works offline and syncs when the connection returns.</sub>
</td>
<td width="33%" valign="top">
<img src="docs/screenshots/activity-desktop.png" alt="Sorting activity on a desktop screen, in Sinhala" /><br/>
<sub><b>Same game on a lab PC</b> - one layout, from a 360px phone up to a desktop.</sub>
</td>
</tr>
</table>

---

## The four grade worlds

Components never change between grades. Only `data-grade` on `<body>` changes, and the colours follow.

| Grade | World | Base | Page |
|---|---|---|---|
| 6 | Teal | `#007e74` | `#edfaf8` |
| 7 | Indigo | `#4f4cda` | `#f4f6ff` |
| 8 | Orange | `#c43f00` | `#fff4ef` |
| 9 | Night lab | `#43d0f9` | `#0d1626` |

Headings use Baloo 2 in English and Yaldevi in Sinhala; body text uses Nunito and Noto Sans Sinhala.
Sinhala gets a slightly larger type scale and a taller line height, because its letters stack above and
below the line and cramping them breaks the shapes.

---

## Syllabus coverage

Checked against the four official NIE syllabi on every run of `scripts/check-syllabus.mjs`.

| Grade | Competency levels | Periods | Activities |
|---|---|---|---|
| 6 | 14 / 14 | 30 | 28 |
| 7 | 18 / 18 | 30 | 36 |
| 8 | 10 / 10 | 30 | 22 |
| 9 | 17 / 17 | 30 | 26 |
| **Total** | **59 / 59** | **120** | **112** |

Plus 18 bonus mini games folded in from the grade 9 ICT Adventure set.

---

## How it is put together

**No build step.** Plain ES modules, plain CSS, served as files. There is nothing to compile, which
means a teacher can open `index.html` and it runs.

```
index.html               the shell
css/tokens.css           the design system: colours, type, spacing, motion
css/app.css              screens and components, built only from those tokens
js/app.js                hash router and the three main screens
js/activities/*.js       one module per activity type, twelve of them
js/activities/rounds.js  the shell the one-question-at-a-time types share
data/grade-N.json        lessons, activities and answers, {en, si} on every string
content/                 the syllabus additions, the corrections and grade 9's Sinhala overlay
original/                the nine source games, untouched, as the parity baseline
scripts/                 extraction and the checks
supabase/                the leaderboard schema
```

### The data model is the point

Every piece of text is either a plain string, or `{ en, si }` when it is something a child reads:

```jsonc
{
  "id": "1.3",
  "type": "pick",
  "name": { "en": "Pick the Embedded Computer Devices", "si": "නිහිත පරිගණක සහිත උපකරණ තෝරන්න" },
  "items": [
    { "text": { "en": "Smartphones", "si": "සුහුරු ජංගම දුරකථන" }, "icon": "📱", "correct": true }
  ]
}
```

Icons and answers stay plain, so a translator can never accidentally translate `true`. There is room for
`ta` when Tamil is added.

A few activities answer by clicking one of a fixed set of things - a port, a formatting tool, a chart type -
and every round of the activity shares that set. Those live in `optionSets`, beside `lessons` rather than
inside an activity, keyed by activity id:

```jsonc
"optionSets": {
  "2.1": [
    { "key": "vga", "icon": "🖥️",
      "name": { "en": "VGA Port", "si": "VGA කොවෙනිය" },
      "desc": { "en": "For old-style monitors", "si": "පැරණි සංදර්ශක සඳහා" } }
  ]
}
```

In the original games these were constants sitting outside the content, picked by an `if` on the activity
id inside the renderer, which is how they nearly got left behind. They are content, so they travel in the
data file; they sit outside `lessons` so the parity check below can still compare activity for activity.

### Nothing was lost in the rebuild

The nine original games are kept byte for byte in `original/`. `scripts/check-data.mjs` rebuilds each
language's view out of the JSON and compares it against the original file it came from, so extraction is
provably lossless rather than hopefully lossless.

```
$ node scripts/check-data.mjs
ok    grade 6  8 lessons, 28 activities (22 original + 6 new), en + si original rebuild matches exactly
        si 1.3 items.6.text deliberately corrected: "කෑදර පුටුව" -> "සෙරමික් පිඟාන" (drafted, awaiting review)
        si 1.3 items.6.icon deliberately corrected: "🪑" -> "🍽️"
ok    grade 7  8 lessons, 36 activities (29 original + 7 new), en + si original rebuild matches exactly
ok    grade 8  7 lessons, 22 activities (14 original + 8 new), en + si original rebuild matches exactly
        lesson 5 deliberately replaced: "Logic Gates" -> "Physical Computing"
ok    grade 9  7 lessons, 26 activities (19 original + 7 new), en original rebuild matches exactly
ok    adventure  6 lessons, 18 mini games, rebuild matches original exactly

Translation notes (not failures):
  - grade 9: 2 strings read the same in both languages (may be untranslated, may just be a term like "CPU")
  - adventure: 348 strings have no Sinhala yet
```

Grade 9 is the one grade with no Sinhala original, so its Sinhala is an overlay rather than a second file.
`content/grade-9.sinhala.json` is keyed by the English string, and a key that matches nothing fails the
extract with the key named, so the overlay cannot quietly rot as the English changes underneath it.

---

## Running it

Any static server will do:

```bash
npx serve .
```

Then open the address it prints. To rebuild the data files from the originals and re-run the checks:

```bash
node scripts/extract.mjs        # original/ + content/ -> data/
node scripts/check-data.mjs     # parity against the originals
node scripts/check-syllabus.mjs # NIE competency coverage
```

---

## The leaderboard, and children's data

Every player is a schoolchild under 16, which is the threshold for a child under Sri Lanka's **Personal
Data Protection Act No. 9 of 2022**. The schema therefore stores a **nickname, an avatar key and an
optional class code**, and nothing else. No real names, no email, no device fingerprint beyond a random
id the browser generates for itself.

- Row level security is on, and there is **no anonymous write path to the tables at all**.
- Scores go in through a `submit_score()` function that validates every argument and keeps only a
  student's best score, so replaying an activity can never cost them points.
- Scores save to the device first and sync when the connection returns, so a dropped connection never
  blocks play or loses progress.

---

## Offline

Self-hosted fonts, subsetted to Latin and Sinhala, come to 829 KB across 12 files, and a service worker
precaches the shell, the fonts and all five data files. Once the app has been opened, it runs with the
network off. Verified by stopping the server mid-session and reloading.

---

## Status

All four grades are playable end to end in both languages: **111 of the 112 activities**, across twelve
activity types.

Two things are not wired to a screen yet. Grade 9's Scratch Code Builder is a small app of its own rather
than an activity - a hub of control structures, each with its own block-dragging puzzles - so it is being
done separately; it sits outside the numbered syllabus levels, so coverage is still 59 of 59 without it.
The 18 bonus mini games from the ICT Adventure set are extracted and parity-checked but have no UI.

Grade 9 is now fully Sinhala too. It had no Sinhala source file at all, so its 202 strings were drafted
against the NIE Sinhala-medium terms and live in `content/grade-9.sinhala.json`; every activity they touch
carries `siDraft: true` until Ishini reviews it. That leaves the 18 bonus mini games as the only
untranslated content: their question stems came translated in the original, but all 348 answer options did
not. Newly drafted Sinhala stays flagged until a teacher reviews it, and the app falls back to English
rather than showing a blank.

---

<p align="center">
  <sub>Made by <b>Ishini Premachandra</b> and <b>Dilini Wijesooriya</b></sub>
</p>
