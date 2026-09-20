// Progress lives on the device first. Gate D6 wants local-first with sync when
// online, and a Supabase free project pauses after a week idle, so the device
// copy is the one that always has to work. The Supabase backend plugs in here
// later; nothing else in the app talks to storage.

const KEY = 'igw.progress';

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

function write(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Blocked storage: progress is kept for this session only.
  }
}

// Best score per activity, 0 to 100.
export function scoreFor(grade, activityId) {
  return read()[`${grade}/${activityId}`] ?? null;
}

export function saveScore(grade, activityId, points) {
  const clamped = Math.max(0, Math.min(100, Math.round(points)));
  const state = read();
  const key = `${grade}/${activityId}`;
  if (state[key] === undefined || clamped > state[key]) {
    state[key] = clamped;
    write(state);
  }
  return clamped;
}

export function totalFor(grade) {
  const state = read();
  return Object.entries(state)
    .filter(([key]) => key.startsWith(`${grade}/`))
    .reduce((sum, [, points]) => sum + points, 0);
}

export function starsFor(points) {
  if (points === null) return 0;
  if (points >= 90) return 3;
  if (points >= 70) return 2;
  if (points > 0) return 1;
  return 0;
}
