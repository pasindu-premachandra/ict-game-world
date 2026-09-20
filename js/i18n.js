// UI chrome only. Lesson and activity text lives in data/grade-N.json.

const STRINGS = {
  appName:      { en: 'ICT Game World', si: 'ICT ක්‍රීඩා ලෝකය' },
  skipToContent:{ en: 'Skip to content', si: 'අන්තර්ගතය වෙත යන්න' },
  madeBy:       { en: 'Made by Ishini Premachandra & Dilini Wijesooriya',
                  si: 'නිර්මාණය ඉෂිනි ප්‍රේමචන්ද්‍ර සහ දිලිනි විජේසූරිය' },
  pickGrade:    { en: 'Choose your grade', si: 'ඔබේ ශ්‍රේණිය තෝරන්න' },
  grade:        { en: 'Grade', si: 'ශ්‍රේණිය' },
  lessons:      { en: 'lessons', si: 'පාඩම්' },
  activities:   { en: 'activities', si: 'ක්‍රියාකාරකම්' },
  start:        { en: 'Start', si: 'පටන් ගන්න' },
  check:        { en: 'Check', si: 'පරීක්ෂා කරන්න' },
  next:         { en: 'Next', si: 'ඊළඟ' },
  tryAgain:     { en: 'Try again', si: 'නැවත උත්සාහ කරන්න' },
  backToPath:   { en: 'Back to lessons', si: 'පාඩම් වෙත' },
  correct:      { en: 'Correct', si: 'නිවැරදියි' },
  notQuite:     { en: 'Not quite', si: 'නිවැරදි නැහැ' },
  done:         { en: 'Done', si: 'අවසන්' },
  points:       { en: 'points', si: 'ලකුණු' },
  moveUp:       { en: 'Move up', si: 'ඉහළට' },
  moveDown:     { en: 'Move down', si: 'පහළට' },
  symWhatName:  { en: 'What is this symbol called?', si: 'මෙම සංකේතයේ නම කුමක්ද?' },
  symWhatMean:  { en: 'What does it mean?', si: 'එහි අර්ථය කුමක්ද?' },
  whatName:     { en: 'What should we call you?', si: 'ඔබව හඳුන්වන්නේ කුමක් ලෙසද?' },
  nickname:     { en: 'Nickname', si: 'අන්වර්ථ නාමය' },
  chooseBuddy:  { en: 'Choose your buddy', si: 'ඔබේ මිතුරා තෝරන්න' },
  classCode:    { en: 'Class code (optional)', si: 'පන්ති කේතය (අවශ්‍ය නම්)' },
  saveAndPlay:  { en: 'Save and play', si: 'සුරකින්න' },
  leaderboard:  { en: 'Leaderboard', si: 'ප්‍රමුඛ ලැයිස්තුව' },
  myClass:      { en: 'My class', si: 'මගේ පන්තිය' },
  everyone:     { en: 'Everyone', si: 'සියල්ලෝ' },
  you:          { en: 'You', si: 'ඔබ' },
  noScoresYet:  { en: 'No scores yet. Play something!', si: 'තවම ලකුණු නැත. ක්‍රීඩා කරන්න!' },
  offlineBoard: { en: 'Showing scores from this device only.', si: 'මෙම උපාංගයේ ලකුණු පමණි.' },
  notSynced:    { en: 'scores waiting to sync', si: 'ලකුණු සමමුහුර්ත වීමට ඇත' },
  loading:      { en: 'Loading...', si: 'පූරණය වෙමින්...' },
  notFound:     { en: 'That page does not exist.', si: 'එම පිටුව නොමැත.' },
  englishOnly:  { en: 'Sinhala for this one is still being written.',
                  si: 'මෙයට සිංහල තවම ලියැවෙමින් පවතී.' },

  // Added with the grade 7-9 activity types. Drafted Sinhala, on the list for
  // Ishini and Dilini to review alongside the content typos.
  trueLabel:    { en: 'True', si: 'සත්‍යයි' },
  falseLabel:   { en: 'False', si: 'අසත්‍යයි' },
  whatOutput:   { en: 'What is the output?', si: 'ප්‍රතිදානය කුමක්ද?' },
  hint:         { en: 'Hint', si: 'ඉඟිය' },
  target:       { en: 'Target', si: 'ඉලක්කය' },
  currentSum:   { en: 'Current sum', si: 'දැන් එකතුව' },
  placeValue:   { en: 'Place value', si: 'ස්ථානීය අගය' },
  led:          { en: 'LED', si: 'LED බල්බය' },
  clear:        { en: 'Clear', si: 'මකන්න' },
  addTiles:     { en: 'Click the tiles below to add them here.',
                  si: 'පහළ ඇති ටයිල් ක්ලික් කර මෙහි එකතු කරන්න.' },
};

export const LANGS = ['si', 'en'];

let current = 'en';

export function getLang() {
  return current;
}

export function setLang(lang) {
  current = LANGS.includes(lang) ? lang : 'en';
  document.documentElement.lang = current;
  try {
    localStorage.setItem('igw.lang', current);
  } catch {
    // Private mode or blocked storage: the language just will not be remembered.
  }
  applyStatic();
  return current;
}

export function loadLang() {
  let saved = null;
  try {
    saved = localStorage.getItem('igw.lang');
  } catch {
    saved = null;
  }
  if (saved) return setLang(saved);
  return setLang((navigator.language || '').startsWith('si') ? 'si' : 'en');
}

export function t(key) {
  const entry = STRINGS[key];
  if (!entry) return key;
  return entry[current] ?? entry.en;
}

// A string from the data files is {en, si} when it is translatable copy, or a
// plain string when it is an icon or an answer key. Sinhala can be missing, so
// fall back to English rather than showing a blank to a child.
export function text(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  return value[current] || value.en || '';
}

// True when we are showing English because the Sinhala is not written yet.
export function isFallback(value) {
  return current !== 'en' && value && typeof value === 'object' && !value[current] && Boolean(value.en);
}

export function applyStatic() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('.langswitch button').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.lang === current));
  });
}
