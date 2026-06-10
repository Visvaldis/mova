---
id: 260-int-conlang-workbench
title: Build conlang-workbench interactive
area: interactive
component: conlang-workbench
article: constructed-languages
depends_on: []
order: 260
---

# Build conlang-workbench interactive

**Goal:** turn `constructed-languages` from a Placeholder into its live interactive.

**Context:** spec → `CLAUDE.md` › `conlang-workbench` · article → `content/{en,uk}/constructed-languages.md` ·
tech → `CONVENTIONS.md` · topic accent → `conlangs` (magenta).

## Steps

1. (a) **Toki Pona builder** — ~a dozen word tiles; tap to compose a phrase with a live gloss.
   Highlight the recognizable combos (jan pona = "good person" = friend [article]; telo nasa =
   "weird water" = alcohol [CLAUDE.md spec]).
2. (b) **Conlang timeline** — Lingua Ignota → Volapük → Esperanto → Klingon → Na'vi/Dothraki/Valyrian
   → Toki Pona, each with one-line fate (all dates/facts from the article).
3. (c) **Esperanto decoder** — a sentence; tap words to reveal gloss + the European root they resemble;
   a recognizability meter counts how many are guessable.

## Acceptance

- See the standard checklist in `CONVENTIONS.md`, plus:
- [ ] All three sub-tools usable in EN + UK, keyboard + mobile.
- [ ] Timeline facts trace to the article; non-article vocab (Toki Pona glosses, Esperanto sentence)
      sourced to the cited tokipona.org / Esperanto Wikipedia and flagged `TODO(seva)`.

## Notes

- The article only states jan pona; other Toki Pona glosses + the Esperanto sentence come from cited
  sources, not the article body → `TODO(seva)`.

## Done

Built the `conlang-workbench` island — three tabs, topic accent `conlangs` (magenta).

**Files**
- `src/components/interactive/ConlangWorkbench.tsx` — three-tab island (no internal lang toggle):
  - **(a) Toki Pona builder** — tap 12 word tiles to compose a phrase; live word-for-word literal
    gloss builds up; exact matches to a featured combo (`jan pona`, `telo nasa`) earn a "Known phrase"
    badge with the idiomatic meaning. Undo / Clear. Tiles + buttons are native `<button>`s (keyboard +
    mobile for free); result block is `role="status" aria-live="polite"`.
  - **(b) Conlang timeline** — Lingua Ignota → Volapük → Esperanto → Klingon → Na'vi/Dothraki/Valyrian
    → Toki Pona, each with author, date, one-line fate, and a kind-tinted dot; closes with the article's
    "built as a tool, escaped as a species" pull-quote.
  - **(c) Esperanto decoder** — tap each word to reveal gloss + the European root that gives it away;
    a recognizability meter shows how many are guessable on sight; "Reveal all" exposes the translation.
- `src/components/interactive/conlangWorkbench.data.ts` — all bilingual content, per-item `{en, uk}`.
- `src/components/interactive/ConlangWorkbench.module.css` — scoped; colours only from topic vars /
  `color-mix`, no hardcoded hex; all motion pure CSS (neutralized under reduced-motion).
- `src/i18n/ui.ts` — `conlangWorkbench.*` chrome keys (EN + UK).
- `src/components/Interactive.astro` — import + `BUILT` Set + conditional render.

**Sourcing / `TODO(seva)`** (per CLAUDE.md "no invented data")
- Timeline names/dates/fates are from the article EXCEPT two historically-verifiable additions, flagged
  inline: Volapük's creator (Schleyer — article names no creator) and Peterson's dates (2009–2013 —
  article gives none).
- Toki Pona glosses beyond `jan pona` follow the cited official word list (tokipona.org); `telo nasa` =
  alcohol is the CLAUDE.md spec example.
- The Esperanto sentence is illustrative (the article gives none); glosses/roots trace to the cited
  Esperanto Wikipedia source.

**Verify**: `npm run build` → 100 pages, 0 errors. Article frontmatter already declared
`interactive: conlang-workbench` (EN + UK).
