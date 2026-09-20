# Page spec: Word Bank

Every ICT term in the game, English and Sinhala side by side, searchable.
Built by the redesign task against `css/tokens.css`. This file is the content and the structure, not the markup.

## Why it exists

Two reasons, and the second is the one that keeps the project honest.

1. A Sinhala-medium student meets the English term in the exam paper; an English-medium student meets the Sinhala one in the classroom. Both need the pair.
2. It is the single place the translation is decided. Four grades, 113 activities and two languages drift apart fast. If every activity takes its terms from here, `මෘදුකාංග` cannot become `මාදුකාංග` in one grade and not another, which is exactly how the current typos spread.

## Where the data comes from

`content/word-bank.json`, built during the port by pulling every term that appears in a lesson title, an activity name, or a match pair, then deduplicating.
Each entry: `{ en, si, grade, firstSeen, note? }` where `firstSeen` is the activity id it first appears in.
Terms confirmed against the NIE Sinhala-medium syllabus carry `source: "nie"`. Everything else carries `source: "draft"` until Ishini reviews it.

## Route

`#/words`, and `#/words?q=software` from a search.
Reachable from the top bar on every screen, because a student needs it mid-activity.

## Structure

1. **Header.** Title, one line, and the count: "142 words, English and Sinhala."
2. **Search box.** Matches either language as you type. No submit button, no page reload.
3. **Grade filter.** All, 6, 7, 8, 9. A term can belong to more than one grade.
4. **Term list.** One card per term:
   - English term, display font
   - Sinhala term, Sinhala display font, at least 1.6 line height, never letter-spaced
   - the grade chips it appears in
   - where it first appears, as a link to that activity
   - a small "NIE" mark when the Sinhala came from the official syllabus
5. **Empty state.** "No word matches that. Try part of the word." plus a button that clears the search.

## Copy

| Slot | English | Sinhala |
|---|---|---|
| Page title | Word Bank | වදන් මාලාව |
| Subtitle | Every ICT word in the game, in both languages | ක්‍රීඩාවේ ඇති සෑම තොරතුරු තාක්ෂණ වචනයක්ම, භාෂා දෙකෙන්ම |
| Search placeholder | Search a word | වචනයක් සොයන්න |
| Filter: all | All grades | සියලු ශ්‍රේණි |
| First seen | First seen in | පළමුව හමු වන්නේ |
| NIE mark | From the NIE syllabus | ජාතික අධ්‍යාපන ආයතනයේ විෂය නිර්දේශයෙන් |
| Draft mark | Draft, to be checked | කෙටුම්පත, පරීක්ෂා කළ යුතුයි |
| Empty state | No word matches that. Try part of the word. | එයට ගැළපෙන වචනයක් නැත. වචනයේ කොටසක් උත්සාහ කරන්න. |
| Count | words | වචන |

## Seed terms

These are confirmed against the NIE Sinhala-medium syllabus PDFs and should be loaded first, because they are the ones the current content gets wrong or does not have at all.

| English | Sinhala | Grade | Note |
|---|---|---|---|
| Software | මෘදුකාංග | 6 | The originals write මාදුකාංග in 19 places |
| Mouse | මූසිකය | 6 | The originals write මුසිකය in 10 places |
| Use, usage | භාවිතය | 6 | The originals write හාවිතය in 4 places |
| Media player | මාධ්‍ය ධාවකය | 6 | |
| Drawing software | චිත්‍රක මෘදුකාංග | 6 | |
| Audio | ශ්‍රව්‍ය | 6 | |
| Video | දෘශ්‍ය | 6 | |
| Audio clip | ශ්‍රව්‍ය පසුර | 6 | |
| Editing software | සංස්කරණ මෘදුකාංග | 6 | |
| File | ගොනුව | 6 | |
| File properties | ගොනු ගුණාංග | 7 | |
| Read-only | පඨන මාත්‍ර | 7 | |
| Variable | විචල්‍යය | 7 | |
| Program | වැඩසටහන | 7 | |
| Error, bug | දෝෂය | 7 | |
| Output | ප්‍රතිදානය | 7 | |
| Hacking | අනවසරයෙන් ඇතුළු වීම | 7 | |
| Malware | අනිෂ්ට මෘදුකාංග | 7 | |
| Software piracy | මෘදුකාංග කොල්ල කෑම | 7 | |
| Cyber bullying | සයිබර් හිරිහැර කිරීම | 7 | |
| Trusted website | විශ්වසනීය වෙබ් අඩවිය | 7 | |
| Online conferencing | මාර්ගගත සම්මන්ත්‍රණය | 7 | |
| E-mail | ඊ-තැපෑල | 7 | |
| Physical computing | භෞතික ආගණනය | 8 | The NIE's own grade 8 wording, and already correct in the game |
| Control structure | පාලන ව්‍යූහය | 8 | |
| Iteration, repetition | පුනර්කරණය | 8 | |
| Selection | තේරීම | 8 | |
| Sequence | අනුක්‍රමය | 8 | |
| Table (in a document) | වගුව | 8 | |
| Mobile and smart devices | ජංගම හා සුහුරු උපාංග | 8 | |
| Application | ඇප්ලිකේෂනය | 8 | |
| Word processing software | වදන් සැකසුම් මෘදුකාංග | 8 | |
| Nested iteration | නිඩිත පුනර්කරණය | 9 | |
| Array variable | ආරාව විචල්‍යය | 9 | |
| Sensor | සංවේදකය | 9 | |
| Actuator | යොදකය | 9 | |
| Microcontroller kit | ක්ෂුද්‍ර පාලන පාදක කට්ටලය | 9 | |
| Decomposition | වියෝජනය | 9 | |
| Chart | ප්‍රස්තාරය | 9 | |
| e-Learning | ඊ-ඉගෙනුම | 9 | |
| e-Commerce | ඊ-වාණිජ්‍ය | 9 | |
| m-Commerce | එම්-වාණිජ්‍ය | 9 | |
| e-Health | ඊ-සෞඛ්‍ය | 9 | |
| e-Government | ඊ-රාජ්‍ය | 9 | |
| Office automation | කාර්යාලයීය ස්වයංකරණය | 9 | |
| Digital divide | අංකිත බෙදුම | 9 | |
| Electronic waste | විද්‍යුත් අපද්‍රව්‍ය | 9 | |

Every one of these is read off the NIE Sinhala-medium syllabus page images in `.claude/tasks/syllabus-enrichment/evidence/syllabus/si-pages/`.
They were read by eye, not extracted, because those PDFs have a broken text layer. The gap map explains why.

## Responsive

- Phone: one column of cards, the Sinhala term on its own line under the English one.
- Desktop: two or three columns, English and Sinhala on one line with the Sinhala right-aligned so the eye can scan one column.
- Sinhala never gets `letter-spacing` or `text-transform`, at any width.

## Accessibility

The search box is a real `input type="search"` with a label. The list is a real list. Each term's language is marked with `lang="en"` or `lang="si"` so a screen reader switches voice, which also drives the font switching the design system already does.
