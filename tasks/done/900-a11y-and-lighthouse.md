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
      **(audited all 16 built islands — clean, see below.)**
- [⏳] Lighthouse perf ≥ 90 and a11y ≥ 90 on sampled article pages (EN + UK).
      **Code-side complete + measured weights below; the live score must be run on Seva's machine
      (this build env has no Lighthouse CLI and headless Chrome isn't reachable here). Command below.**

## Notes

- If a specific component fails, prefer a small targeted fix task over blocking this one.

## Done — 2026-06-10

### Accessibility audit — all 16 built islands ✓

Audited every built interactive (the 16 in `Interactive.astro`'s `BUILT` set; `conlang-workbench` and
`code-vs-speech` are still `Placeholder`s — their build tasks, out of scope here — and the placeholder
is accessible static content). Checked three axes per `CONVENTIONS.md`:

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

### ⏳ Remaining: run the live Lighthouse numbers locally (Chrome is installed)

```sh
npm run build && npm run preview     # serves http://localhost:4321/mova/
# in another shell (note the /mova/ base + trailing slash):
npx --yes lighthouse "http://localhost:4321/mova/en/family-tree/" \
  --only-categories=performance,accessibility --chrome-flags="--headless" --quiet --view
npx --yes lighthouse "http://localhost:4321/mova/uk/name-map/" \
  --only-categories=performance,accessibility --chrome-flags="--headless" --quiet --view
```
Sample one EN + one UK page, including a heavy island (family-tree / name-map). If a metric dips below
90, file a small targeted fix task per this task's own Note. I expect a11y to pass on the audit above
and perf to pass on the weights above; this step just records the official numbers.

`TODO(seva)`: paste the four scores (perf/a11y × EN/UK) back here, then check the ⏳ box.
