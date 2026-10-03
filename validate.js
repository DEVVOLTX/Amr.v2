const EMAIL = /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/;
const clean = (s) => String(s ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();

export function validate(b) {
  if (!b || typeof b !== 'object') return { ok: false, error: 'Invalid request' };
  if (clean(b.website)) return { ok: true, spam: true }; // honeypot
  const name = clean(b.name), email = clean(b.email).toLowerCase(), message = clean(b.message);
  if (name.length < 2 || name.length > 80) return { ok: false, error: 'Name must be 2-80 characters' };
  if (email.length > 254 || !EMAIL.test(email)) return { ok: false, error: 'Invalid email' };
  if (message.length < 10 || message.length > 2000) return { ok: false, error: 'Message must be 10-2000 characters' };
  return { ok: true, data: { name, email, message } };
}
