---
id: 140-int-slang-decoder
title: Build the slang-decoder interactive
area: interactive
component: slang-decoder
article: internet-language
depends_on: [010-interactive-foundation]
order: 140
---

# Build the slang-decoder interactive

**Goal:** a two-part internet-language toy: era-translator + emoji-as-gesture matcher.

**Context:** spec → `CLAUDE.md` › `slang-decoder` · article → `content/{en,uk}/internet-language.md` ·
tech → `CONVENTIONS.md` · topic accent → `internet`.

## Steps

1. `src/components/interactive/SlangDecoder.tsx` (prop `lang`).
2. **(a) Translate across generations:** one sentence rendered in 1990s IRC, 2000s SMS, 2010s
   Twitter, 2020s TikTok — user flips between eras.
3. **(b) Emoji-as-gesture matcher:** drag emoji onto the function it serves (tone softener, irony
   marker, gesture replacement, emphasis) — per McCulloch. Drag needs a tap fallback (375px).
4. Works in both UI languages with Ukrainian slang equivalents (lol → лол, кек, ору) from the article.
5. Sentence variants + emoji mappings → `slangDecoder.data.ts`; chrome → `ui.ts` (`slangDecoder.*`).
6. Register in `Interactive.astro`.

## Acceptance

- See `CONVENTIONS.md` standard checklist, plus:
- [ ] Era flipping works for both EN and UK sentence sets.
- [ ] Emoji matcher gives feedback; works via tap on mobile.

## Notes

- Use only slang/examples present in the article; gaps → `TODO(seva)`.
