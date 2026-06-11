# Progress — {{PROJECT_NAME}}

_Last updated: YYYY-MM-DD_

Narrative status. `CLAUDE.md` is the product spec; `README.md` is setup/deploy; the **live, actionable
backlog lives in [`tasks/`](tasks/README.md)** — one file per task, status tracked by folder
(`todo/` → `doing/` → `done/`). To advance the build, tell an agent *"do the next task"*. This file is
the high-level summary; append a dated note after each working session.

Legend: ✅ done · 🟡 placeholder/partial · ⬜ not started

---

## ✅ Done — base structure (deployable shell)

- **Scaffold** — Astro 5 + `@astrojs/react` + `marked`, strict TS. `npm run build` → 0 errors.
- **Content layer** — `content/<lang>/<slug>.md` with path-based ids so EN/UK don't collide; Zod schema.
- **Bilingual system** — `src/i18n/ui.ts` (every UI string EN+UK) + `utils.ts` (lang detection,
  `useTranslations`, `withBase`, `localizedPath`). Top-right toggle on every page; persists; restores scroll.
- **Pages** — root redirect, home (hero + card grid + topic filter), `[lang]/[slug]`, about, 404.
- **Article rendering** — body split at `<!-- INTERACTIVE -->`; large pull-quotes; reading-progress
  bar; "Explore further" sources panel; prev/next nav.
- **Interactive registry** — `Interactive.astro` mounts built islands; unbuilt ids show a topic-styled
  placeholder. One worked island (`SampleToy`) + two sample bilingual entries.
- **Design** — light/dark via `prefers-color-scheme`, per-topic accents, reduced-motion honored, mobile-first.
- **Deploy** — GitHub Pages workflow + `.nojekyll`; base-path-safe links.

## ⬜ To do — next (see [`tasks/`](tasks/README.md) for the live backlog)

1. **Retheme** — replace the demo identity, sample topics, and sample entries (see BOOTSTRAP.md).
2. **Author articles** + fill the interactive catalogue in `CLAUDE.md`.
3. **Build interactives** (`1xx`) — one island per article. Start with your most iconic one.
4. **Aggregating features** (`3xx`) — timeline / course / index, each spec'd in `docs/`.
5. **Polish & ship** (`9xx`) — a11y + Lighthouse ≥ 90, self-host fonts, deploy.

### Current content snapshot
- **2 sample articles × 2 languages** (placeholders for your real content).

---

## Notes / decisions

- **Base path.** Every internal link goes through `withBase()` / `localizedPath()` or it 404s under
  the deploy subpath. Local dev serves under the same base.
- **Loader gotcha.** The glob loader uses frontmatter `slug` as the id by default, collapsing EN+UK;
  `generateId` forces path-based ids. See the comment in `src/content.config.ts`.
- **No backend / CMS / search / analytics** unless a `docs/<FEATURE>.md` explicitly adds one.

<!-- Append dated session notes below, newest last. -->
