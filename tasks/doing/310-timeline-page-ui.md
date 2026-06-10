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
