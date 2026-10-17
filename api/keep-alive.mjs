// Heartbeat write so the Supabase free project does not pause after a week idle.
//
// Vercel Hobby runs each cron job at most once a day, so vercel.json has three,
// and Supabase asks for "a few user requests a day", so this is a reduction in
// risk, not a guarantee. The device-local leaderboard is what actually keeps the
// game working when the project is paused.
//
// Vercel sends Authorization: Bearer <CRON_SECRET> on each cron call once
// CRON_SECRET is set on the project; anything else is refused with a 401.

export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    console.error('keep-alive: SUPABASE_URL and SUPABASE_SECRET_KEY must both be set');
    return res.status(500).json({ ok: false });
  }

  const pingedAt = new Date().toISOString();
  try {
    const r = await fetch(`${url}/rest/v1/keepalive`, {
      method: 'POST',
      headers: {
        apikey: key,
        'content-type': 'application/json',
        prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({ id: 1, pinged_at: pingedAt }),
    });
    if (!r.ok) {
      console.error('keep-alive: Supabase answered', r.status);
      return res.status(500).json({ ok: false });
    }
  } catch (err) {
    console.error('keep-alive: request failed:', err.message);
    return res.status(500).json({ ok: false });
  }

  return res.status(200).json({ ok: true, pingedAt });
}
