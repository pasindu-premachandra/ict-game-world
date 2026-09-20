/* Grade 6 syllabus additions - ICT Game World.
   Fills NIE competency levels 1.3, 1.4 and 4.2, which had no activity.
   Every string is {en, si}. si is drafted by Claude and stays siDraft until Ishini reviews it.
   Engine types used here (order, match, pick, bucket) all already exist in grade 6. */

export const grade = 6;
export const siDraft = true;

export const lessons = [
  {
    id: 7,
    title: { en: 'Software Around Us', si: 'මෘදුකාංග අප වටා' },
    icon: '💿',
    cls: 'l7',
    activities: [
      {
        id: '7.1',
        competency: '1.3',
        type: 'bucket',
        name: { en: 'Sort the Kinds of Software', si: 'මෘදුකාංග වර්ග කරමු' },
        instruction: {
          en: 'Click an item first, then click the correct bucket to sort it.',
          si: 'මුලින් ද්‍රව්‍යයක් ක්ලික් කර, පසුව නිවැරදි බඳුන ක්ලික් කරන්න.'
        },
        buckets: [
          {
            name: { en: '🎮 Computer Games', si: '🎮 පරිගණක ක්‍රීඩා' },
            items: [
              { en: 'Chess', si: 'චෙස්' },
              { en: 'Solitaire', si: 'සොලිටෙයාර්' },
              { en: 'Tux Racer', si: 'ටක්ස් රේසර්' }
            ]
          },
          {
            name: { en: '🎵 Media Players', si: '🎵 මාධ්‍ය ධාවක' },
            items: [
              { en: 'VLC Media Player', si: 'VLC මාධ්‍ය ධාවකය' },
              { en: 'Windows Media Player', si: 'Windows මාධ්‍ය ධාවකය' },
              { en: 'Audacity', si: 'Audacity' }
            ]
          },
          {
            name: { en: '🎨 Drawing Software', si: '🎨 චිත්‍රක මෘදුකාංග' },
            items: [
              { en: 'MS Paint', si: 'MS Paint' },
              { en: 'Tux Paint', si: 'Tux Paint' },
              { en: 'GIMP', si: 'GIMP' }
            ]
          }
        ]
      },
      {
        id: '7.2',
        competency: '1.4',
        type: 'match',
        name: { en: 'Where Computers Help Us', si: 'පරිගණකයෙහි භූමිකාව' },
        instruction: {
          en: 'Match each place with the work the computer does there.',
          si: 'එක් එක් ස්ථානය එහි පරිගණකය කරන කාර්යය සමඟ යුගල කරන්න.'
        },
        pairs: [
          {
            l: { en: '🏫 School', si: '🏫 පාසල' },
            r: { en: 'Keeps student marks and attendance', si: 'සිසුන්ගේ ලකුණු හා පැමිණීම තබා ගනී' },
            li: '🏫', ri: '📝'
          },
          {
            l: { en: '🏦 Bank', si: '🏦 බැංකුව' },
            r: { en: 'Handles accounts and ATM withdrawals', si: 'ගිණුම් හා ATM මුදල් ගැනීම් හසුරුවයි' },
            li: '🏦', ri: '💳'
          },
          {
            l: { en: '🏥 Hospital', si: '🏥 රෝහල' },
            r: { en: 'Keeps patient records and test results', si: 'රෝගීන්ගේ වාර්තා හා පරීක්ෂණ ප්‍රතිඵල තබා ගනී' },
            li: '🏥', ri: '🩺'
          },
          {
            l: { en: '🏭 Factory', si: '🏭 කර්මාන්ත ශාලාව' },
            r: { en: 'Controls the machines on the production line', si: 'නිෂ්පාදන පෙළෙහි යන්ත්‍ර පාලනය කරයි' },
            li: '🏭', ri: '⚙️'
          },
          {
            l: { en: '🌾 Farm', si: '🌾 ගොවිපොල' },
            r: { en: 'Watches the weather and plans the watering', si: 'කාලගුණය නිරීක්ෂණය කර ජල සම්පාදනය සැලසුම් කරයි' },
            li: '🌾', ri: '🌧️'
          },
          {
            l: { en: '📚 Library', si: '📚 පුස්තකාලය' },
            r: { en: 'Finds a book and records who borrowed it', si: 'පොතක් සොයා එය ණයට ගත් අය සටහන් කරයි' },
            li: '📚', ri: '🔖'
          }
        ]
      },
      {
        id: '7.3',
        competency: '1.3',
        type: 'pick',
        name: { en: 'Why We Need Software', si: 'මෘදුකාංග අවශ්‍ය වන්නේ ඇයි' },
        instruction: {
          en: 'Select ONLY the correct statements about software.',
          si: 'මෘදුකාංග පිළිබඳ නිවැරදි ප්‍රකාශ පමණක් තෝරන්න.'
        },
        items: [
          { text: { en: 'Software gives the computer its instructions', si: 'මෘදුකාංග පරිගණකයට උපදෙස් ලබා දෙයි' }, icon: '📜', correct: true },
          { text: { en: 'A computer with no software cannot do any work', si: 'මෘදුකාංග නැති පරිගණකයකට කිසිදු කාර්යයක් කළ නොහැක' }, icon: '🚫', correct: true },
          { text: { en: 'Educational software helps students learn', si: 'අධ්‍යාපන මෘදුකාංග සිසුන්ට ඉගෙනීමට උපකාර වේ' }, icon: '🎓', correct: true },
          { text: { en: 'A library management system is software', si: 'පුස්තකාල කළමනාකරණ පද්ධතිය මෘදුකාංගයකි' }, icon: '📚', correct: true },
          { text: { en: 'Software is a part you can hold in your hand', si: 'මෘදුකාංග යනු අතට ගත හැකි කොටසකි' }, icon: '✋', correct: false },
          { text: { en: 'Software and hardware mean the same thing', si: 'මෘදුකාංග හා දෘඪාංග යන්නෙහි අර්ථය එකමය' }, icon: '🔁', correct: false },
          { text: { en: 'Only games count as software', si: 'මෘදුකාංග ලෙස සැලකෙන්නේ ක්‍රීඩා පමණි' }, icon: '🎮', correct: false }
        ]
      }
    ]
  },
  {
    id: 8,
    title: { en: 'Audio and Video Software', si: 'ශ්‍රව්‍ය හා දෘශ්‍ය මෘදුකාංග' },
    icon: '🎬',
    cls: 'l8',
    activities: [
      {
        id: '8.1',
        competency: '4.2',
        type: 'order',
        name: { en: 'Record an Audio Clip', si: 'ශ්‍රව්‍ය පසුරක් පටිගත කරමු' },
        instruction: {
          en: 'Drag the steps to put the recording of an audio clip in the correct order.',
          si: 'ශ්‍රව්‍ය පසුරක් පටිගත කිරීමේ පියවර නිවැරදි පිළිවෙලට සකසන්න.'
        },
        correctOrder: [
          { text: { en: 'Open the audio editing software', si: 'ශ්‍රව්‍ය සංස්කරණ මෘදුකාංගය විවෘත කරන්න' }, icon: '🎛️' },
          { text: { en: 'Connect and switch on the microphone', si: 'මයික්‍රෝෆෝනය සම්බන්ධ කර ක්‍රියාත්මක කරන්න' }, icon: '🎤' },
          { text: { en: 'Click Record and speak', si: 'Record ක්ලික් කර කතා කරන්න' }, icon: '⏺️' },
          { text: { en: 'Click Stop when you have finished', si: 'අවසන් වූ විට Stop ක්ලික් කරන්න' }, icon: '⏹️' },
          { text: { en: 'Save the audio file', si: 'ශ්‍රව්‍ය ගොනුව සුරකින්න' }, icon: '💾' }
        ]
      },
      {
        id: '8.2',
        competency: '4.2',
        type: 'match',
        name: { en: 'Match Audio and Video Files', si: 'ශ්‍රව්‍ය හා දෘශ්‍ය ගොනු යුගල කරමු' },
        instruction: {
          en: 'Match each file extension with the kind of file it is.',
          si: 'එක් එක් ගොනු දිගුව එහි ගොනු වර්ගය සමඟ යුගල කරන්න.'
        },
        pairs: [
          { l: { en: '.mp3', si: '.mp3' }, r: { en: 'An audio file that takes little space', si: 'අඩු ඉඩක් ගන්නා ශ්‍රව්‍ය ගොනුවකි' }, li: '🎵', ri: '📦' },
          { l: { en: '.wav', si: '.wav' }, r: { en: 'An audio file that is not compressed', si: 'සම්පීඩනය නොකළ ශ්‍රව්‍ය ගොනුවකි' }, li: '🔊', ri: '📀' },
          { l: { en: '.mp4', si: '.mp4' }, r: { en: 'A video file used on most devices', si: 'බොහෝ උපාංගවල භාවිත වන දෘශ්‍ය ගොනුවකි' }, li: '🎬', ri: '📱' },
          { l: { en: '.mov', si: '.mov' }, r: { en: 'A video file made by a camera or phone', si: 'කැමරාවකින් හෝ දුරකථනයකින් සාදන ලද දෘශ්‍ය ගොනුවකි' }, li: '📹', ri: '📸' }
        ]
      },
      {
        id: '8.3',
        competency: '4.2',
        type: 'pick',
        name: { en: 'What Video Software Can Do', si: 'දෘශ්‍ය මෘදුකාංගයෙන් කළ හැකි දේ' },
        instruction: {
          en: 'Select ONLY the things you can do with video editing software.',
          si: 'දෘශ්‍ය සංස්කරණ මෘදුකාංගයෙන් කළ හැකි දේ පමණක් තෝරන්න.'
        },
        items: [
          { text: { en: 'Cut out a part of a video', si: 'දෘශ්‍යයක කොටසක් කපා ඉවත් කිරීම' }, icon: '✂️', correct: true },
          { text: { en: 'Join two video clips together', si: 'දෘශ්‍ය පසුරු දෙකක් එකට එක් කිරීම' }, icon: '🔗', correct: true },
          { text: { en: 'Add a title to the video', si: 'දෘශ්‍යයට මාතෘකාවක් එක් කිරීම' }, icon: '🔤', correct: true },
          { text: { en: 'Add background music to the video', si: 'දෘශ්‍යයට පසුබිම් සංගීතය එක් කිරීම' }, icon: '🎶', correct: true },
          { text: { en: 'Print the video on a sheet of paper', si: 'දෘශ්‍යය කඩදාසියක මුද්‍රණය කිරීම' }, icon: '🖨️', correct: false },
          { text: { en: 'Turn the video into a keyboard', si: 'දෘශ්‍යය යතුරුපුවරුවක් බවට පත් කිරීම' }, icon: '⌨️', correct: false }
        ]
      }
    ]
  }
];
