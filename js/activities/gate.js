import { t } from '../i18n.js';
import { el } from '../dom.js';
import { rounds, lockOptions } from './rounds.js';

// Logic gate lab. The original printed the gate's name in a box; a grade 8
// student is taught the standard symbol as well, so it is drawn. Same data,
// same answers.
const SHAPES = {
  AND:  '<path d="M12 8 H40 A22 22 0 0 1 40 52 H12 Z"/>',
  OR:   '<path d="M10 8 Q34 8 62 30 Q34 52 10 52 Q24 30 10 8 Z"/>',
  NOT:  '<polygon points="12,8 54,30 12,52"/><circle cx="60" cy="30" r="6"/>',
};

function symbol(gate) {
  const wrap = el('span', { class: 'gate-shape', 'aria-hidden': 'true' });
  wrap.innerHTML = `<svg viewBox="0 0 80 60" width="100%" height="100%">
    <g fill="var(--g-light)" stroke="var(--g-base)" stroke-width="3" stroke-linejoin="round">
      ${SHAPES[gate] || SHAPES.AND}
    </g></svg>`;
  return wrap;
}

const formula = (r) => (r.gate === 'NOT' ? `NOT ${r.a}` : r.gate === 'OR' ? `${r.a} + ${r.b}` : `${r.a} . ${r.b}`);

export function render(activity, onDone) {
  const roundList = activity.rounds;

  return rounds(roundList.length, (index, settle) => {
    const r = roundList[index];
    const choices = el('div', { class: 'gate-choices' });
    let correctBtn = null;

    ['0', '1'].forEach((value) => {
      const b = el('button', { type: 'button', class: 'gate-choice' }, [value]);
      if (value === r.correct) correctBtn = b;
      b.addEventListener('click', () => {
        lockOptions(choices, '.gate-choice', b, correctBtn);
        settle(value === r.correct);
      });
      choices.append(b);
    });

    const inputs = el('div', { class: 'gate-inputs' }, [
      el('span', { class: 'gate-pin' }, [el('span', { class: 'gate-pin-label' }, ['A']), el('span', { class: `gate-pin-value${r.a === 1 ? ' is-on' : ''}` }, [String(r.a)])]),
      r.b === null ? null : el('span', { class: 'gate-pin' }, [el('span', { class: 'gate-pin-label' }, ['B']), el('span', { class: `gate-pin-value${r.b === 1 ? ' is-on' : ''}` }, [String(r.b)])]),
    ].filter(Boolean));

    return el('div', { class: 'gate-lab' }, [
      el('p', { class: 'round-ask' }, [`${r.gate} - ${t('whatOutput')}`]),
      el('div', { class: 'gate-diagram' }, [inputs, symbol(r.gate), el('span', { class: 'gate-out' }, ['?'])]),
      el('p', { class: 'gate-formula' }, [formula(r)]),
      choices,
    ]);
  }, onDone);
}
