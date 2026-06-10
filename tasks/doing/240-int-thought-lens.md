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
