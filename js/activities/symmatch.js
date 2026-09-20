import { text, t } from '../i18n.js';
import { shuffled, el } from '../dom.js';

// Match each flow chart symbol with its name and its meaning.
//
// The original laid this out as three parallel columns, which collapsed to one
// column on a phone and left 15 stacked cards under three headers
// (original/grade-6/english.html:394). This runs one symbol at a time instead:
// same logic, and it fits any width without a special case.

const SHAPES = {
  oval:          '<rect x="6" y="14" width="68" height="32" rx="16"/>',
  rectangle:     '<rect x="8" y="16" width="64" height="28"/>',
  parallelogram: '<polygon points="18,16 74,16 62,44 6,44"/>',
  diamond:       '<polygon points="40,10 72,30 40,50 8,30"/>',
  arrow:         '<polygon points="10,24 52,24 52,14 74,30 52,46 52,36 10,36"/>',
};

function shape(symbol, color) {
  const wrap = el('span', { class: 'sym-shape', 'aria-hidden': 'true' });
  wrap.innerHTML = `<svg viewBox="0 0 80 60" width="100%" height="100%">
    <g fill="${color || 'var(--g-light)'}" stroke="var(--g-dark)" stroke-width="3" stroke-linejoin="round">
      ${SHAPES[symbol] || SHAPES.rectangle}
    </g></svg>`;
  return wrap;
}

export function render(activity, onDone) {
  const triples = activity.triples;
  const order = shuffled(triples.map((tr, i) => i));
  const nameOptions = shuffled(triples.map((tr, i) => ({ i, label: text(tr.name) })));
  const meaningOptions = shuffled(triples.map((tr, i) => ({ i, label: text(tr.meaning) })));

  let round = 0;
  let stage = 'name';
  let score = 0;

  const node = el('div', { class: 'sym-game' });

  function draw() {
    if (round >= order.length) {
      node.replaceChildren(el('p', { class: 'sym-done' }, [t('done')]));
      onDone(Math.round((score / (order.length * 2)) * 100));
      return;
    }
    const current = order[round];
    const triple = triples[current];
    const options = stage === 'name' ? nameOptions : meaningOptions;

    node.replaceChildren(
      el('p', { class: 'sym-progress' }, [`${round + 1} / ${order.length}`]),
      shape(triple.symbol, triple.color),
      el('p', { class: 'sym-ask' }, [t(stage === 'name' ? 'symWhatName' : 'symWhatMean')]),
      el('div', { class: 'sym-options' }, options.map((opt) => {
        const b = el('button', { type: 'button', class: 'sym-option' }, [opt.label]);
        b.addEventListener('click', () => choose(current, opt, b));
        return b;
      })),
    );
  }

  function choose(current, opt, button) {
    const ok = opt.i === current;
    if (ok) score++;
    button.classList.add(ok ? 'is-correct' : 'is-wrong');
    node.querySelectorAll('.sym-option').forEach((b) => { b.disabled = true; });

    setTimeout(() => {
      if (stage === 'name') {
        stage = 'meaning';
      } else {
        stage = 'name';
        round++;
      }
      draw();
    }, 700);
  }

  draw();

  // This one scores itself as it goes, so the activity screen hides its Check button.
  return { node, selfScoring: true };
}
