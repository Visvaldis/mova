---
id: 270-int-code-vs-speech
title: Build code-vs-speech interactive
area: interactive
component: code-vs-speech
article: machine-languages
depends_on: []
order: 270
---

# Build code-vs-speech interactive

**Goal:** turn `machine-languages` from a Placeholder into its live interactive.

**Context:** spec → `CLAUDE.md` › `code-vs-speech` · article → `content/{en,uk}/machine-languages.md` ·
tech → `CONVENTIONS.md` · topic accent → `machine` (graphite).

## Steps

1. **Hockett scorecard** — two columns (a Ukrainian sentence vs a Python snippet); step each design
   feature (discreteness, productivity, duality, ambiguity, lying/irony, child acquisition) and show
   pass/fail lights + a one-liner. Pass/fail verdicts all from the article.
2. **Brain panel** — a simple two-region brain SVG (language network vs multiple-demand network) that
   lights up per column. Keep the MIT (Fedorenko) result **verbatim** from the article.

## Acceptance

- See the standard checklist in `CONVENTIONS.md`, plus:
- [ ] Every design-feature verdict + the MIT result trace to the article (MIT quote verbatim).
- [ ] Scorecard + brain panel usable in EN + UK, keyboard + mobile.

## Notes

- `CLAUDE.md`: "Keep the MIT result verbatim from the article."

## Done

Built the `code-vs-speech` island — scorecard + brain panel, topic accent `machine` (graphite).

**Files**
- `src/components/interactive/CodeVsSpeech.tsx`:
  - **Hockett scorecard** — two columns (Ukrainian sentence `Ця мова жива.` vs Python `print("Hello,
    world")`); six design features as expandable rows, each with a pass/fail light per column and a
    one-liner verdict. Code passes discreteness / productivity / duality, fails ambiguity / lying-irony /
    acquisition — exactly the split the article draws. Running tally: Ukrainian 6/6, Python 3/6. Rows are
    native `<button>`s (`aria-expanded`); lights are `role="img"` with bilingual pass/fail aria-labels.
  - **Brain panel** — a two-region brain SVG (language network vs multiple-demand network). Two pills
    ("Reading Ukrainian" / "Reading Python") light the matching network; the lit region pulses (pure CSS
    → neutralized under reduced-motion). The MIT/Fedorenko result is shown **verbatim** from the article,
    followed by the article's modality footnote and closing pull-quote.
- `src/components/interactive/codeVsSpeech.data.ts` — bilingual content; per-item `{en, uk}`.
- `src/components/interactive/CodeVsSpeech.module.css` — scoped; colours only from topic vars /
  `color-mix`, no hardcoded hex.
- `src/i18n/ui.ts` — `codeVsSpeech.*` chrome keys (EN + UK).
- `src/components/Interactive.astro` — import + `BUILT` Set + conditional render.

**Sourcing** (per CLAUDE.md): every feature, verdict and one-liner traces to the article; `MIT_RESULT`
and `MODALITY_NOTE` are quoted verbatim (EN + UK from the respective article files). The two column
samples are illustrative scaffolding (the spec asks for "a Ukrainian sentence vs a Python snippet"),
noted as such in the data file — no invented facts.

**Milestone**: with this, all 18 article interactives are built — no Placeholder remains
(`BUILT` Set holds all 18 ids).

**Verify**: `npm run build` → 100 pages, 0 errors. Article frontmatter already declared
`interactive: code-vs-speech` (EN + UK).
