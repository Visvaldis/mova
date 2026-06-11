# BOOTSTRAP — build a new interactive bilingual storybook

**You are an agent. Hand this whole file to yourself along with the kit folder it sits in.** Your job:
take the ready-made scaffold in `template/`, retheme it for a new project, and leave it set up so that
"do the next task" can build the rest — with several agents able to work in parallel.

This kit is a generalized version of a working reference project. **Open the reference for worked
examples** of everything below (richer interactives, aggregating features, the integration checklist in
action):

- Reference repo: **https://github.com/Visvaldis/mova**  (live: https://visvaldis.github.io/mova/)
- Reference theme: "the evolution of language." Your theme will differ — that is the *only* thing that
  fundamentally changes. The structure and workflow stay identical.

---

## What stays the same vs. what changes

**Invariants (do not drop any of these — they ARE the workflow):**

1. Content-as-data: articles are `content/{en,uk}/<slug>.md` with typed frontmatter; **never invent or
   rewrite article facts** — every fact an interactive shows traces to its article (or is `TODO(owner)`).
2. One signature **interactive island per article** — the heart of each page; no page ships as plain
   text (unbuilt ones show a topic-styled placeholder).
3. **Bilingual EN + UK** everywhere: one `i18n/ui.ts` dictionary, a site-wide language toggle, dual
   content folders with identical slugs.
4. **Folder-based task board** (`tasks/todo → doing → done` via `git mv`) so agents work in parallel
   without fighting over a status file; numbered cards with `depends_on`, each self-contained.
5. **Three-tier docs:** `CLAUDE.md` (product spec) · `tasks/CONVENTIONS.md` (how islands are built) +
   `tasks/README.md` (protocol) · `PROGRESS.md` (narrative log). Big features get a `docs/<FEATURE>.md`.
6. Registry pattern (`Interactive.astro`), per-topic accent CSS variables, reduced-motion + a11y +
   375px, static build, the "adding a new article" integration checklist.

**The variable:** the theme/domain, project name, the topic palette, and the specific articles +
their interactives. That's it.

---

## Kit layout

```
BOOTSTRAP.md     ← you are here (the hand-off prompt)
README.md        ← what this kit is
template/        ← the ready-to-copy project. Builds out of the box (npm install && npm run build → 0 errors).
                   Ships a demo identity ("Storybook"), 2 sample bilingual entries, and 1 worked island.
```

---

## Procedure

### 0. Gather inputs (ask the user first)

Before touching files, confirm: **project name**, **theme/domain** (one line), **GitHub owner + repo
name** (sets the deploy base), the **topic palette** (3–12 topic ids + a color feel each), and the
**article list** — for each: slug, title, topic, and a one-line idea for its interactive. If the user
only has a theme, propose an article list for approval. Articles' prose is authored by a human or a
dedicated content task — you don't fabricate it.

### 1. Copy + green baseline

Copy everything in `template/` to the new repo root. Then:

```bash
npm install && npm run build      # expect: 0 errors, ~10 pages. This is your known-good baseline.
```

Commit this as the initial commit before rethemeing, so you can diff against a working state.

### 2. Retheme the demo identity (find/replace)

| Token / value | Means | Where it lives |
|---|---|---|
| `{{PROJECT_NAME}}` | display name | `CLAUDE.md`, `README.md`, `PROGRESS.md`, `package.json` description, `global.css` header |
| `{{THEME}}` | one-line domain | `CLAUDE.md`, `README.md`, `PROGRESS.md` |
| `storybook-starter` | npm package name | `package.json` |
| `base: '/storybook'` | deploy subpath → `/<repo>` | `astro.config.mjs` |
| `site: 'https://OWNER…'` | `https://<owner>.github.io` | `astro.config.mjs` |
| `'Storybook'` (brand, EN+UK) | brand + tagline + titles | `src/i18n/ui.ts`, `src/pages/index.astro` title, `favicon.svg` letter |
| hero / about copy | landing + about text | `src/i18n/ui.ts` (`home.hero.*`, `about.*`, `footer.tagline`) |
| `site-lang` / `site-scroll` | localStorage keys (optional rename) | `BaseLayout.astro`, `LanguageToggle.astro`, `index.astro` |

Run `npm run build` again — still 0 errors.

### 3. Topics → accents

In `src/i18n/ui.ts` replace `topicNames` with your topic ids (EN+UK names). In `src/styles/global.css`
add one accent triplet per topic in **both** the light and dark blocks (`[data-topic='<id>']`).
Delete the `sample` / `history` demo topics once yours exist.

### 4. Fill the outline in `CLAUDE.md`

Complete the **interactive catalogue** table (one row per article) and write a short **spec per
interactive** using the spec format given there. Concrete inputs/outputs; cite which article facts each
uses. This is the project's blueprint other agents will build from.

### 5. Author articles (or stub them)

For each article, create `content/en/<slug>.md` + `content/uk/<slug>.md` from
`docs/ARTICLE-TEMPLATE.md` (identical slug; `lang/title/summary` differ). If prose isn't ready, it's
fine to land the EN file and flag the missing UK pair as a `TODO(owner)` content task — the page still
renders with a placeholder interactive. Delete the two `sample-entry-*` demo files once you have real ones.

### 6. Seed the task board

Delete `tasks/todo/100-int-EXAMPLE.md`. For each article add two cards (copy `tasks/_TEMPLATE.md`):
a `05x-wire-topic-<topic>` (metadata + accent, if not already wired) and a `1xx-int-<id>` (build the
island). Keep `tasks/done/000-scaffold.md`. Update the Task index in `tasks/README.md`.

### 7. Build, in parallel, via "do the next task"

Follow `tasks/README.md` § Protocol and § Working in parallel. Each agent claims the lowest-numbered
unblocked `todo/` card with `git mv` into `doing/`, builds per `tasks/CONVENTIONS.md`, verifies
`npm run build`, writes a `## Done` note, and `git mv`s into `done/`. Different interactives = different
files = no conflicts; the only shared files (`ui.ts`, `Interactive.astro`, `global.css`) take small
additive edits.

### 8. Aggregating features + ship

As the catalogue fills, design any cross-article features your theme wants (timeline, course, index)
in `docs/<FEATURE>.md` from `docs/FEATURE-DOC-TEMPLATE.md`, add their nav links, and add a step to the
integration checklist in `tasks/CONVENTIONS.md`. Finish with the `9xx` polish/ship phase (a11y +
Lighthouse ≥ 90, optional self-hosted fonts, deploy). Append a dated note to `PROGRESS.md` each session.

---

## Definition of done (per the spec)

`npm run build` → 0 errors · language toggle works on every page, no untranslated strings · every
interactive usable at 375px, keyboard-navigable, reduced-motion safe · every interactive fact traces to
an article. Full checklist: `CLAUDE.md` § Quality bar and `tasks/CONVENTIONS.md` § Standard acceptance.
