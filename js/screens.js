// The name entry and leaderboard screens. Kept out of app.js so the router
// stays readable.

import { t } from './i18n.js';
import { el, setChildren } from './dom.js';
import { AVATARS } from './config.js';
import { getPlayer, savePlayer } from './player.js';
import { fetchBoard, pendingCount } from './leaderboard.js';
import { totalFor } from './store.js';

const AVATAR_FACE = {
  bot: '🤖', cat: '🐱', owl: '🦉', fox: '🦊',
  star: '⭐', rocket: '🚀', leaf: '🍃', wave: '🌊',
};

export function nameEntry(main, onSaved) {
  const player = getPlayer();
  let chosen = player?.avatar || AVATARS[0];

  const nick = el('input', {
    id: 'nick', class: 'field', type: 'text', maxlength: '20',
    value: player?.nickname || '', autocomplete: 'off', required: true,
  });
  const code = el('input', {
    id: 'code', class: 'field', type: 'text', maxlength: '12',
    value: player?.classCode || '', autocomplete: 'off',
  });

  const grid = el('div', { class: 'avatar-grid', role: 'radiogroup', 'aria-label': t('chooseBuddy') });
  AVATARS.forEach((name) => {
    const b = el('button', {
      type: 'button', class: 'avatar', role: 'radio',
      'aria-checked': String(name === chosen), 'aria-label': name,
    }, [AVATAR_FACE[name]]);
    b.addEventListener('click', () => {
      chosen = name;
      grid.querySelectorAll('.avatar').forEach((x) => x.setAttribute('aria-checked', String(x === b)));
    });
    grid.append(b);
  });

  const form = el('form', { class: 'name-form' }, [
    el('label', { for: 'nick' }, [t('nickname')]),
    nick,
    el('p', { class: 'field-label' }, [t('chooseBuddy')]),
    grid,
    el('label', { for: 'code' }, [t('classCode')]),
    code,
    el('button', { class: 'btn', type: 'submit' }, [t('saveAndPlay')]),
  ]);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!nick.value.trim()) { nick.focus(); return; }
    savePlayer({ nickname: nick.value, avatar: chosen, classCode: code.value });
    onSaved();
  });

  setChildren(main, [el('h1', { class: 'screen-title' }, [t('whatName')]), form]);
  nick.focus();
}

export async function leaderboard(main, grade) {
  const player = getPlayer();
  const hasClass = Boolean(player?.classCode);
  let scope = hasClass ? 'class' : 'all';

  const list = el('div', { class: 'board' });
  const note = el('p', { class: 'board-note' });

  const tabs = el('div', { class: 'tabs', role: 'tablist' });
  const mk = (key, label) => {
    const b = el('button', {
      type: 'button', class: 'tab', role: 'tab', 'aria-selected': String(scope === key),
    }, [label]);
    b.addEventListener('click', () => {
      scope = key;
      tabs.querySelectorAll('.tab').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
      draw();
    });
    return b;
  };
  if (hasClass) tabs.append(mk('class', t('myClass')));
  tabs.append(mk('all', t('everyone')));

  async function draw() {
    list.replaceChildren(el('p', { class: 'loading' }, [t('loading')]));
    const rows = await fetchBoard(grade, { classCode: scope === 'class' ? player.classCode : null });

    const waiting = pendingCount();
    note.textContent = rows.length
      ? (waiting ? `${waiting} ${t('notSynced')}` : '')
      : t('offlineBoard');

    if (!rows.length) {
      const mine = totalFor(grade);
      list.replaceChildren(mine
        ? row({ nickname: player?.nickname || t('you'), avatar: player?.avatar || 'bot', points: mine }, 1, true)
        : el('p', { class: 'loading' }, [t('noScoresYet')]));
      return;
    }
    // Match on the player id, never the nickname: two children in one class can
    // pick the same nickname, and both used to be badged "You".
    list.replaceChildren(...rows.map((r, i) => row(r, i + 1, r.player_id === player?.id)));
  }

  function row(r, place, isMe) {
    return el('div', { class: `board-row${isMe ? ' is-me' : ''}` }, [
      el('span', { class: 'place' }, [String(place)]),
      el('span', { class: 'board-avatar', 'aria-hidden': 'true' }, [AVATAR_FACE[r.avatar] || '🤖']),
      el('span', { class: 'board-name' }, [r.nickname]),
      isMe ? el('span', { class: 'board-you' }, [t('you')]) : null,
      el('span', { class: 'board-points' }, [`${r.points}`]),
    ]);
  }

  setChildren(main, [
    el('nav', { class: 'crumb' }, [el('a', { href: `#/g${grade}` }, [`← ${t('backToPath')}`])]),
    el('h1', { class: 'screen-title' }, [t('leaderboard')]),
    tabs,
    note,
    list,
  ]);
  await draw();
}
