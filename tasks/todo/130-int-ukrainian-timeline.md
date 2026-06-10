---
id: 130-int-ukrainian-timeline
title: Build the ukrainian-timeline interactive
area: interactive
component: ukrainian-timeline
article: ukrainian-language-history
depends_on: [010-interactive-foundation]
order: 130
---

# Build the ukrainian-timeline interactive

**Goal:** a vertical, scroll-driven timeline of Ukrainian, ~860 CE → today.

**Context:** spec → `CLAUDE.md` › `ukrainian-timeline` · article →
`content/{en,uk}/ukrainian-language-history.md` · tech → `CONVENTIONS.md` · topic accent → `ukrainian`.

## Steps

1. `src/components/interactive/UkrainianTimeline.tsx` (prop `lang`), vertical scroll-driven era cards.
2. Eras from the article: Kyivan Rus / Old East Slavic, Galicia-Volhynia, Lithuanian-Polish era,
   Kotliarevsky's *Eneida* (1798), Shevchenko, **Valuev Circular (1863)** & **Ems Ukaz (1876)** as
   "ban" markers, korenizatsiia, Executed Renaissance, Soviet russification, 1989/1991 official
   status, post-2014 and post-2022 revival.
3. Each era card carries a **sample text snippet** of that period's language (from the article).
4. Bans rendered visually distinct (red strikethrough motif). Small line chart of speakers/status.
5. Era data + snippets → `ukrainianTimeline.data.ts`; chrome → `ui.ts` (`ukrainianTimeline.*`).
6. Register in `Interactive.astro`.

## Acceptance

- See `CONVENTIONS.md` standard checklist, plus:
- [ ] Bans visually distinct; era snippets shown; speaker chart renders.
- [ ] Scroll-driven behavior degrades to tap/step at 375px; `prefers-reduced-motion` respected.

## Notes

- Speaker/status numbers not in the article → `TODO(seva)`.
