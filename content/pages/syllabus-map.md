# Page spec: Syllabus Map

The page that proves the game teaches the syllabus.
Built by the redesign task against `css/tokens.css`. This file is the content and the structure, not the markup.

## Why it exists

A teacher or an examiner opens the game and asks one question: does this cover the syllabus?
Today the only way to answer is to play all 113 activities.
This page answers it in one screen, per grade, straight from `content/syllabus-map.json`.

## Where the data comes from

`content/syllabus-map.json`, joined to the activity list the app already holds.
No hand-written copy in this page except the labels below.
If `check-syllabus.mjs` is green, this page is correct by construction.

## Route

`#/syllabus` for the current grade, `#/syllabus/7` to jump to a grade.
Reachable from the top bar trophy row and from the footer of every grade home screen.

## Structure

1. **Header.** Grade chip, the grade's colour world, the title, and one line: "Every skill the NIE syllabus asks for, and where you practise it."
2. **Coverage bar.** One bar per grade: covered periods out of 30, with the number beside it, never colour alone. All four grades read 30 of 30 today.
3. **Grade tabs.** 6, 7, 8, 9. Keyboard reachable, 44px minimum.
4. **Competency groups.** One card per numbered competency (for example "1. Appreciates the importance of computers"), holding its levels.
5. **Level rows.** One row per competency level:
   - the level number, for example `1.3`
   - the level title from the syllabus
   - the periods it carries
   - a status chip: covered, or new this version
   - the activities that cover it, each a link that opens that activity
6. **Footer note.** The syllabus edition, the four PDF links, and the line "Implemented from 2018, still in force for the 2026 school year."

## Copy

| Slot | English | Sinhala |
|---|---|---|
| Page title | Syllabus Map | විෂය නිර්දේශ සිතියම |
| Subtitle | Every skill the syllabus asks for, and where you practise it | විෂය නිර්දේශය අපේක්ෂා කරන සෑම නිපුණතාවක්ම හා ඔබ එය පුහුණු වන තැන |
| Coverage label | Covered | ආවරණය වී ඇත |
| Periods | periods | කාලච්ඡේද |
| Status: covered | Covered | ආවරණය වී ඇත |
| Status: new | New this version | මෙම අනුවාදයේ අලුත් |
| Competency heading | Competency | නිපුණතාව |
| Level heading | Competency level | නිපුණතා මට්ටම |
| Activities heading | Practise it here | මෙහි පුහුණු වන්න |
| Footer | NIE syllabus, implemented from 2018 | ජාතික අධ්‍යාපන ආයතනයේ විෂය නිර්දේශය, 2018 සිට ක්‍රියාත්මකයි |

## States

- **Covered.** Tick plus the word, never the tick alone.
- **New this version.** A plus plus the words, in the grade's accent.
- **Bonus activity.** Listed under the grade but outside the competency groups, in a small "Extra challenges" card at the bottom, with the line "Beyond the syllabus, for anyone who wants more." Grade 8's three logic gate activities live here.

## Responsive

- Phone: one column, competency cards stack, the activity links wrap onto their own line under the level title.
- Desktop: two columns of competency cards, coverage bar full width at the top.
- The level number column is fixed width so the numbers line up.

## Accessibility

Real headings, `h1` down to `h3`, in order. The coverage bar is a `progress` element with a visible number beside it. Status is always a word, never only a colour or an icon.
