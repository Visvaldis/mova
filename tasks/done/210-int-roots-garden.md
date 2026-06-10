---
id: 210-int-roots-garden
title: Build the roots-garden interactive
area: interactive
component: roots-garden
article: ukrainian-word-origins
depends_on: [010-interactive-foundation]
order: 210
---

# Build the roots-garden interactive

**Goal:** a "stratigraphy" of Ukrainian vocabulary by historical layer.

**Context:** spec → `CLAUDE.md` › `roots-garden` · article →
`content/{en,uk}/ukrainian-word-origins.md` · tech → `CONVENTIONS.md` · topic accent → `roots`.

## Steps

1. `src/components/interactive/RootsGarden.tsx` (prop `lang`).
2. Ukrainian words as cards sorted into animated layers: Proto-Indo-European core → Proto-Slavic →
   Greek/church → Turkic → German-via-Polish → coined 19th c. → English 21st c.
3. Tap a word → origin-story card with a route mini-map.
4. Special "birth certificate" treatment for **мрія** (author, date, source verb — from the article).
5. Tappable sentence **"козак на майдані п'є каву під дахом"** — each word lights up its layer.
6. Words + layers + stories → `rootsGarden.data.ts`; chrome → `ui.ts` (`rootsGarden.*`).
7. Register in `Interactive.astro`.

## Acceptance

- See `CONVENTIONS.md` standard checklist, plus:
- [ ] Words sort into the correct layers (animation gated on reduced-motion).
- [ ] мрія birth-certificate + the tappable sentence work; usable at 375px.

## Notes

- Layer assignments / мрія details must come from the article; gaps → `TODO(seva)`.

## Done — 2026-06-10

Built the `roots-garden` interactive as a two-tab island.

**Files**

- `src/components/interactive/RootsGarden.tsx` — new. Tab 1 *Stratigraphy*: seven
  historical layers stacked newest-on-top (sediment metaphor), each tinted by depth via
  `color-mix(var(--accent-soft), var(--bg))`; word chips settle in with a staggered CSS
  animation. A **Re-sort** button replays the settle by remounting (keyed). Tap a chip →
  detail panel with origin/story + a **route mini-map** (shared `lib/geo` `project()` /
  `WORLD_PATH`, cropped to a Eurasia viewBox, arcs source→[via]→Ukraine). мрія gets a
  dedicated **birth-certificate** card (author / date / source verb + meaning + the An-225
  note). Tab 2 *Four empires, one phrase*: the tappable sentence **козак на майдані п'є
  каву під дахом** — each word lights up its layer (borrowed = accent fill, native frame =
  dotted/muted), with a per-word note (aria-live) and a layer legend.
- `src/components/interactive/rootsGarden.data.ts` — new. `LAYERS` (7), `WORDS`
  (article-sourced), `SENTENCE`, `UKRAINE` constant. Every word / origin / date traces to
  the article (header comment lists the anchors).
- `src/components/interactive/RootsGarden.module.css` — new. Scoped; topic vars +
  `color-mix` only, no hardcoded hex. All motion is pure CSS (settle / drop / draw) →
  neutralized by the global `prefers-reduced-motion` rule.
- `src/i18n/ui.ts` — added the `rootsGarden.*` chrome block (en + uk).
- `src/components/Interactive.astro` — imported + registered `roots-garden`; added to `BUILT`.

**Verification**

- `npm run build` → 0 errors (60 pages). `tsc --noEmit` → no errors in the new files
  (the single remaining error is pre-existing in `aiLanguageLab.data.ts`).
- Placeholder gone on both `/en/` and `/uk/ukrainian-word-origins/`; strata + мрія render.
- Topic vars (roots) used throughout → correct in light & dark; keyboard-navigable
  (all controls are `<button>`); panel / cert collapse to one column ≤520px (375px OK).

**`TODO(seva)`**

- **English (21st-c.) layer has no word-cards** — the article mentions "a modern flood of
  English" but names no specific loanwords. The layer renders its blurb + an honest
  "no examples in the article" note. Add article-sourced 21st-c. English borrowings if the
  prose gains any.
- **кава in the sentence** is one of the article's "four empires" but the article does not
  etymologise it; tagged Turkic (Ottoman *kahve*) as the immediate donor and
  cross-referenced to the traveling-words article. Confirm the layer you want shown.
- Layer split for the inherited core (PIE vs Proto-Slavic) follows the article's explicit
  cues (мати = PIE *méh₂tēr; вирій / ведмідь = Slavic; жито → Slavic) — a judgment call
  where the article lumps them as one "inherited core".
