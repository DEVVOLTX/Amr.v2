import { makeLimiter } from '../../../lib/ratelimit.js';
import { validate } from '../../../lib/validate.js';

export const runtime = 'nodejs';
const limited = makeLimiter();
const json = (b, s = 200) => Response.json(b, { status: s, headers: { 'Cache-Control': 'no-store' } });

export async function POST(req) {
  const site = process.env.SITE_URL, origin = req.headers.get('origin');
  if (site && origin && origin !== site) return json({ error: 'Forbidden' }, 403);
  if (!(req.headers.get('content-type') || '').startsWith('application/json')) return json({ error: 'Unsupported' }, 415);
  const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
  if (limited(ip)) return json({ error: 'Too many requests. Try later.' }, 429);
  const raw = await req.text();
  if (raw.length > 10000) return json({ error: 'Too large' }, 413);
  let body; try { body = JSON.parse(raw); } catch { return json({ error: 'Invalid JSON' }, 400); }
  const r = validate(body);
  if (!r.ok) return json({ error: r.error }, 400);
  if (r.spam) return json({ ok: true });
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return json({ error: 'Server not configured' }, 500);
  const { createClient } = await import('@supabase/supabase-js');
  const { error } = await createClient(url, key, { auth: { persistSession: false } }).from('messages').insert(r.data);
  if (error) { console.error('supabase:', error.message); return json({ error: 'Could not save message' }, 500); }
  return json({ ok: true }, 201);
}
