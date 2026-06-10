# Mova / Tongue

An interactive, bilingual (English + Ukrainian) website about the evolution of language.
Built with [Astro](https://astro.build) + React islands, deployed statically to GitHub Pages.

> Article content lives in `content/en/*.md` and `content/uk/*.md` and is authored separately —
> the app turns each article into an interactive page. See `CLAUDE.md` for the full product spec.

## Develop

```bash
npm install
npm run dev        # http://localhost:4321/mova/
```

The dev server runs under the `/mova/` base path (matching the GitHub Pages deploy).

## Build

```bash
npm run build      # static output in ./dist
npm run preview    # serve the built site locally
```

## Deploy to GitHub Pages

This repo is wired for GitHub Pages at **https://visvaldis.github.io/mova/**.

1. Push to the `main` branch.
2. In the GitHub repo: **Settings → Pages → Build and deployment → Source = "GitHub Actions"** (one-time).
3. The workflow in `.github/workflows/deploy.yml` builds and deploys on every push to `main`
   (and can be run manually from the **Actions** tab).

If your default branch isn't `main`, update the branch name in `deploy.yml`.
The deploy URL is controlled by `site` + `base` in `astro.config.mjs` — change both if the
repo or owner name changes.

## Project structure

```
content/<lang>/<slug>.md     # articles (authored separately — do not edit)
src/
  i18n/ui.ts                 # every localized UI string (EN + UK) + per-interactive blurbs
  i18n/utils.ts              # language detection, translations, base-path link helpers
  content.config.ts          # content collection (glob loader → ids like "en/origins-of-language")
  styles/global.css          # design tokens, light/dark, per-topic accents
  layouts/BaseLayout.astro   # shell: <head>, nav, footer, language persistence
  components/                # Nav, LanguageToggle, Footer, ArticleCard, SourcesPanel,
                             #   ReadingProgress, Interactive (registry)
  components/interactive/    # interactive islands (Placeholder for now)
  pages/                     # index redirect, [lang]/index, [lang]/[slug], about, timeline, 404
```

## Status

This is the **base structure**: full bilingual shell, routing, home / article / timeline / about pages,
language toggle, sources panels, and GitHub Pages deploy. The six interactive components are wired
through a registry (`src/components/Interactive.astro`) and currently render polished, topic-styled
**placeholders**. To add a real one, build it under `src/components/interactive/` and register it by id.
