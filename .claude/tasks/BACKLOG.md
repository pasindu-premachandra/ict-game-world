# ICT Game World - implementation backlog

What is designed and signed off but **not built yet**, audited 2026-09-20 against the code and against
`DESIGN.md` in the Open Design project `ict-game-world-design-system`.

This file exists because the gap turned out to be much bigger than the two items the
`codebase-and-infra` handoff was tracking, and because three sessions now run in parallel and need one
shared list to avoid two people building the same thing.

**Ownership right now**

| Area | Owner |
|---|---|
| `scratch-hub` (g9 3.4) | parallel session, `.claude/tasks/scratch-builder/` - and its scope grew: Ishini says the Scratch builder belongs to every grade, so it is moving to the home page rather than staying inside grade 9 |
| Sinhala translations | parallel session. Grade 9 closed in `5b9e098`, which also fixed a blind spot I introduced: the gap scanner was not looking inside `optionSets`. The adventure set's 348 strings are outstanding |
| Adventure set, 18 mini games | `.claude/tasks/adventure-set/` |
| Section 2, the reward layer | **in flight as of `7595337`** - `js/audio.js` (84 lines, oscillator cues, nothing added to the precache), `js/motion.js` (96 lines, the four `DESIGN.md` moments) and `js/reward.js` (104 lines, streak, stars, floating points, confetti) appeared untracked while this file was being written. Items 2.1 to 2.6 look covered. **Confirm with whoever owns it before touching them.** |
| Section 3, the robot, and section 4, the diverging screens | **unowned** |

Do not start an unowned item without saying so here first. This table went stale within an hour of being
written, so check `git log` and `git status` before trusting it.

---

## 1. Content that has no screen

| # | Item | Size | Notes |
|---|---|---|---|
| 1.1 | `scratch-hub`, g9 3.4 | large | Nested sub-app: hub of 3 control structures, each with block-dragging puzzles, plus workspace, palette and program checker (`original/grade-9/english-medium.html:1174-1520`). `SCRATCH_STRUCTURES` sits **outside** the `LESSONS` literal, so it is not in `data/` yet either. The 7 `--scratch-*` block-colour tokens are declared for it and unused. Outside the numbered syllabus levels, so coverage stays 59/59 without it. **Parallel session.** |
| 1.2 | Adventure set, 18 mini games | ~~medium~~ **done 2026-09-20** | `data/adventure-9.json`, 6 themed sets, three kinds: `mcQuiz` 11, `sortGame` 4, `memoryGame` 3. Bonus content per gate D3 in `redesign-trilingual`, so not counted in the 112. Built and proven 2026-09-20: 18/18 play to 100 in both languages, bonus rows on grade 9 lessons 1-6. One step open, the Supabase migration that lets bonus scores reach the class board. See `adventure-set/README.md`. |

## 2. The reward layer - designed, tokenised, never written

`css/app.css` is 441 lines with **zero `@keyframes` and two `transition:` declarations.** These tokens are
declared in `tokens.css` and referenced **zero** times anywhere in the app:

```
--dur-reward  --ease-pop  --stagger  --shadow-drag  --shadow-float  --press-depth
--combo  --star-edge
--bot-body  --bot-face  --bot-pins  --bot-antenna  --bot-hands  --bot-eye
--node  --node-current
--scratch-motion  --scratch-looks  --scratch-events  --scratch-control
--scratch-sensing  --scratch-variables  --scratch-pen
```

| # | Item | Notes |
|---|---|---|
| 2.1 | `js/audio.js` | **Never created.** Plan step 6 in `codebase-and-infra` asked for it; screen S1 has a music toggle; `DESIGN.md` lists one in the top bar; the originals had `sfx.correct/wrong/win/click`. |
| 2.2 | `js/motion.js` | **Never created.** Step 8 "motion layer" in `redesign-trilingual` is still unchecked. `DESIGN.md` names exactly four moments: correct pop with sparks, wrong shake with a coral flash, stars landing one by one with `--stagger` between them, and the path drawing to the next lesson. Reduced motion must take every duration to 0ms and just show the end state - `tokens.css` already does that half. |
| 2.3 | Combo / streak | The flame `x3` pill in the top bar (S2, S3, S4) and the combo banner on the result (S5). `--combo` is flame orange and unused. The originals scaled XP by the combo. |
| 2.4 | Floating `+XP` and the XP pill | Originals had `floatScore('+15 XP')`. S5 shows a `+45 XP` pill. |
| 2.5 | Confetti on three stars | Originals fired `confetti(60)`. |
| 2.6 | Drawn stars | The app prints the `★` character. The design has filled and empty stars with a `--star-edge` outline, landing one at a time. |
| 2.7 | Trophy button in the top bar | In `DESIGN.md`'s top-bar list and in S2/S3/S4. No destination exists for it yet either. |

## 3. The robot friend

| # | Item | Notes |
|---|---|---|
| 3.1 | The robot, three moods | `DESIGN.md`: "A teal square robot with two antennae. It has three moods: idle while waiting, happy after a right answer, thinking while checking or giving a hint. It keeps its own colours in every grade world (body #00beab, face #88edda)." Six `--bot-*` tokens, zero uses. It appears on S1, S2, S4 and S5. |
| 3.2 | Instruction callout | `DESIGN.md`: "the robot in a speech bubble, one short sentence in each language." The app renders a plain `<p class="instruction">`. This is how instructions are supposed to reach the child, so 3.1 and 3.2 are one job. |

## 4. Screens that diverge from the signed-off design

| # | Screen | Designed | Built |
|---|---|---|---|
| 4.1 | Lesson path (S3) | Zig-zag journey: circular nodes (`--node` 72px, `--node-current` 84px), solid connectors behind, dotted ahead, per-lesson stars, a progress ring (2/7), and **done / current / locked** states with a padlock | Flat `<ol>` of headings and links. **No progressive locking at all** - every activity is open from the start |
| 4.2 | Grade picker (S2) | One wide card per grade with lesson and activity counts, a chevron, and a "Your class" tick on the student's own grade | 2x2 grid of bare numbers |
| 4.3 | Activity chrome (S4) | Close `X`, segmented progress bar, combo pill, robot delivering the instruction | Crumb link, heading, plain paragraph, `1 / 6` text |
| 4.4 | Result (S5) | Robot, drawn stars, `+XP` pill, points and combo rows, **"Next activity"** primary button | `100 points`, `★` text, "Back to lessons" + "Try again" |
| 4.5 | Avatars (S1) | Eight drawn icon buddies in coloured circles, chosen one gets a ring and a tick | Eight emoji faces |
| 4.6 | Leaderboard (S6) | Tabs, **a podium for the top three**, rows, "You" row | Tabs and rows only, no podium |

**4.7 - no "Next activity" button.** `t('next')` is defined in `js/i18n.js` and never used. A child returns
to the lesson list after every single activity. Of everything on this page this is the one item that is a
plain UX defect rather than missing polish, and it is roughly a ten-minute fix.

**4.8 - the app shows one language at a time; the design shows both.** This was an open question until
`DESIGN.md` settled it. It says, twice:

> Do put Sinhala and English side by side with each language in its own `lang`.

> Activity list item: type icon, **English and Sinhala title**, then stars or a padlock.
> Instruction callout: the robot in a speech bubble, **one short sentence in each language**.

S1, S3, S4 and S5 all stack the two languages, with the සිං/EN switch choosing which is *primary* rather
than which is *shown*. The build treats the switch as an either/or. This changes every screen, so it wants
Pasindu's confirmation before anyone builds to it - but it is a divergence from a signed-off system, not an
open design question.

## 5. Smaller, and things already fine

- **Tamil.** The data model keeps room for `ta`, `tokens.css` has a `:lang(ta)` block, the fonts are named
  but not loaded. Gate D4 said Sinhala and English only for now, so this is deliberate, not a gap.
- **The liyawela divider.** `DESIGN.md`: "The one Sri Lankan touch is a light liyawela-style divider between
  sections." Not built.
- **Top bar clipping** (from Ishini's polish list) **does not reproduce** - measured 16px of clearance at
  320px and 360px in both languages on production. The rebuild fixed it.
- **The 11 new UI strings** added with the ported activity types are drafted Sinhala and belong on Ishini's
  review list, not here.

---

## How this was measured

Reproduce any number above with:

```bash
# unused tokens
grep -o "var(--combo[,)]" css/app.css js/*.js js/activities/*.js | wc -l

# motion
grep -c '@keyframes' css/app.css        # 0
grep -c 'transition:' css/app.css       # 2

# the unused 'next' string
grep -rn "t('next')" js/                # no hits

# progressive locking
grep -nE "locked|unlock" js/app.js      # only the is-soon class for unported types
```

The design side is `DESIGN.md`, `index.html` and `tokens.css` in the Open Design project
`ict-game-world-design-system`, plus the screen captures kept locally in
`.claude/tasks/redesign-trilingual/review/` as `s1.png` to `s6.png` and `d1.png`.
