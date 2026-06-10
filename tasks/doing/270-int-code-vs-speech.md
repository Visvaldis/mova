---
id: 270-int-code-vs-speech
title: Build code-vs-speech interactive
area: interactive
component: code-vs-speech
article: machine-languages
depends_on: []
order: 270
---

# Build code-vs-speech interactive

**Goal:** turn `machine-languages` from a Placeholder into its live interactive.

**Context:** spec → `CLAUDE.md` › `code-vs-speech` · article → `content/{en,uk}/machine-languages.md` ·
tech → `CONVENTIONS.md` · topic accent → `machine` (graphite).

## Steps

1. **Hockett scorecard** — two columns (a Ukrainian sentence vs a Python snippet); step each design
   feature (discreteness, productivity, duality, ambiguity, lying/irony, child acquisition) and show
   pass/fail lights + a one-liner. Pass/fail verdicts all from the article.
2. **Brain panel** — a simple two-region brain SVG (language network vs multiple-demand network) that
   lights up per column. Keep the MIT (Fedorenko) result **verbatim** from the article.

## Acceptance

- See the standard checklist in `CONVENTIONS.md`, plus:
- [ ] Every design-feature verdict + the MIT result trace to the article (MIT quote verbatim).
- [ ] Scorecard + brain panel usable in EN + UK, keyboard + mobile.

## Notes

- `CLAUDE.md`: "Keep the MIT result verbatim from the article."
