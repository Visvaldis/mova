---
id: 250-int-accent-atlas
title: Design + build the accent-atlas interactive
area: interactive
component: accent-atlas
article: dialects-and-accents
depends_on: [010-interactive-foundation, 055-wire-topic-dialects]
order: 250
---

# Design + build the accent-atlas interactive

**Goal:** invent the interaction for `accent-atlas` (no `CLAUDE.md` spec) **and** build it. Design in
plan mode (Seva reviews), then implement.

**Context:** article → `content/en/dialects-and-accents.md` (⚠️ **no UK version yet** — the component
is still built bilingual via the `lang` prop; the UK *page* won't exist until Seva writes the UK
article) · tech → `CONVENTIONS.md` · topic accent → `dialects`. Themes: "a language is a dialect with
an army and navy", everyone has an accent, no dialect is "broken grammar", dialect continua /
isoglosses, and **паляниця** as a shibboleth.

## Steps

1. **Design (in plan mode).** Read the EN article; list concrete, article-sourced hooks. Propose the
   interaction — candidates: a **"dialect vs language" slider** that reframes the same variety as
   politics shifts; a **shibboleth tester** (паляниця & friends); an **isogloss map** where toggling
   features redraws the "language" borders. Surface 1–2 options. *(Optional: jot it in
   `tasks/specs/accent-atlas.md`.)*
2. **Build.** Implement `src/components/interactive/AccentAtlas.tsx` (prop `lang`). Content data →
   `accentAtlas.data.ts`; chrome → `ui.ts` (`accentAtlas.*`). Register `'accent-atlas'` in
   `Interactive.astro`.
3. Refine the `interactiveInfo['accent-atlas']` blurb in `ui.ts`.

## Acceptance

- See the standard checklist in `CONVENTIONS.md`, plus:
- [ ] The interaction conveys the "dialect ≠ broken language" point; claims trace to the article.

## Notes

- `TODO(seva)`: `content/uk/dialects-and-accents.md` is missing — the EN page works; the UK page (and
  the toggle to it) won't until the UK article is written by hand.
