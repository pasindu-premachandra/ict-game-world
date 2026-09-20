import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

// Fold the syllabus-enrichment content into the extracted originals.
//
// Everything this adds is stamped with origin:'syllabus-enrichment', and every
// lesson it replaces is recorded in the file's `replaced` list. That is what
// lets check-data.mjs still prove the untouched part is bit-identical to the
// original games: it simply ignores anything carrying an origin.

const ORIGIN = 'syllabus-enrichment';

function stamp(node, siDraft) {
  return { ...node, origin: ORIGIN, ...(siDraft ? { siDraft: true } : {}) };
}

export async function applyAdditions(grade, lessons) {
  const file = resolve(`content/grade-${grade}.additions.js`);
  if (!existsSync(file)) return { lessons, replaced: [], added: { lessons: 0, activities: 0 } };

  const mod = await import(pathToFileURL(file).href);
  if (mod.grade !== grade) throw new Error(`content/grade-${grade}.additions.js declares grade ${mod.grade}`);
  const draft = Boolean(mod.siDraft);

  let out = lessons.map((l) => ({ ...l }));
  const replaced = [];
  let addedActivities = 0;

  for (const rep of mod.replacedLessons ?? []) {
    const index = out.findIndex((l) => l.id === rep.id);
    if (index === -1) throw new Error(`grade ${grade}: replacedLessons names lesson ${rep.id}, which does not exist`);
    replaced.push({
      id: rep.id,
      was: rep.replaces?.title ?? null,
      now: rep.title?.en ?? null,
      reason: rep.replaces?.reason ?? null,
      droppedActivities: out[index].activities.length,
    });
    out[index] = stamp({ ...rep, activities: rep.activities.map((a) => stamp(a, draft)) }, draft);
    addedActivities += rep.activities.length;
  }

  for (const extra of mod.additionsToExistingLessons ?? []) {
    const lesson = out.find((l) => l.id === extra.lessonId);
    if (!lesson) throw new Error(`grade ${grade}: additionsToExistingLessons names lesson ${extra.lessonId}, which does not exist`);
    const existing = new Set(lesson.activities.map((a) => a.id));
    for (const activity of extra.activities) {
      if (existing.has(activity.id)) throw new Error(`grade ${grade}: activity ${activity.id} already exists in lesson ${extra.lessonId}`);
    }
    lesson.activities = [...lesson.activities, ...extra.activities.map((a) => stamp(a, draft))];
    addedActivities += extra.activities.length;
  }

  const newLessons = (mod.lessons ?? []).map((l) => stamp({ ...l, activities: l.activities.map((a) => stamp(a, draft)) }, draft));
  addedActivities += newLessons.reduce((n, l) => n + l.activities.length, 0);

  return {
    lessons: [...out, ...newLessons],
    replaced,
    added: { lessons: newLessons.length, activities: addedActivities },
  };
}
