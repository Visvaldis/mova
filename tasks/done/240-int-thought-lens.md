---
id: 240-int-thought-lens
title: Design + build the thought-lens interactive
area: interactive
component: thought-lens
article: language-and-thought
depends_on: [010-interactive-foundation, 050-wire-topic-thought]
order: 240
---

# Design + build the thought-lens interactive

**Goal:** invent the interaction for `thought-lens` (this article post-dates `CLAUDE.md`, so there's
no spec) **and** build it. Design in plan mode (Seva reviews the plan), then implement.

**Context:** article → `content/{en,uk}/language-and-thought.md` · tech → `CONVENTIONS.md` ·
topic accent → `thought`. Title: "Does Your Language Think For You?" Themes to confirm in the article:
Ukrainian's two blues (синій/блакитний), grammatical gender steering perception (German bridges
"feminine"), absolute vs egocentric direction (an Australian language using north/south for "left"),
linguistic relativity (Boroditsky).

## Steps

1. **Design (in plan mode).** Read the article (both languages); list the concrete, article-sourced
   phenomena you can dramatize. Propose the interaction — strong candidate: **"see a scene through a
   language's grammar"** — toggle lenses (color categories / grammatical gender / ego- vs geo-centric
   direction) and watch the same scene get re-described. Surface 1–2 options if unsure. *(Optional:
   jot the chosen design in `tasks/specs/thought-lens.md`.)*
2. **Build.** Implement `src/components/interactive/ThoughtLens.tsx` (prop `lang`). Content data →
   `thoughtLens.data.ts`; chrome → `ui.ts` (`thoughtLens.*`). Register `'thought-lens'` in
   `Interactive.astro`.
3. Refine the `interactiveInfo['thought-lens']` blurb in `ui.ts` to match the real design.

## Acceptance

- See the standard checklist in `CONVENTIONS.md`, plus:
- [ ] The interaction makes a relativity phenomenon tangible; every claim traces to the article.

## Notes

- All facts from the article; gaps → `TODO(seva)`.

## Done

Built `thought-lens` as a **four-lens tabbed island** (design approved in chat; spec in
`tasks/specs/thought-lens.md`). One tight, article-sourced mini-experiment per tab:

1. **Colour** — light→dark blue gradient; a native range slider places *your* boundary, then
   "Reveal" shows English bracketing the whole strip as one word *blue* vs Ukrainian splitting
   *блакитний | синій*, with the "Russian blues" explainer.
2. **Space** — top-down table (plate, cup north of it, seated viewer, compass). Toggle ego
   (left/right) vs Guugu Yimithirr (compass) and "Change seat": the ego label flips, "north" never
   does — the article's dead-reckoning point.
3. **Gender** — line-drawing bridge; toggle German (die Brücke, fem.) vs Spanish (el puente, masc.),
   adjectives swap (*elegant, slender* ↔ *strong, towering*), with a prominent contested-research
   caveat badge.
4. **Grammar** — two fixed sentences side by side; English forces definiteness + one "blue",
   Ukrainian forces aspect (випив↔пив) + vocative (друже) + синій/блакитний. Forced tokens
   highlighted with glosses; closing line ties back to the site's own language switch.

Files: `ThoughtLens.tsx`, `thoughtLens.data.ts`, `ThoughtLens.module.css`; `thoughtLens.*` chrome +
refined card blurb in `ui.ts`; registered in `Interactive.astro`.

- `npm run build` → 0 errors (64 pages). Component logic type-clean.
- Renders + usable in `en` and `uk` (verified in built HTML: all four tabs, both languages, no
  leaked keys). All strings via `ui.ts`/`.data.ts`; topic CSS vars (light + dark).
- Motion is CSS-only (globally neutralised under `prefers-reduced-motion`) — no JS animation/hook.
- Native range + buttons, `role="tablist"`/`tab`; bilingual aria. Stacks at 375px.
- **No invented data.** Only illustrative value: the Ukrainian colour-boundary position (the article
  gives no precise number) — labelled "illustrative" in the UI, not a `TODO(seva)`.
- Not browser-verified (no Playwright/Puppeteer in repo; not installed — out of scope). Structural +
  type + HTML-render verification only; visual review left to Seva.
