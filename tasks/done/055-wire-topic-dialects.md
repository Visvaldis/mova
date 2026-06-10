---
id: 055-wire-topic-dialects
title: Wire the "dialects" topic + accent-atlas metadata
area: infra
component: accent-atlas
article: dialects-and-accents
depends_on: []
order: 55
---

# Wire the "dialects" topic + accent-atlas metadata

**Goal:** make `dialects-and-accents` render with a proper topic name, accent color, and interactive
blurb. Same recipe as `050-wire-topic-thought`, for topic `dialects` / interactive `accent-atlas`.

**Context:** article → `content/en/dialects-and-accents.md` (topic `dialects`, interactive
`accent-atlas`). ⚠️ **`content/uk/dialects-and-accents.md` is missing** — see Notes.

## Steps

1. `src/i18n/ui.ts` → `topicNames`: add `dialects: { en: 'Dialects & accents', uk: 'Діалекти й акценти' }`.
2. `src/i18n/ui.ts` → `interactiveInfo`: add an `accent-atlas` entry (icon + EN/UK title + one-line
   desc seeded from the article summary only). `250-int-accent-atlas` will refine it.
3. `src/styles/global.css`: add `[data-topic='dialects']` accent triplet in the light and dark blocks.
   Distinct hue (e.g. a warm terracotta/clay). Follow the per-topic-accent design rule.

## Acceptance

- [ ] `npm run build` → 0 errors.
- [ ] `/en/dialects-and-accents/` shows a localized topic chip + themed placeholder (light + dark).

## Notes

- **`TODO(seva)` — content gap:** `content/uk/dialects-and-accents.md` does not exist. The EN page
  works, but the language toggle EN→UK 404s for this article. Article prose is authored by hand
  (`CLAUDE.md`: do not generate article content), so this is a writing task for Seva, not an agent.
- `accent-atlas` has **no spec in `CLAUDE.md`** — `250-int-accent-atlas` designs (in plan mode) and builds it.
