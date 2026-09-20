import { loadLang, setLang, t, text, isFallback, applyStatic } from './i18n.js';
import { el, setChildren, icon, bot } from './dom.js';
import { scoreFor, saveScore, totalFor, starsFor, lastGrade, setLastGrade } from './store.js';
import { hasPlayer, getPlayer } from './player.js';
import { pushScore, flushQueue } from './leaderboard.js';
import { nameEntry, leaderboard } from './screens.js';
import { soundOn, setSound } from './audio.js';
import { stars, resetStreak, finished } from './reward.js';
import { bonusGames, PREFIX } from './adventure.js';
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
  setLastGrade(grade);
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
  const mine = lastGrade();
  const player = getPlayer();
  const greeting = player?.nickname ? `${t('hi')} ${player.nickname}! ${t('whichGrade')}` : t('welcome');

  // Every grade file is precached by the service worker, so the counts cost no
  // extra round trip - but on a first visit they would still hold up the first
  // paint, so the cards go up straight away and the counts drop in after.
  const subs = new Map();

  main.replaceChildren(
    el('h1', { class: 'screen-title' }, [t('pickGrade')]),
    el('div', { class: 'callout' }, [
      bot('idle'),
      el('p', { class: 'bubble' }, [greeting]),
    ]),
    el('div', { class: 'grade-list' }, GRADES.map((grade) => {
      const sub = el('span', { class: 'gcard-sub' });
      subs.set(grade, sub);
      return el('a', {
        class: `gcard${grade === mine ? ' is-mine' : ''}`,
        href: `#/g${grade}`, 'data-grade': String(grade),
      }, [
        el('span', { class: 'gcard-num' }, [String(grade)]),
        el('span', { class: 'gcard-body' }, [
          el('span', { class: 'gcard-title' }, [`${t('grade')} ${grade}`]),
          sub,
        ]),
        grade === mine
          ? el('span', { class: 'pill-on' }, [icon('i-check'), t('yourClass')])
          : el('span', { class: 'gcard-chev' }, [icon('i-chev')]),
      ]);
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

  GRADES.forEach(async (grade) => {
    try {
      const data = await loadGrade(grade);
      const acts = data.lessons.reduce((sum, l) => sum + l.activities.length, 0);
      subs.get(grade).textContent =
        `${data.lessons.length} ${t('lessons')} · ${acts} ${t('activities')}`;
    } catch {
      // Offline before the grade file was ever cached: the card still works,
      // it just shows no counts.
    }
  });
}

async function lessonPath(grade) {
  setGrade(grade);
  showXp(grade);
  main.replaceChildren(el('p', { class: 'loading' }, [t('loading')]));
  const data = await loadGrade(grade);
  // Bonus rounds sit at the end of the lesson they belong to, in every grade:
  // grade 9's come from the ICT Adventure set, grades 6 to 8 from the authored
  // ones. adventure.js hands both over in the same shape.
  const bonus = await bonusGames(grade);

  const list = el('ol', { class: 'path' });
  pathRows(data, bonus).forEach(({ lesson, activities }) => {
    const items = activities.map((activity) => {
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
    el('div', { class: 'grade-links' }, [
      el('a', { class: 'btn btn-ghost', href: `#/g${grade}/board` }, [t('leaderboard')]),
      // The bonus games are also rows inside their lesson, but a child who
      // wants a game rather than a lesson should not have to hunt for them.
      bonus.length ? el('a', { class: 'btn btn-ghost', href: `#/g${grade}/bonus` }, [
        t('bonusGames'),
        el('span', { class: 'link-count' }, [String(bonus.length)]),
      ]) : null,
    ].filter(Boolean)),
    list,
  ]);
}

// Every bonus game a grade has, on one screen. The same rows the lesson path
// carries, gathered so a child can pick a game directly.
async function bonusScreen(grade) {
  setGrade(grade);
  showXp(grade);
  main.replaceChildren(el('p', { class: 'loading' }, [t('loading')]));
  const games = await bonusGames(grade);
  if (!games.length) return notFound();

  const rows = games.map((game) => el('li', {}, [
    el('a', { class: 'act is-bonus', href: `#/g${grade}/${game.id}` }, [
      el('span', { class: 'act-icon', 'aria-hidden': 'true' }, [text(game.icon)]),
      el('span', { class: 'act-name' }, [text(game.name)]),
      scoreFor(grade, game.id) === null
        ? null
        : el('span', { class: 'act-stars' }, [stars(starsFor(scoreFor(grade, game.id)), 3)]),
    ].filter(Boolean)),
  ]));

  setChildren(main, [
    el('nav', { class: 'crumb' }, [el('a', { href: `#/g${grade}` }, [`← ${t('backToPath')}`])]),
    el('h1', { class: 'screen-title' }, [t('bonusGames')]),
    el('p', { class: 'instruction' }, [t('bonusLead')]),
    el('ol', { class: 'act-list' }, rows),
  ]);
}

// A grade's activities in the order the lesson path lists them, the bonus
// rounds folded in. The path and the Next activity button both read this, so
// Next always lands on the row a child sees underneath the one they finished.
function pathRows(data, bonus) {
  return data.lessons.map((lesson) => ({
    lesson,
    activities: [...lesson.activities, ...bonus.filter((game) => game.lesson === lesson.id)],
  }));
}

// The bar across the top of an activity: a way out, and how far through the
// child is. Only the round-based types can say how far, and they announce it by
// bubbling igw:progress up from their own node, so the fifteen renderers keep
// the one render(activity, onDone) signature they all share.
function chrome(grade, game) {
  const close = el('a', {
    class: 'closebtn', href: `#/g${grade}`, 'aria-label': t('closeActivity'),
  }, [icon('i-x')]);
  if (!game.total) return el('div', { class: 'actbar' }, [close]);

  const cells = Array.from({ length: game.total }, () => el('i'));
  const bar = el('div', {
    class: 'bar-set', role: 'progressbar',
    'aria-valuemin': '0', 'aria-valuemax': String(game.total), 'aria-valuenow': '0',
    'aria-label': `0 / ${game.total}`,
  }, cells);

  game.node.addEventListener('igw:progress', ({ detail }) => {
    cells.forEach((cell, i) => cell.classList.toggle('is-done', i < detail.index));
    bar.setAttribute('aria-valuenow', String(detail.index));
    bar.setAttribute('aria-label', `${detail.index} / ${game.total}`);
  });

  return el('div', { class: 'actbar' }, [close, bar]);
}

function nextPlayable(rows, activityId) {
  const flat = rows.flatMap((r) => r.activities).filter((a) => TYPES.includes(a.type));
  const at = flat.findIndex((a) => a.id === activityId);
  return at >= 0 ? flat[at + 1] || null : null;
}

async function activityScreen(grade, activityId) {
  setGrade(grade);
  showXp(grade);
  resetStreak();
  const data = await loadGrade(grade);
  // The bonus games load whatever the activity is, because the Next button has
  // to know where the bonus rounds sit in the order.
  const bonus = await bonusGames(grade);

  let found = null;
  if (activityId.startsWith(PREFIX)) {
    // A bonus game lives in its own file, in its own shape. adventure.js hands
    // back the activity shape everything below already understands.
    const hit = bonus.find((game) => game.id === activityId);
    if (hit) found = { activity: hit };
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
  const next = nextPlayable(pathRows(data, bonus), activity.id);

  const game = mod.render(activity, (points) => {
    const saved = saveScore(grade, activity.id, points);
    pushScore(grade, activity.id, saved);
    showXp(grade);
    result.hidden = false;
    const won = starsFor(saved);
    result.replaceChildren(
      bot('happy'),
      el('h2', { class: 'result-title' }, [t('activityDone')]),
      stars(won, 3, true),
      el('p', { class: 'result-score' }, [`${saved} ${t('points')}`]),
    );
    finished(won);
    // The ✕ in the chrome is how a child leaves, so the end of an activity is
    // free to point forwards. Without this they walked back to the lesson list
    // after every single one.
    actions.replaceChildren(
      next
        ? el('a', { class: 'btn', href: `#/g${grade}/${next.id}` }, [t('next')])
        : el('a', { class: 'btn', href: `#/g${grade}` }, [t('backToPath')]),
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
    chrome(grade, game),
    el('h1', { class: 'screen-title' }, [text(activity.name)]),
    isFallback(activity.name) ? el('p', { class: 'note-fallback' }, [t('englishOnly')]) : null,
    el('div', { class: 'callout' }, [
      bot('think'),
      el('p', { class: 'bubble' }, [text(activity.instruction)]),
    ]),
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
    // Browsing the bonus list scores nothing, so it stays open like the lesson
    // path does; the name gate below still catches the game itself.
    if (parts[1] === 'bonus') return await bonusScreen(grade);
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
