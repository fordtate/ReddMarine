# Redd Marine

Everything for Redd Marine in one repo: the live website, the brand package, and
the current strategy docs.

The website deploys to **www.reddmarine.com** via GitHub Pages **from the `docs/`
folder** (not the repo root).

> **Pages source — verify before assuming.** This README previously stated the
> `/docs` setting was already applied; it was not. The live site was being served
> from the repo root. Settings → Pages is the only source of truth. If a change
> under `docs/` does not appear on the live site, check that setting first.

## Folder layout

| Path | Contents | Deployed? |
| --- | --- | --- |
| `docs/` | **The entire live website.** Nothing else deploys. | ✅ yes — this is the Pages publishing source |
| `docs/index.html` | The landing page. | ✅ |
| `docs/CNAME` | Custom-domain binding for www.reddmarine.com. Must stay in `docs/`. | ✅ |
| `docs/site.webmanifest` | PWA manifest, served at `/site.webmanifest`. | ✅ |
| `docs/assets/icons/` | Favicons, apple-touch icon, PWA icons, maskable icons. | ✅ |
| `docs/assets/img/` | Site imagery (currently just the emblem). | ✅ |
| `docs/kit/` | The builder interview kit, encrypted behind a password. `index.html` is the gate, `admin.html` manages who has a password, `payload.enc` is the encrypted kit, `access.json` holds the wrapped keys. | ✅ |
| `Strategy/` | Current product design, CEO review, 30-day next steps, and the interview-kit production plan. | ❌ |
| `Strategy/demo-kit/` | The kit's plaintext source: `prototype.html` (open it directly for an offline demo) and `build-kit.mjs`, which encrypts it into `docs/kit/`. | ❌ |
| `ReddMarine Brand Package/` | The finished brand deliverable — logos, app icons, favicon set, social assets, brand guide. Source of record for all marks. | ❌ |
| `Branding Source Concepts/` | Early concept art the final marks were built from. Reference only. | ❌ |
| `_OUTDATED (pre-Sept-2026 strategy)/` | Superseded research and founder notes. See the README inside it. | ❌ |
| `_ARCHIVE/` | Old website drafts and scratch renders. Git-ignored. | ❌ |

Because only `docs/` deploys, every non-website folder above is version-controlled
but never published.

## Deploying a website change

1. Edit files under `docs/` only.
2. `git add docs` — this stages the website change and nothing else.
3. `git commit -m "Site: <what changed>"` and `git push`.
4. GitHub Pages rebuilds automatically (~1 min). No build step, no workflow.

That's the whole loop. `git status` for a site edit shows only `docs/…` paths.

### The GitHub Pages setting

Settings → Pages → Build and deployment → Source: **Deploy from a branch** →
Branch: **main**, folder: **/docs**. The custom domain (www.reddmarine.com) is set
in the same page and is what keeps `docs/CNAME` in sync.

Set to `/docs` on 2026-09-03. Before that the site was served from the repo root,
which is why the root `index.html` was the live page for a while even though this
README claimed otherwise.

## The builder interview kit

`Strategy/demo-kit/prototype.html` is the source: one self-contained file, no
network of any kind, meant to be opened full-screen on an iPad in a builder
meeting. Keep a local copy for demos — it is the offline path and does not need
the site to be up.

The hosted copy at **www.reddmarine.com/kit/** is the same file, AES-GCM encrypted
under a random content key. Each password holds its own PBKDF2-wrapped copy of
that key, so passwords can be added and removed without re-encrypting anything.

**After editing the prototype**, republish it:

```
KIT_ADMIN_PHRASE="<your admin phrase>" node Strategy/demo-kit/build-kit.mjs
git add docs/kit && git commit -m "Kit: <what changed>" && git push
```

Passing the admin phrase keeps every password that is already handed out working.
`--init` instead generates a new content key and new passwords, which invalidates
every password already given to a builder.

**To manage passwords**, no terminal: go to **www.reddmarine.com/kit/admin.html**
and enter the admin phrase. That opens a management screen listing every password
in the clear, each one editable — change the password, rename who it is for, add
one, remove one, or rotate the admin phrase itself. Then paste the file it builds
over `docs/kit/access.json` in the GitHub web UI. The page lists the exact clicks.

Wrapping a key is one-way, so a wrapped password could never be read back. To make
them readable, `access.json` also carries a **vault**: a second random key wrapped
under the admin phrase alone, with each password encrypted under it. So the admin
phrase reveals every password, a demo password unwraps the kit but not the vault,
and anyone with neither sees only ciphertext.

To rotate the admin phrase from the terminal instead:

```
KIT_ADMIN_PHRASE="old" KIT_NEW_ADMIN_PHRASE="new" \
  node Strategy/demo-kit/build-kit.mjs --set-admin
```

## Site asset map

Everything the site loads, and where it's referenced:

| File | Referenced by | Purpose |
| --- | --- | --- |
| `docs/assets/icons/favicon.ico` | `index.html` | Legacy multi-size favicon (16/32/48). |
| `docs/assets/icons/favicon.svg` | `index.html` | Modern scalable favicon. |
| `docs/assets/icons/favicon-16.png` `favicon-32.png` | `index.html` | PNG favicon fallbacks. |
| `docs/assets/icons/favicon-48.png` | (bundled in `.ico`) | Kept with the set; not linked directly. |
| `docs/assets/icons/apple-touch-icon-180.png` | `index.html` | iOS home-screen icon. |
| `docs/assets/icons/icon-192.png` `icon-512.png` | `site.webmanifest` | PWA icons (`purpose: any`). |
| `docs/assets/icons/maskable-192.png` `maskable-512.png` | `site.webmanifest` | PWA icons (`purpose: maskable`). |
| `docs/assets/img/redd-marine-emblem.png` | `index.html` | The emblem shown on the splash page. |

All references use root-absolute paths (`/assets/...`, `/site.webmanifest`), so they
resolve from any URL on the domain.

### Icon source of record

`docs/assets/icons/` is a deploy copy. The authoritative versions live in
`ReddMarine Brand Package/03 Favicon & Web/`. If icons are regenerated, update the
brand package first, then copy the changed files into `docs/assets/icons/`.

## Brand colors

Primary red `#EF3513` on ink `#141414` with cream `#FFF8E1`. Full spec:
`ReddMarine Brand Package/brand-colors.txt`.
