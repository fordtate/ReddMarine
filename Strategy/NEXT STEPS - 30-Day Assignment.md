# Redd Marine — Next Steps (30-Day Demand Gate)

Pulled from the Product Design doc so it stands alone. The full reasoning is in
`Redd Marine - Product Design.md` and `Redd Marine - CEO Review & Scope Decisions.md`.

## The one-line version

**Do the demand test, not the build. Do not write firmware until you have builder
words on paper.**

## This month

### 1. Builder interviews (the #1 risk test)
List every dock builder / marine contractor within driving distance. Call or visit
8–10. Ask one question at a time, then stop talking:
- "When you build a high-end dock, what do you do about electrical safety and lighting
  control today?"
- "If there were one box that handled fault monitoring and lighting, would you put it
  on your quotes at roughly $1,500–2,500 installed?"
- "Would you rather resell your client a ~$15/mo monitoring plan for a cut, or buy the
  kit at a margin and run your own service plan?"

The dollar figures are placeholders to get a reaction — watch them flinch or nod.
Write down exact words. Note which **business shape** each builder leans toward
(resell-a-subscription vs buy-at-margin) — that answer decides whether Redd Marine is
a SaaS or a trade business, and a clear "trade business" answer means the design doc
gets revised before any 90-day work.

**Target:** 3 builders verbally committed to a paid pilot, written agreement in
progress (signed within 60 days is fine).

### 2. Homeowner renewal probe
Stand up a one-page site with a real **"Reserve a pilot install — $50 deposit"**
button (skip the no-commitment waitlist). Drive 15+ waterfront homeowners to it (lake
associations, local Facebook groups, a boat-ramp flyer). Ask them directly: with local
control working for free, what makes you keep paying in year two?

**Target:** ≥3 of 15 give an unprompted, specific year-two reason. ≥3 paid $50
deposits is a strong secondary signal.

### 3. Legal / liability (staged)
- Book a marine-electrical / patent attorney for a **preliminary read** on the ESD
  patent cluster and the liability posture of an alerting product. Ask specifically
  whether the "trend alerting" feature changes the liability picture vs passive
  logging. Get a quote for the full FTO opinion.
- Form the business entity.
- Open conversations with 2–3 product-liability insurance brokers. A "we won't insure
  this" is a go/no-go signal; a slow firm quote is not.

### 4. Fill in the founder budget number
The 90-day plan runs ~$11–31k (EE consult, prototype parts, on-dock unit, staged FTO,
legal doc set). If your budget for this phase is under ~$15k, staging the FTO and
legal work is mandatory and the on-dock milestone moves past 90 days.

## Kill criteria (clearly-failed outcomes)
- Fewer than 2 builders willing to commit to a paid pilot at all.
- Fewer than 2 of 15 homeowners give a specific year-two renewal reason.
- The patent read says the monitoring approach is blocked with no clean design-around.
- The EE pass shows correct residual-current sensing can't be done on an existing dock
  feed within a builder-acceptable BOM and install-labor budget.

Scheduling latency does not count against the gate — "professionals engaged + written
broker risk-appetite response" is the bar; firm quotes and the FTO opinion may trail.

## After the gate passes
Run `/plan-eng-review` (gstack) on the build plan — but only once the demand gate
passes AND the EE sensing pass has settled RCM Type A vs B. Carry two constraints into
that review: spare I/O + generic device schema (platform headroom), and the minimal
single-builder login the builder dashboard needs.
