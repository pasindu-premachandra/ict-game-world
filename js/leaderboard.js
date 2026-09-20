// The class leaderboard, local first.
//
// Scores are always saved on the device (store.js). This module pushes them to
// Supabase when it can and queues them when it cannot, so a dropped connection
// or a paused free project never costs a student their progress or blocks play.

import { SUPABASE_URL, SUPABASE_KEY } from './config.js';
import { getPlayer } from './player.js';

const QUEUE = 'igw.pending';

const headers = {
  apikey: SUPABASE_KEY,
  authorization: `Bearer ${SUPABASE_KEY}`,
  'content-type': 'application/json',
};

function readQueue() {
  try {
    return JSON.parse(localStorage.getItem(QUEUE) || '[]');
  } catch {
    return [];
  }
}

function writeQueue(list) {
  try {
    localStorage.setItem(QUEUE, JSON.stringify(list.slice(-200)));
  } catch {
    // Blocked storage: the queue is dropped, the device score still stands.
  }
}

async function post(entry) {
  const player = getPlayer();
  if (!player) return false;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/submit_score`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      p_player: player.id,
      p_nickname: player.nickname,
      p_avatar: player.avatar,
      p_class_code: player.classCode,
      p_grade: entry.grade,
      p_activity: entry.activityId,
      p_points: entry.points,
    }),
  });
  return res.ok;
}

// Called after every scored activity. Never throws: the device score is the
// one that matters, and the server copy can always catch up later.
export async function pushScore(grade, activityId, points) {
  if (!getPlayer()) return;
  const entry = { grade, activityId, points };
  try {
    if (navigator.onLine && await post(entry)) return;
  } catch {
    // fall through and queue
  }
  writeQueue([...readQueue().filter((e) => !(e.grade === grade && e.activityId === activityId)), entry]);
}

export async function flushQueue() {
  if (!navigator.onLine || !getPlayer()) return;
  const pending = readQueue();
  if (!pending.length) return;
  const left = [];
  for (const entry of pending) {
    try {
      if (!await post(entry)) left.push(entry);
    } catch {
      left.push(entry);
    }
  }
  writeQueue(left);
}

export function pendingCount() {
  return readQueue().length;
}

// Returns [] when the project is paused or the device is offline, so the screen
// can show the device board instead of an error.
export async function fetchBoard(grade, { classCode = null } = {}) {
  const view = classCode ? 'leaderboard_class' : 'leaderboard_grade';
  const params = new URLSearchParams({
    select: 'nickname,avatar,class_code,points,activities_done',
    grade: `eq.${grade}`,
    order: 'points.desc',
    limit: '50',
  });
  if (classCode) params.set('class_code', `eq.${classCode}`);

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${view}?${params}`, { headers });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

window.addEventListener('online', () => { flushQueue(); });
