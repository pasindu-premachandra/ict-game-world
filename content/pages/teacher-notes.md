# Page spec: Teacher Notes

One printable page per grade, so another teacher can pick the game up and run a lesson with it.
Built by the redesign task against `css/tokens.css`. This file is the content and the structure, not the markup.

## Why it exists

The game is good on a screen and useless on a desk. A teacher planning tomorrow's period needs three things the game does not currently give them: what to set up, what the right answers are and why, and where students usually go wrong.
It is also the artifact that makes this a teaching project rather than a coding project, which matters because that is what Ishini and Dilini are assessed on.

## Where the data comes from

- The competency rows come from `content/syllabus-map.json`.
- The answers come from the activity data itself, so they cannot drift out of date.
- The setup lines and the common mistakes are hand written, one block per lesson, in `content/teacher-notes.json` as `{ lessonId, setup: {en, si}, mistakes: [{en, si}] }`.

## Route

`#/teacher` and `#/teacher/8`. Linked from the grade home screen footer, not from the student top bar.

## Structure

One page per grade, printable as one or two A4 sheets.

1. **Header.** Grade, the number of lessons and activities, the periods covered, and the line "NIE ICT syllabus, implemented from 2018."
2. **Before the lesson.** A short checklist: the devices needed, whether the Internet is needed (it is not, the game works offline), the language to set, and how to give out the class code if the leaderboard is being used.
3. **Lesson by lesson.** For each lesson:
   - the lesson title in both languages
   - the competency levels it covers and their periods
   - each activity: id, name, type, and roughly how long it takes
   - **the answers, with one line of reasoning each**, not just the key
   - **common mistakes**, two or three per lesson
4. **Extra challenges.** The bonus activities, named, with the note that they sit outside the syllabus. Grade 8's logic gate activities are listed here.
5. **Print footer.** "Made by Ishini Premachandra and Dilini Wijesooriya" and the date the page was printed.

## Copy

| Slot | English | Sinhala |
|---|---|---|
| Page title | Teacher Notes | ගුරු සටහන් |
| Subtitle | One page to run this grade in class | මෙම ශ්‍රේණිය පන්තියේ දී ගෙන යාමට එක් පිටුවක් |
| Before the lesson | Before the lesson | පාඩමට පෙර |
| Answers | Answers and why | පිළිතුරු හා හේතු |
| Common mistakes | Common mistakes | සුලභ වැරදි |
| Extra challenges | Extra challenges, beyond the syllabus | අමතර අභියෝග, විෂය නිර්දේශයෙන් ඔබ්බට |
| Time | about | පමණ |
| Print | Print this page | මෙම පිටුව මුද්‍රණය කරන්න |
| Offline note | The game works without the Internet | අන්තර්ජාලය නොමැතිව ක්‍රීඩාව ක්‍රියා කරයි |

## Worked example, grade 8 lesson 5

This is the block that needs the most care, because the lesson changed.

**Before the lesson.** No kit is needed. The LED activity is on screen, so it works in a lab with no micro:bit. If the school does have a micro:bit or an Arduino, activity 5.2 is the program to type in afterwards.

**Answers and why.**

- **5.1 Switch the LEDs On and Off.** The four bulbs are place values 8, 4, 2 and 1. For the target 5, light bulbs 4 and 1, because 4 plus 1 is 5. This is the same binary idea as lesson 1, now switching something real. On is 1, off is 0: the two logic levels the syllabus asks for.
- **5.2 Make the LED Blink.** Connect, start the repeat, on, wait, off, wait. The wait after the off is the step students leave out, and without it the bulb looks permanently on because the off lasts microseconds.
- **5.3 Match the Part to Its Job.** The resistor is the one students guess wrong; it protects the LED from too much current, it does not supply power. The battery supplies power.
- **5.4 to 5.6, extra.** Logic gates. Not in the grade 8 syllabus, kept because students enjoy them and they preview grade 10.

**Common mistakes.**

- Thinking the LED is the computer. The microcontroller runs the program; the LED only shows the result.
- Leaving out the second wait in the blink program.
- Reading the LED pattern right to left. The place values run 8, 4, 2, 1 from the left, the same as the binary lesson.

## Responsive and print

- Screen phone: one column, each lesson a collapsible card so a teacher can read one lesson at a time.
- Screen desktop: two columns, lessons flowing down the left, the before-the-lesson checklist pinned on the right.
- **Print:** all cards expanded, no navigation, no top bar, black on white, page breaks between lessons, the credit line in the footer. This is the one place the dark grade 9 world must not follow through to paper.

## Accessibility

Answers are in a real definition list, not a table of one-word cells, so a screen reader reads the reasoning with the answer. The collapsible cards use `details` and `summary`, which stay open when the page is printed.
