#!/usr/bin/env node
/**
 * Redd Marine — builds the encrypted interview kit for static hosting.
 *
 *   node Strategy/demo-kit/build-kit.mjs                 # re-encrypt, keep passwords
 *   node Strategy/demo-kit/build-kit.mjs --init          # fresh key + fresh passwords
 *
 * What it does
 * ------------
 * prototype.html is encrypted once, with a random 256-bit AES-GCM "content key".
 * That content key is then wrapped separately under each demo password (and under
 * the admin phrase) using PBKDF2-SHA256. docs/kit/index.html asks for a password,
 * tries each wrapped copy, and on success unwraps the content key and decrypts the
 * kit in the browser. The plaintext never sits on the server.
 *
 * Re-running without --init reuses the existing content key, so every password
 * that already works keeps working — only the payload is re-encrypted. That is
 * the normal case: you changed the prototype and want the live copy updated.
 *
 * Uses WebCrypto, the same primitives the two browser pages use, so the formats
 * cannot drift apart.
 */

import { webcrypto as crypto } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../..');
const SOURCE = resolve(HERE, 'prototype.html');
const OUT_DIR = resolve(ROOT, 'docs/kit');
const PAYLOAD = resolve(OUT_DIR, 'payload.enc');
const ACCESS = resolve(OUT_DIR, 'access.json');

const ITERATIONS = 600000;          // OWASP 2023 floor for PBKDF2-SHA256
const SALT_BYTES = 16;
const IV_BYTES = 12;

const b64 = buf => Buffer.from(buf).toString('base64');
const unb64 = s => new Uint8Array(Buffer.from(s, 'base64'));
const rand = n => crypto.getRandomValues(new Uint8Array(n));

async function deriveWrappingKey(password, salt) {
  const base = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/** Wrap the raw content key under one password. */
async function wrapUnder(password, rawContentKey) {
  const salt = rand(SALT_BYTES);
  const iv = rand(IV_BYTES);
  const wrappingKey = await deriveWrappingKey(password, salt);
  const key = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, wrappingKey, rawContentKey);
  return { salt: b64(salt), iv: b64(iv), key: b64(key) };
}

/** Recover the raw content key from an existing entry — used on re-encrypt. */
async function unwrapWith(password, entry) {
  const wrappingKey = await deriveWrappingKey(password, unb64(entry.salt));
  return new Uint8Array(await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: unb64(entry.iv) }, wrappingKey, unb64(entry.key)
  ));
}

/**
 * payload.enc sits in a public repo, so a password is the only thing between a
 * stranger and the kit. The attacker gets the file and can grind offline, so the
 * password's own entropy has to carry the weight — PBKDF2 only slows the grind,
 * it does not stop it.
 *
 * Crockford-style base32 minus the characters people mistype (i, l, o, u, 0, 1):
 * 30 symbols, ~4.9 bits each. 12 characters is ~59 bits, 16 is ~78. Both are far
 * out of reach of an offline GPU attack, and both are short enough to text to a
 * builder or type on an iPad.
 */
const ALPHABET = '23456789abcdefghjkmnpqrstvwxyz';

function code(chars) {
  // rejection sampling — a plain % over 256 would bias the first 16 symbols
  const out = [];
  while (out.length < chars) {
    for (const b of crypto.getRandomValues(new Uint8Array(chars * 2))) {
      if (b >= 240) continue;                 // 240 = 8 * 30, the largest clean multiple
      out.push(ALPHABET[b % ALPHABET.length]);
      if (out.length === chars) break;
    }
  }
  return out.join('').replace(/(.{4})(?=.)/g, '$1-');
}

async function main() {
  const init = process.argv.includes('--init');

  if (!existsSync(SOURCE)) throw new Error('missing ' + SOURCE);
  await mkdir(OUT_DIR, { recursive: true });

  const html = await readFile(SOURCE);
  let access, rawContentKey, seeded = null;

  if (!init && existsSync(ACCESS)) {
    // Re-encrypt in place: recover the existing content key so every live
    // password keeps working.
    access = JSON.parse(await readFile(ACCESS, 'utf8'));
    const phrase = process.env.KIT_ADMIN_PHRASE;
    if (!phrase) {
      throw new Error(
        'access.json exists, so the content key has to be recovered to keep the\n' +
        'current passwords working. Re-run with the admin phrase:\n\n' +
        '  KIT_ADMIN_PHRASE="your-phrase" node Strategy/demo-kit/build-kit.mjs\n\n' +
        'Or pass --init to start over with a new key and new passwords (every\n' +
        'password already handed out stops working).'
      );
    }
    rawContentKey = await unwrapWith(phrase, access.admin);
    console.log('Recovered the content key; %d password(s) preserved.', access.entries.length);
  } else {
    rawContentKey = rand(32);
    const demo  = code(12);   // ~59 bits
    const admin = code(16);   // ~78 bits
    access = {
      version: 1,
      note: 'Wrapped keys only. Editable through kit/admin.html — no terminal needed.',
      payload: 'payload.enc',
      cipher: 'AES-GCM',
      kdf: { name: 'PBKDF2', hash: 'SHA-256', iterations: ITERATIONS, keyLength: 256 },
      admin: await wrapUnder(admin, rawContentKey),
      entries: [{
        label: 'Demo — first builder meetings',
        added: new Date().toISOString().slice(0, 10),
        ...await wrapUnder(demo, rawContentKey),
      }],
    };
    seeded = { demo, admin };
  }

  // Encrypt the kit itself under the content key.
  const contentKey = await crypto.subtle.importKey(
    'raw', rawContentKey, 'AES-GCM', false, ['encrypt']
  );
  const iv = rand(IV_BYTES);
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, contentKey, html);

  // payload.enc = IV || ciphertext+tag
  const out = new Uint8Array(IV_BYTES + ct.byteLength);
  out.set(iv, 0);
  out.set(new Uint8Array(ct), IV_BYTES);

  await writeFile(PAYLOAD, out);
  await writeFile(ACCESS, JSON.stringify(access, null, 2) + '\n');

  console.log('payload.enc  %d KB (from %d KB of HTML)',
    Math.round(out.length / 1024), Math.round(html.length / 1024));
  console.log('access.json  %d password(s) + 1 admin phrase', access.entries.length);

  if (seeded) {
    console.log('\n──────── WRITE THESE DOWN — they are not recoverable ────────');
    console.log('  demo password : %s', seeded.demo);
    console.log('  admin phrase  : %s', seeded.admin);
    console.log('────────────────────────────────────────────────────────────');
  }
}

main().catch(e => { console.error('\n' + e.message); process.exit(1); });
