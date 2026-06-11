---
slug: sample-entry-two
lang: en
title: The second sample chapter
summary: This chapter's interactive isn't built yet, so it shows the styled placeholder.
order: 2
topic: history
readingTime: 2
interactive: sample-two
sources:
  - title: Example source
    url: https://example.com/
---

This chapter names an interactive (`sample-two`) that has no component registered
yet. Instead of plain text, the reader sees a topic-styled **placeholder** that
shows the one-line description from `interactiveInfo` in `ui.ts`.

That is the rule: no chapter ever ships as plain text. Build the component, register
it in `Interactive.astro`, and the placeholder is replaced automatically.
