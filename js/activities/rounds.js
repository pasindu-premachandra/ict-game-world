import { t } from '../i18n.js';
import { el } from '../dom.js';
import { answered } from '../reward.js';

// Seven of the activity types are the same game underneath: show one round,
// take one answer, say whether it was right, move on, and score out of the
// number of rounds. Only the middle of a round differs, so that is the one
// thing a renderer passes in.
//
// One answer per round, like symmatch. The originals let a child retry until
// they were right, which cannot be scored out of 100 - everyone would finish
// on 100. The best score is kept by the server, so practising a second time
// still costs nothing.

const RIGHT_MS = 800;
const WRONG_MS = 1600;

export function rounds(total, drawRound, onDone) {
  const body = el('div', { class: 'round-body' });
  const feedback = el('p', { class: 'round-feedback', role: 'status', 'aria-live': 'polite' });
  const node = el('div', { class: 'round-game' }, [body, feedback]);

  let index = 0;
  let score = 0;
  let done = false;

  // Settling twice would double-count a round, which is easy to do when a
  // renderer wires both a click and an Enter key to the same answer.
  function settle(ok, message) {
    if (done) return;
    done = true;
    if (ok) score++;
    feedback.className = `round-feedback ${ok ? 'is-good' : 'is-bad'}`;
    feedback.textContent = message || t(ok ? 'correct' : 'notQuite');
    // Every renderer marks what was answered with is-correct or is-wrong,
    // directly or through lockOptions, so the reward layer can find it without
    // all seven of them passing it in.
    const hit = body.querySelector('.is-correct, .is-wrong') || body;
    answered(ok, hit, Math.round(100 / total));
    setTimeout(() => { index++; draw(); }, ok ? RIGHT_MS : WRONG_MS);
  }

  function draw() {
    // How far through the child is. The activity screen draws this as the
    // segmented bar in its chrome; nothing here knows or cares how it looks.
    node.dispatchEvent(new CustomEvent('igw:progress', { bubbles: true, detail: { index } }));
    if (index >= total) {
      feedback.className = 'round-feedback';
      feedback.textContent = '';
      body.replaceChildren(el('p', { class: 'round-done' }, [t('done')]));
      onDone(Math.round((score / total) * 100));
      return;
    }
    done = false;
    feedback.className = 'round-feedback';
    feedback.textContent = '';
    body.replaceChildren(drawRound(index, settle));
  }

  draw();

  // Scores itself as it goes, so the activity screen hides its Check button.
  return { node, selfScoring: true, total };
}

// Shared by every round that answers with a row of buttons: lock the row, mark
// the one that was pressed, and show which one was right.
export function lockOptions(container, selector, pressed, correct) {
  container.querySelectorAll(selector).forEach((b) => { b.disabled = true; });
  pressed?.classList.add(pressed === correct ? 'is-correct' : 'is-wrong');
  if (correct && correct !== pressed) correct.classList.add('is-answer');
}
