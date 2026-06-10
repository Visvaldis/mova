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

## Done — 2026-06-10

Built the `ai-language-lab` interactive as a two-tab island (📈 Drift simulator · 🕵️ Human or AI?).

**Files**
- `src/components/interactive/AiLanguageLab.tsx` — component (prop `lang`).
- `src/components/interactive/aiLanguageLab.data.ts` — the toy drift model (`simulate`/`classify`),
  the four outcome cards (`OUTCOMES`), and the 6 quiz pairs (`QUIZ`).
- `src/components/interactive/AiLanguageLab.module.css` — scoped styles (topic vars + scoped
  green/red feedback tokens for the quiz, light + dark).
- `src/i18n/ui.ts` — added `aiLanguageLab.*` chrome strings (en + uk).
- `src/components/Interactive.astro` — registered `ai-language-lab` (placeholder no longer shows).

**Drift simulator.** Two `<input type=range>` sliders — *AI-generated text share* and *Human
innovation rate* — drive an honest toy model of a "vocabulary diversity" index across 14 generations
(`D' = D − a·K·D + r·K·(CAP−D)`; equilibrium `CAP·r/(a+r)`). Live SVG line+area chart (responsive
viewBox), baseline at "today" = 100. The end state is mapped onto the article's three named futures
— **Homogenization / Acceleration / Conservatism** — plus a **Balanced drift** middle (article's
"not mutually exclusive"). Prominent bilingual ⚠️ disclaimer: *illustrative model, not research*.
Carries the real article anchor (delve/boast/tapestry spiked after 2023).

**Quiz.** "Which one was written by AI?" — 6 pairs, click the AI sentence, get a verdict + the tell,
running score, end screen with tiered message + replay. Deterministic option order (`qi % 2`) to
avoid hydration mismatch (no `Math.random`).

**Verification**
- `npm run build` → 0 errors (58 pages). Confirmed the island SSRs on `/{en,uk}/ai-and-language/`
  (placeholder gone), renders in both languages, no raw `aiLanguageLab.*` keys leak to HTML.
- Reduced-motion: the JS line-draw (`runDraw` via rAF) is gated on `useReducedMotion` — jumps to the
  full static curve when set; sliders always update the chart live (full curve, instant). Replay
  button only shown when motion is allowed.
- A11y: native `<button>`/`<input type=range>`; bilingual `aria-label`s; outcome + tell are
  `aria-live="polite"`. Mobile: controls/options stack at 375px.

**TODO(seva)** — only illustrative, captioned content (no invented *facts*):
- The drift simulator is a teaching cartoon (no real corpus) — labeled as such in both languages.
- The 6 quiz sentence pairs are not verbatim from the article; they instantiate the article's own
  tells (AI = safe/generic/fluent, leaning on delve/boast/tapestry; human = concrete, idiosyncratic
  detail). Provenance noted at the top of `aiLanguageLab.data.ts`. UK pairs adapt the same contrast
  (the English tell-words don't carry over). If you want curated/real pairs, swap `QUIZ`.
