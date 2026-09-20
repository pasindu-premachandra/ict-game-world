import { loadLang, setLang, t, text, isFallback, applyStatic } from './i18n.js';
import { el, setChildren } from './dom.js';
import { scoreFor, saveScore, totalFor, starsFor } from './store.js';
import { hasPlayer } from './player.js';
import { pushScore, flushQueue } from './leaderboard.js';
import { nameEntry, leaderboard } from './screens.js';
import { soundOn, setSound } from './audio.js';
import { stars, resetStreak, finished } from './reward.js';
import { loadAdventure, bonusFor, findActivity, PREFIX } from './adventure.js';
import { scratchHub, scratchStructure, scratchPuzzle } from './scratch.js';

const GRADES = [6, 7, 8, 9];
const TYPES = [
  'order', 'match', 'pick', 'bucket', 'symmatch',
  'tf', 'input', 'hotspot', 'trace', 'bits', 'gate', 'query',
  'mcquiz', 'sortgame', 'memory',
];

const main = document.getElementById('main');
const cache = new Map();
const modules = new Map();

async function loadGrade(grade) {
  if (!cache.has(grade)) {
    const res = await fetch(`data/grade-${grade}.json`);
    if (!res.ok) throw new Error(`cannot load grade ${grade}`);
    cache.set(grade, await res.json());
  }
  return cache.get(grade);
}

async function loadType(type) {
  if (!modules.has(type)) modules.set(type, await import(`./activities/${type}.js`));
  return modules.get(type);
}

function setGrade(grade) {
  document.body.dataset.grade = String(grade);
  document.getElementById('chipGrade').textContent = String(grade);
}

function showXp(grade) {
  const xp = document.getElementById('xp');
  if (grade === null) { xp.hidden = true; return; }
  xp.hidden = false;
  document.getElementById('xpValue').textContent = String(totalFor(grade));
}

// ---- screens -------------------------------------------------------------

function gradePicker() {
  showXp(null);
  main.replaceChildren(
    el('h1', { class: 'screen-title' }, [t('pickGrade')]),
    el('div', { class: 'grade-grid' }, GRADES.map((grade) => {
      const card = el('a', { class: 'grade-card', href: `#/g${grade}`, 'data-grade': String(grade) }, [
        el('span', { class: 'grade-num' }, [String(grade)]),
        el('span', { class: 'grade-word' }, [t('grade')]),
      ]);
      return card;
    })),
    // The Scratch Code Builder teaches the control structures, which every
    // grade meets, so it sits beside the grades rather than inside one.
    el('a', { class: 'builder-card', href: '#/scratch' }, [
      el('span', { class: 'builder-icon', 'aria-hidden': 'true' }, ['🐱']),
      el('span', { class: 'builder-body' }, [
        el('span', { class: 'builder-title' }, [t('scratchTitle')]),
        el('span', { class: 'builder-sub' }, [t('forEveryGrade')]),
      ]),
      el('span', { class: 'builder-chev', 'aria-hidden': 'true' }, ['›']),
    ]),
  );
}

async function lessonPath(grade) {
  setGrade(grade);
  showXp(grade);
  main.replaceChildren(el('p', { class: 'loading' }, [t('loading')]));
  const data = await loadGrade(grade);
  // The ICT Adventure sets are bonus rounds on the grade 9 path, one set per
  // lesson (gate O1). Only grade 9 pays the extra fetch.
  const adventure = grade === 9 ? await loadAdventure() : null;

  const list = el('ol', { class: 'path' });
  data.lessons.forEach((lesson) => {
    const bonus = adventure ? bonusFor(adventure, lesson.id) : [];
    const items = [...lesson.activities, ...bonus].map((activity) => {
      const points = scoreFor(grade, activity.id);
      // The Scratch Code Builder is not a grade activity - it lives on the home
      // page, for every grade - so grade 9's 3.4 is a door into it.
      const builder = activity.type === 'scratch-hub';
      const playable = builder || TYPES.includes(activity.type);
      const node = el(playable ? 'a' : 'span', {
        class: `act${playable ? '' : ' is-soon'}${activity.bonus ? ' is-bonus' : ''}`,
        href: playable ? (builder ? '#/scratch' : `#/g${grade}/${activity.id}`) : null,
      }, [
        el('span', { class: 'act-name' }, [text(activity.name)]),
        activity.bonus ? el('span', { class: 'act-bonus' }, [t('bonus')]) : null,
        points === null ? null : el('span', { class: 'act-stars' }, [stars(starsFor(points), 3)]),
        points === null ? null : el('span', { class: 'sr-only' }, [`${points} ${t('points')}`]),
      ]);
      return el('li', {}, [node]);
    });

    list.append(el('li', { class: 'path-lesson' }, [
      el('h2', { class: 'lesson-title' }, [
        el('span', { class: 'lesson-icon', 'aria-hidden': 'true' }, [text(lesson.icon)]),
        text(lesson.title),
      ]),
      el('ol', { class: 'act-list' }, items),
    ]));
  });

  setChildren(main, [
    el('h1', { class: 'screen-title' }, [`${t('grade')} ${grade}`]),
    el('p', {}, [el('a', { class: 'btn btn-ghost', href: `#/g${grade}/board` }, [t('leaderboard')])]),
    list,
  ]);
}

async function activityScreen(grade, activityId) {
  setGrade(grade);
  showXp(grade);
  resetStreak();
  const data = await loadGrade(grade);

  let found = null;
  if (activityId.startsWith(PREFIX)) {
    // A bonus game lives in the adventure file, in its own shape. adventure.js
    // hands back the activity shape everything below already understands.
    const bonus = findActivity(await loadAdventure(), activityId);
    if (bonus) found = { activity: bonus };
  } else {
    for (const lesson of data.lessons) {
      const hit = lesson.activities.find((a) => a.id === activityId);
      if (hit) { found = { lesson, activity: hit }; break; }
    }
  }
  // A bookmark of grade 9's 3.4 from before the builder moved out.
  if (found?.activity.type === 'scratch-hub') { location.hash = '#/scratch'; return; }
  if (!found || !TYPES.includes(found.activity.type)) return notFound();

  // A hotspot's clickable options are shared by every round, so the originals
  // kept them outside the activity. Newer ones carry their own. Either way the
  // renderer only ever reads activity.options.
  const shared = data.optionSets?.[found.activity.id];
  const activity = shared && !found.activity.options
    ? { ...found.activity, options: shared }
    : found.activity;
  const mod = await loadType(activity.type);

  const result = el('div', { class: 'result', hidden: true, role: 'status', 'aria-live': 'polite' });
  const actions = el('div', { class: 'actions' });

  const game = mod.render(activity, (points) => {
    const saved = saveScore(grade, activity.id, points);
    pushScore(grade, activity.id, saved);
    showXp(grade);
    result.hidden = false;
    const won = starsFor(saved);
    result.replaceChildren(
      el('p', { class: 'result-score' }, [`${saved} ${t('points')}`]),
      stars(won, 3, true),
    );
    finished(won);
    actions.replaceChildren(
      el('a', { class: 'btn', href: `#/g${grade}` }, [t('backToPath')]),
      el('button', { class: 'btn btn-ghost', type: 'button' }, [t('tryAgain')]),
    );
    actions.querySelector('button').addEventListener('click', () => {
      activityScreen(grade, activityId);
    });
  });

  if (!game.selfScoring) {
    const check = el('button', { class: 'btn', type: 'button' }, [t('check')]);
    check.addEventListener('click', () => { check.disabled = true; game.check(); });
    actions.append(check);
  }

  setChildren(main, [
    el('nav', { class: 'crumb' }, [el('a', { href: `#/g${grade}` }, [`← ${t('backToPath')}`])]),
    el('h1', { class: 'screen-title' }, [text(activity.name)]),
    isFallback(activity.name) ? el('p', { class: 'note-fallback' }, [t('englishOnly')]) : null,
    el('p', { class: 'instruction' }, [text(activity.instruction)]),
    game.node,
    result,
    actions,
  ]);
  // preventScroll, or focusing main slides the heading under the sticky top bar.
  main.focus({ preventScroll: true });
}

function notFound() {
  showXp(null);
  main.replaceChildren(
    el('p', { class: 'loading' }, [t('notFound')]),
    el('p', {}, [el('a', { class: 'btn', href: '#/' }, [t('pickGrade')])]),
  );
}

// ---- routing -------------------------------------------------------------

async function route() {
  const hash = location.hash.replace(/^#\/?/, '');
  const parts = hash.split('/').filter(Boolean);
  window.scrollTo(0, 0);

  try {
    if (parts[0] === 'name') {
      showXp(null);
      return nameEntry(main, () => { flushQueue(); history.back(); });
    }
    // Before the hasPlayer() redirect below: the builder scores nothing, so it
    // never needs a nickname. It also leaves data-grade alone, so a child stays
    // in their own colour world.
    if (parts[0] === 'scratch') {
      showXp(null);
      if (parts.length === 1) return await scratchHub(main);
      if (parts.length === 2) return await scratchStructure(main, parts[1]);
      return await scratchPuzzle(main, parts[1], parts[2]);
    }
    if (!parts.length) return gradePicker();
    const grade = Number((parts[0].match(/^g([6-9])$/) || [])[1]);
    if (!grade) return notFound();
    if (parts.length === 1) return await lessonPath(grade);
    if (parts[1] === 'board') {
      setGrade(grade);
      showXp(grade);
      if (!hasPlayer()) { location.hash = '#/name'; return; }
      return await leaderboard(main, grade);
    }
    // An old bookmark of 3.4 is a door into the builder, which scores nothing,
    // so resolve it before the name gate rather than after it.
    const lessons = (await loadGrade(grade)).lessons;
    if (lessons.some((l) => l.activities.some((a) => a.id === parts[1] && a.type === 'scratch-hub'))) {
      location.hash = '#/scratch';
      return;
    }
    // A score with no player behind it cannot reach the leaderboard, so ask
    // for the name before the first activity rather than losing that score.
    if (!hasPlayer()) { setGrade(grade); location.hash = '#/name'; return; }
    return await activityScreen(grade, parts[1]);
  } catch (err) {
    console.error(err);
    notFound();
  }
}

const soundBtn = document.getElementById('soundBtn');

function paintSound() {
  soundBtn.setAttribute('aria-pressed', String(soundOn()));
  soundBtn.setAttribute('aria-label', t(soundOn() ? 'soundOn' : 'soundOff'));
}

soundBtn.addEventListener('click', () => { setSound(!soundOn()); paintSound(); });

document.querySelectorAll('.langswitch button').forEach((b) => {
  b.addEventListener('click', () => { setLang(b.dataset.lang); paintSound(); route(); });
});
document.getElementById('homeBtn').addEventListener('click', () => { location.hash = '#/'; });

window.addEventListener('hashchange', route);
loadLang();
flushQueue();
applyStatic();
paintSound();
route();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {
      // No offline support on this browser; the game still works online.
    });
  });
}
