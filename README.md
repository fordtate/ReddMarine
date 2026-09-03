# Redd Marine

Everything for Redd Marine in one repo: the live website, the brand package, and
the current strategy docs.

The website deploys to **www.reddmarine.com** via GitHub Pages **from the `docs/`
folder** (not the repo root).

## Folder layout

| Path | Contents | Deployed? |
| --- | --- | --- |
| `docs/` | **The entire live website.** Nothing else deploys. | ✅ yes — this is the Pages publishing source |
| `docs/index.html` | The landing page. | ✅ |
| `docs/CNAME` | Custom-domain binding for www.reddmarine.com. Must stay in `docs/`. | ✅ |
| `docs/site.webmanifest` | PWA manifest, served at `/site.webmanifest`. | ✅ |
| `docs/assets/icons/` | Favicons, apple-touch icon, PWA icons, maskable icons. | ✅ |
| `docs/assets/img/` | Site imagery (currently just the emblem). | ✅ |
| `Strategy/` | Current product design, CEO review, and 30-day next steps. | ❌ |
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

### One-time GitHub setting (already done, for reference)

Settings → Pages → Build and deployment → Source: **Deploy from a branch** →
Branch: **main**, folder: **/docs**. The custom domain (www.reddmarine.com) is set
in the same page and is what keeps `docs/CNAME` in sync.

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
