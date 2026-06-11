# <FEATURE>.md — <feature name>

A design doc for a feature bigger than one article's interactive (e.g. a master timeline, a guided
course, an index). Lives in `docs/`. Same ground rules as everything else: static, bilingual,
keyboard-accessible, no invented data.

## 1. Why

What gap this fills; who it's for; the one-line pitch. Non-goals.

## 2. Information architecture

Routes, nav entry, where data lives. e.g.
```
/{lang}/<feature>/        the page
src/data/<feature>.ts     hardcoded, article-sourced data (each item points at a slug)
```

## 3. The experience

What the reader does and sees. Components, states, mobile behavior.

## 4. Data & sourcing

Where every fact comes from (which article/dataset). Mark gaps `TODO(owner)`.

## 5. Integration

How this feature consumes articles, and what the "adding a new article" checklist must do to keep it
in sync (add this feature's step to `tasks/CONVENTIONS.md` § integration checklist).

## 6. Tasks

Break into board cards (`3xx-…`): data first, then page, then polish.
