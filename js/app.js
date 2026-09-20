import { loadLang, setLang, t, text, isFallback, applyStatic } from './i18n.js';
import { el, setChildren } from './dom.js';
import { scoreFor, saveScore, totalFor, starsFor } from './store.js';
import { hasPlayer } from './player.js';
import { pushScore, flushQueue } from './leaderboard.js';
import { nameEntry, leaderboard } from './screens.js';

const GRADES = [6, 7, 8, 9];
const TYPES = ['order', 'match', 'pick', 'bucket', 'symmatch'];

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
  );
}

async function lessonPath(grade) {
  setGrade(grade);
  showXp(grade);
  main.replaceChildren(el('p', { class: 'loading' }, [t('loading')]));
  const data = await loadGrade(grade);

  const list = el('ol', { class: 'path' });
  data.lessons.forEach((lesson) => {
    const items = lesson.activities.map((activity) => {
      const points = scoreFor(grade, activity.id);
      const playable = TYPES.includes(activity.type);
      const node = el(playable ? 'a' : 'span', {
        class: `act${playable ? '' : ' is-soon'}`,
        href: playable ? `#/g${grade}/${activity.id}` : null,
      }, [
        el('span', { class: 'act-name' }, [text(activity.name)]),
        el('span', { class: 'act-stars', 'aria-hidden': 'true' }, ['★'.repeat(starsFor(points)) || '']),
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
  const data = await loadGrade(grade);

  let found = null;
  for (const lesson of data.lessons) {
    const hit = lesson.activities.find((a) => a.id === activityId);
    if (hit) { found = { lesson, activity: hit }; break; }
  }
  if (!found || !TYPES.includes(found.activity.type)) return notFound();

  const { activity } = found;
  const mod = await loadType(activity.type);

  const result = el('div', { class: 'result', hidden: true, role: 'status', 'aria-live': 'polite' });
  const actions = el('div', { class: 'actions' });

  const game = mod.render(activity, (points) => {
    const saved = saveScore(grade, activity.id, points);
    pushScore(grade, activity.id, saved);
    showXp(grade);
    result.hidden = false;
    result.replaceChildren(
      el('p', { class: 'result-score' }, [`${saved} ${t('points')}`]),
      el('p', { class: 'result-stars', 'aria-hidden': 'true' }, ['★'.repeat(starsFor(saved)).padEnd(3, '☆')]),
    );
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
    // A score with no player behind it cannot reach the leaderboard, so ask
    // for the name before the first activity rather than losing that score.
    if (!hasPlayer()) { setGrade(grade); location.hash = '#/name'; return; }
    return await activityScreen(grade, parts[1]);
  } catch (err) {
    console.error(err);
    notFound();
  }
}

document.querySelectorAll('.langswitch button').forEach((b) => {
  b.addEventListener('click', () => { setLang(b.dataset.lang); route(); });
});
document.getElementById('homeBtn').addEventListener('click', () => { location.hash = '#/'; });

window.addEventListener('hashchange', route);
loadLang();
flushQueue();
applyStatic();
route();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {
      // No offline support on this browser; the game still works online.
    });
  });
}
