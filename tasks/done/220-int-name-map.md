---
id: 220-int-name-map
title: Build the name-map interactive
area: interactive
component: name-map
article: names-and-places
depends_on: [010-interactive-foundation]
order: 220
---

# Build the name-map interactive

**Goal:** a tabbed component about names — toponyms, month names, and surnames.

**Context:** spec → `CLAUDE.md` › `name-map` · article → `content/{en,uk}/names-and-places.md` ·
tech → `CONVENTIONS.md` · topic accent → `names`. **Larger** (3 tabs) — split if needed.

## Steps

1. `src/components/interactive/NameMap.tsx` (prop `lang`).
2. **Tab 1:** SVG map of Ukraine with tappable toponyms (Київ, Дніпро, Крим, Одеса, -слав/-город
   towns) → etymology cards; include the Україна "borderland vs homeland" debate card showing both views.
3. **Tab 2:** month-name wheel — 12 months as a ring, toggle EN (Roman gods/numbers) ⇄ UK (nature
   calendar), literal glosses on hover.
4. **Tab 3:** surname matcher — match English surnames to Ukrainian occupational twins
   (Smith↔Коваль, Baker↔?, Miller↔Мельник).
5. Toponyms + months + surnames → `nameMap.data.ts`; chrome → `ui.ts` (`nameMap.*`).
6. Register in `Interactive.astro`.

## Acceptance

- See `CONVENTIONS.md` standard checklist, plus:
- [ ] All three tabs work; Україна card presents both views fairly.
- [ ] Month wheel toggles EN/UK glosses; surname matcher gives feedback; usable at 375px.

## Notes

- Etymologies/glosses must come from the article; gaps (e.g. Baker↔?) → `TODO(seva)`.

## Done — 2026-06-10

Built the `name-map` interactive as a three-tab island.

**Files**

- `src/components/interactive/NameMap.tsx` — new.
  - **Tab 1 · Place names:** a schematic SVG map of Ukraine (hand-simplified
    national border incl. Crimea, drawn from a self-contained equirectangular
    projection in the data file). Four tappable pins — **Київ, Дніпро, Крим,
    Одеса** — each opening an etymology card. Two non-geographic chips below the
    map: **Україна** (a dedicated debate card presenting *both* the "borderland /
    окраїна" and Pivtorak "land / країна ← краяти, 1187" views fairly) and
    **-слав / -город** (the Slavic naming pattern). Pins are keyboard-operable
    (`role=button`, `tabIndex`, Enter/Space).
  - **Tab 2 · Month wheel:** the 12 months arranged in a responsive CSS ring
    (positioned by sin/cos percentages, upright, native buttons). Toggle **Roman
    calendar (EN) ⇄ Nature calendar (UK)**; tap a month for its literal gloss.
    Months the article actually glosses get a soft accent fill as a discovery
    hint; un-glossed months show an honest "not described here" note.
  - **Tab 3 · Surname twins:** a tap-to-match game — Smith↔Коваль, Miller↔Мельник,
    and Baker↔"?" (open). Correct match locks both cards + shows the shared trade;
    completing all three reveals the "the one who works metal, in twenty
    languages" payoff. Deterministic column shuffle (no `Math.random`).
- `src/components/interactive/nameMap.data.ts` — new. `uaProject` + `UA_VIEW` +
  `UKRAINE_OUTLINE`, `TOPONYMS`, `UKRAINA_DEBATE`, `SLAV_HOROD`, `MONTHS`,
  `SURNAMES`, `SURNAMES_PAYOFF`. Every etymology/gloss/date traces to the article
  (header comment notes the source); un-sourced glosses left blank with inline
  `TODO(seva)` markers.
- `src/components/interactive/NameMap.module.css` — new. Scoped; topic vars +
  `color-mix` only, no hardcoded hex. All motion is CSS transitions →
  neutralized by the global `prefers-reduced-motion` rule (no JS-driven motion).
- `src/i18n/ui.ts` — added the `nameMap.*` chrome block (en + uk).
- `src/components/Interactive.astro` — imported + registered `name-map`; added to `BUILT`.

**Verification**

- `npm run build` → 0 errors (64 pages).
- Placeholder gone on both `/en/` and `/uk/names-and-places/`; all four pins +
  chips render with bilingual `aria-label`s; map outline path present.
- `tsc --noEmit` → no errors in the new files. (Two pre-existing, unrelated
  errors remain — `aiLanguageLab.data.ts` and `words/WordFilter.tsx`; neither was
  touched here.)
- Topic vars (names) used throughout → correct in light & dark; keyboard-navigable;
  layout collapses to one column ≤520px and the wheel is fluid (375px OK).

**`TODO(seva)`**

- **English month glosses** — the article glosses only January (Janus), March
  (Mars), July (Julius), August (Augustus) and September–December (the "7th–10th"
  number fossils). **February, April, May, June** have no English gloss in the
  article → left blank.
- **Ukrainian month glosses** — article glosses січень, лютий, березень, квітень,
  травень, серпень, жовтень, листопад. **червень, липень, вересень, грудень** have
  no gloss in the article → left blank.
- **Baker's Ukrainian twin** — the article (and task spec) leave it open
  ("Baker↔?"); shown as an open "?" card that reveals the gap (Пекар noted only as
  an out-of-article guess) rather than inventing a match.
- **-слав / -город towns** — the article describes the suffix pattern but names no
  specific towns, so it's a pattern card, not individual map pins.
- The Ukraine border outline is hand-simplified/schematic (not survey-grade); a
  future pass could swap in a precise GeoJSON-derived path (would also serve the
  pending `accent-atlas` task).
- Minor: the `names` topic accent is wired as indigo in `global.css`, while
  `CLAUDE.md`'s design direction lists names=plum (and thought=indigo). Used
  `var(--accent)` so it follows whatever is wired; flag for a possible palette
  reconciliation (out of scope here).
