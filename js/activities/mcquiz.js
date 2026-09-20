import { text } from '../i18n.js';
import { el } from '../dom.js';
import { rounds, lockOptions } from './rounds.js';

// A question and four answers, from the ICT Adventure sets. This is `trace`
// without the code block, so it is the round shell plus an option list; the
// options read as prose rather than code, which is the only reason it does not
// simply reuse the trace styles.
//
// The options are not shuffled. `ans` is an index into the order the content
// author wrote, and several questions end on "All of these", which stops being
// the last option if the list moves.
export function render(activity, onDone) {
  const questions = activity.questions;

  return rounds(questions.length, (index, settle) => {
    const q = questions[index];
    const list = el('div', { class: 'quiz-options' });
    let correctBtn = null;

    q.opts.forEach((opt, i) => {
      const b = el('button', { type: 'button', class: 'quiz-opt' }, [text(opt)]);
      if (i === q.ans) correctBtn = b;
      b.addEventListener('click', () => {
        lockOptions(list, '.quiz-opt', b, correctBtn);
        settle(i === q.ans);
      });
      list.append(b);
    });

    return el('div', { class: 'quiz-round' }, [
      el('p', { class: 'round-ask' }, [text(q.q)]),
      list,
    ]);
  }, onDone);
}
