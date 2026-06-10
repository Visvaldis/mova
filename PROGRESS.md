# Progress — Mova / Tongue

_Last updated: 2026-06-09_

Narrative status. `CLAUDE.md` is the product spec; `README.md` is setup/deploy.
**The live, actionable backlog now lives in [`tasks/`](tasks/README.md)** — one file per task,
status tracked by folder (`todo/` → `doing/` → `done/`). To advance the build, tell an agent
*"do the next task"* (protocol in `tasks/README.md`). This file is the high-level summary.

Legend: ✅ done · 🟡 placeholder/partial · ⬜ not started

---

## ✅ Done — base structure (deployable shell)

- **Project scaffold** — Astro 5 + `@astrojs/react`, `marked`, strict TS. `npm run build` → 0 errors, 36 pages.
- **GitHub Pages wiring** — `astro.config.mjs` (`site` + `base: '/mova'`, `trailingSlash: 'always'`),
  `.github/workflows/deploy.yml` (Astro action → Pages), `public/.nojekyll`, base-path-safe links via `withBase()`.
- **Content layer** — `src/content.config.ts` globs `content/<lang>/<slug>.md` with **path-based ids**
  (`en/…`, `uk/…`) so EN/UK don't collide on the shared `slug`. Zod schema matches frontmatter.
- **Bilingual system** — `src/i18n/ui.ts` (every UI string EN+UK, 14 topic names, 14 interactive blurbs) +
  `src/i18n/utils.ts` (lang detection, `useTranslations`, `withBase`, `localizedPath`).
- **Language toggle** — top-right on every page; stays on the same article, persists to `localStorage`,
  restores scroll; root `/` redirects by saved → browser → default language.
- **Pages** — home (hero + 14-card grid), article (`[lang]/[slug]`), timeline, about, 404.
- **Article rendering** — body split at `<!-- INTERACTIVE -->` marker (fallback: before first H2) with the
  interactive mounted between; large pull-quotes; reading-progress bar; "Explore further" sources panel
  (external-link icons); prev/next nav.
- **Design** — light/dark via `prefers-color-scheme`, per-topic accent colors (all 14 topics),
  `prefers-reduced-motion` honored, mobile-first (verified at 375px), Inter (Cyrillic subset) via Google Fonts.
- **Git** — initial commit on `main`, remote `origin` → `git@github.com:Visvaldis/mova.git` (not pushed).

---

## ⬜ To do — next (see [`tasks/`](tasks/README.md) for the live backlog)

**The core work is the interactive components** — all currently render a 🟡 placeholder via the
registry in `src/components/Interactive.astro`. Then features, then a playground, then ship.
Granular task files live in `tasks/todo/`; tell an agent *"do the next task"* to advance.

Phases:

1. **Foundation** (`010`) + **new-article wiring** (`050`/`055`) — shared island infra and metadata
   for the two newest articles.
2. **Interactives** (`100`–`250`) — one island per article. 14 have specs in `CLAUDE.md`; **start with
   `sound-shift`** (a prototype exists in `prototype-sound-shift.html`). The two newest ones
   (`thought-lens`, `accent-atlas`) carry their own design step inside the task (done in plan mode).
3. **Features** (`300`–`340`) — master timeline page, topic selection/filtering, animated home-card previews.
4. **Playground** (`400`) — open-ended; designs (in plan mode) and builds in one task.
5. **Polish & ship** (`900`–`920`) — accessibility + Lighthouse ≥ 90, self-hosted fonts, deploy.

### Current content snapshot
- **16 articles** authored (`content/en/` has 16; `content/uk/` has 15) — all render today (placeholders).
- ⚠️ **`content/uk/dialects-and-accents.md` is missing** → the EN page works but the language toggle
  404s for it. Article prose is hand-authored, so this is a `TODO(seva)` writing task.
- ⚠️ Topics `thought` / `dialects` and interactives `thought-lens` / `accent-atlas` are **not yet wired**
  into `src/i18n/ui.ts` (topic names + blurbs) or `src/styles/global.css` (accent colors) → tasks `050`/`055`.

---

## Notes / decisions

- **16 articles and growing.** `CLAUDE.md` carries full interactive specs for 14 of them; the two
  newest (`language-and-thought` → `thought-lens`, `dialects-and-accents` → `accent-atlas`) post-date
  the spec, so their tasks (`tasks/240`/`250`) design **and** build in one go — the design step runs
  in plan mode for review. Placeholder blurbs are derived from each article's authored `summary` —
  no invented data. New articles get onboarded via the checklist in `tasks/README.md`.
- **Loader gotcha (resolved).** Astro's glob loader uses frontmatter `slug` as the id by default, collapsing
  EN+UK; `generateId` forces path-based ids. See comment in `src/content.config.ts`.
- **Base path.** Every internal link must go through `withBase()` / `localizedPath()` or it 404s under `/mova/`.
  Local dev serves at `http://localhost:4321/mova/`, not bare `/`.
- **No backend / CMS / search / analytics** — out of scope per spec.

---

## ✅ Update — 2026-06-10 (content/playground session)

- **Content complete: 18 articles × 2 languages.** The previously-missing `content/uk/dialects-and-accents.md`
  now exists, plus `constructed-languages` and `machine-languages` (EN+UK). All EN/UK pairs verified.
- **`CLAUDE.md` now has specs for all 18 interactives** (added `thought-lens`, `accent-atlas`,
  `conlang-workbench`, `code-vs-speech`) — the "needs design" gap is closed.
- **Wiring done** (former tasks `050`/`055` scope): `src/i18n/ui.ts` has topic names + interactive blurbs for
  `thought` / `dialects` / `conlangs` / `machine`; `src/styles/global.css` has their light+dark accents.
- **Playground P1 shipped** (spec: `docs/PLAYGROUND.md`):
  - Hub `/{lang}/playground/` + nav link; registry in `src/components/playground/registry.ts`.
  - `babel-daily` — daily guess-the-language (UDHR Art. 1, 41 languages), hints, streak/stats in
    `localStorage` (`mova:playground:babel`), emoji share, practice mode.
  - `word-time-machine` — 15 hand-curated etymology chains (`src/data/playground/etymologies.json`,
    every entry sourced: etymonline/ЕСУМ), cognate fans, * marks reconstructions.
  - `sound-shift-sandbox` — Grimm / Ukrainian ikavism / Great Vowel Shift rule packs in
    `src/lib/soundlaws.ts` (single-pass chain-shift application), per-character diff highlighting.
  - Shared `.toy` / `.pg-card` styles in `global.css`; `prefers-reduced-motion` honored; all strings i18n'd.
- **Build verified: 52 pages, zero errors.** (Sandbox note: ran with a temp config overriding
  `outDir`/`cacheDir`; repo `dist/` is stale — rebuild on host with plain `npm run build`.)
- **P2 remaining** (per `docs/PLAYGROUND.md`): `stratigraph`, `conlang-forge`, `cognate-rush`.
