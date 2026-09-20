import { text, t } from '../i18n.js';
import { el, shuffled } from '../dom.js';
import { rounds } from './rounds.js';

// Build a search query out of tiles. The lesson is that a search engine wants
// keywords, not a sentence, so the pool carries the filler words ("how", "the",
// "and") as the wrong answer. Order does not matter, the set of tiles does.
const sameSet = (a, b) => a.length === b.length && a.every((v) => b.includes(v)) && b.every((v) => a.includes(v));

export function render(activity, onDone) {
  const roundList = activity.rounds;

  return rounds(roundList.length, (index, settle) => {
    const r = roundList[index];
    const chosen = [];

    const slot = el('div', { class: 'query-slot' });
    const pool = el('div', { class: 'query-pool' });
    const check = el('button', { class: 'btn', type: 'button' }, [t('check')]);
    const clear = el('button', { class: 'btn btn-ghost', type: 'button' }, [t('clear')]);

    function redraw() {
      pool.querySelectorAll('.query-tile').forEach((tile) => {
        tile.disabled = chosen.includes(tile.dataset.word);
      });
      if (!chosen.length) {
        slot.replaceChildren(el('span', { class: 'query-empty' }, [t('addTiles')]));
        return;
      }
      slot.replaceChildren(...chosen.map((word) => {
        const b = el('button', { type: 'button', class: 'query-tile is-placed' }, [word]);
        b.addEventListener('click', () => {
          chosen.splice(chosen.indexOf(word), 1);
          redraw();
        });
        return b;
      }));
    }

    shuffled(r.pool).forEach((word) => {
      const tile = el('button', { type: 'button', class: 'query-tile', 'data-word': word }, [word]);
      tile.addEventListener('click', () => { chosen.push(word); redraw(); });
      pool.append(tile);
    });

    check.addEventListener('click', () => {
      const ok = sameSet(chosen, r.correct);
      pool.querySelectorAll('.query-tile').forEach((b) => { b.disabled = true; });
      slot.querySelectorAll('.query-tile').forEach((b) => { b.disabled = true; });
      slot.classList.add(ok ? 'is-correct' : 'is-wrong');
      check.disabled = true;
      clear.disabled = true;
      settle(ok, ok ? t('correct') : `${t('notQuite')} - ${r.correct.join(' ')}`);
    });
    clear.addEventListener('click', () => { chosen.length = 0; redraw(); });

    redraw();

    return el('div', { class: 'query-build' }, [
      el('p', { class: 'round-ask' }, [text(r.q)]),
      slot,
      pool,
      el('div', { class: 'query-actions' }, [check, clear]),
    ]);
  }, onDone);
}
