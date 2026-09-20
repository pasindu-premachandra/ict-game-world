// Daily ping so the Supabase free project does not pause after a week idle.
//
// Vercel Hobby allows one cron run a day and no more, and Supabase asks for
// "a few user requests a day", so this is a reduction in risk, not a guarantee.
// The device-local leaderboard is what actually keeps the game working when the
// project is paused.
//
// Vercel sends cron requests with the vercel-cron/1.0 user agent; anything else
// is refused so the endpoint is not a free proxy to the database.

export default async function handler(req, res) {
  const isCron = (req.headers['user-agent'] || '').startsWith('vercel-cron/');
  const secret = process.env.CRON_SECRET;
  const authorised = isCron || (secret && req.headers.authorization === `Bearer ${secret}`);

  if (!authorised) return res.status(401).json({ error: 'not a cron request' });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return res.status(200).json({ ok: true, skipped: 'supabase not configured yet' });

  try {
    const r = await fetch(`${url}/rest/v1/leaderboard_grade?select=grade&limit=1`, {
      headers: { apikey: key, authorization: `Bearer ${key}` },
    });
    return res.status(200).json({ ok: r.ok, status: r.status, at: new Date().toISOString() });
  } catch (err) {
    return res.status(200).json({ ok: false, error: String(err), at: new Date().toISOString() });
  }
}
