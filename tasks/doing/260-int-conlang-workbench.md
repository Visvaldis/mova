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
