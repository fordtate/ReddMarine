# Redd Marine — Strategy (current)

This folder holds the current strategic thinking for Redd Marine, produced
2026-09-02 through a structured brainstorm (gstack `/office-hours`) and a
CEO-mode review (gstack `/plan-ceo-review`).

| File | What it is |
| --- | --- |
| `Redd Marine - Product Design.md` | The main design doc. Problem, demand evidence, status quo, the wedge, business shape, premises, competitive landscape, three implementation approaches (Approach A chosen), feasibility (sensing topology, MCU failsafe), budget, open questions, and the assignment. Survived 3 rounds of adversarial review. |
| `Redd Marine - CEO Review & Scope Decisions.md` | The CEO-review output. Premise challenge, inversion (ranked failure modes), the 10x vision, and 4 accepted scope decisions (business-shape resolution, builder service dashboard in v1, staged liability structure, platform-ready hardware headroom). |
| `NEXT STEPS - 30-Day Assignment.md` | The standalone action list for this month. |

## The short version

- **Product:** one box per private dock — residual-current monitoring on top of a
  certified ELCI breaker (never marketed as "safe to swim"), plus app-controlled
  lighting and load control. Sold through the dock builder, who earns a royalty and
  gets a diagnostics + service dashboard.
- **Wedge:** ship it as a software + off-the-shelf-parts system, not a custom box, so
  demand and subscription-renewal economics get tested on real docks before hardware
  capital is spent.
- **Biggest open risk:** does the recurring revenue actually recur, and is this a SaaS
  or a trade business? The 30-day builder interviews answer both.
- **Do not build firmware until builders have said yes on paper.**

## Older material

The pre-September-2026 strategy, research, and founder notes are in
`../_OUTDATED (pre-Sept-2026 strategy)/`. They are kept for reference but are
superseded by the docs here — the newer work is more rigorous about the regulatory
domain (ESDPA green-light prohibition, UL cert path), the sensing hardware (a cheap
clamp CT can't measure milliamp leakage — you need a residual-current monitor), and
the business model (thin per-unit economics point toward a trade business).
