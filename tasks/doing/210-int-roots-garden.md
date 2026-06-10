---
id: 210-int-roots-garden
title: Build the roots-garden interactive
area: interactive
component: roots-garden
article: ukrainian-word-origins
depends_on: [010-interactive-foundation]
order: 210
---

# Build the roots-garden interactive

**Goal:** a "stratigraphy" of Ukrainian vocabulary by historical layer.

**Context:** spec → `CLAUDE.md` › `roots-garden` · article →
`content/{en,uk}/ukrainian-word-origins.md` · tech → `CONVENTIONS.md` · topic accent → `roots`.

## Steps

1. `src/components/interactive/RootsGarden.tsx` (prop `lang`).
2. Ukrainian words as cards sorted into animated layers: Proto-Indo-European core → Proto-Slavic →
   Greek/church → Turkic → German-via-Polish → coined 19th c. → English 21st c.
3. Tap a word → origin-story card with a route mini-map.
4. Special "birth certificate" treatment for **мрія** (author, date, source verb — from the article).
5. Tappable sentence **"козак на майдані п'є каву під дахом"** — each word lights up its layer.
6. Words + layers + stories → `rootsGarden.data.ts`; chrome → `ui.ts` (`rootsGarden.*`).
7. Register in `Interactive.astro`.

## Acceptance

- See `CONVENTIONS.md` standard checklist, plus:
- [ ] Words sort into the correct layers (animation gated on reduced-motion).
- [ ] мрія birth-certificate + the tappable sentence work; usable at 375px.

## Notes

- Layer assignments / мрія details must come from the article; gaps → `TODO(seva)`.
