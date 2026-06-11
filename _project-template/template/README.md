# {{PROJECT_NAME}}

An interactive, bilingual (English + Ukrainian) storybook about **{{THEME}}**, built with
[Astro](https://astro.build) + React islands and deployed statically to GitHub Pages.

> Article content lives in `content/en/*.md` and `content/uk/*.md` and is authored separately — the
> app turns each article into an interactive page. See `CLAUDE.md` for the full product spec, and
> `tasks/` for the live backlog.

## Develop

```bash
npm install
npm run dev        # serves under the configured base, e.g. http://localhost:4321/storybook/
```

## Build

```bash
npm run build      # static output in ./dist
npm run preview    # serve the built site locally
```

## Deploy (GitHub Pages)

1. Set `site` + `base` in `astro.config.mjs` to your repo (`https://<owner>.github.io` + `/<repo>`).
2. Push to `main`. In the repo: **Settings → Pages → Source = "GitHub Actions"** (one-time).
3. `.github/workflows/deploy.yml` builds and deploys on every push to `main`.

## Project structure

```
content/<lang>/<slug>.md     # articles (authored separately)
src/
  i18n/ui.ts                 # every localized UI string (EN + UK) + topic & interactive registries
  i18n/utils.ts              # lang detection, translations, base-path link helpers
  content.config.ts          # content collection (path-based ids: "en/<slug>")
  styles/global.css          # design tokens, light/dark, per-topic accents
  layouts/BaseLayout.astro   # shell: head, nav, footer, language persistence
  components/                # Nav, Footer, LanguageToggle, ArticleCard, SourcesPanel,
                             #   ReadingProgress, Interactive (registry)
  components/interactive/    # interactive islands (_TEMPLATE.tsx, SampleToy.tsx, Placeholder.tsx)
  pages/                     # root redirect, [lang]/index, [lang]/[slug], about, 404
docs/                        # ARTICLE-TEMPLATE.md, FEATURE-DOC-TEMPLATE.md, feature design docs
tasks/                       # the backlog: todo/ doing/ done/ + CONVENTIONS.md + README.md
CLAUDE.md  PROGRESS.md        # product spec · narrative status
```
