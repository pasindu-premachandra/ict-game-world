// ICT Adventure carries its Sinhala as sibling keys (q / qSi, title / titleSi)
// and leaves the rest English-only. This reshapes it into the same {en, si}
// model the other grades use, and can rebuild the original shape so
// check-data.mjs can prove the reshape lost nothing.

const pair = (en, si = null) => ({ en, si: si ?? null });

export function normalise({ lessons, games }) {
  const byId = Object.fromEntries(games.map((g) => [g.id, g]));

  return {
    grade: 9,
    set: 'adventure',
    languages: ['en', 'si'],
    lessons: lessons.map((L) => ({
      num: L.num,
      theme: L.theme,
      emoji: L.emoji,
      title: pair(L.title, L.titleSi),
      games: L.games.map((meta) => {
        const g = byId[meta.id];
        if (!g) throw new Error(`lesson ${L.num} lists game ${meta.id}, which has no function`);
        return {
          id: meta.id,
          icon: meta.icon,
          name: pair(meta.name),
          desc: pair(meta.desc),
          kind: g.kind,
          ...body(g),
        };
      }),
    })),
  };
}

function body(g) {
  if (g.kind === 'mcQuiz') {
    return {
      questions: g.questions.map((q) => ({
        q: pair(q.q, q.qSi),
        opts: q.opts.map((o) => pair(o)),
        ans: q.ans,
      })),
    };
  }
  if (g.kind === 'sortGame') {
    return {
      items: g.items.map((it) => ({ name: pair(it.name), bin: it.bin })),
      bins: g.bins.map((b) => ({ id: b.id, name: pair(b.name), emoji: b.emoji })),
    };
  }
  if (g.kind === 'memoryGame') {
    return { pairs: g.pairs.map((p) => ({ a: pair(p.a), b: pair(p.b), key: p.key })) };
  }
  throw new Error(`unknown game kind ${g.kind}`);
}

// Rebuild the shape readAdventure() returns, so it can be compared with it.
export function denormalise(data) {
  const lessons = data.lessons.map((L) => ({
    num: L.num,
    theme: L.theme,
    emoji: L.emoji,
    title: L.title.en,
    titleSi: L.title.si,
    games: L.games.map((g) => ({ id: g.id, icon: g.icon, name: g.name.en, desc: g.desc.en })),
  }));

  const games = data.lessons.flatMap((L) => L.games.map((g) => {
    if (g.kind === 'mcQuiz') {
      return {
        id: g.id,
        kind: g.kind,
        questions: g.questions.map((q) => ({ q: q.q.en, qSi: q.q.si, opts: q.opts.map((o) => o.en), ans: q.ans })),
      };
    }
    if (g.kind === 'sortGame') {
      return {
        id: g.id,
        kind: g.kind,
        items: g.items.map((it) => ({ name: it.name.en, bin: it.bin })),
        bins: g.bins.map((b) => ({ id: b.id, name: b.name.en, emoji: b.emoji })),
      };
    }
    return { id: g.id, kind: g.kind, pairs: g.pairs.map((p) => ({ a: p.a.en, b: p.b.en, key: p.key })) };
  }));

  return { lessons, games };
}
