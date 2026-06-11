---
slug: sample-entry-one
lang: en
title: The first sample chapter
summary: A short demo chapter showing how an article becomes an interactive page.
order: 1
topic: sample
readingTime: 3
interactive: sample-toy
sources:
  - title: Astro documentation
    url: https://docs.astro.build/
    note: The framework this starter is built on.
  - title: MDN — prefers-reduced-motion
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
---

This is the intro. Everything before the marker renders above the interactive.
Write the hook here — the one idea that makes the reader want to play.

> Pull-quotes (blockquotes) render large. Use one memorable line per chapter.

<!-- INTERACTIVE -->

## How this page is built

The text above and below this heading is plain markdown. The interactive island
(`sample-toy`) was injected at the `<!-- INTERACTIVE -->` marker. Remove the marker
and it mounts right after this first H2 instead.

Replace this chapter with your real content, and `sample-toy` with the interactive
named in this chapter's `interactive` frontmatter field. Every fact a reader sees
inside an interactive must trace back to the article text.
