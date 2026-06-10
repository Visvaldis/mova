# Progress — Mova / Tongue

_Last updated: 2026-06-09_

Tracking doc for the build. `CLAUDE.md` is the product spec; `README.md` is setup/deploy.
This file is **what's done** and **what's next**.

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

## ⬜ To do — next

### 1. Interactive components (the core work)

Content has **14 articles**, each naming an `interactive`. All currently render a 🟡 styled **placeholder**
via the registry in `src/components/Interactive.astro`. The first 6 have full specs in `CLAUDE.md`; the
other 8 need an interaction designed from the article's own content (no spec exists yet).

| # | Topic | `interactive` id | Article slug | Spec | Status |
|---|-------|------------------|--------------|------|--------|
| 1 | origins | `origins-timeline` | origins-of-language | CLAUDE.md | 🟡 |
| 2 | families | `family-tree` | language-families | CLAUDE.md | 🟡 |
| 3 | sound | `sound-shift` | sound-change | CLAUDE.md (+ `prototype-sound-shift.html`) | 🟡 |
| 4 | ukrainian | `ukrainian-timeline` | ukrainian-language-history | CLAUDE.md | 🟡 |
| 5 | internet | `slang-decoder` | internet-language | CLAUDE.md | 🟡 |
| 6 | ai | `ai-language-lab` | ai-and-language | CLAUDE.md | 🟡 |
| 7 | birth | `creole-lab` | new-languages | needs design | 🟡 |
| 8 | revival | `vitality-map` | language-death-and-revival | needs design | 🟡 |
| 9 | writing | `script-evolver` | writing-systems | needs design | 🟡 |
| 10 | borrowing | `word-traveler` | traveling-words | needs design | 🟡 |
| 11 | everyday | `word-xray` | everyday-etymologies | needs design | 🟡 |
| 12 | roots | `roots-garden` | ukrainian-word-origins | needs design | 🟡 |
| 13 | names | `name-map` | names-and-places | needs design | 🟡 |
| 14 | myths | `myth-buster` | etymology-myths | needs design | 🟡 |

Suggested order: start with **`sound-shift`** (a prototype already exists), then the rest of the
CLAUDE.md six, then design the eight.

**Recipe to ship one:**
1. Build `src/components/interactive/<Name>.tsx` as a React island; accept a `lang` prop, pull all UI text
   from `src/i18n/ui.ts` (add keys there — never hardcode strings).
2. Register it by id in `src/components/Interactive.astro` (`const registry = { 'sound-shift': SoundShift }`);
   it auto-mounts at the marker with `client:visible`.
3. Keep every fact sourced from the article. If you need a number that isn't in the article, mark it
   `TODO(seva)` in code and list it here.

### 2. Aggregated timeline page ⬜
`/{lang}/timeline` is a placeholder. Build the master interactive timeline (~135,000 BCE → today,
log-scaled) aggregating key dated events from all articles (hardcode events from article content).
Replace the placeholder block in `src/pages/[lang]/timeline.astro`.

### 3. Home-card live previews ⬜
CLAUDE.md asks each card to show "a small animated preview of its interactive." Cards currently show a
static topic icon — upgrade to a mini animated preview once components exist.

### 4. Definition-of-done checks (from CLAUDE.md) ⬜
- [ ] Lighthouse ≥ 90 performance **and** accessibility on article pages (not yet measured).
- [ ] Each interactive keyboard-navigable + `prefers-reduced-motion` aware + bilingual aria/alt text.
- [ ] All interactives functional at 375px.
- [ ] Consider self-hosting fonts (Fixel / e-Ukraine) instead of the Google Fonts CDN for perf + offline.

### 5. Deploy — one-time user actions ⬜
- [ ] `git push -u origin main`
- [ ] Repo **Settings → Pages → Source = "GitHub Actions"**.
- [ ] If the default branch isn't `main`, update the trigger in `.github/workflows/deploy.yml`.

---

## Notes / decisions

- **14 articles, not 6.** CLAUDE.md specs 6 interactives; the content folder added 8 more topics/articles.
  The 8 extra placeholders' descriptions are derived from each article's authored `summary` — no invented data.
- **Loader gotcha (resolved).** Astro's glob loader uses frontmatter `slug` as the id by default, collapsing
  EN+UK; `generateId` forces path-based ids. See comment in `src/content.config.ts`.
- **Base path.** Every internal link must go through `withBase()` / `localizedPath()` or it 404s under `/mova/`.
  Local dev serves at `http://localhost:4321/mova/`, not bare `/`.
- **No backend / CMS / search / analytics** — out of scope per spec.
