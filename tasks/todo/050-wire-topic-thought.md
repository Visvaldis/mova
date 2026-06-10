---
id: 050-wire-topic-thought
title: Wire the "thought" topic + thought-lens metadata
area: infra
component: thought-lens
article: language-and-thought
depends_on: []
order: 50
---

# Wire the "thought" topic + thought-lens metadata

**Goal:** make `language-and-thought` render with a proper topic name, accent color, and interactive
blurb (it currently falls back to a generic accent, `✦` icon, and the raw topic id).

**Context:** article → `content/{en,uk}/language-and-thought.md` (topic `thought`, interactive
`thought-lens`; both EN+UK present). This article was added after the original 14 and is unwired.

## Steps

1. **`src/i18n/ui.ts` → `topicNames`**: add `thought: { en: 'Language & thought', uk: 'Мова й мислення' }`
   (tune wording to taste).
2. **`src/i18n/ui.ts` → `interactiveInfo`**: add a `thought-lens` entry — icon + EN/UK title + a
   one-line `desc` describing what the (future) component does. Seed the desc from the article
   **summary** only (no invented facts); `240-int-thought-lens` will refine it.
3. **`src/styles/global.css`**: add `[data-topic='thought']` accent triplet (`--accent`,
   `--accent-soft`, `--accent-2`) in both the light block (~L43–56) and the dark block (~L72–85).
   Pick a hue that doesn't collide with neighbors (sound=violet, names=indigo) — e.g. a cool
   blue-violet/periwinkle. Follow the per-topic-accent design rule in `CLAUDE.md`.

## Acceptance

- [ ] `npm run build` → 0 errors.
- [ ] `/en/language-and-thought/` and `/uk/language-and-thought/` show a localized topic chip and a
      themed placeholder (no `✦`, no raw `thought` string), correct in light + dark.

## Notes

- `thought-lens` has **no spec in `CLAUDE.md`** — `240-int-thought-lens` designs (in plan mode) and builds it.
