import { text, t } from '../i18n.js';
import { el } from '../dom.js';
import { rounds } from './rounds.js';

// Type the answer. Answers are things like "read only" and "=SUM(A1:A10)", so
// case and stray spaces are forgiven; nothing else is.
const normalise = (value) => String(value).trim().toLowerCase().replace(/\s+/g, ' ');

export function render(activity, onDone) {
  const questions = activity.questions;

  return rounds(questions.length, (index, settle) => {
    const q = questions[index];
    const field = el('input', {
      type: 'text',
      class: 'field input-field',
      id: `answer-${index}`,
      autocomplete: 'off',
      autocapitalize: 'off',
      spellcheck: 'false',
    });
    const submit = el('button', { class: 'btn', type: 'submit' }, [t('check')]);

    function answer(event) {
      event.preventDefault();
      const ok = normalise(field.value) === normalise(q.ans);
      field.disabled = true;
      submit.disabled = true;
      field.classList.add(ok ? 'is-correct' : 'is-wrong');
      settle(ok, ok ? t('correct') : `${t('notQuite')} - ${q.ans}`);
    }

    // A form, so Enter submits on a phone keyboard without wiring a key handler.
    const form = el('form', { class: 'input-box' }, [
      el('label', { class: 'input-q', for: `answer-${index}` }, [text(q.q)]),
      q.hint ? el('p', { class: 'input-hint' }, [`${t('hint')}: ${text(q.hint)}`]) : null,
      field,
      submit,
    ].filter(Boolean));
    form.addEventListener('submit', answer);
    // Autofocus would scroll a phone under the keyboard on the result screen too.
    setTimeout(() => field.focus({ preventScroll: true }), 0);
    return form;
  }, onDone);
}
