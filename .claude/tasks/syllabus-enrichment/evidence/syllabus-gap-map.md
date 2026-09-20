# NIE syllabus gap map - ICT Game World

What the official syllabus asks for, what the game already teaches, and what is missing.
Built 2026-09-20 from the four official PDFs, downloaded to `evidence/syllabus/`.

## Sources

| File | URL | Note |
|---|---|---|
| `eGr06Syl-ICT.pdf` | https://nie.lk/pdffiles/tg/eGr06Syl%20ICT.pdf | English medium, "To be implemented from 2018", 30 periods |
| `eGr07Syl-ICT.pdf` | https://nie.lk/pdffiles/tg/eGr07Syl%20ICT.pdf | same, 30 periods |
| `eGr08Syl-ICT.pdf` | https://nie.lk/pdffiles/tg/eGr08Syl%20ICT.pdf | same, 30 periods |
| `eGr09Syl-ICT.pdf` | https://nie.lk/pdffiles/tg/eGr09Syl%20ICT.pdf | same, 30 periods |
| `SGr06..09Syl-ICT.pdf` | `https://nie.lk/pdffiles/tg/sGr0NSyl%20ICT.pdf` | Sinhala medium, the same four syllabi |

All eight fetched with `curl`, HTTP 200, `application/pdf`. No metered tool was used.

### Is the 2018 syllabus still the live one

Yes, for the whole 2026 school year, in every grade from 6 to 9.
The junior secondary reform was pushed from 2026 to January 2027 by Cabinet on 2026-01-13 (newswire.lk).
The Education Ministry notice told schools that "Grade Six students should be taught the previous syllabus" and that last year's textbooks should be reused in 2026 (sundaytimes.lk, print edition 2026-01-18).
A parliamentary subcommittee confirmed on 2026-09-14 that the reform is still being prepared for 2027 (dailymirror.lk/breaking-news/Preparations-underway-to-implement-education-reforms-in-2027/108-350279).
Grades 7 to 9 were never part of the 2026 phase at all.

So enriching against these four PDFs is enriching against what is actually taught in class today.

### A note on the Sinhala PDFs

They render correctly in any PDF reader, but text extraction from them is lossy.
Each one embeds `Iskoola Pota` twice, once as Type0 / Identity-H and once as TrueType / WinAnsiEncoding, and the WinAnsi runs lose their character mapping on copy.
Extracted text comes out as `ත තහයුේ පේධ්ති` where the page itself shows `මෙහෙයුම් පද්ධතිය`.
This is the same class of damage as the typos already logged in the other task (`මාදුකාංග` for `මෘදුකාංග`, `මුසිකය` for `මූසිකය`), which suggests the original Sinhala content was copied out of these very PDFs.
Do not machine-read Sinhala terms from them.
Page images of every syllabus table are rendered to `evidence/syllabus/si-pages/` for reading by eye instead.

## Baseline: what the game covers today

86 activities, 25 lessons, across four grades.

| Grade | Lessons | Activities | Engine types used |
|---|---|---|---|
| 6 | 6 | 22 | order, match, pick, bucket, symmatch |
| 7 | 7 | 29 | match, order, pick, bucket, symmatch |
| 8 | 6 | 17 | bits, input, tf, hotspot, trace, gate, query |
| 9 | 6 | 18 | match, tf, bucket, input, hotspot, pick |

Every lesson maps onto a real syllabus competency. Nothing in the game is off-syllabus invention.
The gaps below are competency levels that carry syllabus periods but have no activity at all.

## Grade 6 (6 competencies, 30 periods)

| Competency level | Syllabus content | In the game | Verdict |
|---|---|---|---|
| 1.1, 1.2 | Basic components, computer vs human, embedded computers | L1 1.1-1.4 | covered |
| **1.3** | **Need of software; examples: games, media player, drawing software** | nothing | **missing** |
| **1.4** | **Role of the computer in schools, banks, hospitals, factories, farms** | nothing | **missing** |
| 2.1, 2.2 | Lab good practice, start and shutdown, posture, e-waste, passwords | L2 2.1-2.4 | covered |
| 3.1 | File handling, window minimize, maximize, resize | L3 3.1-3.3 | covered |
| 4.1 | Mouse and keyboard through drawing and typing software | L4 4.1-4.3 | covered |
| **4.2** | **Audio software and video software, create an audio clip and a video clip** | nothing | **missing** |
| 5.1, 5.2 | Recipe algorithm, flowchart symbols | L5 5.1-5.4 | covered |
| 6.1, 6.2, 6.3 | Internet, search engines, access control | L6 6.1-6.4 | covered |

Evidence: `\bsoftware\b` appears twice in the whole grade 6 file, both inside an internet-terms match.
`bank`, `hospital`, `farm`, `media player` and `drawing` return zero hits.
`\baudio\b` returns one hit, the comment header of the sound engine.

Competency 4.2 alone carries 2 of the 30 periods and has no activity.

## Grade 7 (7 competencies, 30 periods)

| Competency level | Syllabus content | In the game | Verdict |
|---|---|---|---|
| 1.1, 1.2 | CPU components, ALU and CU, processor history | L1 1.1-1.4 | covered |
| 2.1, 2.2 | OS types, storage media | L2 2.1-2.3 | covered |
| 2.3 | Folder and file manipulation, copy and move between storage | L2 2.4 partial | thin |
| **2.4** | **File properties: size, type, modified date** | nothing | **missing** |
| 3.1, 3.2 | Surge, UPS, dust, overheating, anti-virus, access control | L3 3.1-3.4 | covered |
| 4.1 | Touch typing, typing software | L4 4.1-4.4 | covered |
| 5.1, 5.2 | Flowcharts, sequence, selection, iteration, Scratch IDE | L5 5.1-5.4 | covered |
| **5.3** | **Definition of a variable, use of variables in programs** | nothing | **missing** |
| **5.4** | **Errors in a program as bugs, the effect of an error** | nothing | **missing** |
| 6.1 | Presentation software end to end | L6 6.1-6.4 | covered |
| 7.1 | WWW, URL, downloads, earth maps | L7 7.1-7.2 | covered |
| **7.1b** | **Trusted vs untrusted websites, authentic and reliable information** | nothing | **missing** |
| 7.2 | Email fields, account creation | L7 7.3 | covered |
| **7.2b** | **Online conferencing** | nothing | **missing** |
| 7.3 | Web page with HTML, text formatting, colours, lists | L7 7.5 | covered |
| **7.4** | **Hacking, virus attacks, software piracy, cyber bullying, stealing data, online safety with unknown parties** | L7 7.4 generic only | **missing** |

Evidence: `\bvariable\b`, `\bbug\b`, `\berror\b`, `file propert`, `modified`, `trusted`, `cyber`, `piracy`, `hacking` and `conferenc` all return zero hits in the grade 7 file.

Competency 5.3 and 5.4 together carry 3 periods. Competency 7.4 carries 2. None of them has an activity.

## Grade 8 (6 competencies, 30 periods)

| Competency level | Syllabus content | In the game | Verdict |
|---|---|---|---|
| 1.1, 1.2 | Decimal and binary conversion, data representation with 0 and 1 | L1 1.1-1.3 | covered |
| 2.1 | Regional settings, file properties, file search | L2 2.3 | covered |
| 2.2 | Troubleshooting, ports, sound issues, corrupt software | L2 2.1-2.2 | covered |
| 3.1 | Word processing: format, objects, spelling, lists | L3 3.1-3.2 | covered |
| **3.1b** | **Inserting a table** | nothing | **missing** |
| 4.1 | Input, process, output steps, block diagram, flowcharts | L4 4.1-4.3 | covered |
| **4.1b** | **Applications created for mobile and smart devices** | nothing | **missing** |
| 4.2 | Selection control structures, simple programs | L4 4.2 | covered |
| **5.1** | **Physical computing: components of a physical computing device, controllable devices, turning LEDs on and off, LED patterns with simple programs, two logic levels** | L5 is a Logic Gate lab instead | **wrong topic** |
| 6.1, 6.2 | Search engines, HTML tags, attributes, hyperlinks | L6 6.1-6.3 | covered |

**The grade 8 finding that matters.**
Competency 5 is "Uses a software package for physical computing to implement programming logic", worth 5 of the 30 periods, the single largest block in the grade.
Its content is LEDs, controllable devices, and programs that switch them on and off with two logic levels.
The game teaches AND, OR and NOT truth tables instead, which is grade 10 O/L material, not grade 8.
`LED`, `sensor`, `actuator`, `physical comput` and `logic level` all return zero hits in the grade 8 file.

This also settles an open question from the other task.
The Sinhala lesson title `භෞතික ආගණනය` reads as "physical computing" and matches the syllabus.
The English title "Logic Gates" is the one that drifted. The Sinhala was right all along.

## Grade 9 (6 competencies, 30 periods)

| Competency level | Syllabus content | In the game | Verdict |
|---|---|---|---|
| 1.1, 1.2 | Specifications, processor, hard disk, monitor, RAM, warranty, after sale service | L1 1.1-1.3 | covered |
| 2.1, 2.2 | Workbook, worksheet, cell addressing, formatting, data types | L2 2.3 | covered |
| 2.3 | Mathematical operators | L2 2.1 | covered |
| **2.4** | **SUM, AVERAGE, MAX, MIN, COUNT, COUNTA, and data sorting** | L2 2.1 has SUM, AVERAGE, MAX, MIN only | **partial** |
| 2.5 | Chart types and chart options | L2 2.2 | covered |
| 3.1, 3.2 | Sequence, selection, iteration, multiple conditions | L3 3.1-3.3 | covered |
| **3.3** | **Nested iteration** | one true/false line inside 3.2 | **thin** |
| **3.4** | **Array variables, declaring and applying them** | one true/false line inside 3.2 | **thin** |
| 3.5 | Evaluating the solution, decomposition | L3 3.3 | covered |
| 4.1 | Microcontroller kit, sensors, actuators | L4 4.1-4.3 | covered |
| 5.1, 5.2 | Network components, sending messages, sharing resources | L5 5.1-5.3 | covered |
| **6.1** | **Office automation, e-Learning, e-Commerce, m-Commerce, e-Health, e-Government, Digital Divide, safe e-waste disposal** | e-Learning and 3R only | **partial** |
| 6.2 | Career opportunities, ten named roles | L6 6.1 | covered |

Evidence: `COUNTA` returns zero hits. `e-Commerce`, `e-Health` and `e-Government` return zero hits.
`array` and `nested` each appear exactly once, as a single statement inside the true/false activity 3.2.
Competency 3.3 and 3.4 sit inside a 5 period block; competency 6.1 carries 1 period.

## Summary

| Grade | Competency levels with no activity | Periods behind them |
|---|---|---|
| 6 | 1.3, 1.4, 4.2 | about 5 of 30 |
| 7 | 2.4, 5.3, 5.4, 7.1b, 7.2b, 7.4 | about 8 of 30 |
| 8 | 3.1b, 4.1b, and 5.1 taught as the wrong topic | about 7 of 30 |
| 9 | 2.4 partial, 3.3, 3.4, 6.1 partial | about 4 of 30 |

Roughly a quarter of the syllabus has no activity in the game, and one grade 8 lesson teaches an O/L topic in place of its own.
Everything the game does cover, it covers correctly.
