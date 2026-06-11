# Tasks — {{PROJECT_NAME}}

The work backlog. This is the **operational board**: one file per task, each self-contained enough
that an agent can be told *"do the next task"* and finish it without further briefing.

- **Product spec:** `../CLAUDE.md` (what we're building — do not edit article content)
- **Tech conventions:** `CONVENTIONS.md` (how every interactive island is built)
- **Narrative status:** `../PROGRESS.md` (prose log; this board is the live truth)

---

## Status = folder

A task's status is **which folder its file lives in**. No status column to keep in sync — which is
what lets several agents work at once without fighting over one file.

```
tasks/todo/    not started (the queue)
tasks/doing/   in progress  (one per agent)
tasks/done/    finished
tasks/specs/   optional scratch space for design notes
```

See everything at a glance: `ls tasks/todo tasks/doing tasks/done`

---

## Protocol — "do the next task"

1. **Pick it.** The next task is the **lowest-numbered file in `tasks/todo/`** whose every
   `depends_on:` id already lives in `tasks/done/`. If the lowest is blocked, skip to the next unblocked.
2. **Claim it.** `git mv tasks/todo/<file> tasks/doing/` (and commit) — this is your lock.
3. **Load context.** Read the task file in full, plus what it points at: the relevant `CLAUDE.md`
   spec section, the article(s) it names (`content/{en,uk}/<slug>.md`), and `CONVENTIONS.md`. That's
   all the context you need — don't go hunting.
4. **Do the work.** Follow the steps. Keep **every fact sourced from the article**; missing value →
   `TODO(owner): …` in the code and the Done note.
5. **Verify.** Walk the task's Acceptance checklist. Run `npm run build` — must finish with **0 errors**.
6. **Finish.** Append a `## Done — YYYY-MM-DD` note (what shipped, files touched, any `TODO(owner)`,
   follow-ups), then `git mv tasks/doing/<file> tasks/done/`.
7. **Spawn follow-ups.** If the work revealed new work, add task files to `tasks/todo/`.

---

## Working in parallel (multiple agents)

The board is built for this. To avoid collisions:

- **One agent per task file.** Claiming = `git mv` into `doing/`. Two agents never hold the same file.
- **Pick disjoint work.** Different interactives live in different files (`src/components/interactive/
  <Name>.tsx` + `<name>.data.ts`) — those never conflict.
- **Shared touch-points are append-only.** `src/i18n/ui.ts` (add a namespaced block at the end),
  `src/components/Interactive.astro` (add an import + a `BUILT` entry + one render line), and
  `src/styles/global.css` (add one accent triplet) are the only files multiple tasks touch. Keep edits
  small and additive so merges stay trivial; if two agents add to `ui.ts`, the diff is two separate blocks.
- **Optional:** give each agent its own git worktree/branch and merge on green build.

---

## Roadmap

Build order, and why. Numbers are filename prefixes (leave gaps to insert future work).

| Phase | Range | What |
|-------|-------|------|
| **0 · Foundation** | `000–0xx` | Shell + shared island infra. **Shipped by the starter** (`000-scaffold`). |
| **0 · New-article wiring** | `05x` | Topic + interactive metadata for each authored article (one per topic). |
| **1 · Interactives** | `100–2xx` | The heart of the site — one island per article. **Do these first.** |
| **2 · Aggregating features** | `3xx` | Master timeline, course/journey, indexes — whatever your theme wants. |
| **3 · Open-ended areas** | `4xx` | Playground / sandbox toys, if any. |
| **4 · Polish & ship** | `9xx` | Accessibility + Lighthouse pass, self-host fonts, deploy. |

---

## Task index

One row per article (the unit you keep extending). Status = which folder the file is in.

| Article (`slug`) | Topic | Interactive id | Task |
|---|---|---|---|
| sample-entry-one | sample | sample-toy | `000-scaffold` (demo, done) |
| _{{your-slug}}_ | _{{topic}}_ | _{{id}}_ | `1xx-int-{{id}}` |

---

## Adding a task

Copy `_TEMPLATE.md` into `tasks/todo/` as `NNN-<kind>-<slug>.md`. Numbering: `0xx` infra · `1xx–2xx`
interactives · `3xx` features · `4xx` playground · `9xx` polish/ship. Leave gaps. Set `depends_on:` to
the ids (filenames without `.md`) that must be in `done/` first.

## Adding a NEW article (the recurring case)

When you drop `content/en/<slug>.md` (+ `content/uk/<slug>.md`) it renders immediately (generic accent,
placeholder interactive). To fully onboard it, create task files for: (1) **wire metadata**
(`05x-wire-topic-<topic>`) and (2) **build the interactive** (`1xx-int-<id>`), then follow the
integration checklist in `CONVENTIONS.md`. Add a row to the Task index above.
