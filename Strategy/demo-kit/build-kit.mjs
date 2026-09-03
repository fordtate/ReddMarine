#!/usr/bin/env node
/**
 * Redd Marine — builds the encrypted interview kit for static hosting.
 *
 *   node build-kit.mjs --init                     fresh key, fresh passwords
 *   KIT_ADMIN_PHRASE=... node build-kit.mjs       re-encrypt, keep passwords
 *   KIT_ADMIN_PHRASE=... KIT_NEW_ADMIN_PHRASE=... node build-kit.mjs --set-admin
 *
 * How it works
 * ------------
 * prototype.html is encrypted once under a random 256-bit AES-GCM "content key".
 * That content key is never stored on its own — only as one PBKDF2-SHA256-wrapped
 * copy per password. docs/kit/index.html asks for a password, tries each wrapped
 * copy, unwraps the content key and decrypts the kit in the browser. The plaintext
 * never sits on the server and the password never leaves the device.
 *
 * The vault (v2)
 * --------------
 * Wrapping is one-way, so the admin page could never show you an existing
 * password. A second random key — the vault key — is wrapped under the admin
 * phrase alone, and each entry carries its password encrypted under it. Unlocking
 * with the admin phrase therefore reveals every password for editing. Anyone
 * without the admin phrase sees only ciphertext, and a demo password unwraps the
 * content key but not the vault.
 *
 * Uses WebCrypto, the same primitives the browser pages use, so the formats
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
const enc = new TextEncoder();
const dec = new TextDecoder();

async function deriveWrappingKey(password, salt) {
  const base = await crypto.subtle.importKey(
    'raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
  );
}

/** Wrap raw key bytes under a password. */
async function wrapUnder(password, rawKey) {
  const salt = rand(SALT_BYTES), iv = rand(IV_BYTES);
  const wk = await deriveWrappingKey(password, salt);
  const key = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, wk, rawKey);
  return { salt: b64(salt), iv: b64(iv), key: b64(key) };
}

/** Recover raw key bytes from a wrapped record. */
async function unwrapWith(password, rec) {
  const wk = await deriveWrappingKey(password, unb64(rec.salt));
  return new Uint8Array(await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: unb64(rec.iv) }, wk, unb64(rec.key)
  ));
}

/** Store a password inside the vault, so the admin page can show it later. */
async function seal(vaultKey, text) {
  const iv = rand(IV_BYTES);
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, vaultKey, enc.encode(text));
  return { iv: b64(iv), ct: b64(ct) };
}

async function importVaultKey(raw) {
  return crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

/** Readable default for a seeded password. Short on purpose — see the README. */
const ALPHABET = '23456789abcdefghjkmnpqrstvwxyz';
function code(chars) {
  const out = [];
  while (out.length < chars) {
    // rejection sampling — a plain % over 256 would bias the first 16 symbols
    for (const b of crypto.getRandomValues(new Uint8Array(chars * 2))) {
      if (b >= 240) continue;              // 240 = 8 * 30, the largest clean multiple
      out.push(ALPHABET[b % ALPHABET.length]);
      if (out.length === chars) break;
    }
  }
  return out.join('').replace(/(.{4})(?=.)/g, '$1-');
}

async function main() {
  const init = process.argv.includes('--init');
  const setAdmin = process.argv.includes('--set-admin');
  const phrase = process.env.KIT_ADMIN_PHRASE;
  const newPhrase = process.env.KIT_NEW_ADMIN_PHRASE;

  if (!existsSync(SOURCE)) throw new Error('missing ' + SOURCE);
  await mkdir(OUT_DIR, { recursive: true });

  const html = await readFile(SOURCE);
  let access, contentRaw, vaultRaw, seeded = null;

  if (!init && existsSync(ACCESS)) {
    access = JSON.parse(await readFile(ACCESS, 'utf8'));
    if (!phrase) {
      throw new Error(
        'access.json exists, so the content key has to be recovered to keep the\n' +
        'current passwords working. Re-run with the admin phrase:\n\n' +
        '  KIT_ADMIN_PHRASE="your-phrase" node Strategy/demo-kit/build-kit.mjs\n\n' +
        'Or pass --init to start over with a new key and new passwords (every\n' +
        'password already handed out stops working).'
      );
    }
    contentRaw = await unwrapWith(phrase, access.admin);

    if (access.vault) {
      vaultRaw = await unwrapWith(phrase, access.vault);
    } else {
      // upgrading a v1 file: mint a vault, but the old passwords were never
      // recorded, so they stay unreadable until they are changed
      vaultRaw = rand(32);
      console.log('Upgrading to v2: added a vault. Existing passwords still work,');
      console.log('but cannot be displayed — they were never stored. Set new ones');
      console.log('in admin.html to make them visible.');
    }
    console.log('Recovered the content key; %d password(s) preserved.', access.entries.length);
  } else {
    contentRaw = rand(32);
    vaultRaw = rand(32);
    const vk = await importVaultKey(vaultRaw);
    const demo = process.env.KIT_DEMO_PASSWORD || code(12);
    const admin = newPhrase || process.env.KIT_ADMIN_PHRASE || code(16);
    access = {
      version: 2,
      note: 'Wrapped keys only. Managed through kit/admin.html — no terminal needed.',
      payload: 'payload.enc',
      cipher: 'AES-GCM',
      kdf: { name: 'PBKDF2', hash: 'SHA-256', iterations: ITERATIONS, keyLength: 256 },
      admin: await wrapUnder(admin, contentRaw),
      vault: await wrapUnder(admin, vaultRaw),
      entries: [{
        label: 'Demo — first builder meetings',
        added: new Date().toISOString().slice(0, 10),
        ...await wrapUnder(demo, contentRaw),
        secret: await seal(vk, demo),
      }],
    };
    seeded = { demo, admin };
  }

  if (setAdmin) {
    if (!newPhrase) throw new Error('--set-admin needs KIT_NEW_ADMIN_PHRASE set.');
    access.admin = await wrapUnder(newPhrase, contentRaw);
    access.vault = await wrapUnder(newPhrase, vaultRaw);
    access.version = 2;
    console.log('Admin phrase changed. Demo passwords are untouched.');
  } else if (!access.vault) {
    access.vault = await wrapUnder(phrase, vaultRaw);
    access.version = 2;
  }

  // Encrypt the kit itself under the content key.
  const contentKey = await crypto.subtle.importKey('raw', contentRaw, 'AES-GCM', false, ['encrypt']);
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
  console.log('access.json  v%d · %d password(s) + 1 admin phrase',
    access.version, access.entries.length);

  if (seeded) {
    console.log('\n──────── WRITE THESE DOWN ────────');
    console.log('  demo password : %s', seeded.demo);
    console.log('  admin phrase  : %s', seeded.admin);
    console.log('──────────────────────────────────');
  }
}

main().catch(e => { console.error('\n' + e.message); process.exit(1); });
