// Who is playing, on this device. A random id, a nickname and an avatar, plus
// an optional class code so a teacher can group a class. Nothing else is kept
// and nothing identifies a real child, because every player here is under 16.

import { AVATARS } from './config.js';

const KEY = 'igw.player';

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || 'null');
  } catch {
    return null;
  }
}

export function getPlayer() {
  return read();
}

export function hasPlayer() {
  return Boolean(read()?.nickname);
}

export function savePlayer({ nickname, avatar, classCode }) {
  const existing = read();
  const player = {
    id: existing?.id || crypto.randomUUID(),
    nickname: String(nickname || '').trim().slice(0, 20),
    avatar: AVATARS.includes(avatar) ? avatar : AVATARS[0],
    classCode: String(classCode || '').trim().toUpperCase().slice(0, 12) || null,
  };
  if (!player.nickname) throw new Error('nickname is required');
  try {
    localStorage.setItem(KEY, JSON.stringify(player));
  } catch {
    // Blocked storage: the player lasts for this session only.
  }
  return player;
}
