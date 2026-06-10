---
id: 400-playground
title: Design + build the playground
area: feature
component:
article:
depends_on: []
order: 400
---

# Design + build the playground

**Goal:** decide what "the playground" is **and** build it. Open-ended — Seva wants "something like a
playground" after the interactives and topic selection land. Design in plan mode (Seva reviews the
plan), then implement.

**Context:** the site is a museum of language-evolution interactives; a playground likely turns the
exhibits into a sandbox. Best done once several components exist so the building blocks are known.
tech → `CONVENTIONS.md`.

## Steps

1. **Design (in plan mode).** Propose a direction. Candidates:
   - A free-form **sound-change machine** (apply/compose arbitrary consonant rules to any word).
   - A **build-your-own-etymology / word-mixer** combining morphemes from `word-xray`.
   - A **"language laboratory"** hub that remixes existing interactives.
   - A **quiz arcade** aggregating the per-article quizzes.
   Pick one (or a small combination); decide route (`/{lang}/playground/`), nav entry, and scope.
   *(Optional: jot the design in `tasks/specs/playground.md`.)*
2. **Build.** Add the route under `src/pages/[lang]/playground/…` and a nav entry (`Nav.astro` +
   `ui.ts` `nav.playground`, EN+UK). Implement, **reusing existing components and `*.data.ts`** — don't
   duplicate content.

## Acceptance

- See the standard checklist in `CONVENTIONS.md`, plus:
- [ ] Nav entry localized with correct active state; reuses existing interactives/data where possible.

## Notes

- If the build turns out large, split it into follow-up `41x` tasks after the design is settled.
