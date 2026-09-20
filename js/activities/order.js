import { text, t } from '../i18n.js';
import { shuffled, el } from '../dom.js';

// Put the steps in the right order. Dragging is not wired as the only route in:
// every item has up and down buttons, which is also what makes it work with a
// keyboard and a screen reader.
export function render(activity, onDone) {
  const answer = activity.correctOrder;
  let items = shuffled(answer.map((step, i) => ({ step, i })));
  if (items.every((it, i) => it.i === i) && items.length > 1) items = [items[1], items[0], ...items.slice(2)];

  const list = el('ol', { class: 'order-list' });

  function draw() {
    list.replaceChildren();
    items.forEach((it, index) => {
      const row = el('li', { class: 'order-item' }, [
        el('span', { class: 'order-num', 'aria-hidden': 'true' }, [String(index + 1)]),
        el('span', { class: 'order-icon', 'aria-hidden': 'true' }, [it.step.icon || '']),
        el('span', { class: 'order-text' }, [text(it.step.text)]),
        el('span', { class: 'order-moves' }, [
          button('▲', t('moveUp'), index === 0, () => move(index, -1)),
          button('▼', t('moveDown'), index === items.length - 1, () => move(index, 1)),
        ]),
      ]);
      list.append(row);
    });
  }

  function button(glyph, label, disabled, onClick) {
    const b = el('button', { type: 'button', class: 'movebtn', 'aria-label': label }, [glyph]);
    b.disabled = disabled;
    b.addEventListener('click', onClick);
    return b;
  }

  function move(index, delta) {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    [items[index], items[target]] = [items[target], items[index]];
    draw();
    list.querySelectorAll('.order-item')[target].querySelector('.movebtn:not([disabled])')?.focus();
  }

  draw();

  return {
    node: list,
    check() {
      const right = items.filter((it, i) => it.i === i).length;
      const points = Math.round((right / items.length) * 100);
      list.querySelectorAll('.order-item').forEach((row, i) => {
        row.classList.add(items[i].i === i ? 'is-correct' : 'is-wrong');
      });
      list.querySelectorAll('.movebtn').forEach((b) => { b.disabled = true; });
      onDone(points);
    },
  };
}
