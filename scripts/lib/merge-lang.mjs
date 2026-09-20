// Merge the English and Sinhala copies of one game into a single bilingual tree.
//
// The two files are the same game with translated strings, so we walk them in
// lockstep. A string that differs between them is human copy and becomes
// {en, si}; a string that is identical in both is an icon, an answer key, a
// colour or a piece of pseudocode, and stays a plain string. Anything that is
// not a string must be identical in both, and a mismatch throws rather than
// silently picking a side, because that is how an answer would get changed.

export class MergeError extends Error {
  constructor(path, message) {
    super(`${path || '<root>'}: ${message}`);
    this.path = path;
  }
}

const typeOf = (v) => (Array.isArray(v) ? 'array' : v === null ? 'null' : typeof v);

// Keys that hold human copy. With both languages present we can tell copy from
// an icon or an answer key by whether the two sides differ, but grade 9 has no
// Sinhala file, so there we have to say which keys are copy. Getting this wrong
// wraps id and type into {en, si} and breaks every id lookup downstream.
const COPY_KEYS = new Set([
  'title', 'name', 'instruction', 'text', 'l', 'r', 'meaning', 'q', 's', 'hint', 'items', 'desc',
]);

export function mergeLang(en, si, path = '', hasSi = true, key = null) {
  const te = typeOf(en);

  if (!hasSi) {
    if (te === 'string') return COPY_KEYS.has(key) ? { en, si: null } : en;
    if (te === 'array') return en.map((v, i) => mergeLang(v, undefined, `${path}[${i}]`, false, key));
    if (te === 'object') {
      return Object.fromEntries(
        Object.entries(en).map(([k, v]) => [k, mergeLang(v, undefined, path ? `${path}.${k}` : k, false, k)])
      );
    }
    return en;
  }

  const ts = typeOf(si);
  if (te !== ts) throw new MergeError(path, `english is ${te}, sinhala is ${ts}`);

  if (te === 'array') {
    if (en.length !== si.length) {
      throw new MergeError(path, `english has ${en.length} items, sinhala has ${si.length}`);
    }
    return en.map((v, i) => mergeLang(v, si[i], `${path}[${i}]`));
  }

  if (te === 'object') {
    const ke = Object.keys(en);
    const ks = Object.keys(si);
    const missing = ke.filter((k) => !ks.includes(k));
    const extra = ks.filter((k) => !ke.includes(k));
    if (missing.length || extra.length) {
      throw new MergeError(path, `key mismatch (sinhala missing: ${missing.join(',') || 'none'}; sinhala extra: ${extra.join(',') || 'none'})`);
    }
    return Object.fromEntries(ke.map((k) => [k, mergeLang(en[k], si[k], path ? `${path}.${k}` : k)]));
  }

  if (te === 'string') return en === si ? en : { en, si };

  if (en !== si) throw new MergeError(path, `non-text value differs: english ${JSON.stringify(en)}, sinhala ${JSON.stringify(si)}`);
  return en;
}
