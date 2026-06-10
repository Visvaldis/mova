---
id: 110-int-origins-timeline
title: Build the origins-timeline interactive
area: interactive
component: origins-timeline
article: origins-of-language
depends_on: [010-interactive-foundation]
order: 110
---

# Build the origins-timeline interactive

**Goal:** a horizontal, scrubbable deep-time timeline (log scale, ~7 Mya → today).

**Context:** spec → `CLAUDE.md` › `origins-timeline` · article → `content/{en,uk}/origins-of-language.md` ·
tech → `CONVENTIONS.md` · topic accent → `origins`.

## Steps

1. `src/components/interactive/OriginsTimeline.tsx` (prop `lang`), log-scaled axis.
2. Milestone nodes from the article: chimp-lineage split, Homo erectus, FOXP2, ~135 kya linguistic
   capacity (Miyagawa 2025), ~100 kya symbolic behavior, writing ~5.2 kya. Clicking a node opens a
   card with a 2–3 sentence explainer **pulled from the article**.
3. "Compare hypotheses" toggle: gesture-first / vocal-first / gradualist as colored bands.
4. Dates/explainers → `originsTimeline.data.ts`; chrome → `ui.ts` (`originsTimeline.*`).
5. Register in `Interactive.astro`.

## Acceptance

- See `CONVENTIONS.md` standard checklist, plus:
- [ ] Log scale legible; nodes clickable/keyboard-focusable; cards localized.
- [ ] Hypothesis bands toggle on/off. Usable at 375px (scrub → tap/step fallback).

## Notes

- Any date/claim not in the article → `TODO(seva)`.
