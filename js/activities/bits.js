import { t } from '../i18n.js';
import { el } from '../dom.js';
import { rounds } from './rounds.js';

// Toggle the bits until they add up to the target. `bitCount` defaults to a
// byte; grade 8 lesson 5 uses four bits and calls them LEDs, so the label above
// each switch follows `labelStyle`.
export function render(activity, onDone) {
  const targets = activity.targets;
  const bitCount = activity.bitCount ?? 8;
  const led = activity.labelStyle === 'led';
  const places = Array.from({ length: bitCount }, (_, i) => 2 ** (bitCount - 1 - i));

  return rounds(targets.length, (index, settle) => {
    const target = targets[index];
    const on = new Set();

    const sum = () => [...on].reduce((n, i) => n + places[i], 0);

    const total = el('p', { class: 'bits-sum', role: 'status', 'aria-live': 'polite' });
    const row = el('div', { class: 'bits-row' });
    const check = el('button', { class: 'btn', type: 'button' }, [t('check')]);

    function redraw() {
      total.textContent = `${t('currentSum')}: ${sum()}`;
    }

    places.forEach((place, i) => {
      const bit = el('button', {
        type: 'button',
        class: 'bit-btn',
        'aria-pressed': 'false',
        'aria-label': `${led ? t('led') : t('placeValue')} ${place}`,
      }, ['0']);
      bit.addEventListener('click', () => {
        const nowOn = !on.has(i);
        if (nowOn) on.add(i); else on.delete(i);
        bit.classList.toggle('is-on', nowOn);
        bit.setAttribute('aria-pressed', String(nowOn));
        bit.textContent = nowOn ? '1' : '0';
        redraw();
      });
      row.append(el('div', { class: 'bit-cell' }, [
        el('span', { class: 'bit-place', 'aria-hidden': 'true' }, [led ? `${place}` : String(place)]),
        bit,
      ]));
    });

    check.addEventListener('click', () => {
      const got = sum();
      row.querySelectorAll('.bit-btn').forEach((b) => { b.disabled = true; });
      check.disabled = true;
      const ok = got === target;
      settle(ok, ok ? t('correct') : `${t('notQuite')} - ${got} ≠ ${target}`);
    });

    redraw();

    return el('div', { class: 'bits-wrap' }, [
      el('p', { class: 'bits-target' }, [`${t('target')}: ${target}`]),
      row,
      total,
      check,
    ]);
  }, onDone);
}
