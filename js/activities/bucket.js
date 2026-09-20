import { text } from '../i18n.js';
import { shuffled, el } from '../dom.js';

// Pick a chip, then pick the bucket it belongs in. This is how the originals
// worked too ("click an item first, then click the correct bucket").
export function render(activity, onDone) {
  const buckets = activity.buckets;
  const chips = shuffled(buckets.flatMap((b, bi) => b.items.map((item) => ({ item, bi }))));
  const placed = new Map();
  let picked = null;

  const pool = el('div', { class: 'chip-pool' });
  const row = el('div', { class: 'bucket-row' });

  function drawPool() {
    pool.replaceChildren();
    chips.forEach((chip, i) => {
      if (placed.has(i)) return;
      const b = el('button', { type: 'button', class: 'chip' }, [text(chip.item)]);
      b.addEventListener('click', () => {
        pool.querySelectorAll('.chip').forEach((c) => c.classList.remove('is-picked'));
        picked = i;
        b.classList.add('is-picked');
        row.querySelectorAll('.bucket').forEach((z) => z.classList.add('is-ready'));
      });
      pool.append(b);
    });
  }

  buckets.forEach((bucket, bi) => {
    const drop = el('div', { class: 'bucket-items' });
    const zone = el('button', { type: 'button', class: 'bucket' }, [
      el('span', { class: 'bucket-name' }, [text(bucket.name)]),
      drop,
    ]);
    zone.addEventListener('click', () => {
      if (picked === null) return;
      placed.set(picked, bi);
      drop.append(el('span', { class: 'placed', 'data-chip': String(picked) }, [text(chips[picked].item)]));
      picked = null;
      row.querySelectorAll('.bucket').forEach((z) => z.classList.remove('is-ready'));
      drawPool();
    });
    row.append(zone);
  });

  drawPool();

  return {
    node: el('div', { class: 'bucket-game' }, [pool, row]),
    check() {
      let right = 0;
      placed.forEach((bi, chipIndex) => {
        const ok = chips[chipIndex].bi === bi;
        if (ok) right++;
        row.querySelector(`.placed[data-chip="${chipIndex}"]`)?.classList.add(ok ? 'is-correct' : 'is-wrong');
      });
      pool.querySelectorAll('.chip').forEach((b) => { b.disabled = true; });
      row.querySelectorAll('.bucket').forEach((b) => { b.disabled = true; });
      onDone(Math.round((right / chips.length) * 100));
    },
  };
}
