import test from 'node:test';
import assert from 'node:assert/strict';
import { validate } from '../src/lib/validate.js';
import { makeLimiter } from '../src/lib/ratelimit.js';
import { D } from '../src/lib/i18n.js';

const ok = { name: 'Sara', email: 'Sara@Example.com', message: 'Hello, I like your work.' };
test('accepts valid input and normalises email', () => {
  const r = validate(ok); assert.equal(r.ok, true); assert.equal(r.data.email, 'sara@example.com');
});
test('rejects short name, bad email, short/long message', () => {
  assert.equal(validate({ ...ok, name: 'A' }).ok, false);
  assert.equal(validate({ ...ok, email: 'nope' }).ok, false);
  assert.equal(validate({ ...ok, message: 'short' }).ok, false);
  assert.equal(validate({ ...ok, message: 'x'.repeat(2001) }).ok, false);
  assert.equal(validate(null).ok, false);
});
test('honeypot is flagged as spam', () => assert.equal(validate({ ...ok, website: 'http://spam' }).spam, true));
test('control characters are stripped', () => assert.equal(validate({ ...ok, name: 'Sa\u0000ra' }).data.name, 'Sara'));
test('limiter blocks the 6th hit and recovers after the window', () => {
  const l = makeLimiter(5, 1000);
  for (let i = 0; i < 5; i++) assert.equal(l('ip', 0), false);
  assert.equal(l('ip', 10), true); assert.equal(l('ip', 2000), false);
});
test('every translation has ar/es/it', () => {
  for (const [k, v] of Object.entries(D)) assert.equal(v.length, 3, k);
});
