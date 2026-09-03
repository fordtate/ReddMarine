# Redd Marine — Builder Interview Kit: Production Plan

Companion to `NEXT STEPS - 30-Day Assignment.md`. This is the plan for the visual
props used in the 30-day builder interviews and the homeowner deposit test.

## Status — 3 Sep 2026

**Components 1 and 2 are built and shipped.** The rest of this doc is kept as the
spec they were built against; where the build differs, the build wins.

| Component | Status |
|---|---|
| 1 — Interactive app prototype (all 6 screens) | ✅ Done |
| 2 — Responsive dock lighting demo (5 layers, 6 presets) | ✅ Done, inside the prototype as planned |
| 3 — The sync video | ⬜ Not started. Nothing left to build for it — screen-record the prototype |
| 4 — Photoreal render | ⬜ Out of scope until the 30-day gate passes. Unchanged |

### Where it lives

- **Source / offline demo:** `Strategy/demo-kit/prototype.html` — one self-contained
  file, ~187 KB, zero network requests of any kind (Montserrat is embedded). This is
  the copy to open on the iPad. It does not need the site, wifi, or a signal.
- **Hosted, password-protected:** **www.reddmarine.com/kit/** — the same file, AES-GCM
  encrypted; the browser decrypts it after a correct password. Reachable from a
  discreet "Builder preview" link on the homepage.
- **Managing passwords:** **www.reddmarine.com/kit/admin.html** — admin phrase in, add
  or remove a named password, paste the file it gives you into GitHub. No terminal.
- **Republishing after a prototype edit:** `node Strategy/demo-kit/build-kit.mjs`
  with `KIT_ADMIN_PHRASE` set. See the repo README.

### Built differently from the spec, on purpose

- Every date in the kit is derived from the day it is opened, not hard-coded. The
  arc holds its shape — alert 3 days ago, repair 2 days ago, chart ending today —
  so the prop stays internally consistent across the whole interview window.
- Screen 2 puts the dock and the scene buttons side by side rather than stacked, so
  both are visible at once on the iPad. That is what makes Component 3 a plain
  screen recording with no compositing.
- `[Your Company]` is edited by clicking the chip in the top bar and typing. It
  propagates to all 8 places live and persists in that browser.
- The service-request card reads "Repaired · closeout scheduled" rather than the
  spec's "Scheduled" — the same card already logs the repair as complete.

### Still to do

- Screen-record the click-through (Component 3).
- Swap `[Your Company]` for the real business name before each meeting.
- Type the builder's real dollar figures into screen 6 during the conversation —
  every figure there is editable and everything recomputes.

---

## Sequencing rules (read first)

1. **Book at least 3 builder conversations before you start building the kit.** The
   kit serves the calls. If building it delays the first call, you've inverted the
   priority.
2. **Time-box v1 to ~3 focused days.** The clickable prototype is the must-have; the
   dock lighting layer is a strong nice-to-have; the photoreal render is explicitly
   out of scope until the 30-day gate passes.
3. **Do not write firmware or real backend code.** Everything in the kit is a
   front-end illusion with hand-authored fake data.
4. The kit is dual-purpose: builder interviews (lead with the dashboard screens) and
   the homeowner $50-deposit landing page (lead with the dock lighting).

---

## Component 1 — Interactive app prototype (must-have)

A clickable, brand-styled prototype that runs offline on a laptop or iPad. You drive
it live in the conversation. A screen recording of it becomes the follow-up video and
a chunk of the landing page.

### Screens

| # | Screen | Audience | What it proves |
|---|--------|----------|----------------|
| 1 | **The box** — one diagram: dock feed → certified ELCI breaker → Redd Marine monitor → dock loads (lights, outlets, charger). Callout: "watches leakage current, logs everything, alerts before it trips." | Both | What it is, in 10 seconds. Makes clear Redd Marine sits *on top of* a certified breaker, not replacing it. |
| 2 | **Homeowner app — home.** System status tile ("All normal" — never "safe to swim"), lighting scene buttons, a "Leaving the dock" scene. | Homeowner-lean | What the builder's client sees day to day. The hook, kept thin. |
| 3 | **Homeowner app — alert.** "Rising leakage current detected. Your installer has been notified. No action needed from you." | Both | The safety-record value with zero swim-safety claim. |
| 4 | **Builder dashboard — fleet view.** List of docks, status dots, last-check time, one red flag. | Builder | "Your book of business on one screen." |
| 5 | **Builder dashboard — one dock.** Residual-current trend chart creeping toward the ~15 mA early-warning line (well under the 30 mA trip), alert log, **service-request queue** with one open request, per-dock history (installed date, service visits, warranty status). | Builder | The service business made real. **This is the screen question 3 lives or dies on.** |
| 6 | **Builder dashboard — the money view.** "6 docks active · 4 on plans · $__/mo," shown both ways: *royalty* framing and *your-own-service-plan* framing, toggleable. | Builder | Makes the resell-vs-buy-at-margin question concrete. Watch which framing they respond to. |

### Fake-data spec

Use Wilmington / Wrightsville-area-feeling names. Swap `[Your Company]` for the
interviewee's business name before each meeting.

**Fleet (6 docks):**

| Dock | Location | Status | Notes |
|------|----------|--------|-------|
| Harborview | Wrightsville Beach | 🔴 flagged | The story dock — see trend below |
| The Selby Residence | Masonboro | 🟢 normal | Installed 14 months ago |
| Pier 12 | Banks Channel | 🟢 normal | Newest install, 2 months |
| Cormorant Point | Bald Head Island | 🟢 normal | 1 past service visit (light fixture) |
| Alvarez Dock | Middle Sound | 🟡 watch | Slightly elevated baseline, stable |
| Anchorage Lane | Hewletts Creek | 🟢 normal | — |

**The trend story (Harborview):** residual current sits at a 3–4 mA baseline for
weeks. Over ~10 days it climbs to 16 mA — crosses the 15 mA early-warning line, never
approaches the 30 mA breaker trip. Alert fires on day 8. A service request is
auto-created. The builder rolls a truck, finds a corroded bonding jumper, replaces it,
and the trend drops back to 4 mA. The chart should show the full arc: flat → climb →
alert marker → fix marker → back to flat.

**Homeowner alert copy:**
> Redd Marine noticed rising electrical leakage on your dock over the past week. Your
> installer, [Your Company], has been notified and will reach out to schedule a look.
> Your dock's safety breaker is working normally — there's nothing you need to do
> right now.

**Builder alert copy:**
> ⚠ Harborview (Wrightsville Beach) — residual-current trend crossed 15 mA over 10 days.
> Pattern looks like a degrading bond or a wet fixture, not an appliance fault.
> Auto-created service request SR-0043.

**Service queue (one open item):**
> **SR-0043 · Harborview · Wrightsville Beach** — Trend alert, opened 3 days ago.
> Status: `Scheduled` · Tech: `[Your Company]` · Homeowner notified ✓

**Money view:** "6 docks active · 4 on monitoring plans." Royalty framing: "You earn
$__/mo in monitoring royalties." Service framing: "You bill $__/mo in service plans;
Redd Marine takes $__/dock." Leave the dollar figures as editable placeholders.

### Narration script (what you say while clicking)

> "Here's the box — it sits right after the safety breaker your electrician already
> puts in, and it watches the dock's wiring. [screen 1]
>
> Day to day, your client sees this — lights, scenes, and a status light. [screen 2]
>
> Here's the part that matters. Say a bonding connection starts corroding — happens on
> every dock eventually. Weeks before the breaker would ever trip, your client gets
> this, and *you* get a call. [screens 3 → 5, point at the trend chart]
>
> And this is your side: every dock you've ever installed, monitored, in one place,
> with a service request already written up when something's off. [screen 4 → 5, the
> queue]
>
> So here's my real question. Would you rather we bill your client a monthly plan and
> cut you in — or would you rather buy the kit at a margin and run the service plan
> yourself? [screen 6, toggle the two framings]"

---

## Component 2 — Responsive dock lighting demo (strong nice-to-have)

Built **inside the prototype**, not as a separate render. A stylized dock illustration
(vector / CSS, on-brand, night scene) with independent glow layers. Tapping a lighting
preset in the app UI changes the dock on the same screen. The "app + dock
simultaneously" video the founder wants is then just a screen recording of this — no
separate production.

### Light layers (independently controllable)

1. **Deck / post lights** — warm downlights along the walkway
2. **Running / edge lights** — low path lighting at the deck edge
3. **Spreader / flood lights** — harsh white, mounted high on a piling
4. **Underwater lights** — glow in the water around and under the dock
5. **Nav markers** — red (port) and green (starboard) at the dock end

### Presets

| Preset | Deck | Edge | Spreader | Underwater | Nav |
|--------|------|------|----------|------------|-----|
| All Off | – | – | – | – | – |
| Arrival | 30% warm | on, low warm | – | – | on |
| Evening | 50% warm | on, low warm | – | on, teal | on |
| Entertain | 80% warm | on | – | on, color | on |
| Running Lights Only | – | – | – | – | on |
| Security | – | – | full white | – | – |

### Style

Night scene. Dock rendered in the brand's one-point-perspective motif (ties to the
logo). Water plane with subtle reflection of the lights. UI chrome in the Redd Marine
palette (`#EF3513` / `#141414` / `#FFF8E1`, Montserrat); the fixture light colors are
realistic (warm white, teal underwater, red/green nav), not brand-constrained.
Illustration quality, not photoreal — nobody should mistake it for a finished product.

---

## Component 3 — The sync video (falls out of Component 2)

- Screen-record the prototype: tap through 3–4 lighting presets, ~30–40 seconds.
- Light edit in CapCut / DaVinci Resolve (free): add a title card, trim, maybe a
  caption per preset.
- Uses: email follow-up after a builder meeting, the homeowner landing page hero,
  early pitch material.
- No separate animation or compositing work — the app UI and the dock are the same
  screen.

---

## Component 4 — Photoreal dock render (POST-GATE ONLY)

Explicitly **out of scope until the 30-day demand gate passes.** If it passes and you
are building the real landing page and pitch deck:

- **Cheapest good path:** render 5 still frames of one fixed camera angle (one per
  preset), then cross-fade between them in the video editor, timed to app taps. Turns
  the 3D job from "animation rig" into "5 renders of one scene with different emission
  values."
- **Tool options, fastest to most control:**

  | Tool | Effort to 5 stills | Notes |
  |------|-------------------|-------|
  | AI image gen (fixed reference + inpainting) | hours | Cheapest. Keeping the exact same dock + angle across all 5 while only lights change is the hard part. |
  | Twinmotion / D5 Render | 1–2 days | Real-time arch-viz, drag-and-drop lights + water, free tiers. Fastest to "photoreal-ish dusk dock." |
  | Blender (Eevee) | 3–5 days if skilled; +15–30 hrs to learn this scene | Free, full control. Worth it only if someone wants to learn it. Can be Claude-assisted — see below. |
  | Freelance 3D arch-viz | ~1 week turnaround, ~$300–1,500 | Best ROI if budget allows; frees the founder to make calls. |

- A fully animated photoreal render (moving camera, animated light transitions) is a
  marketing asset, not a validation asset. Later still.

---

## What NOT to build (any version)

- A working app, real charts, real auth, or anything that connects to a server.
- Sensor-internal animations beyond the single box diagram (screen 1).
- Multiple visual style variants — the brand is already set.
- Native iOS/Android apps. The prototype is web, full-screen on an iPad.
- Anything that implies the product is further along than "concept a founder is
  validating." A too-polished prop distorts the answers you're trying to collect.

---

## Tooling map

| Piece | Tool |
|-------|------|
| Screen 1 (box diagram) | gstack `/diagram` — English in, editable `.excalidraw` + SVG + PNG out |
| Screen flow / visual direction | gstack `/design` — multi-artboard canvas, publishes as an Artifact, exports PNG/PDF for the deck |
| The interactive prototype | Claude Code → a single self-contained HTML Artifact (the dock illustration lives inside it) |
| Fake data + copy | Claude Code, plain edits |
| The sync video | screen recorder (macOS: ⇧⌘5) + CapCut or DaVinci Resolve |
| Photoreal stills (post-gate) | Twinmotion / D5 / Blender / freelance — see Component 4 |
| QA pass on the prototype | gstack `/design-review` (optional, it's a throwaway prop) |

Not the right tools here: `/design-consultation` (builds a full design system — you
have a brand), `/design-shotgun` (explores visual directions — you don't need to).

---

## Build workflow with Claude Code

### Phase 0 — Prep (you, ~30 min)
- Collect 3–5 reference images: docks you like at dusk, app UIs whose feel you want,
  lighting moods. Drop them in `Strategy/demo-kit-refs/`.
- Confirm the fake scenario details above (names, the trend story, dollar placeholders).
- Decide the demo device (iPad recommended) and confirm it'll be used offline.
- Note your first builder meeting date so the build is time-boxed against it.

### Phase 1 — Box diagram (~15 min)
Run `/diagram`. Prompt: the screen-1 flow (dock feed → certified ELCI breaker → Redd
Marine monitor → loads), labelled, with the "watches leakage, logs, alerts before it
trips" callout. Save the PNG into the repo.

### Phase 2 — Screen direction (~30–45 min)
Run `/design`. Give it: this doc, the brand colors/font, the 6 screens, the refs.
Ask for artboards of screens 2–6. Iterate on layout and hierarchy only — not code.
Approve a direction.

### Phase 3 — Build the interactive prototype (~1–2 hrs of back-and-forth)
In Claude Code, ask for **a single self-contained HTML file** (an Artifact):
- All 6 screens, navigable (bottom tab bar or a screen switcher).
- Real interactivity on the parts that matter: the lighting presets change the dock
  illustration; the trend chart is a real (fake-data) SVG chart; the money view
  toggles between the two framings.
- The dock illustration with the 5 light layers and 6 presets from Component 2.
- Brand palette and Montserrat, full-screen, works offline, looks right on an iPad.
- Fake data and copy exactly as specced above.
Iterate screen by screen. Keep it one file so it's trivial to host or open locally.

### Phase 4 — Polish + fake-data pass (~30 min)
Tighten copy, spacing, the trend curve shape, the alert timing. Run `/design-review`
if you want a second pass.

### Phase 5 — Record the video (you, ~30 min)
Full-screen the prototype, screen-record a click-through of the lighting presets and
the alert-to-service-request flow. Trim in CapCut/Resolve, add a title card.

### Phase 6 — (optional, post-gate) Blender stills
Only if the gate passes and you want photoreal. See the Blender section below.

### Where it lives
The Artifact is hosted on claude.ai, but also **save the HTML file into the repo** at
`Strategy/demo-kit/prototype.html` so it's versioned and openable offline. The box
diagram and any `/design` exports go in `Strategy/demo-kit/` too.

### Which model
- **Phases 2–3 (design direction + building the interactive prototype): Opus 5.**
  Design taste and a complex single-file interactive artifact are exactly where Opus
  is worth it. `/model opus` in Claude Code, or turn on fast mode (Opus with faster
  output).
- **Phases 1, 4, 5 (diagram, copy tweaks, data): Sonnet 5** is plenty and faster.
- **Phase 6 (Blender): Opus 5** for the spatial reasoning and Python, though the
  bottleneck there is Blender setup, not the model.

---

## Can Claude drive Blender?

Yes, through an MCP server. The well-known one is **`blender-mcp`** (community project,
`ahujasid/blender-mcp`). How it works:

- You install a **Blender add-on** that opens a socket inside a running Blender.
- You register the **MCP server** with Claude Code (`claude mcp add`) or Claude
  Desktop.
- Claude can then: create and transform objects, set materials and shaders, place and
  configure lights and cameras, run arbitrary Python in Blender, and (via the add-on)
  pull free assets from PolyHaven / Sketchfab / Hyper3D.

What it's genuinely good at: scene setup, procedural work, materials and lighting
tweaks, "make 5 versions of this with different emission values," batch renders driven
by Python. What it will not do: art-direct for you, model complex organic geometry
well, or make render times shorter. You still direct; Claude executes Blender's Python.
For the 5-still dock job it's a real accelerant *if* you already have or can quickly
assemble a dock model — it's not a one-prompt "photoreal dock" button.

Practical call: for v1 (interview kit) you do not need Blender at all — the dock lives
in the HTML prototype. For v2 (post-gate photoreal), `blender-mcp` is worth setting up
if you're going the Blender route rather than Twinmotion or freelance.

Setup, when you get there:
```
# 1. In Blender: install the add-on from ahujasid/blender-mcp, enable it,
#    start the socket server from its N-panel.
# 2. Register with Claude Code:
claude mcp add blender -- uvx blender-mcp
# 3. Confirm Claude sees it, then describe the scene you want.
```
(Check the project's README for the current command — it changes.)

---

## Help me help you — what to have ready

When you're ready to build, give Claude Code, in one message:

1. **This doc** (`Strategy/Builder Interview Kit — Production Plan.md`) and the
   design doc.
2. **Reference images** in `Strategy/demo-kit-refs/` — 3–5 is enough.
3. **The brand basics restated:** `#EF3513` red, `#141414` ink, `#FFF8E1` cream,
   Montserrat; emblem at `docs/assets/img/redd-marine-emblem.png`.
4. **The device + context:** "full-screen on an iPad, used offline, I'm clicking
   through it live in a meeting."
5. **Your first builder meeting date**, so the build is time-boxed against it.
6. **Any scenario changes** — a real builder name to use, different dock names, real
   dollar figures for the money view.
7. **The model choice:** "use Opus 5 for this."

Then: "Build the interactive prototype from Component 1 and 2 of the production plan.
One self-contained HTML file. Start with screen 5 (the builder dock detail) — that's
the one that matters most."
