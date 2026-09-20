// The Scratch Code Builder: hub, structure list and the block workspace.
//
// It is not a grade activity. The originals ship it as an app of its own
// (original/grade-9/scratch.html), which is why it sits on the home page and
// every grade can open it. Grade 9's 3.4 links in here too.
//
// Nothing here is scored. submit_score() only accepts a grade and an activity
// id like "1.2", and a builder common to all grades has no grade to file
// under, so a built program is a tick on the device and nothing more.

import { text, t, isFallback } from './i18n.js';
import { el, setChildren, shuffled } from './dom.js';
import { isBuilt, markBuilt } from './store.js';

let cache = null;

export async function loadScratch() {
  if (!cache) {
    const res = await fetch('data/scratch.json');
    if (!res.ok) throw new Error('cannot load the scratch builder');
    cache = await res.json();
  }
  return cache;
}

// ---- blocks ---------------------------------------------------------------

// Block text is content from the originals and carries a little markup: <b>
// around a variable name, a scratch-pill span around a value. It is parsed
// into parts and built with el(), so nothing from the data reaches innerHTML.
const MARKUP = /<b>(.*?)<\/b>|<span class="scratch-pill(?: (\w+))?">(.*?)<\/span>/g;

function labelParts(source) {
  const out = [];
  let last = 0;
  for (const m of source.matchAll(MARKUP)) {
    if (m.index > last) out.push(source.slice(last, m.index));
    const tone = m[1] !== undefined ? 'name' : (m[2] || 'value');
    out.push(el('i', { class: `sb-pill is-${tone}` }, [m[1] !== undefined ? m[1] : m[3]]));
    last = m.index + m[0].length;
  }
  if (last < source.length) out.push(source.slice(last));
  return out;
}

// The `else` marker and the C-blocks both open a mouth.
const opensMouth = (block) => Boolean(block.isC || block.isElse);

// The originals never nest anything: a C-block is drawn with an empty mouth and
// the blocks that belong inside it sit after it as siblings, and `else` is a
// bare marker with its branch as the next sibling. A loop that actually holds
// its blocks needs both shaped properly, so the else marker takes what follows
// it at the same level. Same blocks, same order, drawn the way Scratch draws it.
function toTree(list) {
  const out = [];
  let openElse = null;
  for (const block of list) {
    const node = { ...block, body: block.body ? toTree(block.body) : (opensMouth(block) ? [] : null) };
    if (openElse) { openElse.body.push(node); continue; }
    out.push(node);
    if (block.isElse) openElse = node;
  }
  return out;
}

const signature = (tree) => tree.map((n) => (n.body ? `${n.id}(${signature(n.body)})` : n.id)).join(',');

function flatten(tree, out = []) {
  tree.forEach((node) => {
    out.push({ ...node, body: node.body ? [] : null });
    if (node.body) flatten(node.body, out);
  });
  return out;
}

function positionsOf(tree, parent = 'root', map = new Map()) {
  tree.forEach((node, i) => {
    map.set(node.id, `${parent}:${i}`);
    if (node.body) positionsOf(node.body, node.id, map);
  });
  return map;
}

// ---- screens --------------------------------------------------------------

export async function scratchHub(main) {
  main.replaceChildren(el('p', { class: 'loading' }, [t('loading')]));
  const data = await loadScratch();

  const cards = data.structures.map((structure) => {
    const done = structure.puzzles.filter((p) => isBuilt(p.id)).length;
    const total = structure.puzzles.length;
    return el('a', {
      class: 'struct-card', href: `#/scratch/${structure.id}`, 'data-sc': structure.color,
    }, [
      el('span', { class: 'struct-top' }, [
        el('span', { class: 'struct-icon', 'aria-hidden': 'true' }, [structure.icon]),
        el('span', { class: 'struct-title' }, [text(structure.title)]),
      ]),
      el('span', { class: 'struct-desc' }, [text(structure.desc)]),
      el('span', { class: 'struct-count' }, [`${done} / ${total} ${t('programsBuilt')}`]),
      el('span', { class: 'struct-bar' }, [
        el('span', { class: 'struct-fill', style: `width:${total ? (done / total) * 100 : 0}%` }),
      ]),
    ]);
  });

  setChildren(main, [
    el('nav', { class: 'crumb' }, [el('a', { href: '#/' }, [`← ${t('pickGrade')}`])]),
    el('h1', { class: 'screen-title' }, [t('scratchTitle')]),
    el('p', { class: 'instruction' }, [t('scratchLead')]),
    el('div', { class: 'struct-grid' }, cards),
  ]);
  main.focus({ preventScroll: true });
}

export async function scratchStructure(main, structureId) {
  main.replaceChildren(el('p', { class: 'loading' }, [t('loading')]));
  const data = await loadScratch();
  const structure = data.structures.find((s) => s.id === structureId);
  if (!structure) return notFound(main);

  const items = structure.puzzles.map((puzzle, i) => {
    const done = isBuilt(puzzle.id);
    return el('li', {}, [
      el('a', { class: `act${done ? ' is-built' : ''}`, href: `#/scratch/${structure.id}/${puzzle.id}` }, [
        el('span', { class: 'act-num', 'aria-hidden': 'true' }, [done ? '✓' : String(i + 1)]),
        el('span', { class: 'act-name' }, [text(puzzle.name)]),
        done ? el('span', { class: 'sr-only' }, [t('built')]) : null,
      ]),
    ]);
  });

  setChildren(main, [
    el('nav', { class: 'crumb' }, [el('a', { href: '#/scratch' }, [`← ${t('scratchTitle')}`])]),
    el('h1', { class: 'screen-title' }, [
      el('span', { class: 'struct-icon', 'aria-hidden': 'true' }, [structure.icon]),
      ' ',
      text(structure.title),
    ]),
    isFallback(structure.title) ? el('p', { class: 'note-fallback' }, [t('englishOnly')]) : null,
    el('p', { class: 'instruction' }, [text(structure.desc)]),
    el('ol', { class: 'act-list' }, items),
  ]);
  main.focus({ preventScroll: true });
}

export async function scratchPuzzle(main, structureId, puzzleId) {
  main.replaceChildren(el('p', { class: 'loading' }, [t('loading')]));
  const data = await loadScratch();
  const structure = data.structures.find((s) => s.id === structureId);
  const puzzle = structure?.puzzles.find((p) => p.id === puzzleId);
  if (!puzzle) return notFound(main);

  const answer = toTree(puzzle.order);
  const wanted = signature(answer);
  const wantedAt = positionsOf(answer);
  const total = flatten(answer).length;

  let tray = shuffled(flatten(answer));
  let placed = [];
  let mouth = 'root';       // which slot the next block goes into
  let dragging = null;      // block id being dragged, mouse only

  const progress = el('p', { class: 'round-progress' });
  const zone = el('div', { class: 'sb-zone' });
  const trayBox = el('div', { class: 'sb-tray' });
  const feedback = el('p', { class: 'round-feedback', role: 'status', 'aria-live': 'polite' });
  const run = el('button', { class: 'btn', type: 'button' }, [t('runProgram')]);
  const reset = el('button', { class: 'btn btn-ghost', type: 'button' }, [t('reset')]);

  // Finding a node, its parent list and its index, all from the id the button
  // carries. The tree is at most two deep, but recursing keeps it honest.
  function locate(list, id, parent = 'root') {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === id) return { list, index: i, node: list[i], parent };
      if (list[i].body) {
        const hit = locate(list[i].body, id, list[i].id);
        if (hit) return hit;
      }
    }
    return null;
  }

  function mouths(list, out = ['root']) {
    list.forEach((node) => { if (node.body) { out.push(node.id); mouths(node.body, out); } });
    return out;
  }

  function place(id) {
    const from = tray.findIndex((b) => b.id === id);
    if (from === -1) return;
    const [block] = tray.splice(from, 1);
    const into = mouth === 'root' ? placed : locate(placed, mouth)?.node.body;
    if (!into) { tray.splice(from, 0, block); return; }
    into.push(block);
    if (block.body) mouth = block.id;   // a loop you just placed is where you are working
    draw();
  }

  // Taking a block out takes whatever is inside it too, the way lifting a loop
  // out of a script in Scratch lifts its contents with it.
  function takeBack(id) {
    const hit = locate(placed, id);
    if (!hit) return;
    hit.list.splice(hit.index, 1);
    flatten([hit.node]).forEach((b) => tray.push(b));
    tray = shuffled(tray);
    if (!mouths(placed).includes(mouth)) mouth = 'root';
    draw();
  }

  function move(id, delta) {
    const hit = locate(placed, id);
    if (!hit) return;
    const to = hit.index + delta;
    if (to < 0 || to >= hit.list.length) return;
    [hit.list[hit.index], hit.list[to]] = [hit.list[to], hit.list[hit.index]];
    draw(id);
  }

  function blockNode(block, where) {
    const label = el('span', { class: 'sb-label' }, labelParts(block.text));
    const classes = ['sb-block', `sb-${block.type}`];
    if (block.isHat) classes.push('is-hat');
    if (opensMouth(block)) classes.push('is-mouth');

    if (where === 'tray') {
      const b = el('button', {
        type: 'button', class: classes.join(' '), draggable: 'true',
        'data-id': block.id, 'aria-label': `${t('addBlock')}: ${plain(block.text)}`,
      }, [label]);
      b.addEventListener('click', () => place(block.id));
      b.addEventListener('dragstart', (e) => { dragging = block.id; e.dataTransfer.effectAllowed = 'move'; });
      b.addEventListener('dragend', () => { dragging = null; });
      return opensMouth(block) ? el('span', { class: 'sb-c' }, [b, el('span', { class: 'sb-c-foot' })]) : b;
    }

    const head = el('button', {
      type: 'button', class: `${classes.join(' ')} is-placed`,
      'data-id': block.id, 'aria-label': `${t('removeBlock')}: ${plain(block.text)}`,
    }, [label]);
    head.addEventListener('click', () => takeBack(block.id));

    const row = el('div', { class: 'sb-row' }, [
      head,
      el('span', { class: 'sb-moves' }, [
        moveBtn('▲', t('moveUp'), () => move(block.id, -1)),
        moveBtn('▼', t('moveDown'), () => move(block.id, 1)),
      ]),
    ]);

    if (!block.body) return row;
    return el('div', { class: 'sb-c' }, [
      row,
      el('div', { class: 'sb-c-body' }, [
        ...block.body.map((child) => blockNode(child, 'zone')),
        slot(block.id),
      ]),
      el('span', { class: 'sb-c-foot' }),
    ]);
  }

  function moveBtn(glyph, label, onClick) {
    const b = el('button', { type: 'button', class: 'movebtn', 'aria-label': label }, [glyph]);
    b.addEventListener('click', onClick);
    return b;
  }

  // A slot is where the next block lands. With no loop placed there is only
  // ever one, so the child never has to choose; a placed loop adds its own.
  function slot(id) {
    const only = mouths(placed).length === 1;
    const chosen = mouth === id;
    const b = el('button', {
      type: 'button',
      class: `sb-slot${chosen ? ' is-chosen' : ''}`,
      'data-slot': id,
      'aria-pressed': only ? null : String(chosen),
    }, [id === 'root' ? t('placeHere') : t('insideLoop')]);
    b.addEventListener('click', () => { mouth = id; draw(); });
    b.addEventListener('dragover', (e) => { e.preventDefault(); b.classList.add('is-over'); });
    b.addEventListener('dragleave', () => b.classList.remove('is-over'));
    b.addEventListener('drop', (e) => {
      e.preventDefault();
      b.classList.remove('is-over');
      if (!dragging) return;
      mouth = id;
      place(dragging);
    });
    return b;
  }

  function draw(focusId) {
    progress.textContent = `${total - tray.length} / ${total} ${t('placed')}`;
    zone.replaceChildren(...placed.map((block) => blockNode(block, 'zone')), slot('root'));
    trayBox.replaceChildren(...(tray.length
      ? tray.map((block) => blockNode(block, 'tray'))
      : [el('p', { class: 'sb-tray-empty' }, [t('trayEmpty')])]));
    run.disabled = tray.length > 0;
    if (focusId) zone.querySelector(`.sb-block[data-id="${focusId}"]`)?.focus();
  }

  run.addEventListener('click', () => {
    if (tray.length) return;
    if (signature(placed) === wanted) return win();
    const at = positionsOf(placed);
    let wrong = 0;
    zone.querySelectorAll('.sb-block.is-placed').forEach((node) => {
      const id = node.dataset.id;
      if (at.get(id) !== wantedAt.get(id)) { node.classList.add('is-wrong-place'); wrong++; }
    });
    feedback.className = 'round-feedback is-bad';
    feedback.textContent = t('notYet');
    setTimeout(() => {
      zone.querySelectorAll('.is-wrong-place').forEach((n) => n.classList.remove('is-wrong-place'));
    }, 1200);
  });

  reset.addEventListener('click', () => {
    tray = shuffled(flatten(answer));
    placed = [];
    mouth = 'root';
    feedback.className = 'round-feedback';
    feedback.textContent = '';
    draw();
  });

  function win() {
    markBuilt(puzzle.id);
    const next = structure.puzzles[structure.puzzles.indexOf(puzzle) + 1];
    setChildren(main, [
      el('nav', { class: 'crumb' }, [el('a', { href: `#/scratch/${structure.id}` }, [`← ${text(structure.title)}`])]),
      el('h1', { class: 'screen-title' }, [t('programRuns')]),
      el('p', { class: 'instruction' }, [text(puzzle.name)]),
      el('div', { class: 'sb-zone is-done' }, placed.map((block) => showBlock(block))),
      el('div', { class: 'actions' }, [
        next ? el('a', { class: 'btn', href: `#/scratch/${structure.id}/${next.id}` }, [t('nextProgram')]) : null,
        el('a', { class: 'btn btn-ghost', href: `#/scratch/${structure.id}` }, [text(structure.title)]),
        el('a', { class: 'btn btn-ghost', href: '#/scratch' }, [t('scratchTitle')]),
      ]),
    ]);
    main.focus({ preventScroll: true });
  }

  // The finished program, with nothing left to press.
  function showBlock(block) {
    const classes = ['sb-block', `sb-${block.type}`, 'is-placed'];
    if (block.isHat) classes.push('is-hat');
    if (opensMouth(block)) classes.push('is-mouth');
    const head = el('span', { class: classes.join(' ') }, [el('span', { class: 'sb-label' }, labelParts(block.text))]);
    if (!block.body) return head;
    return el('div', { class: 'sb-c' }, [
      head,
      el('div', { class: 'sb-c-body' }, block.body.map(showBlock)),
      el('span', { class: 'sb-c-foot' }),
    ]);
  }

  draw();

  setChildren(main, [
    el('nav', { class: 'crumb' }, [el('a', { href: `#/scratch/${structure.id}` }, [`← ${text(structure.title)}`])]),
    el('h1', { class: 'screen-title' }, [text(puzzle.name)]),
    isFallback(puzzle.name) ? el('p', { class: 'note-fallback' }, [t('englishOnly')]) : null,
    el('p', { class: 'instruction' }, [text(puzzle.description)]),
    progress,
    el('p', { class: 'sb-legend' }, [t('scriptArea')]),
    zone,
    el('p', { class: 'sb-legend' }, [t('blockTray')]),
    trayBox,
    feedback,
    el('div', { class: 'actions' }, [run, reset]),
  ]);
  main.focus({ preventScroll: true });
}

// An aria-label wants the words, not the markup around them.
const plain = (source) => source.replace(MARKUP, (m, name, tone, value) => name ?? value);

function notFound(main) {
  setChildren(main, [
    el('p', { class: 'loading' }, [t('notFound')]),
    el('p', {}, [el('a', { class: 'btn', href: '#/scratch' }, [t('scratchTitle')])]),
  ]);
}
