import { text } from '../i18n.js';
import { shuffled, el } from '../dom.js';

// Tap one side then the other to join a pair. Two columns of real buttons, so
// it works with a keyboard and reads correctly to a screen reader.
export function render(activity, onDone) {
  const pairs = activity.pairs;
  const left = shuffled(pairs.map((p, i) => ({ p, i })));
  const right = shuffled(pairs.map((p, i) => ({ p, i })));
  const joined = new Map();
  let picked = null;

  const leftCol = el('div', { class: 'match-col' });
  const rightCol = el('div', { class: 'match-col' });

  function card(side, entry, label, icon) {
    const b = el('button', { type: 'button', class: 'match-card' }, [
      el('span', { class: 'match-icon', 'aria-hidden': 'true' }, [icon || '']),
      el('span', {}, [label]),
    ]);
    b.addEventListener('click', () => {
      if (b.disabled) return;
      if (side === 'l') {
        leftCol.querySelectorAll('.match-card').forEach((c) => c.classList.remove('is-picked'));
        picked = entry;
        b.classList.add('is-picked');
        return;
      }
      if (!picked) return;
      joined.set(picked.i, entry.i);
      const lb = leftCol.querySelector('.is-picked');
      lb.classList.remove('is-picked');
      lb.classList.add('is-joined');
      b.classList.add('is-joined');
      lb.disabled = true;
      b.disabled = true;
      picked = null;
    });
    return b;
  }

  left.forEach((entry) => leftCol.append(card('l', entry, text(entry.p.l), entry.p.li)));
  right.forEach((entry) => rightCol.append(card('r', entry, text(entry.p.r), entry.p.ri)));

  return {
    node: el('div', { class: 'match-grid' }, [leftCol, rightCol]),
    check() {
      let right_ = 0;
      left.forEach((entry, idx) => {
        const card_ = leftCol.querySelectorAll('.match-card')[idx];
        const ok = joined.get(entry.i) === entry.i;
        if (ok) right_++;
        card_.classList.add(ok ? 'is-correct' : 'is-wrong');
      });
      leftCol.querySelectorAll('button').forEach((b) => { b.disabled = true; });
      rightCol.querySelectorAll('button').forEach((b) => { b.disabled = true; });
      onDone(Math.round((right_ / pairs.length) * 100));
    },
  };
}
