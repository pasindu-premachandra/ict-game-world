// What a child sees and hears when they get something right: the streak, the
// drawn stars, the points floating off the answer, the confetti on a perfect
// score. It calls audio.js and motion.js and animates nothing itself.
//
// The streak is feedback only. The originals scaled XP by it, but a score here
// has to stay inside 0 to 100 - saveScore clamps it and submit_score() in the
// database rejects anything above 100 - so a streak that paid points would
// either be thrown away or break the leaderboard. It changes the noise and the
// pill, never the number.

import { el } from './dom.js';
import { sfx } from './audio.js';
import { pop, shake, flash, sparks, floatXp, confetti } from './motion.js';
import { t } from './i18n.js';

const HOT = 3;

let streak = 0;
let best = 0;

function pill() {
  return document.getElementById('combo');
}

function paint() {
  const node = pill();
  if (!node) return;
  node.hidden = streak < 2;
  node.classList.toggle('is-hot', streak >= HOT);
  document.getElementById('comboValue').textContent = `x${streak}`;
}

export function resetStreak() {
  streak = 0;
  best = 0;
  paint();
}

export function bestStreak() {
  return best;
}

// One answered round. `points` is what the round is worth out of 100, so the
// number that floats up is the one that actually lands on the score.
export function answered(ok, node, points) {
  if (ok) {
    streak++;
    best = Math.max(best, streak);
    sfx.correct();
    pop(node);
    sparks(node);
    if (points) floatXp(`+${points}`, node);
    if (streak === HOT) {
      sfx.combo();
      toast(`${t('combo')} x${streak}`);
    }
  } else {
    streak = 0;
    sfx.wrong();
    shake(node);
    flash(node);
  }
  paint();
}

// The end of an activity. Three stars is the only perfect result, so it is the
// only one that gets confetti.
export function finished(starCount) {
  sfx.win();
  if (starCount >= 3) confetti();
}

export function stars(filled, total = 3, landing = false) {
  const node = el('span', { class: `stars${landing ? ' is-landing' : ''}`, 'aria-hidden': 'true' });
  for (let i = 0; i < total; i++) {
    const star = el('span', { class: `star${i < filled ? '' : ' is-empty'}`, style: `--i:${i}` });
    star.innerHTML = '<svg viewBox="0 0 24 24"><use href="#i-star"/></svg>';
    node.append(star);
  }
  return node;
}

let toastTimer = null;

export function toast(message) {
  let node = document.getElementById('toast');
  if (!node) {
    node = el('div', { class: 'toast toast--combo', id: 'toast', role: 'status' });
    document.body.append(node);
  }
  node.replaceChildren(
    el('span', { class: 'toast__ic' }, [flame()]),
    el('span', {}, [message]),
  );
  node.classList.add('is-up');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove('is-up'), 1800);
}

function flame() {
  const svg = el('span', { class: 'ic-wrap' });
  svg.innerHTML = '<svg viewBox="0 0 24 24"><use href="#i-flame"/></svg>';
  return svg;
}
