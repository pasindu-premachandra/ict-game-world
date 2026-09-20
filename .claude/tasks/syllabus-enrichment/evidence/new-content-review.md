# New content, for Ishini and Dilini to check

27 new activities and 5 new lessons, written to fill the NIE syllabus gaps.
Everything below is in plain language so you can check it without opening any code.
The code itself is in `content/grade-6.additions.js` and its three siblings.

**The Sinhala is my draft.** Every new Sinhala string is flagged `siDraft: true` in the data, which means it does not ship until you have read it. The terms come from the official NIE Sinhala-medium syllabus pages, not from a translator; the page images are in `evidence/syllabus/si-pages/`.

**Please look hardest at:** the grade 8 lesson 5 change, the grade 7 find-the-bug answers, and any Sinhala that sounds wrong when you read it out loud.

## The totals

| Grade | Activities before | Activities after | New | New lessons |
|---|---|---|---|---|
| 6 | 22 | 28 | 6 | 2 |
| 7 | 29 | 36 | 7 | 1 |
| 8 | 17 | 24 | 7 | 1, and lesson 5 rebuilt |
| 9 | 18 | 25 | 7 | 1 |
| **Total** | **86** | **113** | **27** | **5** |

All 59 competency levels across the four syllabi now have at least one activity, and all 120 syllabus periods are covered. `node scripts/check-syllabus.mjs` proves it.

## Grade 6

### New lesson 7, Software Around Us / මෘදුකාංග අප වටා

Fills competency 1.3 (the need for software) and 1.4 (where computers are used). Neither had anything before.

**7.1 Sort the Kinds of Software.** Three buckets, straight from the syllabus's own examples.
- Computer games: Chess, Solitaire, Tux Racer
- Media players: VLC, Windows Media Player, Audacity
- Drawing software: MS Paint, Tux Paint, GIMP

*Check:* Audacity is an audio editor rather than a player. I put it under media players because grade 6 meets it again in lesson 8. Move it if you would rather keep the bucket strict.

**7.2 Where Computers Help Us.** Six pairs, the five places the syllabus names plus the library, because the syllabus mentions a library management system by name.
- School - keeps student marks and attendance
- Bank - handles accounts and ATM withdrawals
- Hospital - keeps patient records and test results
- Factory - controls the machines on the production line
- Farm - watches the weather and plans the watering
- Library - finds a book and records who borrowed it

**7.3 Why We Need Software.** Pick the correct ones.
- Correct: software gives the computer its instructions; a computer with no software cannot work; educational software helps students learn; a library management system is software
- Wrong: software is a part you can hold; software and hardware mean the same thing; only games count as software

### New lesson 8, Audio and Video Software / ශ්‍රව්‍ය හා දෘශ්‍ය මෘදුකාංග

Fills competency 4.2, worth 2 periods, which had nothing.

**8.1 Record an Audio Clip.** Correct order: open the software, connect the microphone, click Record and speak, click Stop, save the file.

**8.2 Match Audio and Video Files.**
- .mp3 - an audio file that takes little space
- .wav - an audio file that is not compressed
- .mp4 - a video file used on most devices
- .mov - a video file made by a camera or phone

*Check:* grade 6 lesson 3 already uses .avi, so I used .mov here to avoid repeating a pair.

**8.3 What Video Software Can Do.**
- Correct: cut out a part, join two clips, add a title, add background music
- Wrong: print the video on paper, turn the video into a keyboard

## Grade 7

### Added to lesson 2

**2.5 Match the File Properties.** Fills competency 2.4, which had nothing.
- Size - how much space the file takes on the disk
- Type - which software opens the file
- Modified date - when the file was last changed
- Location - which folder it is saved in
- Read-only - can be opened but not changed

### Added to lesson 5

**5.5 Match the Variable to What It Holds.** Fills competency 5.3, worth 2 periods.
- score - the points the player has won
- name - the player's name, as text
- lives - how many turns are left
- speed - how fast the sprite moves

**5.6 Find the Bug.** Fills competency 5.4. Five short programs; the student picks what really happens. **Please check these answers carefully, they are the ones most likely to trip a student.**

| Program | Answer | Why |
|---|---|---|
| set score to 0, change by 1 twice, say score | 2 | No bug. It goes up twice from zero. |
| set count to 1, repeat 3 saying count, count never changed | 1 1 1 | The bug. Nothing changes count inside the loop. |
| set total to 10, set total to 5, say total | 5 | The bug. The second set wipes out the first. |
| age is 12, if age is over 18 say Adult else say Student | Student | No bug. 12 is not over 18. |
| price 100, discount 10, say price plus discount | 110 | The bug. A discount should be subtracted. |

Two of the five have no bug at all. That is deliberate: a student who assumes every program is broken gets those wrong, which is the point of the competency.

### New lesson 8, Safe, Legal and Kind Online / ආරක්ෂිත, නීත්‍යනුකූල හා කාරුණික අන්තර්ජාල භාවිතය

Fills competency 7.4 (2 periods), plus the trusted-sites half of 7.1 and the conferencing half of 7.2. None had anything.

**8.1 Match the Online Danger.** The five the syllabus names: hacking, virus attack, software piracy, cyber bullying, stealing data. Sinhala terms are the syllabus's own, including සයිබර් හිරිහැර කිරීම and මෘදුකාංග කොල්ල කෑම.

**8.2 Trusted or Not Trusted.** Two buckets.
- Trust: address starts with https, a .gov.lk or school site, the writer and date are shown, other trusted sites link to it
- Be careful: asks for your password by email, promises money for nothing, spelling mistakes everywhere, no writer or date

**8.3 Be Safe and Be Kind.**
- Correct: tell a trusted adult, keep your password secret, use software the school paid for, think before you post about someone, block and report a stranger
- Wrong: share your home address with someone met online, copy a friend's paid software, forward a message that mocks a classmate

**8.4 Meeting Online.** Online conferencing, chat, e-mail, mute, host.

## Grade 8

### Lesson 5 rebuilt, Logic Gates becomes Physical Computing

**This is the one real change to something you already built, so here is the whole reason.**

Grade 8 competency 5 in the syllabus reads "Uses a software package for physical computing to implement programming logic". It is worth 5 of the grade's 30 periods, the largest single block in the grade. Its content is LEDs, controllable devices, and programs that switch them on and off with two logic levels.

The lesson as it stands is an AND, OR and NOT truth table lab. That is real ICT and students enjoy it, but truth tables are grade 10 O/L material and appear nowhere in the grade 8 syllabus.

**Your Sinhala title was right all along.** භෞතික ආගණනය is the NIE's own grade 8 wording for physical computing, word for word off page 4 of the Sinhala syllabus. It was on the open-questions list as a suspected translation error. It is not one. The English title "Logic Gates" is the one that drifted. The Sinhala does not change.

**Nothing is deleted.** All three old activities survive as 5.4, 5.5 and 5.6, marked as bonus rounds, with a line saying they sit beyond the syllabus.

**5.1 Switch the LEDs On and Off.** Four LEDs with place values 8, 4, 2, 1. The student toggles them to match the number the program sends. Targets: 5, 10, 3, 12, 9, 6, 15, 8. This reuses the binary engine from lesson 1, so no new engine is needed, and it teaches the two logic levels the syllabus asks for.

**5.2 Make the LED Blink.** Correct order: connect the LED to pin 0, start a repeat block, set pin 0 to 1, wait one second, set pin 0 to 0, wait one second.

*Check:* the second wait is the step students leave out. Without it the bulb looks permanently lit.

**5.3 Match the Part to Its Job.** LED gives light, microcontroller runs the program, pin is where you connect, battery supplies power, resistor protects the LED from too much current.

### Added to lesson 3

**3.3 Build a Table.** Fills the "inserting a table" part of competency 3.1. Six rounds: insert table, insert row, insert column, merge cells, borders, delete row.

### New lesson 7, Apps on Phones and Smart Devices / ජංගම හා සුහුරු උපාංගවල ඇප්ලිකේෂන්

Fills the mobile and smart device part of competency 4.1, which had nothing.

**7.1 Where Does the App Run.** Three buckets: phone app, smart device, computer.
**7.2 App Facts.** Six true or false. False ones: a phone app and a computer program are built exactly the same way; every app must be paid for.
**7.3 Match the App to Its Job.** Map, banking, health, learning and weather apps, each matched to the everyday problem it solves.

## Grade 9

### Added to lesson 2

**2.4 Count and Sort.** Fills competency 2.4. The syllabus names SUM, AVERAGE, MAX, MIN, COUNT and COUNTA; the game had only the first four.
- Count cells A1 to A20 holding a number: `=count(a1:a20)`
- Count cells B1 to B20 that are not empty: `=counta(b1:b20)`
- Add marks C2 to C41: `=sum(c2:c41)`
- Class average D2 to D41: `=average(d2:d41)`

**2.5 Sorting the Data.**
- Correct: sorting orders the rows; ascending is smallest to largest; descending is largest to smallest; text sorts A to Z; select the whole table so rows stay together
- Wrong: sorting deletes rows you do not need; only one column can ever be sorted

### Added to lesson 3

**3.4 Trace the Nested Repeat.** Fills competency 3.3, worth 3 periods, which had one true/false line.
- repeat 3 containing repeat 2 saying hi: 6 times
- repeat 4 containing repeat 5 changing n: n is 20
- repeat 2 of move plus repeat 4 of turn 90: two full turns and two moves
- repeat 3 of (repeat 3 stamp, then move): 9 stamps

**3.5 The Array Challenge.** Fills competency 3.4, worth 2 periods, which had one true/false line.
- marks holds 45, 60, 72, 88: 4 items
- item 1 of marks: 45, because Scratch lists start at 1
- the Scratch word for an array: list
- one name for 30 marks saves you: 30 separate variables

### New lesson 7, ICT All Around Us / තොරතුරු තාක්ෂණය අප වටා

Fills competency 6.1. The game had e-Learning and the 3R concept, and nothing else from a list of eight.

**7.1 Match the e-Service.** e-Learning, e-Commerce, m-Commerce, e-Health, e-Government and office automation, with the NIE's own Sinhala: ඊ-ඉගෙනුම, ඊ-වාණිජ්‍ය, එම්-වාණිජ්‍ය, ඊ-සෞඛ්‍ය, ඊ-රාජ්‍ය, කාර්යාලයීය ස්වයංකරණය.

**7.2 The Digital Divide / අංකිත බෙදුම.**
- Correct: a village with no Internet is on the wrong side; cost of devices is one reason; not knowing how to use a computer widens it; school labs help close it
- Wrong: it means the Internet is split in two; everyone already has equal access

**7.3 Good and Harmful Effects of ICT.** Two buckets, four each, including the electronic waste line the syllabus asks for.

## Three things I would like your opinion on

1. **Grade 6 activity 7.1**, whether Audacity belongs in the media player bucket.
2. **Grade 7 activity 5.6**, whether two of five programs having no bug is fair at grade 7, or whether it should be one of five.
3. **Any Sinhala that reads oddly.** I drafted it from the official syllabus terms, but you teach these children and I do not. The three I am least sure of are නිඩිත පුනර්කරණය (nested iteration), යොදකය (actuator) and ස්ප්‍රයිටය (sprite).
