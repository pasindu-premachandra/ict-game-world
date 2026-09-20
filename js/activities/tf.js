import { text, t } from '../i18n.js';
import { el } from '../dom.js';
import { rounds } from './rounds.js';

// One statement at a time, true or false. Two big targets rather than a list of
// radio pairs, because on a phone a child answers this with a thumb.
export function render(activity, onDone) {
  const statements = activity.statements;

  return rounds(statements.length, (index, settle) => {
    const st = statements[index];
    const row = el('div', { class: 'tf-buttons' });

    function answer(value, button) {
      row.querySelectorAll('button').forEach((b) => { b.disabled = true; });
      const ok = value === st.a;
      button.classList.add(ok ? 'is-correct' : 'is-wrong');
      if (!ok) row.querySelector(`[data-value="${st.a}"]`).classList.add('is-answer');
      settle(ok, ok ? t('correct') : `${t('notQuite')} - ${t(st.a ? 'trueLabel' : 'falseLabel')}`);
    }

    [true, false].forEach((value) => {
      const b = el('button', {
        type: 'button',
        class: `tf-btn tf-${value}`,
        'data-value': String(value),
      }, [t(value ? 'trueLabel' : 'falseLabel')]);
      b.addEventListener('click', () => answer(value, b));
      row.append(b);
    });

    return el('div', { class: 'tf-card' }, [
      el('p', { class: 'tf-statement' }, [text(st.s)]),
      row,
    ]);
  }, onDone);
}
