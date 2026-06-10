# Tasks — Mova / Tongue

The work backlog. This is the **operational board**: one file per task, each self-contained
enough that an agent can be told *"do the next task"* and finish it without further briefing.

- **Product spec:** `../CLAUDE.md` (what we're building — do not edit article content)
- **Tech conventions:** `CONVENTIONS.md` (how every interactive island is built)
- **Narrative status:** `../PROGRESS.md` (prose summary; this board is the live truth)

---

## Status = folder

A task's status is **which folder its file lives in**. There is no status column to keep in sync.

```
tasks/todo/    not started (the queue)
tasks/doing/   in progress  (normally one at a time)
tasks/done/    finished
tasks/specs/   optional scratch space for design notes (design itself happens in plan mode)
```

See everything at a glance:

```sh
ls tasks/todo tasks/doing tasks/done
```

---

## Protocol — "do the next task"

1. **Pick it.** The next task is the **lowest-numbered file in `tasks/todo/`** whose every
   `depends_on:` id already lives in `tasks/done/`. If the lowest-numbered one is still blocked,
   skip to the next unblocked task.
2. **Claim it.** `git mv tasks/todo/<file> tasks/doing/`.
3. **Load context.** Read the task file in full, plus the things it points at: the relevant
   `CLAUDE.md` spec section, the article(s) it names (`content/en|uk/<slug>.md`), and
   `CONVENTIONS.md`. That is all the context you need — don't go hunting.
4. **Do the work.** Follow the steps. Keep **every fact sourced from the article**; if you need a
   value the article doesn't give, write `TODO(seva): …` in the code and record it in the Done note.
5. **Verify.** Walk the task's Acceptance checklist. Run `npm run build` — it must finish with **0 errors**.
6. **Finish.** Append a `## Done — YYYY-MM-DD` note (what shipped, files touched, any `TODO(seva)`,
   follow-ups), then `git mv tasks/doing/<file> tasks/done/`.
7. **Spawn follow-ups.** If the work revealed new work, add task files to `tasks/todo/` (see below).

---

## Roadmap

Build order, and why. Numbers are filename prefixes (gaps left for inserting future work).

| Phase | Range | What |
|-------|-------|------|
| **0 · Foundation** | `010` | Shared island infra (reduced-motion hook, conventions). Unblocks every component. |
| **0 · New-article wiring** | `050–055` | Wire the two already-added articles (`thought`, `dialects`) into topic/accent/i18n metadata so they render correctly. |
| **1 · Interactives** | `100–250` | The heart of the site — one island per article. **Do these first.** 14 have specs in `CLAUDE.md`; 2 (`thought-lens`, `accent-atlas`) carry their own design step inside the task (done in plan mode). |
| **2 · Features** | `300–340` | Master timeline page, topic selection/filtering, animated home-card previews. |
| **3 · Playground** | `400` | A sandbox area — open-ended, so the task designs (in plan mode) and builds in one go. |
| **4 · Polish & ship** | `900–920` | Accessibility + Lighthouse pass, self-hosted fonts, deploy. |

---

## Task index

Interactives, keyed by article (the unit you'll keep extending as you add articles). To see
status, note which folder the file is in.

| Article (`slug`) | Topic | Interactive id | Task |
|---|---|---|---|
| origins-of-language | origins | origins-timeline | `110-int-origins-timeline` |
| language-families | families | family-tree | `120-int-family-tree` |
| sound-change | sound | sound-shift | `100-int-sound-shift` *(prototype exists — first)* |
| ukrainian-language-history | ukrainian | ukrainian-timeline | `130-int-ukrainian-timeline` |
| internet-language | internet | slang-decoder | `140-int-slang-decoder` |
| ai-and-language | ai | ai-language-lab | `150-int-ai-language-lab` |
| new-languages | birth | creole-lab | `160-int-creole-lab` |
| language-death-and-revival | revival | vitality-map | `170-int-vitality-map` |
| writing-systems | writing | script-evolver | `180-int-script-evolver` |
| traveling-words | borrowing | word-traveler | `190-int-word-traveler` |
| everyday-etymologies | everyday | word-xray | `200-int-word-xray` |
| ukrainian-word-origins | roots | roots-garden | `210-int-roots-garden` |
| names-and-places | names | name-map | `220-int-name-map` |
| etymology-myths | myths | myth-buster | `230-int-myth-buster` |
| language-and-thought | thought | thought-lens | `240-int-thought-lens` *(design+build — no `CLAUDE.md` spec)* |
| dialects-and-accents | dialects | accent-atlas | `250-int-accent-atlas` *(design+build — no `CLAUDE.md` spec)* |

Features & polish: `300`/`310` timeline · `320`/`330` topic selection · `340` home previews ·
`400` playground · `900` a11y+Lighthouse · `910` fonts · `920` deploy.

---

## Adding a NEW article (the recurring case)

When you drop `content/en/<slug>.md` (and ideally `content/uk/<slug>.md`), it renders immediately
thanks to fallbacks — but with a generic accent, a `✦` icon, and an untranslated topic name. To
fully onboard it, create task files (copy `_TEMPLATE.md`) for:

1. **Wire metadata** (`05x-wire-topic-<topic>`): add the topic to `topicNames` and the interactive
   to `interactiveInfo` in `src/i18n/ui.ts`, and add a `[data-topic='<topic>']` accent (light + dark)
   in `src/styles/global.css`. See `050-wire-topic-thought` for the exact recipe.
2. **Build the interactive** (`2xx-int-<id>`): one task that **designs and builds** the component.
   If `CLAUDE.md` has a spec, follow it; if not, the task's first step is "Design (in plan mode)" —
   Seva reviews the plan before the agent builds. See `240-int-thought-lens` for the design+build
   shape. Build per `CONVENTIONS.md`.
3. **Check the UK pair exists.** If `content/uk/<slug>.md` is missing, the EN article works but the
   language toggle 404s for it — flag it as a `TODO(seva)` content task (article prose is authored,
   not generated). *(Live example: `uk/dialects-and-accents.md` is currently missing.)*
4. Add a row to the **Task index** above.

---

## Adding a task

Copy `_TEMPLATE.md` into `tasks/todo/` as `NNN-<kind>-<slug>.md`. Numbering:
`0xx` infra · `1xx–2xx` interactives · `3xx` features · `4xx` playground · `9xx` polish/ship.
Leave gaps. Set `depends_on:` to the ids (filenames без `.md`) that must be in `done/` first.
