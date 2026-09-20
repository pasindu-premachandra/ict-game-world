import { text, t } from '../i18n.js';
import { el } from '../dom.js';
import { rounds, lockOptions } from './rounds.js';

// Read a short program and say what it prints. The code stays as written: it is
// pseudocode a child compares line by line, so it is never translated and never
// re-wrapped.
export function render(activity, onDone) {
  const questions = activity.questions;

  return rounds(questions.length, (index, settle) => {
    const q = questions[index];
    const list = el('div', { class: 'trace-options' });
    let correctBtn = null;

    q.opts.forEach((opt, i) => {
      const b = el('button', { type: 'button', class: 'trace-opt' }, [text(opt)]);
      if (i === q.ans) correctBtn = b;
      b.addEventListener('click', () => {
        lockOptions(list, '.trace-opt', b, correctBtn);
        const ok = i === q.ans;
        settle(ok, q.note ? text(q.note) : undefined);
      });
      list.append(b);
    });

    return el('div', { class: 'trace-round' }, [
      el('pre', { class: 'trace-code' }, [q.code]),
      el('p', { class: 'round-ask' }, [t('whatOutput')]),
      list,
    ]);
  }, onDone);
}
