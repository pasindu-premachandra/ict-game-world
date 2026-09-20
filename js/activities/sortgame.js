import { render as bucket } from './bucket.js';

// The ICT Adventure sort games are the bucket activity with a different shape:
// a flat items[] where each item names its bin, plus a bins[] carrying the
// labels, instead of bins that contain their own items.
//
// So this is an adapter, not a renderer. Reshaping and handing off means the
// two sort games stay one interaction - a fix to the chip-then-bucket
// behaviour, or to its keyboard handling, lands on both at once.
export function render(activity, onDone) {
  const buckets = activity.bins.map((bin) => ({
    name: bin.name,
    emoji: bin.emoji,
    items: activity.items.filter((item) => item.bin === bin.id).map((item) => item.name),
  }));

  return bucket({ ...activity, buckets }, onDone);
}
