// The four moments DESIGN.md names: a correct pop with sparks, a wrong shake
// with a coral flash, stars landing one by one, and the path drawing on. Only
// transform and opacity move.
//
// Durations are tokens, and tokens.css already zeroes them all under
// prefers-reduced-motion, so a CSS animation lands on its final frame by
// itself. The pieces built here - sparks, confetti, the floating XP - have no
// final frame worth showing, so they are skipped outright instead.

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)');

export function reduced() {
  return REDUCED.matches;
}

// Re-adding a class the node already carries restarts nothing, so the class
// comes off for one frame first. Without this a second correct answer on the
// same node sits still.
function replay(node, cls, ms) {
  if (!node) return;
  node.classList.remove(cls);
  void node.offsetWidth;
  node.classList.add(cls);
  setTimeout(() => node.classList.remove(cls), ms);
}

export function pop(node) {
  replay(node, 'anim-pop', 400);
}

export function shake(node) {
  replay(node, 'anim-shake', 600);
}

export function flash(node) {
  replay(node, 'anim-flash', 600);
}

const SPARKS = 7;
const SPARK_REACH = 54;

// Fixed to the node's centre rather than appended inside it, so a card does
// not need position:relative and its overflow cannot clip the sparks.
export function sparks(node) {
  if (reduced() || !node) return;
  const box = node.getBoundingClientRect();
  const host = document.createElement('span');
  host.className = 'sparks';
  host.setAttribute('aria-hidden', 'true');
  host.style.left = `${box.left + box.width / 2}px`;
  host.style.top = `${box.top + box.height / 2}px`;
  for (let i = 0; i < SPARKS; i++) {
    const angle = (i / SPARKS) * Math.PI * 2;
    const spark = document.createElement('i');
    spark.className = 'spark';
    spark.style.setProperty('--dx', `${Math.round(Math.cos(angle) * SPARK_REACH)}px`);
    spark.style.setProperty('--dy', `${Math.round(Math.sin(angle) * SPARK_REACH)}px`);
    host.append(spark);
  }
  document.body.append(host);
  setTimeout(() => host.remove(), 700);
}

// "+15 XP" rising off the node that earned it.
export function floatXp(label, node) {
  if (reduced()) return;
  const box = node?.getBoundingClientRect();
  const tag = document.createElement('span');
  tag.className = 'float-xp';
  tag.setAttribute('aria-hidden', 'true');
  tag.textContent = label;
  tag.style.left = `${box ? box.left + box.width / 2 : window.innerWidth / 2}px`;
  tag.style.top = `${box ? box.top : window.innerHeight / 2}px`;
  document.body.append(tag);
  setTimeout(() => tag.remove(), 1100);
}

const CONFETTI_COLOURS = ['var(--gold)', 'var(--flame)', 'var(--success)', 'var(--info)', 'var(--g-base)'];

export function confetti(count = 70) {
  if (reduced()) return;
  const host = document.createElement('div');
  host.className = 'confetti';
  host.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < count; i++) {
    const bit = document.createElement('i');
    bit.style.left = `${Math.random() * 100}vw`;
    bit.style.background = CONFETTI_COLOURS[i % CONFETTI_COLOURS.length];
    bit.style.animationDuration = `${1.8 + Math.random() * 1.6}s`;
    bit.style.animationDelay = `${Math.random() * 0.4}s`;
    if (Math.random() > 0.6) bit.style.borderRadius = '50%';
    host.append(bit);
  }
  document.body.append(host);
  setTimeout(() => host.remove(), 4400);
}
