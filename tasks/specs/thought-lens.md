# Spec — `thought-lens` (article: language-and-thought)

**Chosen design:** four-lens tabbed island, one tight article-sourced mini-experiment per tab.
Reuses the site's tabbed pattern (NameMap/AccentAtlas). Default tab: **Color**.

## Tabs

1. **Color — "the cheapest experiment you'll run on yourself."**
   A light-blue → dark-blue gradient strip. A native range slider places *your* boundary
   ("where does light blue become dark blue?"). Reveal: English brackets the whole strip as one
   word **blue**; Ukrainian splits **блакитний | синій**. Explainer = the "Russian blues" study
   (cross-boundary discrimination faster; vanishes under verbal interference; Ukrainian predicts the
   same). The exact UK split point is **illustrative** (article gives no number) — labelled as such.

2. **Space — egocentric vs. geocentric direction.**
   Top-down table: a plate, a cup placed **north** of it, a seated viewer, a compass (N up).
   Toggle **Your language** (left/right) vs **Guugu Yimithirr** (compass). A **Turn / change seat**
   button moves the viewer between the west and east edges: facing east, north is on your *left*;
   facing west, north is on your *right* — the ego label flips, "the cup is north of the plate"
   never does. That's the article's dead-reckoning point (kept even indoors, from childhood).

3. **Gender — the bridge** *(contested-research caveat badge).*
   Line-drawing bridge. Toggle **German (die Brücke, fem.)** vs **Spanish (el puente, masc.)**;
   adjectives swap — only the article's words: *elegant, slender* ↔ *strong, towering*. Prominent
   badge: never fully published / replications mixed / "love the story, check the evidence."

4. **Grammar — what your language *obliges* you to encode** (Deutscher's thesis).
   One idea, two fixed sentences side by side. **English forces:** definiteness (the/a) + one "blue".
   **Ukrainian forces:** aspect (випив↔пив), vocative (друг→друже), синій/блакитний. Forced tokens
   highlighted, each with a one-line gloss; each card also notes what it does *not* force. Closing
   line: you already ran this experiment by hitting the language switch on this page.

## Files

- `src/components/interactive/ThoughtLens.tsx` — tab shell + 4 small sub-views (prop `lang`).
- `src/components/interactive/thoughtLens.data.ts` — bilingual content (color words/explainer,
  space captions, gender adjectives + caveat, grammar sentences/glosses).
- `src/components/interactive/ThoughtLens.module.css` — scoped; topic vars. The blue gradient uses
  literal blues (the experiment's subject matter, not theme colour) — commented.
- `src/i18n/ui.ts` — `thoughtLens.*` chrome (tabs, intros, buttons, aria); refine the card blurb.
- Register `'thought-lens'` in `Interactive.astro`.

## Notes

- All motion = CSS transitions (globally neutralised under `prefers-reduced-motion`); no JS motion.
- Native `<input type=range>` + `<button>` → keyboard-accessible. Bilingual aria from `ui.ts`.
- Stacks at 375px. Every fact traces to the article; illustrative bits labelled, none invented.
