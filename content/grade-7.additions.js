/* Grade 7 syllabus additions - ICT Game World.
   Fills NIE competency levels 2.4, 5.3, 5.4, 7.1 (trusted sites), 7.2 (conferencing) and 7.4,
   none of which had an activity.
   Activities 2.5 and 5.5 extend existing lessons; lesson 8 is new.
   5.6 uses the `trace` engine, which today exists only in grade 8. The redesign merges all
   engines into one app, so this is reuse, not a new engine.
   Every string is {en, si}. si is drafted by Claude and stays siDraft until Ishini reviews it. */

export const grade = 7;
export const siDraft = true;

/* Added to lesson 2, Operating System, after the existing 2.4 */
export const additionsToExistingLessons = [
  {
    lessonId: 2,
    activities: [
      {
        id: '2.5',
        competency: '2.4',
        type: 'match',
        name: { en: 'Match the File Properties', si: 'ගොනු ගුණාංග යුගල කරමු' },
        instruction: {
          en: 'Match each file property with what it tells you.',
          si: 'එක් එක් ගොනු ගුණාංගය එයින් කියවෙන දේ සමඟ යුගල කරන්න.'
        },
        pairs: [
          { l: { en: '📏 Size', si: '📏 ප්‍රමාණය' }, r: { en: 'How much space the file takes on the disk', si: 'ගොනුව තැටියේ ගන්නා ඉඩ ප්‍රමාණය' }, li: '📏', ri: '💽' },
          { l: { en: '🏷️ Type', si: '🏷️ වර්ගය' }, r: { en: 'Which software opens the file', si: 'ගොනුව විවෘත කරන මෘදුකාංගය' }, li: '🏷️', ri: '🧩' },
          { l: { en: '📅 Modified date', si: '📅 වෙනස් කළ දිනය' }, r: { en: 'When the file was last changed', si: 'ගොනුව අවසන් වරට වෙනස් කළ දිනය' }, li: '📅', ri: '🕗' },
          { l: { en: '📂 Location', si: '📂 පිහිටීම' }, r: { en: 'Which folder the file is saved in', si: 'ගොනුව සුරැකී ඇති බහාලුම' }, li: '📂', ri: '🗄️' },
          { l: { en: '🔒 Read-only', si: '🔒 පඨන මාත්‍ර' }, r: { en: 'The file can be opened but not changed', si: 'ගොනුව විවෘත කළ හැකි නමුත් වෙනස් කළ නොහැක' }, li: '🔒', ri: '🚫' }
        ]
      }
    ]
  },
  {
    lessonId: 5,
    activities: [
      {
        id: '5.5',
        competency: '5.3',
        type: 'match',
        name: { en: 'Match the Variable to What It Holds', si: 'විචල්‍යය හා එහි අගය යුගල කරමු' },
        instruction: {
          en: 'A variable is a named box that holds a value. Match each variable with what it holds.',
          si: 'විචල්‍යයක් යනු අගයක් තබා ගන්නා නමක් සහිත කොටුවකි. එක් එක් විචල්‍යය එහි අගය සමඟ යුගල කරන්න.'
        },
        pairs: [
          { l: { en: 'score', si: 'score' }, r: { en: 'The number of points the player has won', si: 'ක්‍රීඩකයා දිනාගත් ලකුණු ගණන' }, li: '🔢', ri: '🏆' },
          { l: { en: 'name', si: 'name' }, r: { en: 'The player\'s name, kept as text', si: 'පාඨ ලෙස තබා ගන්නා ක්‍රීඩකයාගේ නම' }, li: '🔤', ri: '🧒' },
          { l: { en: 'lives', si: 'lives' }, r: { en: 'How many turns are still left', si: 'තවම ඉතිරි ඇති වාර ගණන' }, li: '❤️', ri: '🔁' },
          { l: { en: 'speed', si: 'speed' }, r: { en: 'How fast the sprite moves', si: 'ස්ප්‍රයිටය චලනය වන වේගය' }, li: '⚡', ri: '🏃' }
        ]
      },
      {
        id: '5.6',
        competency: '5.4',
        type: 'trace',
        name: { en: 'Find the Bug', si: 'දෝෂය සොයමු' },
        instruction: {
          en: 'A mistake in a program is called a bug. Read each program and choose what really happens.',
          si: 'වැඩසටහනක ඇති වරද දෝෂයක් (bug) ලෙස හැඳින්වේ. එක් එක් වැඩසටහන කියවා සැබවින්ම සිදුවන දේ තෝරන්න.'
        },
        questions: [
          {
            code: 'set score to 0\nchange score by 1\nchange score by 1\nsay score',
            opts: ['0', '1', '2', '3'],
            ans: 2,
            note: { en: 'No bug here. score goes up twice from 0.', si: 'මෙහි දෝෂයක් නැත. score අගය 0 සිට දෙවරක් වැඩි වේ.' }
          },
          {
            code: 'set count to 1\nrepeat 3\n   say count\n(count is never changed)',
            opts: ['1 1 1', '1 2 3', '3 3 3', 'Nothing is said'],
            ans: 0,
            note: { en: 'The bug: count is never changed inside the repeat, so it stays 1.', si: 'දෝෂය: repeat තුළ count කිසිදා වෙනස් නොවන නිසා එය 1 ලෙසම පවතී.' }
          },
          {
            code: 'set total to 10\nset total to 5\nsay total',
            opts: ['15', '10', '5', 'Error'],
            ans: 2,
            note: { en: 'The bug: the second set wipes out the first value.', si: 'දෝෂය: දෙවන set මඟින් පළමු අගය මකා දමයි.' }
          },
          {
            code: 'set age to 12\nif age > 18 then\n   say "Adult"\nelse\n   say "Student"',
            opts: ['Adult', 'Student', 'Both', 'Nothing'],
            ans: 1,
            note: { en: 'No bug. 12 is not greater than 18, so the else runs.', si: 'දෝෂයක් නැත. 12 යනු 18 ට වඩා වැඩි නොවන නිසා else ක්‍රියාත්මක වේ.' }
          },
          {
            code: 'set price to 100\nset discount to 10\nsay price + discount',
            opts: ['90', '110', '100', '10'],
            ans: 1,
            note: { en: 'The bug: a discount should be taken away, not added.', si: 'දෝෂය: වට්ටමක් එකතු කළ යුතු නොව අඩු කළ යුතුය.' }
          }
        ]
      }
    ]
  }
];

export const lessons = [
  {
    id: 8,
    title: { en: 'Safe, Legal and Kind Online', si: 'ආරක්ෂිත, නීත්‍යනුකූල හා කාරුණික අන්තර්ජාල භාවිතය' },
    icon: '🛡️',
    cls: 'l8',
    activities: [
      {
        id: '8.1',
        competency: '7.4',
        type: 'match',
        name: { en: 'Match the Online Danger', si: 'අන්තර්ජාල අනතුරු යුගල කරමු' },
        instruction: {
          en: 'Match each danger with what it means.',
          si: 'එක් එක් අනතුර එහි අර්ථය සමඟ යුගල කරන්න.'
        },
        pairs: [
          {
            l: { en: '🔓 Hacking', si: '🔓 අනවසරයෙන් ඇතුළු වීම' },
            r: { en: 'Entering someone\'s computer or account without permission', si: 'අනුමැතියකින් තොරව වෙනත් අයගේ පරිගණකයට හෝ ගිණුමට ඇතුළු වීම' },
            li: '🔓', ri: '🚪'
          },
          {
            l: { en: '🦠 Virus attack', si: '🦠 වෛරස් ප්‍රහාරය' },
            r: { en: 'Harmful software that damages your files', si: 'ඔබගේ ගොනුවලට හානි කරන අනිෂ්ට මෘදුකාංග' },
            li: '🦠', ri: '💥'
          },
          {
            l: { en: '📀 Software piracy', si: '📀 මෘදුකාංග කොල්ල කෑම' },
            r: { en: 'Copying and using software without paying for it', si: 'මුදල් නොගෙවා මෘදුකාංග පිටපත් කර භාවිත කිරීම' },
            li: '📀', ri: '💸'
          },
          {
            l: { en: '😢 Cyber bullying', si: '😢 සයිබර් හිරිහැර කිරීම' },
            r: { en: 'Hurting or shaming someone through the Internet', si: 'අන්තර්ජාලය හරහා අනෙකෙකුට හිංසා කිරීම හෝ අපහාස කිරීම' },
            li: '😢', ri: '💔'
          },
          {
            l: { en: '🕵️ Stealing data', si: '🕵️ දත්ත සොරකම් කිරීම' },
            r: { en: 'Taking someone\'s private information without asking', si: 'අසන්නේ නැතිව අනෙකෙකුගේ පෞද්ගලික තොරතුරු ගැනීම' },
            li: '🕵️', ri: '🔐'
          }
        ]
      },
      {
        id: '8.2',
        competency: '7.1',
        type: 'bucket',
        name: { en: 'Trusted or Not Trusted', si: 'විශ්වසනීයද නැද්ද' },
        instruction: {
          en: 'Click a sign first, then click the correct bucket.',
          si: 'මුලින් ලකුණක් ක්ලික් කර, පසුව නිවැරදි බඳුන ක්ලික් කරන්න.'
        },
        buckets: [
          {
            name: { en: '✅ A site you can trust', si: '✅ විශ්වසනීය වෙබ් අඩවියක්' },
            items: [
              { en: 'The address starts with https', si: 'ලිපිනය https වලින් පටන් ගනී' },
              { en: 'It is a .gov.lk or a school site', si: 'එය .gov.lk හෝ පාසල් වෙබ් අඩවියකි' },
              { en: 'The writer and the date are shown', si: 'ලේඛකයා හා දිනය දක්වා ඇත' },
              { en: 'Other trusted sites link to it', si: 'වෙනත් විශ්වසනීය අඩවි එයට සබැඳී ඇත' }
            ]
          },
          {
            name: { en: '⚠️ A site to be careful with', si: '⚠️ පරිස්සම් විය යුතු වෙබ් අඩවියක්' },
            items: [
              { en: 'It asks for your password by email', si: 'ඊ-තැපෑලෙන් ඔබගේ මුරපදය ඉල්ලයි' },
              { en: 'It promises money for doing nothing', si: 'කිසිවක් නොකර මුදල් ලැබෙන බව පොරොන්දු වෙයි' },
              { en: 'There are spelling mistakes everywhere', si: 'සෑම තැනම අක්ෂර වින්‍යාස දෝෂ ඇත' },
              { en: 'No writer and no date are given', si: 'ලේඛකයෙක් හෝ දිනයක් දක්වා නැත' }
            ]
          }
        ]
      },
      {
        id: '8.3',
        competency: '7.4',
        type: 'pick',
        name: { en: 'Be Safe and Be Kind', si: 'ආරක්ෂිත වන්න, කාරුණික වන්න' },
        instruction: {
          en: 'Select ONLY the safe and kind things to do online.',
          si: 'අන්තර්ජාලයේ දී කළ යුතු ආරක්ෂිත හා කාරුණික දේ පමණක් තෝරන්න.'
        },
        items: [
          { text: { en: 'Tell a trusted adult if someone is unkind to you online', si: 'අන්තර්ජාලයේ දී කවුරුන් හෝ අකාරුණික වන්නේ නම් විශ්වාසවන්ත වැඩිහිටියෙකුට කියන්න' }, icon: '🧑‍🏫', correct: true },
          { text: { en: 'Keep your password secret, even from friends', si: 'මිතුරන්ගෙන් පවා ඔබගේ මුරපදය රහසක් ලෙස තබා ගන්න' }, icon: '🔐', correct: true },
          { text: { en: 'Use only software your school has paid for', si: 'ඔබගේ පාසල මුදල් ගෙවා ඇති මෘදුකාංග පමණක් භාවිත කරන්න' }, icon: '🧾', correct: true },
          { text: { en: 'Think before you post something about someone else', si: 'අන් අයෙක් ගැන යමක් පළ කිරීමට පෙර සිතන්න' }, icon: '💭', correct: true },
          { text: { en: 'Block and report a stranger who keeps messaging you', si: 'නිතර පණිවිඩ එවන නාඳුනන අයෙකු අවහිර කර වාර්තා කරන්න' }, icon: '🚫', correct: true },
          { text: { en: 'Share your home address with someone you met online', si: 'අන්තර්ජාලයෙන් හමු වූ අයෙකුට ඔබගේ නිවසේ ලිපිනය දෙන්න' }, icon: '🏠', correct: false },
          { text: { en: 'Copy a friend\'s paid software onto your computer', si: 'මිතුරෙකුගේ මිලදී ගත් මෘදුකාංගය ඔබගේ පරිගණකයට පිටපත් කරන්න' }, icon: '📀', correct: false },
          { text: { en: 'Forward a message that makes fun of a classmate', si: 'පන්තියේ මිතුරෙකුට සමච්චල් කරන පණිවිඩයක් ඉදිරියට යවන්න' }, icon: '😢', correct: false }
        ]
      },
      {
        id: '8.4',
        competency: '7.2',
        type: 'match',
        name: { en: 'Meeting Online', si: 'මාර්ගගත ව හමුවීම' },
        instruction: {
          en: 'Match each word with what it means in an online meeting.',
          si: 'මාර්ගගත සම්මන්ත්‍රණයක දී එක් එක් වචනයේ අර්ථය යුගල කරන්න.'
        },
        pairs: [
          {
            l: { en: '💻 Online conferencing', si: '💻 මාර්ගගත සම්මන්ත්‍රණය' },
            r: { en: 'Meeting and talking with a group through the Internet', si: 'අන්තර්ජාලය හරහා කණ්ඩායමක් සමඟ හමුවී කතා කිරීම' },
            li: '💻', ri: '👥'
          },
          {
            l: { en: '💬 Chat', si: '💬 මාර්ගගත සංවාදය' },
            r: { en: 'Typing messages back and forth right now', si: 'එම මොහොතේම පණිවිඩ හුවමාරු කර ගැනීම' },
            li: '💬', ri: '⌨️'
          },
          {
            l: { en: '📧 E-mail', si: '📧 ඊ-තැපෑල' },
            r: { en: 'Sending a written message that waits in an inbox', si: 'එන ලිපි ගොනුවේ රැඳී සිටින ලිඛිත පණිවිඩයක් යැවීම' },
            li: '📧', ri: '📥'
          },
          {
            l: { en: '🔇 Mute', si: '🔇 නිහඬ කිරීම' },
            r: { en: 'Turning your microphone off so others do not hear you', si: 'අන් අයට නොඇසෙන ලෙස ඔබගේ මයික්‍රෝෆෝනය ක්‍රියා විරහිත කිරීම' },
            li: '🔇', ri: '🎤'
          },
          {
            l: { en: '🧑‍💼 Host', si: '🧑‍💼 සත්කාරක' },
            r: { en: 'The person who starts the online meeting', si: 'මාර්ගගත සම්මන්ත්‍රණය ආරම්භ කරන පුද්ගලයා' },
            li: '🧑‍💼', ri: '▶️'
          }
        ]
      }
    ]
  }
];
