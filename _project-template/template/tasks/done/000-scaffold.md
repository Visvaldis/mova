---
id: 000-scaffold
title: Bilingual static shell + shared island infra
area: infra
depends_on: []
order: 0
---

# Bilingual static shell + shared island infra

**Goal:** a deployable EN/UK shell where every article renders as an interactive page, with the
registry → island → i18n → topic-variable path proven end-to-end.

## Done — (shipped by the starter)

Built: Astro 5 + React islands, `marked` body rendering, path-based content ids (EN/UK don't
collide), `src/i18n/{ui,utils}.ts`, `BaseLayout` + Nav/Footer/LanguageToggle/ArticleCard/
SourcesPanel/ReadingProgress, the `Interactive.astro` registry + `Placeholder`, `useReducedMotion`,
`global.css` (tokens, light/dark, per-topic accents, reduced-motion), pages (root redirect, home,
`[lang]/[slug]`, about, 404), GitHub Pages deploy workflow. One worked interactive (`SampleToy`) and
two sample bilingual entries. `npm run build` → 0 errors, 10 pages.

Replace the demo identity (name/slug/base, hero copy, sample topics + entries) per BOOTSTRAP.md, then
start the interactives at `1xx`.
