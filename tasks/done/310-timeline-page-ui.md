---
id: 310-timeline-page-ui
title: Build the master timeline page UI
area: feature
component:
article: (all)
depends_on: [010-interactive-foundation, 300-timeline-events-data]
order: 310
---

# Build the master timeline page UI

**Goal:** replace the placeholder on `/{lang}/timeline` with a real interactive timeline.

**Context:** spec → `CLAUDE.md` › Pages › Timeline · data → `src/data/timelineEvents.ts` (task 300) ·
page → `src/pages/[lang]/timeline.astro` (placeholder at ~L18–32) · tech → `CONVENTIONS.md`.

## Steps

1. `src/components/interactive/MasterTimeline.tsx` (prop `lang`) consuming `timelineEvents.ts`.
2. **Log-scaled** axis ~135,000 BCE → today; scrub/zoom; events as nodes colored by topic.
3. Click an event → card (title, blurb) with a link to its article (`localizedPath(lang, slug)`).
4. Replace the placeholder block in `timeline.astro`; mount with `client:visible`.
5. Chrome → `ui.ts` (`timeline.*`, extending existing keys).

## Acceptance

- See `CONVENTIONS.md` standard checklist, plus:
- [ ] Log scale legible; events clickable/keyboard-focusable and link to articles.
- [ ] Works at 375px (scrub → tap/step); reduced-motion respected.

## Notes

- Stays correct as new articles add rows to `timelineEvents.ts`.

## Done — 2026-06-10

Shipped `src/components/interactive/MasterTimeline.tsx`, mounted in `src/pages/[lang]/timeline.astro`
via `client:visible` (placeholder removed). Consumes `timelineEvents.ts`.

- **Log-scaled** SVG axis (~8M years-before-present → today) with M/k tick labels; one node per
  event, colored by topic, with a leader line so dense modern decades stay tappable.
- **Topic legend** doubles as a filter — tap a pill to isolate one topic's events.
- **Step buttons** (Earlier/Later) are the 375px scrub fallback; they skip filtered-out nodes.
- Click/Enter a node → event card (title, year via bilingual `fmtYear`, blurb) with a
  `localizedPath(lang, slug)` link to the source article.
- Chrome added to `ui.ts` under `timeline.*` (legend, axisLabel, today, logNote, prev, next,
  openArticle) in both EN and UK.

A11y/motion: nodes are `tabindex`/`role=button` with bilingual `aria-label`; step buttons labelled
from `ui.ts`; only CSS transitions used (no JS rAF), which the global `prefers-reduced-motion` rule
(`transition-duration: 0.001ms !important`) neutralizes.

`TODO(seva)`: the per-topic node colors are a small hardcoded hex map (`TOPIC_COLOR`) mirroring the
global accents — a deliberate exception to the "no hardcoded hex" convention, since this one page
shows all 18 topic accents at once and can't get them from the single `data-topic` CSS context.

Not registered in `Interactive.astro` (correct — it's a page-level component, not an article
interactive). `npm run build` → 0 errors; `/en/timeline/` and `/uk/timeline/` render.
