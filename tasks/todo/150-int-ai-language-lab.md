---
id: 150-int-ai-language-lab
title: Build the ai-language-lab interactive
area: interactive
component: ai-language-lab
article: ai-and-language
depends_on: [010-interactive-foundation]
order: 150
---

# Build the ai-language-lab interactive

**Goal:** a toy "drift simulator" + a "human or AI?" quiz.

**Context:** spec → `CLAUDE.md` › `ai-language-lab` · article → `content/{en,uk}/ai-and-language.md` ·
tech → `CONVENTIONS.md` · topic accent → `ai`.

## Steps

1. `src/components/interactive/AiLanguageLab.tsx` (prop `lang`).
2. **Drift simulator:** sliders for "AI-generated text share" and "human innovation rate"; chart
   shows vocabulary homogenization vs diversification across generations. **Label it clearly as an
   illustrative model, not research** (bilingual disclaimer).
3. **Quiz card:** "human or AI phrasing?" — 6 sentence pairs, score at the end.
4. Quiz pairs → `aiLanguageLab.data.ts`; chrome + disclaimer → `ui.ts` (`aiLanguageLab.*`).
5. Register in `Interactive.astro`.

## Acceptance

- See `CONVENTIONS.md` standard checklist, plus:
- [ ] Sliders update the chart live; disclaimer present in both languages.
- [ ] Quiz scores correctly; chart animation gated on `useReducedMotion`.

## Notes

- The simulation is illustrative (no real corpus). Sentence pairs should come from / echo the
  article; anything invented → `TODO(seva)`.
