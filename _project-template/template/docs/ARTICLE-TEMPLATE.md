# Article authoring template

Copy the two blocks below into `content/en/<slug>.md` and `content/uk/<slug>.md`. Keep the **same
`slug`** in both. Article prose is authored by a human (or in a dedicated content task) — the build
agent turns it into a page but does not invent facts.

> Keep this file in `docs/` (NOT in `content/`) — anything under `content/**/*.md` is loaded as a
> real article and must have valid frontmatter.

## `content/en/<slug>.md`

```markdown
---
slug: <slug>                 # identical across languages
lang: en
title: <English title>
summary: <one sentence shown on the card and as the meta description>
order: 10                    # controls home-grid + prev/next order
topic: <topic-id>            # must exist in ui.ts topicNames + global.css accent
readingTime: 5               # minutes, integer
interactive: <interactive-id>   # must match an Interactive.astro id (or a placeholder)
sources:
  - title: <source name>
    url: https://…
    note: <optional one-line why-it-matters>
---

Intro paragraph(s) — the hook. Renders above the interactive.

> A memorable pull-quote renders large.

<!-- INTERACTIVE -->

## First section heading

Body continues below the interactive. Every fact an interactive shows must appear here.
```

## `content/uk/<slug>.md`

Same frontmatter with `lang: uk` and translated `title` / `summary`; `slug`, `order`, `topic`,
`interactive` stay identical. Body is the Ukrainian translation.
