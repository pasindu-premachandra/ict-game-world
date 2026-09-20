import { text } from '../i18n.js';
import { shuffled, el } from '../dom.js';

// Choose every correct item and leave the rest. Scored on all items, so
// ticking everything does not pass.
export function render(activity, onDone) {
  const items = shuffled(activity.items);
  const chosen = new Set();
  const grid = el('div', { class: 'pick-grid' });

  items.forEach((item, i) => {
    const input = el('input', { type: 'checkbox', id: `pick-${i}` });
    input.addEventListener('change', () => {
      if (input.checked) chosen.add(item); else chosen.delete(item);
      label.classList.toggle('is-picked', input.checked);
    });
    const label = el('label', { class: 'pick-card', for: `pick-${i}` }, [
      input,
      el('span', { class: 'pick-icon', 'aria-hidden': 'true' }, [item.icon || '']),
      el('span', { class: 'pick-text' }, [text(item.text)]),
    ]);
    grid.append(label);
  });

  return {
    node: grid,
    check() {
      let right = 0;
      grid.querySelectorAll('.pick-card').forEach((card, i) => {
        const item = items[i];
        const picked = chosen.has(item);
        if (picked === Boolean(item.correct)) right++;
        card.classList.add(picked === Boolean(item.correct) ? 'is-correct' : 'is-wrong');
        if (item.correct) card.classList.add('is-answer');
        card.querySelector('input').disabled = true;
      });
      onDone(Math.round((right / items.length) * 100));
    },
  };
}
