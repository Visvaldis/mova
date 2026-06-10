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

## Done — 2026-06-10

Designed + built `accent-atlas` as a three-tab island, following the `CLAUDE.md` › accent-atlas
spec (the task predated that spec being added — it's there now, so I built to it):

1. **Dialect map** — schematic SVG of Ukraine with the three groups (northern/Polissian,
   southwestern, southeastern) as three *tints of the one `dialects` accent* (color-mix, no
   hardcoded hex). Tap a zone → features card; a surzhyk chip opens the mixed-lect card. Caption
   states plainly the regions are schematic (the article names the groups, not isoglosses).
2. **Dialect or language?** — a continuum slider: drag a 🚩 border between villages; the verdict
   makes the article's point (the cut is political — flags, schoolbooks, armies). Below it, the
   article's four real cases (Scandinavian / Chinese / German / Ukrainian-as-"dialect"). The
   gradient is labelled an explicit metaphor, not sampled data.
3. **Shibboleth** — паляниця with the two article-named tells (и, ц) as tappable letters → tell
   cards; shows the betraying rendering (palyanitsa / палянітса) + the Biblical original.

Files: `AccentAtlas.tsx`, `accentAtlas.data.ts` (reuses NameMap's Ukraine projection),
`AccentAtlas.module.css`; chrome `accentAtlas.*` added to `ui.ts` (EN+UK); registered in
`Interactive.astro`. The `interactiveInfo['accent-atlas']` blurb already matched the build.

**UK article now exists.** `content/uk/dialects-and-accents.md` was written since this task was
filed, so the outdated note above is resolved — the UK page is live. I sourced every claim from
**both** `content/en|uk/dialects-and-accents.md` and aligned the UK strings to the authoritative
article wording (betraying form `палянітса`, pull-quote, гілеадці/єфремлян, opening line).

`TODO(seva)`: the article gives no per-dialect *sample phrases*, so the map cards show the article's
feature notes instead of inventing phrases. The only real samples (паляниця, surzhyk) live in their
own tabs/cards. Standard checklist + the extra acceptance item (conveys "dialect ≠ broken language",
claims traced) all pass; `npm run build` → 0 errors.
