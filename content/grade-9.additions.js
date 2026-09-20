/* Grade 9 syllabus additions - ICT Game World.
   Fills NIE competency levels 2.4 (COUNT, COUNTA and data sorting), 3.3 (nested iteration),
   3.4 (array variables) and 6.1 (the e-services and the digital divide).
   3.3 and 3.4 each had exactly one true/false line inside activity 3.2, which is not coverage.
   3.4 uses the `trace` engine, today only in grade 8. The redesign merges all engines, so this
   is reuse, not a new engine.
   Every string is {en, si}. si is drafted by Claude and stays siDraft until Ishini reviews it. */

export const grade = 9;
export const siDraft = true;

export const additionsToExistingLessons = [
  {
    lessonId: 2,
    activities: [
      {
        id: '2.4',
        competency: '2.4',
        type: 'input',
        name: { en: 'Count and Sort', si: 'ගණන් කිරීම හා වර්ග කිරීම' },
        instruction: {
          en: 'Type the correct spreadsheet function for each task.',
          si: 'එක් එක් කාර්යය සඳහා නිවැරදි පැතුරුම්පත්ශ්‍රිතය ටයිප් කරන්න.'
        },
        questions: [
          {
            q: { en: 'To count how many cells from A1 to A20 hold a number:', si: 'A1 සිට A20 දක්වා සංඛ්‍යාවක් ඇති කොටු කීයක් ඇත්දැයි ගණන් කිරීමට:' },
            ans: '=count(a1:a20)',
            hint: { en: 'COUNT counts only numbers', si: 'COUNT මඟින් ගණන් කරන්නේ සංඛ්‍යා පමණි' }
          },
          {
            q: { en: 'To count how many cells from B1 to B20 are not empty:', si: 'B1 සිට B20 දක්වා හිස් නොවන කොටු කීයක් ඇත්දැයි ගණන් කිරීමට:' },
            ans: '=counta(b1:b20)',
            hint: { en: 'COUNTA counts text as well as numbers', si: 'COUNTA මඟින් සංඛ්‍යා මෙන්ම පාඨද ගණන් කරයි' }
          },
          {
            q: { en: 'To add up the marks in C2 to C41:', si: 'C2 සිට C41 දක්වා ලකුණු එකතු කිරීමට:' },
            ans: '=sum(c2:c41)',
            hint: { en: 'Use the SUM function', si: 'SUM ශ්‍රිතය භාවිත කරන්න' }
          },
          {
            q: { en: 'To find the class average of D2 to D41:', si: 'D2 සිට D41 දක්වා පන්තියේ සාමාන්‍යය සෙවීමට:' },
            ans: '=average(d2:d41)',
            hint: { en: 'Use the AVERAGE function', si: 'AVERAGE ශ්‍රිතය භාවිත කරන්න' }
          }
        ]
      },
      {
        id: '2.5',
        competency: '2.4',
        type: 'pick',
        name: { en: 'Sorting the Data', si: 'දත්ත වර්ග කිරීම' },
        instruction: {
          en: 'Select ONLY the correct statements about sorting data in a spreadsheet.',
          si: 'පැතුරුම්පතක දත්ත වර්ග කිරීම පිළිබඳ නිවැරදි ප්‍රකාශ පමණක් තෝරන්න.'
        },
        items: [
          { text: { en: 'Sorting puts the rows in a chosen order', si: 'වර්ග කිරීම මඟින් පේළි තෝරාගත් පිළිවෙලකට සකසයි' }, icon: '🔢', correct: true },
          { text: { en: 'Ascending order goes from smallest to largest', si: 'ආරෝහණ පිළිවෙල කුඩාම සිට විශාලතම දක්වා යයි' }, icon: '⬆️', correct: true },
          { text: { en: 'Descending order goes from largest to smallest', si: 'අවරෝහණ පිළිවෙල විශාලතම සිට කුඩාම දක්වා යයි' }, icon: '⬇️', correct: true },
          { text: { en: 'Text can be sorted from A to Z', si: 'පාඨ A සිට Z දක්වා වර්ග කළ හැකිය' }, icon: '🔤', correct: true },
          { text: { en: 'You should select the whole table so the rows stay together', si: 'පේළි එකට රැඳෙන ලෙස මුළු වගුවම තෝරාගත යුතුය' }, icon: '🧱', correct: true },
          { text: { en: 'Sorting deletes the rows you do not need', si: 'වර්ග කිරීමෙන් ඔබට අවශ්‍ය නොවන පේළි මකා දමයි' }, icon: '🗑️', correct: false },
          { text: { en: 'Only one column can ever be sorted in a sheet', si: 'පත්‍රයක වර්ග කළ හැක්කේ එක් තීරුවක් පමණි' }, icon: '1️⃣', correct: false }
        ]
      }
    ]
  },
  {
    lessonId: 3,
    activities: [
      {
        id: '3.5',
        competency: '3.3',
        type: 'trace',
        name: { en: 'Trace the Nested Repeat', si: 'නිඩිත පුනර්කරණය අනුගමනය කරමු' },
        instruction: {
          en: 'A repeat inside another repeat is called nested iteration. Read each program and choose the correct output.',
          si: 'පුනර්කරණයක් තුළ ඇති තවත් පුනර්කරණයක් නිඩිත පුනර්කරණය ලෙස හැඳින්වේ. එක් එක් වැඩසටහන කියවා නිවැරදි ප්‍රතිදානය තෝරන්න.'
        },
        questions: [
          {
            code: 'repeat 3\n   repeat 2\n      say "hi"',
            opts: ['2 times', '3 times', '5 times', '6 times'],
            ans: 3,
            note: { en: '3 outer turns times 2 inner turns is 6.', si: 'බාහිර වාර 3 ගුණ අභ්‍යන්තර වාර 2 යනු 6 කි.' }
          },
          {
            code: 'set n to 0\nrepeat 4\n   repeat 5\n      change n by 1\nsay n',
            opts: ['9', '20', '4', '5'],
            ans: 1,
            note: { en: '4 times 5 is 20.', si: '4 ගුණ 5 යනු 20 කි.' }
          },
          {
            code: 'repeat 2\n   move 10 steps\n   repeat 4\n      turn 90 degrees',
            opts: ['A line', 'Two full turns and two moves', 'Nothing moves', 'One square'],
            ans: 1,
            note: { en: '4 turns of 90 degrees is one full turn, done twice.', si: 'අංශක 90 බැගින් හැරවීම් 4ක් යනු සම්පූර්ණ භ්‍රමණයකි, එය දෙවරක් සිදු වේ.' }
          },
          {
            code: 'repeat 3\n   repeat 3\n      stamp\n   move 20 steps',
            opts: ['3 stamps', '6 stamps', '9 stamps', '20 stamps'],
            ans: 2,
            note: { en: '3 outer turns, 3 stamps each, is 9 stamps.', si: 'බාහිර වාර 3, එක් වරකට මුද්‍රා 3 බැගින්, මුද්‍රා 9 කි.' }
          }
        ]
      },
      {
        id: '3.6',
        competency: '3.4',
        type: 'input',
        name: { en: 'The Array Challenge', si: 'ආරාව විචල්‍ය අභියෝගය' },
        instruction: {
          en: 'An array variable holds many values under one name. Scratch calls it a list. Type the answer.',
          si: 'ආරාව විචල්‍යයක් එක් නමක් යටතේ අගයන් රැසක් තබා ගනී. Scratch හි එය ලැයිස්තුවක් ලෙස හැඳින්වේ. පිළිතුර ටයිප් කරන්න.'
        },
        questions: [
          {
            q: { en: 'marks holds 45, 60, 72, 88. How many items are in the array?', si: 'marks හි 45, 60, 72, 88 ඇත. ආරාවේ අගයන් කීයක් තිබේද?' },
            ans: '4',
            hint: { en: 'Count the values', si: 'අගයන් ගණන් කරන්න' }
          },
          {
            q: { en: 'In Scratch, item 1 of marks gives which value from 45, 60, 72, 88?', si: 'Scratch හි marks හි 1 වන අගය, 45, 60, 72, 88 අතරින් කුමක්ද?' },
            ans: '45',
            hint: { en: 'Scratch lists start counting at 1', si: 'Scratch ලැයිස්තු ගණන් කිරීම ආරම්භ වන්නේ 1 සිටය' }
          },
          {
            q: { en: 'What is the word Scratch uses for an array?', si: 'ආරාවක් සඳහා Scratch භාවිත කරන වචනය කුමක්ද?' },
            ans: 'list',
            hint: { en: 'You add it from the Variables section', si: 'එය Variables කොටසෙන් එක් කරයි' }
          },
          {
            q: { en: 'One name holding 30 student marks saves you from making how many separate variables?', si: 'සිසුන් 30 දෙනෙකුගේ ලකුණු එක් නමක තබා ගැනීමෙන් වෙන වෙනම විචල්‍ය කීයක් සෑදීමෙන් වැළකේද?' },
            ans: '30',
            hint: { en: 'One per student, without the array', si: 'ආරාව නැතිනම් සිසුවෙකුට එකක් බැගින්' }
          }
        ]
      }
    ]
  }
];

export const lessons = [
  {
    id: 7,
    title: { en: 'ICT All Around Us', si: 'තොරතුරු තාක්ෂණය අප වටා' },
    icon: '🌏',
    cls: 'l7',
    activities: [
      {
        id: '7.1',
        competency: '6.1',
        type: 'match',
        name: { en: 'Match the e-Service', si: 'ඊ-සේවාව යුගල කරමු' },
        instruction: {
          en: 'Match each service with what it lets people do.',
          si: 'එක් එක් සේවාව එමඟින් මිනිසුන්ට කළ හැකි දේ සමඟ යුගල කරන්න.'
        },
        pairs: [
          { l: { en: '🎓 e-Learning', si: '🎓 ඊ-ඉගෙනුම' }, r: { en: 'Following a lesson through the Internet', si: 'අන්තර්ජාලය හරහා පාඩමක් හැදෑරීම' }, li: '🎓', ri: '💻' },
          { l: { en: '🛒 e-Commerce', si: '🛒 ඊ-වාණිජ්‍ය' }, r: { en: 'Buying and selling goods on a website', si: 'වෙබ් අඩවියක භාණ්ඩ මිලදී ගැනීම හා විකිණීම' }, li: '🛒', ri: '🌐' },
          { l: { en: '📱 m-Commerce', si: '📱 එම්-වාණිජ්‍ය' }, r: { en: 'Buying and selling using a mobile phone', si: 'ජංගම දුරකථනයක් භාවිතයෙන් මිලදී ගැනීම හා විකිණීම' }, li: '📱', ri: '💳' },
          { l: { en: '🩺 e-Health', si: '🩺 ඊ-සෞඛ්‍ය' }, r: { en: 'Booking a doctor or reading test results online', si: 'මාර්ගගත ව වෛද්‍යවරයෙකු වෙන් කර ගැනීම හෝ පරීක්ෂණ ප්‍රතිඵල කියවීම' }, li: '🩺', ri: '📋' },
          { l: { en: '🏛️ e-Government', si: '🏛️ ඊ-රාජ්‍ය' }, r: { en: 'Getting a government service on a website', si: 'වෙබ් අඩවියකින් රාජ්‍ය සේවාවක් ලබා ගැනීම' }, li: '🏛️', ri: '📄' },
          { l: { en: '🏢 Office automation', si: '🏢 කාර්යාලයීය ස්වයංකරණය' }, r: { en: 'Doing office work with computers instead of paper', si: 'කඩදාසි වෙනුවට පරිගණක යොදා කාර්යාල වැඩ කිරීම' }, li: '🏢', ri: '🖨️' }
        ]
      },
      {
        id: '7.2',
        competency: '6.1',
        type: 'pick',
        name: { en: 'The Digital Divide', si: 'අංකිත බෙදුම' },
        instruction: {
          en: 'The digital divide is the gap between people who can use ICT and people who cannot. Select ONLY the correct statements.',
          si: 'අංකිත බෙදුම යනු තොරතුරු තාක්ෂණය භාවිත කළ හැකි අය හා නොහැකි අය අතර පරතරයයි. නිවැරදි ප්‍රකාශ පමණක් තෝරන්න.'
        },
        items: [
          { text: { en: 'A village with no Internet is on the wrong side of the divide', si: 'අන්තර්ජාලය නොමැති ගමක් බෙදුමේ වැරදි පැත්තේ ඇත' }, icon: '🏘️', correct: true },
          { text: { en: 'Cost of devices is one reason the divide exists', si: 'උපාංගවල මිල බෙදුම පවතින එක් හේතුවකි' }, icon: '💰', correct: true },
          { text: { en: 'Not knowing how to use a computer widens the divide', si: 'පරිගණකයක් භාවිත කිරීම නොදැනීම බෙදුම පුළුල් කරයි' }, icon: '❓', correct: true },
          { text: { en: 'School computer labs help to close the divide', si: 'පාසල් පරිගණක විද්‍යාගාර බෙදුම අඩු කිරීමට උපකාර වේ' }, icon: '🏫', correct: true },
          { text: { en: 'The divide means the Internet is divided into two halves', si: 'බෙදුම යන්නෙන් අදහස් වන්නේ අන්තර්ජාලය කොටස් දෙකකට බෙදී ඇති බවයි' }, icon: '✂️', correct: false },
          { text: { en: 'Everyone in the country already has equal access to ICT', si: 'රටේ සැමට දැනටමත් තොරතුරු තාක්ෂණයට සමාන ප්‍රවේශයක් ඇත' }, icon: '🟰', correct: false }
        ]
      },
      {
        id: '7.3',
        competency: '6.1',
        type: 'bucket',
        name: { en: 'Good and Harmful Effects of ICT', si: 'තොරතුරු තාක්ෂණයේ යහපත් හා අයහපත් බලපෑම්' },
        instruction: {
          en: 'Click an effect first, then click the correct bucket.',
          si: 'මුලින් බලපෑමක් ක්ලික් කර, පසුව නිවැරදි බඳුන ක්ලික් කරන්න.'
        },
        buckets: [
          {
            name: { en: '👍 Good for society', si: '👍 සමාජයට යහපත්' },
            items: [
              { en: 'A student in a village can follow a city lesson', si: 'ගමක සිටින සිසුවෙකුට නගරයේ පාඩමක් හැදෑරිය හැකිය' },
              { en: 'Government forms are filled without travelling', si: 'ගමන් නොකර රාජ්‍ය ආකෘති පත්‍ර පිරවිය හැකිය' },
              { en: 'A small shop can sell across the whole country', si: 'කුඩා කඩයකට මුළු රට පුරා විකිණිය හැකිය' },
              { en: 'Test results reach the patient the same day', si: 'පරීක්ෂණ ප්‍රතිඵල එදිනම රෝගියාට ලැබේ' }
            ]
          },
          {
            name: { en: '👎 Harmful for society', si: '👎 සමාජයට අයහපත්' },
            items: [
              { en: 'Electronic waste piles up and pollutes', si: 'විද්‍යුත් අපද්‍රව්‍ය එකතු වී දූෂණය වේ' },
              { en: 'People with no access fall further behind', si: 'ප්‍රවේශයක් නැති අය තවත් පසුබසී' },
              { en: 'Private information can be stolen', si: 'පෞද්ගලික තොරතුරු සොරකම් කළ හැකිය' },
              { en: 'Some jobs disappear when work is automated', si: 'වැඩ ස්වයංක්‍රීය වූ විට සමහර රැකියා අහිමි වේ' }
            ]
          }
        ]
      }
    ]
  }
];
