export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === null || value === undefined || value === false) continue;
    if (key === 'class') node.className = value;
    else node.setAttribute(key, value === true ? '' : value);
  }
  for (const child of children) {
    if (child === null || child === undefined) continue;
    node.append(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
}

// A line icon from the <defs> block in index.html. Stroked from currentColor,
// so it takes the colour of whatever it sits in.
export function icon(id) {
  const node = el('span', { class: 'ic', 'aria-hidden': 'true' });
  node.innerHTML = `<svg viewBox="0 0 24 24"><use href="#${id}"/></svg>`;
  return node;
}

// The ICT friend. `mood` is idle, happy or think. Parsed rather than built with
// el(), because createElement makes an HTML element and an <svg> needs the SVG
// namespace to render at all.
export function bot(mood, label = null) {
  const holder = document.createElement('div');
  holder.innerHTML = `<svg class="bot" viewBox="0 0 120 120"><use href="#bot-${mood}"/></svg>`;
  const node = holder.firstElementChild;
  if (label) {
    node.setAttribute('role', 'img');
    node.setAttribute('aria-label', label);
  } else {
    node.setAttribute('aria-hidden', 'true');
  }
  return node;
}

// How the friend speaks: the robot plus a speech bubble. Every screen that
// tells a child what to do uses this, never a bare paragraph.
export function callout(mood, message) {
  return el('div', { class: 'callout' }, [
    bot(mood),
    el('p', { class: 'bubble' }, [message]),
  ]);
}

// The bar across the top of anything a child plays: a way out, and how far
// through they are. `total` is the number of steps, or 0 when the screen has
// nothing to segment. setDone(n) fills the first n.
export function activityBar(closeHref, closeLabel, total = 0) {
  const close = el('a', { class: 'closebtn', href: closeHref, 'aria-label': closeLabel }, [icon('i-x')]);
  if (!total) return { node: el('div', { class: 'actbar' }, [close]), setDone() {} };

  const cells = Array.from({ length: total }, () => el('i'));
  const bar = el('div', {
    class: 'bar-set', role: 'progressbar',
    'aria-valuemin': '0', 'aria-valuemax': String(total), 'aria-valuenow': '0',
    'aria-label': `0 / ${total}`,
  }, cells);

  return {
    node: el('div', { class: 'actbar' }, [close, bar]),
    setDone(n) {
      cells.forEach((cell, i) => cell.classList.toggle('is-done', i < n));
      bar.setAttribute('aria-valuenow', String(n));
      bar.setAttribute('aria-label', `${n} / ${total}`);
    },
  };
}

export function shuffled(list) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function clear(node) {
  node.replaceChildren();
  return node;
}

// replaceChildren turns a null child into the literal text "null", so the
// optional rows every screen builds have to be filtered out first.
export function setChildren(node, children) {
  node.replaceChildren(...children.filter((c) => c !== null && c !== undefined));
  return node;
}
