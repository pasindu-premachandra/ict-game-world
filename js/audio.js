// Sound effects, built from oscillators. Nothing to download, nothing to
// decode, and no audio file in the precache - which matters, because the
// service worker already carries 829 KB of fonts.
//
// The five cues and their frequencies are the originals', so the game sounds
// the same as the one Ishini built.
//
// A browser will not let a page make a sound before the child has touched it,
// so the context is built on the first cue rather than at load, and resumed if
// the browser suspended it.

const KEY = 'igw.sound';

let ctx = null;
let on = true;

try {
  on = localStorage.getItem(KEY) !== 'off';
} catch {
  // Blocked storage: sound stays on, it just will not be remembered.
}

function context() {
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) {
    try {
      ctx = new Ctor();
    } catch {
      return null;
    }
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// One short tone. An exponential ramp cannot reach zero, hence the 0.0001.
function blip(freq, dur, type, vol, delay) {
  const ac = context();
  if (!ac) return;
  const at = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(vol, at + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(at);
  osc.stop(at + dur + 0.03);
}

function run(notes) {
  if (!on) return;
  for (const [freq, dur, type, vol, delay] of notes) blip(freq, dur, type, vol, delay);
}

const rising = (freqs, dur, type, vol, gap) =>
  freqs.map((freq, i) => [freq, dur, type, vol, i * gap]);

export const sfx = {
  correct: () => run(rising([659, 784, 988, 1319], 0.15, 'sine', 0.18, 0.05)),
  wrong: () => run([[220, 0.15, 'sawtooth', 0.1, 0], [160, 0.2, 'sawtooth', 0.1, 0.1]]),
  click: () => run([[1000, 0.04, 'square', 0.04, 0]]),
  win: () => run(rising([523, 659, 784, 1047, 1319, 1568], 0.22, 'triangle', 0.15, 0.1)),
  combo: () => run(rising([880, 1109, 1319], 0.1, 'square', 0.14, 0.04)),
};

export function soundOn() {
  return on;
}

export function setSound(next) {
  on = Boolean(next);
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {
    // Blocked storage: the choice lasts for this session only.
  }
  if (on) sfx.click();
  return on;
}
