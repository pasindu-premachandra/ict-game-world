import { text, t } from '../i18n.js';
import { el, shuffled } from '../dom.js';
import { answered } from '../reward.js';

// Pairs memory, from the ICT Adventure sets. Ten cards, face down; turn two
// over, keep them if they belong together, turn them back if they do not.
//
// Gate O2 chose the flip-card grid with a plain back, two columns on a phone
// and five on a lab PC. The card faces are text - "Temperature" pairs with
// "Heat detection" - not icons, which is why the cards are wide rather than
// square and why the grid never goes narrower than two columns.
//
// Real buttons, so it works with a keyboard and reads to a screen reader: a
// face-down card announces itself as a hidden card, and turning one over
// changes its label to what it says.

const FLIP_BACK_MS = 1100;
const KEEP_MS = 420;

// Scoring. A child with no prior knowledge has to spend some turns looking, so
// a perfect run is not "one turn per pair" - par is three turns of looking on
// top. Inside par is full marks; past it each wasted turn costs 8. Flipping
// cards at random runs to twenty-odd turns and lands near zero, which is the
// point: the score has to mean something or the stars do not.
function scoreFor(moves, pairs) {
  const par = pairs + 3;
  if (moves <= par) return 100;
  return Math.max(0, 100 - (moves - par) * 8);
}

export function render(activity, onDone) {
  const pairs = activity.pairs;
  const deck = shuffled(pairs.flatMap((p, i) => [
    { label: p.a, pair: i },
    { label: p.b, pair: i },
  ]));

  let open = [];
  let matched = 0;
  let moves = 0;
  let locked = false;

  const counter = el('p', { class: 'mem-moves', role: 'status', 'aria-live': 'polite' });
  const grid = el('div', { class: 'mem-grid' });

  const draw = () => { counter.textContent = `${t('moves')}: ${moves}`; };

  function faceDown(card) {
    card.classList.remove('is-open');
    card.replaceChildren(el('span', { class: 'mem-back', 'aria-hidden': 'true' }, ['?']));
    card.setAttribute('aria-label', t('hiddenCard'));
    card.disabled = false;
  }

  function faceUp(card, label) {
    card.classList.add('is-open');
    card.replaceChildren(el('span', { class: 'mem-face' }, [text(label)]));
    card.setAttribute('aria-label', text(label));
  }

  deck.forEach((entry) => {
    const card = el('button', { type: 'button', class: 'mem-card' });
    card.dataset.pair = String(entry.pair);
    faceDown(card);

    card.addEventListener('click', () => {
      if (locked || card.classList.contains('is-open') || card.disabled) return;
      faceUp(card, entry.label);
      open.push(card);
      if (open.length < 2) return;

      moves++;
      draw();
      locked = true;
      const [a, b] = open;
      const ok = a.dataset.pair === b.dataset.pair;

      if (ok) {
        matched++;
        setTimeout(() => {
          [a, b].forEach((c) => { c.classList.add('is-correct'); c.disabled = true; });
          answered(true, a, Math.round(100 / pairs.length));
          open = [];
          locked = false;
          if (matched === pairs.length) {
            grid.querySelectorAll('.mem-card').forEach((c) => { c.disabled = true; });
            onDone(scoreFor(moves, pairs.length));
          }
        }, KEEP_MS);
        return;
      }

      [a, b].forEach((c) => c.classList.add('is-wrong'));
      answered(false, a, 0);
      setTimeout(() => {
        [a, b].forEach((c) => { c.classList.remove('is-wrong'); faceDown(c); });
        open = [];
        locked = false;
      }, FLIP_BACK_MS);
    });

    grid.append(card);
  });

  draw();

  // Scores itself when the last pair lands, so the activity screen hides Check.
  return { node: el('div', { class: 'mem-game' }, [counter, grid]), selfScoring: true };
}
