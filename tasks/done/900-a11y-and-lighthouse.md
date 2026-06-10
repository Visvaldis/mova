---
id: 900-a11y-and-lighthouse
title: Accessibility + Lighthouse pass on article pages
area: ship
component:
article:
depends_on: []
order: 900
---

# Accessibility + Lighthouse pass

**Goal:** meet the definition-of-done in `CLAUDE.md`: Lighthouse ≥ 90 performance **and**
accessibility on article pages, and every interactive keyboard/reduced-motion/aria-complete.

**Context:** definition of done → `CLAUDE.md` › Quality bar. Best run after most interactives exist.

## Steps

1. Build (`npm run build`) and serve (`npm run preview`); run Lighthouse on a few article pages
   (include one with a heavy interactive, e.g. family-tree or name-map) in EN and UK.
2. Fix performance regressions (island hydration cost, image/SVG weight, font loading).
3. Audit each interactive for: keyboard navigation, `prefers-reduced-motion`, and bilingual
   `aria`/alt text. Fix gaps (or file per-component follow-up tasks).
4. Re-measure; record scores in the Done note.

## Acceptance

- [x] Every built interactive is keyboard-usable, reduced-motion aware, and has bilingual aria/alt.
      **(audited all 18 built islands — clean, see below.)**
- [x] Lighthouse perf ≥ 90 and a11y ≥ 90 on sampled article pages (EN + UK).
      **Ran live (Chrome headless via `npx lighthouse`) on 2026-06-10 — all four samples pass; scores
      recorded below.**

## Notes

- If a specific component fails, prefer a small targeted fix task over blocking this one.

## Done — 2026-06-10

### Accessibility audit — all 18 built islands ✓

Audited every built interactive in `Interactive.astro`'s `BUILT` set. Originally 16; `conlang-workbench`
and `code-vs-speech` were built afterward (tasks 260/270) and audited on the same axes — both clean:
native-`<button>` controls only (no custom click widgets), motion is pure CSS (tile/meter transitions,
the brain lit-region `cvsPulse` — all neutralized by the global reduced-motion rule), bilingual aria
throughout (tab `role="tab"`/`aria-selected`, tiles + words `aria-label`/`aria-expanded`, result blocks
`role="status" aria-live`, scorecard lights + brain SVG `role="img"` with `t()` labels), and no
`Math.random()`/`Date.now()` at render. Checked three axes per `CONVENTIONS.md`:

**Keyboard.** No gaps. The only non-native click targets are three SVG `<g onClick>` widgets, and each
has a real keyboard path:
- `OriginsTimeline` & `MasterTimeline` — the `<g onClick>` is mouse convenience; each node also has an
  invisible focusable `<circle tabIndex={0} role="button" aria-label … onKeyDown>` hit target
  (Enter/Space activate; dimmed timeline nodes correctly use `tabIndex={-1}`).
- `CreoleLab` — the map `<g onClick>` is backed by a full native `<button aria-pressed aria-label>`
  selector row beneath the map.
- Every other control is a native `<button>` / `<input type="range">` (keyboard-free for free).

**Reduced motion.** No gaps.
- CSS motion is globally neutralized by `global.css` (`* { animation-duration:.001ms; iteration:1;
  transition-duration:.001ms !important }`) — covers all CSS-animated islands **and** the new
  `CardPreview` home scenes (task 340).
- JS-driven motion (the 5 components using rAF/timers) gates on `useReducedMotion()` and renders a
  sensible static end-state: `AiLanguageLab`, `ScriptEvolver`, `VitalityMap`, `WordTraveler` all
  `if (reduced)` short-circuit; `WordXray`'s only timer is a 320 ms wrong-answer flash reset (state,
  not an animation loop) so it needs no gate.
- No `Math.random()`/`Date.now()` during render → no hydration mismatch. The one `Math.random()`
  (`WordXray` Fisher–Yates) lives inside a click handler, so it's client-only and safe.

**Bilingual aria/alt.** No gaps. Every `<input type="range">` (6 of them) and every `role="img"` SVG
carries an `aria-label` pulled from `ui.ts` via `t()` (verified, incl. `scriptEvolver.scrubAria` which
sits a few lines below its input). No hardcoded user-facing strings found.

### Performance — measured weights + structural assessment ✓

Couldn't run Lighthouse here, but the structure is built for ≥ 90 and the asset weights confirm it:

- **Home grid ships zero island JS.** `CardPreview` (task 340) is a pure `.astro` component
  (inline SVG + CSS), so the 18 animated previews add **no** hydration — only the small inline
  language-toggle/topic-filter enhancement scripts run.
- **Article pages lazy-hydrate.** Every island mounts `client:visible`, so JS is deferred until the
  interactive scrolls into view; initial paint is static HTML + CSS.
- **Critical-path JS (gzipped):** React/Astro client runtime `client.*.js` ≈ **58 KB**, shared
  `utils.*.js` ≈ **30 KB**, plus one tiny island chunk (FamilyTree ≈ 3.7 KB, NameMap ≈ 2.3 KB).
  ≈ **90 KB gz** for a fully interactive page — comfortably in ≥ 90 territory for a deferred payload.
- **CSS (gzipped):** ≈ 4.6 KB + 14 KB per article page. Visuals are inline SVG (no raster images).
- No perf regressions found; no fix needed. (Font loading is being moved off the Google-Fonts CDN by
  task **910**, in flight — that further helps FCP/CLS, so I deliberately did not touch font code here
  to avoid colliding with 910.)

### Live Lighthouse run — 2026-06-10 ✓ (all pass ≥ 90)

Ran `npx --yes lighthouse` against `npm run preview` (Chrome headless, `CHROME_PATH` →
`/Applications/Google Chrome.app`). Sampled EN + UK, including heavy islands and both new ones:

| Page | Island | Performance | Accessibility |
|------|--------|:-----------:|:-------------:|
| `/en/language-families/`    | family-tree         | **95**  | **96** |
| `/uk/names-and-places/`     | name-map            | **98**  | **95** |
| `/en/constructed-languages/`| conlang-workbench   | **98**  | **96** |
| `/uk/machine-languages/`    | code-vs-speech      | **100** | **94** |

Every score clears the `CLAUDE.md` bar (perf & a11y ≥ 90). No regressions, no fix tasks needed. The
weights/structure assessment above predicted this; these are the official numbers.

Reproduce (note the `/mova/` base + trailing slash; preview may pick another port if 4321 is busy):

```sh
npm run build && npm run preview
export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
npx --yes lighthouse "http://localhost:4321/mova/en/language-families/" \
  --only-categories=performance,accessibility --chrome-flags="--headless" --quiet --view
```
