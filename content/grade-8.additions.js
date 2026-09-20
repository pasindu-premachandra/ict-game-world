/* Grade 8 syllabus additions - ICT Game World.
   The big one: lesson 5 is rebuilt as Physical Computing (NIE competency 5.1, 5 of the grade's
   30 periods). The old Logic Gate Lab is kept, renumbered 5.4 and marked bonus, because truth
   tables are O/L grade 10 material and not part of the grade 8 syllabus.
   The Sinhala lesson title භෞතික ආගණනය is the NIE's own wording and does not change.
   Also fills competency 3.1 (inserting a table) and 4.1 (mobile and smart device applications).

   Shape note: hotspot activities here carry their own `options` array instead of relying on one
   shared per-file list, so each activity is self-contained. The port must honour that.
   Every string is {en, si}. si is drafted by Claude and stays siDraft until Ishini reviews it. */

export const grade = 8;
export const siDraft = true;

export const additionsToExistingLessons = [
  {
    lessonId: 3,
    activities: [
      {
        id: '3.3',
        competency: '3.1',
        type: 'hotspot',
        name: { en: 'Build a Table', si: 'වගුවක් සාදමු' },
        instruction: {
          en: 'Read the task and click the correct table tool.',
          si: 'කාර්යය කියවා නිවැරදි වගු මෙවලම ක්ලික් කරන්න.'
        },
        options: [
          { key: 'insert', icon: '➕', name: { en: 'Insert Table', si: 'වගුව ඇතුළත් කිරීම' }, desc: { en: 'Put a new table into the document', si: 'ලේඛනයට නව වගුවක් යෙදීම' } },
          { key: 'addrow', icon: '⬇️', name: { en: 'Insert Row', si: 'පේළියක් ඇතුළත් කිරීම' }, desc: { en: 'Add one more row', si: 'තවත් පේළියක් එක් කිරීම' } },
          { key: 'addcol', icon: '➡️', name: { en: 'Insert Column', si: 'තීරුවක් ඇතුළත් කිරීම' }, desc: { en: 'Add one more column', si: 'තවත් තීරුවක් එක් කිරීම' } },
          { key: 'merge', icon: '🔗', name: { en: 'Merge Cells', si: 'කොටු ඒකාබද්ධ කිරීම' }, desc: { en: 'Join two cells into one', si: 'කොටු දෙකක් එකක් බවට පත් කිරීම' } },
          { key: 'border', icon: '🔲', name: { en: 'Borders', si: 'මායිම්' }, desc: { en: 'Draw lines around the cells', si: 'කොටු වටා රේඛා ඇඳීම' } },
          { key: 'delete', icon: '🗑️', name: { en: 'Delete Row', si: 'පේළිය මකා දැමීම' }, desc: { en: 'Remove a row from the table', si: 'වගුවෙන් පේළියක් ඉවත් කිරීම' } }
        ],
        rounds: [
          { q: { en: 'To put a table of 3 columns into your document:', si: 'තීරු 3ක වගුවක් ඔබගේ ලේඛනයට යෙදීමට:' }, ans: 'insert' },
          { q: { en: 'You have one student too many for the table:', si: 'වගුවට සිසුන් එක් අයෙකු වැඩිපුර සිටී:' }, ans: 'addrow' },
          { q: { en: 'You forgot a "Marks" column:', si: 'ඔබට "ලකුණු" තීරුව අමතක වී ඇත:' }, ans: 'addcol' },
          { q: { en: 'To make one wide heading across the top of the table:', si: 'වගුවේ ඉහළින් පළල් ශීර්ෂයක් සෑදීමට:' }, ans: 'merge' },
          { q: { en: 'The table prints with no lines around the cells:', si: 'වගුව කොටු වටා රේඛා නොමැතිව මුද්‍රණය වේ:' }, ans: 'border' },
          { q: { en: 'A student left the class and their row must go:', si: 'සිසුවෙක් පන්තියෙන් ඉවත් වූ අතර ඔහුගේ පේළිය ඉවත් කළ යුතුය:' }, ans: 'delete' }
        ]
      }
    ]
  }
];

/* Lesson 5 is REPLACED, not extended. The old 5.1 gate lab survives as 5.4, marked bonus. */
export const replacedLessons = [
  {
    id: 5,
    title: { en: 'Physical Computing', si: 'භෞතික ආගණනය' },
    icon: '💡',
    cls: 'l5',
    replaces: { title: 'Logic Gates', reason: 'NIE grade 8 competency 5.1 is physical computing, not logic gates. Truth tables are O/L grade 10.' },
    activities: [
      {
        id: '5.1',
        competency: '5.1',
        type: 'bits',
        name: { en: 'Switch the LEDs On and Off', si: 'LED බල්බ දල්වමු හා නිවමු' },
        instruction: {
          en: 'Four LED bulbs are joined to the board. ON is 1 and OFF is 0. Toggle the bulbs so the pattern matches the number the program sends. Place values: 8, 4, 2, 1.',
          si: 'LED බල්බ හතරක් පුවරුවට සම්බන්ධ කර ඇත. දැල්වීම 1 ද, නිවීම 0 ද වේ. වැඩසටහන එවන සංඛ්‍යාවට රටාව ගැළපෙන සේ බල්බ මාරු කරන්න. ස්ථානීය අගයන්: 8, 4, 2, 1.'
        },
        bitCount: 4,
        labelStyle: 'led',
        targets: [5, 10, 3, 12, 9, 6, 15, 8]
      },
      {
        id: '5.2',
        competency: '5.1',
        type: 'order',
        name: { en: 'Make the LED Blink', si: 'LED බල්බය දැල්වෙන රටාව සකසමු' },
        instruction: {
          en: 'Drag the steps to build a program that makes one LED blink over and over.',
          si: 'එක් LED බල්බයක් නැවත නැවත දැල්වෙන වැඩසටහනක් සෑදීමට පියවර අනුපිළිවෙලට සකසන්න.'
        },
        correctOrder: [
          { text: { en: 'Connect the LED to pin 0 on the board', si: 'LED බල්බය පුවරුවේ pin 0 ට සම්බන්ධ කරන්න' }, icon: '🔌' },
          { text: { en: 'Start a repeat block so the steps run again and again', si: 'පියවර නැවත නැවත ක්‍රියාත්මක වන ලෙස පුනර්කරණ කොටසක් ආරම්භ කරන්න' }, icon: '🔁' },
          { text: { en: 'Set pin 0 to 1 so the LED lights up', si: 'LED බල්බය දැල්වෙන ලෙස pin 0 හි අගය 1 කරන්න' }, icon: '💡' },
          { text: { en: 'Wait one second', si: 'තත්පරයක් රැඳී සිටින්න' }, icon: '⏳' },
          { text: { en: 'Set pin 0 to 0 so the LED goes out', si: 'LED බල්බය නිවෙන ලෙස pin 0 හි අගය 0 කරන්න' }, icon: '🌑' },
          { text: { en: 'Wait one second, then the repeat starts again', si: 'තත්පරයක් රැඳී සිටින්න, පසුව පුනර්කරණය නැවත ආරම්භ වේ' }, icon: '⏳' }
        ]
      },
      {
        id: '5.3',
        competency: '5.1',
        type: 'match',
        name: { en: 'Match the Part to Its Job', si: 'උපාංගය හා එහි කාර්යය යුගල කරමු' },
        instruction: {
          en: 'Match each part of a physical computing device with the job it does.',
          si: 'භෞතික ආගණන උපාංගයක එක් එක් කොටස එහි කාර්යය සමඟ යුගල කරන්න.'
        },
        pairs: [
          { l: { en: '💡 LED', si: '💡 LED බල්බය' }, r: { en: 'Gives out light when current passes through it', si: 'විදුලි ධාරාව ගමන් කරන විට ආලෝකය ලබා දෙයි' }, li: '💡', ri: '✨' },
          { l: { en: '🧠 Microcontroller', si: '🧠 ක්ෂුද්‍ර පාලකය' }, r: { en: 'The small computer that runs your program', si: 'ඔබගේ වැඩසටහන ක්‍රියාත්මක කරන කුඩා පරිගණකය' }, li: '🧠', ri: '📜' },
          { l: { en: '📍 Pin', si: '📍 පින්නුව' }, r: { en: 'The point where you connect a device to the board', si: 'උපාංගයක් පුවරුවට සම්බන්ධ කරන ස්ථානය' }, li: '📍', ri: '🔌' },
          { l: { en: '🔋 Battery', si: '🔋 බැටරිය' }, r: { en: 'Supplies the power the circuit needs', si: 'පරිපථයට අවශ්‍ය බලය සපයයි' }, li: '🔋', ri: '⚡' },
          { l: { en: '🧱 Resistor', si: '🧱 ප්‍රතිරෝධකය' }, r: { en: 'Protects the LED from too much current', si: 'අධික ධාරාවෙන් LED බල්බය ආරක්ෂා කරයි' }, li: '🧱', ri: '🛡️' }
        ]
      },
      {
        id: '5.4',
        competency: null,
        bonus: true,
        type: 'gate',
        name: { en: 'Logic Gate Lab (bonus)', si: 'තර්ක ද්වාර පරීක්ෂණාගාරය (අමතර)' },
        instruction: {
          en: 'Bonus round, beyond the grade 8 syllabus. Look at the gate and the inputs. What is the output?',
          si: '8 ශ්‍රේණියේ විෂය නිර්දේශයෙන් ඔබ්බට යන අමතර වටයකි. ද්වාරය හා ආදාන බලා ප්‍රතිදානය කුමක්දැයි තෝරන්න.'
        },
        keptFrom: 'grade 8 english.html activity 5.1, unchanged apart from the id and the bonus flag',
        rounds: [
          { gate: 'AND', a: 1, b: 1, correct: '1' },
          { gate: 'AND', a: 1, b: 0, correct: '0' },
          { gate: 'OR', a: 0, b: 1, correct: '1' },
          { gate: 'OR', a: 0, b: 0, correct: '0' },
          { gate: 'NOT', a: 1, b: null, correct: '0' },
          { gate: 'NOT', a: 0, b: null, correct: '1' }
        ]
      }
    ],
    /* The other two old lesson 5 activities stay, renumbered, still marked bonus. */
    keptAsBonus: [
      { was: '5.2', now: '5.5', name: 'Truth Table Challenge' },
      { was: '5.3', now: '5.6', name: 'Compute the Gate Output' }
    ]
  }
];

export const lessons = [
  {
    id: 7,
    title: { en: 'Apps on Phones and Smart Devices', si: 'ජංගම හා සුහුරු උපාංගවල ඇප්ලිකේෂන්' },
    icon: '📱',
    cls: 'l7',
    activities: [
      {
        id: '7.1',
        competency: '4.1',
        type: 'bucket',
        name: { en: 'Where Does the App Run', si: 'ඇප්ලිකේෂනය ක්‍රියාත්මක වන්නේ කොහේද' },
        instruction: {
          en: 'Click an app first, then click the device it was made for.',
          si: 'මුලින් ඇප්ලිකේෂනයක් ක්ලික් කර, පසුව එය සාදා ඇති උපාංගය ක්ලික් කරන්න.'
        },
        buckets: [
          {
            name: { en: '📱 Phone app', si: '📱 ජංගම දුරකථන ඇප්ලිකේෂන්' },
            items: [
              { en: 'A bus timetable app', si: 'බස් කාලසටහන් ඇප්ලිකේෂනයක්' },
              { en: 'A camera app', si: 'කැමරා ඇප්ලිකේෂනයක්' },
              { en: 'A messaging app', si: 'පණිවිඩ ඇප්ලිකේෂනයක්' }
            ]
          },
          {
            name: { en: '⌚ Smart device', si: '⌚ සුහුරු උපාංග' },
            items: [
              { en: 'A step counter on a watch', si: 'ඔරලෝසුවක පියවර ගණන් කරන්නා' },
              { en: 'A smart TV video app', si: 'සුහුරු රූපවාහිනී දෘශ්‍ය ඇප්ලිකේෂනයක්' },
              { en: 'A smart light switch', si: 'සුහුරු විදුලි පහන් ස්විචයක්' }
            ]
          },
          {
            name: { en: '💻 Computer', si: '💻 පරිගණකය' },
            items: [
              { en: 'A word processing package', si: 'වදන් සැකසුම් මෘදුකාංග පැකේජයක්' },
              { en: 'A spreadsheet package', si: 'පැතුරුම්පත් පැකේජයක්' },
              { en: 'A programming IDE', si: 'ක්‍රමලේඛන IDE එකක්' }
            ]
          }
        ]
      },
      {
        id: '7.2',
        competency: '4.1',
        type: 'tf',
        name: { en: 'App Facts', si: 'ඇප්ලිකේෂන් පිළිබඳ කරුණු' },
        instruction: {
          en: 'Decide whether each statement is True or False.',
          si: 'එක් එක් ප්‍රකාශය සත්‍යද අසත්‍යද යන්න තීරණය කරන්න.'
        },
        statements: [
          { s: { en: 'An app is a program written for a phone or a smart device.', si: 'ඇප්ලිකේෂනයක් යනු දුරකථනයක් හෝ සුහුරු උපාංගයක් සඳහා ලියන ලද වැඩසටහනකි.' }, a: true },
          { s: { en: 'Apps are downloaded from an app store.', si: 'ඇප්ලිකේෂන් ඇප් ගබඩාවකින් බාගත කරනු ලැබේ.' }, a: true },
          { s: { en: 'A phone app and a computer program are built in exactly the same way.', si: 'ජංගම ඇප්ලිකේෂනයක් හා පරිගණක වැඩසටහනක් හරියටම එකම ආකාරයට සාදනු ලැබේ.' }, a: false },
          { s: { en: 'A smart watch can run a program without being joined to a computer.', si: 'සුහුරු ඔරලෝසුවකට පරිගණකයකට සම්බන්ධ නොවී වැඩසටහනක් ක්‍රියාත්මක කළ හැකිය.' }, a: true },
          { s: { en: 'Every app must be paid for before you can use it.', si: 'සෑම ඇප්ලිකේෂනයක්ම භාවිත කිරීමට පෙර මුදල් ගෙවිය යුතුය.' }, a: false },
          { s: { en: 'A problem is broken into input, process and output before an app is written.', si: 'ඇප්ලිකේෂනයක් ලිවීමට පෙර ගැටලුව ආදාන, සැකසීම හා ප්‍රතිදාන ලෙස වෙන් කරනු ලැබේ.' }, a: true }
        ]
      },
      {
        id: '7.3',
        competency: '4.1',
        type: 'match',
        name: { en: 'Match the App to Its Job', si: 'ඇප්ලිකේෂනය හා එහි කාර්යය යුගල කරමු' },
        instruction: {
          en: 'Match each app with the everyday problem it solves.',
          si: 'එක් එක් ඇප්ලිකේෂනය එය විසඳන එදිනෙදා ගැටලුව සමඟ යුගල කරන්න.'
        },
        pairs: [
          { l: { en: '🗺️ Map app', si: '🗺️ සිතියම් ඇප්ලිකේෂනය' }, r: { en: 'Shows the way from here to there', si: 'මෙතැන සිට එතැනට යන මග පෙන්වයි' }, li: '🗺️', ri: '🧭' },
          { l: { en: '🏦 Banking app', si: '🏦 බැංකු ඇප්ලිකේෂනය' }, r: { en: 'Sends money without going to the branch', si: 'ශාඛාවට නොගොස් මුදල් යවයි' }, li: '🏦', ri: '💸' },
          { l: { en: '🩺 Health app', si: '🩺 සෞඛ්‍ය ඇප්ලිකේෂනය' }, r: { en: 'Counts your steps and your sleep', si: 'ඔබගේ පියවර හා නින්ද ගණන් කරයි' }, li: '🩺', ri: '👟' },
          { l: { en: '🎓 Learning app', si: '🎓 ඉගෙනුම් ඇප්ලිකේෂනය' }, r: { en: 'Gives you a lesson and a quiz on the phone', si: 'දුරකථනයෙන් පාඩමක් හා ප්‍රශ්න මාලාවක් ලබා දෙයි' }, li: '🎓', ri: '📚' },
          { l: { en: '🌦️ Weather app', si: '🌦️ කාලගුණ ඇප්ලිකේෂනය' }, r: { en: 'Tells the farmer whether rain is coming', si: 'වැසි එනවාද යන්න ගොවියාට කියයි' }, li: '🌦️', ri: '🌾' }
        ]
      }
    ]
  }
];
