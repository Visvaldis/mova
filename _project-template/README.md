# Interactive Bilingual Storybook — starter kit

A reusable template for building projects with the same structure and workflow as the
**mova / Tongue** reference (https://github.com/Visvaldis/mova): a bilingual (EN/UK), static,
interactive storybook where each authored article becomes a page with its own hands-on component, and
where multiple agents can build in parallel off a folder-based task board.

The **theme is the only thing that changes** — the architecture, conventions, and workflow stay the
same. (Decisions baked in: full starter kit · bilingual EN+UK always · Astro + React islands default.)

## How to use it

**Hand it to an agent (intended path):** give the agent `BOOTSTRAP.md` plus this folder. It will copy
`template/`, retheme it for your project, fill the outline, seed the task board, and then build via
"do the next task." `BOOTSTRAP.md` references the reference repo for worked examples.

**Or do it yourself:** copy `template/` to a new repo, `npm install && npm run build` (0 errors,
~10 pages), then follow `BOOTSTRAP.md` § Procedure.

## What's inside

```
BOOTSTRAP.md     The hand-off meta-prompt: ordered steps + a find/replace table to retheme.
README.md        This file.
template/        A working bilingual Astro+React scaffold, verified to build. Contains:
  CLAUDE.md            product-spec template (what to build) — fill the {{PLACEHOLDERS}}
  PROGRESS.md          narrative status log skeleton
  README.md            setup/deploy for the new repo
  tasks/               the parallel-safe board:
    README.md            "do the next task" protocol + roadmap + working-in-parallel guide
    CONVENTIONS.md       the island contract + "adding a new article" integration checklist
    _TEMPLATE.md         task-card template
    done/000-scaffold.md a finished card (records what the starter shipped)
    todo/100-int-EXAMPLE.md  an example interactive card
  docs/                ARTICLE-TEMPLATE.md, FEATURE-DOC-TEMPLATE.md
  src/                 i18n (ui.ts/utils.ts), BaseLayout, components, the Interactive registry,
                       an island _TEMPLATE.tsx + a working SampleToy island, pages, global.css
  content/{en,uk}/     two sample bilingual entries (one built island, one placeholder)
  astro.config.mjs, package.json, .github/workflows/deploy.yml, …
```

## The workflow in one breath

Author `content/{en,uk}/<slug>.md` → write its interactive spec in `CLAUDE.md` → wire topic +
interactive metadata → build the island per `tasks/CONVENTIONS.md` → register it → verify
`npm run build` → move the task card to `done/`. Repeat per article; agents run these in parallel.
