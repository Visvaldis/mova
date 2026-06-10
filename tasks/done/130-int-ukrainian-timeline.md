---
id: 130-int-ukrainian-timeline
title: Build the ukrainian-timeline interactive
area: interactive
component: ukrainian-timeline
article: ukrainian-language-history
depends_on: [010-interactive-foundation]
order: 130
---

# Build the ukrainian-timeline interactive

**Goal:** a vertical, scroll-driven timeline of Ukrainian, ~860 CE → today.

**Context:** spec → `CLAUDE.md` › `ukrainian-timeline` · article →
`content/{en,uk}/ukrainian-language-history.md` · tech → `CONVENTIONS.md` · topic accent → `ukrainian`.

## Steps

1. `src/components/interactive/UkrainianTimeline.tsx` (prop `lang`), vertical scroll-driven era cards.
2. Eras from the article: Kyivan Rus / Old East Slavic, Galicia-Volhynia, Lithuanian-Polish era,
   Kotliarevsky's *Eneida* (1798), Shevchenko, **Valuev Circular (1863)** & **Ems Ukaz (1876)** as
   "ban" markers, korenizatsiia, Executed Renaissance, Soviet russification, 1989/1991 official
   status, post-2014 and post-2022 revival.
3. Each era card carries a **sample text snippet** of that period's language (from the article).
4. Bans rendered visually distinct (red strikethrough motif). Small line chart of speakers/status.
5. Era data + snippets → `ukrainianTimeline.data.ts`; chrome → `ui.ts` (`ukrainianTimeline.*`).
6. Register in `Interactive.astro`.

## Acceptance

- See `CONVENTIONS.md` standard checklist, plus:
- [ ] Bans visually distinct; era snippets shown; speaker chart renders.
- [ ] Scroll-driven behavior degrades to tap/step at 375px; `prefers-reduced-motion` respected.

## Notes

- Speaker/status numbers not in the article → `TODO(seva)`.

## Done — 2026-06-10

Built the `ukrainian-timeline` island: a vertical, scroll-driven timeline of Ukrainian with 9
article-grounded eras, a spine with active-era tracking, ban/revival visual tones, per-era language
samples, and a schematic status chart.

**Files added:**
- `src/components/interactive/UkrainianTimeline.tsx` — `{lang}` island. Eras stack down a CSS spine;
  an `IntersectionObserver` (center-band `rootMargin`) sets the active era → highlights the spine dot,
  the status-chart point, and the "Era N / 9" counter (`aria-live`). Prev/Next pills + clickable,
  keyboard-operable chart points (`role=button`, Enter/Space) give the tap/step fallback. Entrance
  fade/slide is progressive-enhancement only (`.enhanced` added post-mount **and** gated on
  `useReducedMotion`; reveal tracked in React state so re-renders never wipe it; on-screen cards
  revealed at mount to avoid flash). SSR/no-JS markup is fully visible (verified in dist).
- `src/components/interactive/ukrainianTimeline.data.ts` — typed `ERAS` (dates, bodies, tones, samples,
  schematic `statusLevel`), all condensed from `content/{en,uk}/ukrainian-language-history.md`.
- `src/components/interactive/ukrainianTimeline.module.css` — spine/dots, ban red motif via scoped
  `--ut-ban`/`--ut-ban-soft` tokens (light + dark; semantic red is the one non-topic color, same
  precedent as MythBuster), strikethrough motifs, sample block, 420px tweaks. No bare hex outside the
  scoped danger token.

**Files touched:** `src/i18n/ui.ts` (`ukrainianTimeline.*` chrome, EN + UK); `src/components/Interactive.astro` (registered `ukrainian-timeline`).

**Bans/snippets/chart:** Valuev 1863 & Ems 1876 (and the Executed-Renaissance repression / ґ abolition)
render with red border + strikethrough + ⊘ badge; every era card shows an article-sourced sample
(sound features ніч/кінь/голова/борода, the Valuev quote, the banned-items list, the ґ letter, surzhyk);
schematic SVG status line renders the ban-dips / revival-rises arc.

**`TODO(seva)`** (all in `ukrainianTimeline.data.ts` header):
1. Galicia-Volhynia & the Lithuanian-Polish era are listed in the spec but **not in the article** —
   omitted rather than invented. Add article prose to include them.
2. The article gives **no speaker numbers**, so the chart is a *schematic official-standing arc*
   (each point an article-stated status event), captioned as such — not measured speaker counts.
3. No verbatim period line for Kotliarevsky's *Eneida* or Shevchenko's *Kobzar* in the article — the
   work titles stand in as each era's language landmark.

**Verification:** `npm run build` → 0 errors, 58 pages. Confirmed in `dist` that both EN and UK article
pages mount the real island (placeholder gone), render the bilingual chrome + article-sourced samples,
and that all CSS-module classes resolved (no `undefined`). Built per `CONVENTIONS.md` standard checklist
(both langs, no hardcoded user strings, topic vars + light/dark, reduced-motion gated, keyboard-nav with
bilingual aria, 375px-safe via step controls).

No follow-up tasks created.
