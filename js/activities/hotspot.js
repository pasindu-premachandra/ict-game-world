import { text, t } from '../i18n.js';
import { el, shuffled } from '../dom.js';
import { rounds, lockOptions } from './rounds.js';

// Read the description, click the thing it describes. The options are the same
// set for every round of the activity; app.js resolves them, either from the
// activity itself or from the grade's optionSets (see scripts/lib/read-option-sets.mjs).
export function render(activity, onDone) {
  const options = activity.options ?? [];
  const roundList = activity.rounds;

  if (!options.length) {
    return {
      node: el('p', { class: 'loading' }, [t('notFound')]),
      selfScoring: true,
    };
  }

  return rounds(roundList.length, (index, settle) => {
    const r = roundList[index];
    const grid = el('div', { class: 'hotspot-grid' });
    let correctBtn = null;

    shuffled(options).forEach((opt) => {
      const b = el('button', { type: 'button', class: 'hotspot-item' }, [
        el('span', { class: 'hotspot-icon', 'aria-hidden': 'true' }, [text(opt.icon)]),
        el('span', { class: 'hotspot-name' }, [text(opt.name)]),
        el('span', { class: 'hotspot-desc' }, [text(opt.desc)]),
      ]);
      if (opt.key === r.ans) correctBtn = b;
      b.addEventListener('click', () => {
        lockOptions(grid, '.hotspot-item', b, correctBtn);
        settle(opt.key === r.ans);
      });
      grid.append(b);
    });

    return el('div', { class: 'hotspot-round' }, [
      el('p', { class: 'round-ask' }, [text(r.q)]),
      grid,
    ]);
  }, onDone);
}
