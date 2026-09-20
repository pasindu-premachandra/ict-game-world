# Open Design brief - ICT Game World design system

Sent to Open Design as the prompt for the design-system run (skill: design-consultation + design-md).
Direction chosen at the gate: D2 = A "Game Lab".

## Product

ICT Game World: a Sinhala + English ICT learning game for Sri Lankan students in grades 6-9 (ages 11-15), following the NIE ICT syllabus.
Tamil comes later, so every text slot must also fit Tamil.
Made by Ishini and her friend, two teaching trainees, as their final-year project. Credit them in the footer. No college or batch branding.
Runs on old school-lab PCs (Windows, 1366x768, sometimes slow) and on students' Android phones (360-412px wide).

## Direction: Game Lab

- Gamified and chunky, like Duolingo: 3D-shadow buttons (`box-shadow: 0 5px 0 <darker>`, which the originals already use), rounded cards, bold friendly type.
- A lesson path map with done / current / locked nodes, instead of a plain grid.
- The robot mascot "ICT friend" (teal square robot with antennae, from the originals) reacts to answers: idle, happy, thinking.
- XP, stars (1-3 per activity), a combo streak.
- One colour world per grade, same components: grade 6 teal, grade 7 indigo, grade 8 orange, grade 9 a darker "night lab" so it feels older.
- Sri Lankan touch kept light: bilingual everywhere, local examples, one subtle pattern accent (for example a liyawela-inspired divider). No flags, no heavy heritage motifs.
- Playful for an 11-year-old, not babyish for a 15-year-old.

## Type

- Latin: Baloo 2 (display), Nunito (body).
- Sinhala: Yaldevi (display), Noto Sans Sinhala (body).
- Tamil, reserved for later: Baloo Thambi 2 (display), Noto Sans Tamil (body).
- Rules: no letter-spacing and no uppercase on Sinhala or Tamil; line-height at least 1.6 for them; Sinhala 1-2px larger than Latin at the same step.
- Switch fonts by `:lang(si)` / `:lang(en)`.

## Tokens to deliver

CSS custom properties in `tokens.css`: colour (neutrals, the 4 grade worlds each with base / dark / light, success, error, warning, info), type scale, spacing, radius, shadows (including the chunky 3D shadow), motion (durations, easings), z-index.
Per-grade theme via a class or attribute on `<body>`, for example `data-grade="7"`.

## Components to show

Top bar (grade chip, XP, combo, language switch සිං / EN, music toggle, trophy button) · grade picker card · lesson path node (done, current, locked) · activity list item · instruction callout · answer option (idle, selected, correct, wrong) · match card pair · order item with drag handle and up/down fallback · sort bucket with chips · pick checkbox card · true/false buttons · typed answer field with hint · binary bit toggle row · logic gate (AND/OR/NOT) · Scratch blocks (events, control, looks, motion, pen, sensing, variables colours) · result card with stars and points · name entry (nickname, 8 avatar choices, class code) · leaderboard (tabs, podium, rows, "you" row) · toast · progress ring · footer credit.

## Key screens (phone 375 and desktop 1366)

1. Welcome and name entry.
2. Home: grade picker.
3. Grade 7 lesson path.
4. A match activity in Sinhala (real content below).
5. Result screen.
6. Leaderboard (class 7B, this week).

## Motion rules

Transform and opacity only. Durations 120-600ms. Pop easing `cubic-bezier(.34,1.56,.64,1)`, standard easing `cubic-bezier(.2,.8,.2,1)`.
Every animation confirms a student action: correct pop + spark burst, wrong shake + coral flash, stars landing one by one, path drawing to the next lesson, drag lift and snap.
`prefers-reduced-motion: reduce` turns all of it into instant state changes.

## Accessibility

Touch targets at least 44px. Text contrast at least 4.5:1. Visible focus rings. Status never by colour alone (always ✓ / ✗ or a label).

## Real content for the mockups

- Grade 6: Importance of Computers / පරිගණකයේ වැදගත්කම · Use the Computer Laboratory Safely / පරිගණක විද්‍යාගාරය ආරක්ෂිතව භාවිතය · Operating System and File Management / මෙහෙයුම් පද්ධති හා ගොනු හැසිරවීම · Using Mouse and Keyboard / මූසිකය හා යතුරු පුවරුව · Algorithm & Flow Charts / ඇල්ගොරිතම හා ගැලීම් සටහන් · Using the Internet / අන්තර්ජාලය භාවිතය
- Grade 7: Central Processing Unit / මධ්‍ය සැකසුම් ඒකකය · Operating System / මෙහෙයුම් පද්ධතිය · Security of Computer System / පරිගණක පද්ධතියේ ආරක්ෂාව · Word Processing / වදන් සැකසීම · Programme Development / ක්‍රමලේඛ සංවර්ධනය · Presentation Software / සමර්පණ මෘදුකාංග · Using Internet / අන්තර්ජාලය භාවිතය
- Grade 8: Number Systems / සංඛ්‍යා පද්ධති · Configuring & Formatting / පරිගණකය වින්‍යාස හා සිටුවම් කිරීම · Word Processing / වදන් සැකසීම · Programming / ක්‍රමලේඛ ගොඩනැගීම · Logic Gates / භෞතික ආගණනය · Internet & Web / අන්තර්ජාලය
- Grade 9: Preparation of Computer Specifications · Electronic Spreadsheets / විද්‍යුත් පැතුරුම්පත් · Programming / ක්‍රමලේඛ ගොඩනැගීම · Use of Microcontrollers / ක්ෂුද්‍ර පාලක · Computer Networks / පරිගණක ජාලකරණය · ICT and Society / තොරතුරු තාක්ෂණය සහ සමාජය
- Match activity sample (grade 6, 1.2), English: Speed & Efficiency - Can perform billions of tasks in a second · Accuracy - Gives correct information when correct data is given · Storage Capacity - Can store a huge amount of data.

Note: Sinhala titles above already apply the proposed typo fixes (භාවිතය, මූසිකය, මෘදුකාංග, භෞතික). They are pending Ishini's approval (D5).

## Run prompt actually sent (2026-09-19 18:04, run 8d0d1e06-60e4-4b35-8ed2-ad037db545fe)

Project `ict-game-world-design-system`, skill `design-consultation`, extra skill `design-md`. Reference files copied into the project: `reference/brief.md` (this file), `reference/original-grade-6-english.html`, `reference/original-grade-8-sinhala.html`.

> Build the complete design system for "ICT Game World", a Sinhala + English ICT learning game for Sri Lankan students in grades 6-9 (ages 11-15). Read reference/brief.md first: it is the full brief and the source of truth (direction "Game Lab", fonts, tokens, components, 6 key screens, motion rules, accessibility, real lesson titles). The two files in reference/ are the students' current game (made by the two creators) - reuse their spirit: chunky 3D-shadow buttons, the teal square robot mascot with antennae, playful but clear. Ignore and do NOT reproduce their footer badge ("Ruwanpura NCoE", "2022 - 2024", "Batch"); that branding is dropped.
>
> Deliver these files in the project root:
> 1. DESIGN.md - direction, principles, colour, type (Latin + Sinhala, Tamil reserved), spacing, radius, elevation, motion, accessibility, component rules, do/don't. Plain-language, so a teaching trainee can follow it.
> 2. tokens.css - CSS custom properties for everything in DESIGN.md, plus a per-grade theme switched by data-grade="6|7|8|9" on body (6 teal, 7 indigo, 8 orange, 9 darker "night lab"), and font switching by :lang(si) / :lang(en).
> 3. index.html - one self-contained showcase page (links tokens.css, Google Fonts only: Baloo 2, Nunito, Yaldevi, Noto Sans Sinhala) with: a cover, colour + grade worlds, type specimens in English AND Sinhala, spacing/radius/shadow, every component in the brief with its states, the motion samples running live (respect prefers-reduced-motion), and the 6 key screens drawn as phone frames (375px) plus a desktop frame (1366px) for the lesson path. Use real Sinhala and English content from the brief. Make the page itself fully responsive.
>
> Hard rules: footer credit reads "Made by Ishini Premachandra & Dilini Wijesooriya" (no college or batch branding anywhere). Never use em dashes or en dashes in any copy; use a plain hyphen. No letter-spacing or uppercase on Sinhala text. Touch targets at least 44px, text contrast at least 4.5:1, status never shown by colour alone. Animate only transform and opacity. No external images; draw icons and the mascot as inline SVG or emoji.
