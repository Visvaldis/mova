---
id: 010-interactive-foundation
title: Shared infrastructure for interactive islands
area: infra
component:
article:
depends_on: []
order: 10
---

# Shared infrastructure for interactive islands

**Goal:** create the small shared pieces every interactive component needs, so each later
component task is pure feature work. No visual change to the site yet.

**Context:** tech → `CONVENTIONS.md`. Components mount via `src/components/Interactive.astro`
(registry) into `.interactive-wrap` and inherit the topic CSS variables from `<body data-topic>`.

## Steps

1. **Reduced-motion hook** — `src/components/interactive/useReducedMotion.ts`: returns a boolean from
   `matchMedia('(prefers-reduced-motion: reduce)')`, SSR-safe (default `false`), subscribes to changes
   and cleans up. Every component with JS-driven motion will gate on this.
2. **Shared island styles (optional but recommended)** — a CSS module
   `src/components/interactive/interactive.module.css` with a few reusable, topic-var-driven classes
   matching the prototype look: panel/card (`var(--bg-elev)`, `var(--radius)`, `var(--shadow)`),
   pill button + active state (`var(--accent)` / `var(--on-accent)`), range input (`accent-color`),
   muted caption. Keeps the 14+ components visually consistent without copy-paste.
3. Confirm the registry edit point and `lang` prop contract are documented in `CONVENTIONS.md`
   (they are — just verify they still match `Interactive.astro`).

## Acceptance

- [ ] `npm run build` → 0 errors.
- [ ] `useReducedMotion.ts` exists, typed, SSR-safe.
- [ ] (If done) shared CSS module exists and uses only topic variables — no hardcoded hex.
- [ ] No change to any rendered page (nothing imports these yet).

## Notes

- The first real consumer is `100-int-sound-shift`; it's fine to land the hook here and prove it there.

## Done — 2026-06-10

Shipped the shared island infra. No rendered page changed (nothing imports these yet; `Interactive.astro` registry untouched).

**Files added:**
- `src/components/interactive/useReducedMotion.ts` — typed React hook returning a boolean from `matchMedia('(prefers-reduced-motion: reduce)')`. SSR-safe (defaults `false`, reads the real value on mount), subscribes to `change`, falls back to `addListener`/`removeListener` for older Safari, and cleans up. Both named and default exports.
- `src/components/interactive/interactive.module.css` — CSS Module (locally scoped, can't leak into `.prose`) with topic-var-driven reusable classes: `.panel` (surface), `.card` (inset/accent-left explainer), `.row`, `.pill` (+ `[aria-pressed]`/`[data-active]`/`.active` states + hover), `.range` (`accent-color`), `.caption`, plus `.accent`/`.muted` text helpers. Zero hardcoded hex — every value is a `var(--…)` topic token.

**Step 3 (verify):** confirmed `CONVENTIONS.md`'s registry edit point and single-`lang`-prop contract still match `Interactive.astro` (registry is `Record<string, any>` keyed by interactive id, auto-mounts into `.interactive-wrap` with `client:visible`). No change needed.

**Verification:** `npm run build` → 0 errors, 52 pages.

No `TODO(seva)`. No follow-ups. First consumer will be `100-int-sound-shift`.
