# Conventions — interactive islands & features

Shared decisions so every component task stays small and parallel-safe. Read once; follow in every
build task. (Product spec → `../CLAUDE.md`. Live backlog → this folder. Narrative → `../PROGRESS.md`.)

## Island contract

- File: `src/components/interactive/<PascalName>.tsx`. Default-export a React component.
- **Single prop:** `{ lang: 'en' | 'uk' }`. Each language is its own static page, so the component
  just receives `lang` — **no internal language toggle** (the site nav toggle drives it).
- **Register** in `src/components/Interactive.astro` (3 steps, all three): import it, add its id to the
  `BUILT` set, and add a `{id === '<id>' && <Component client:visible lang={lang} />}` line. It then
  mounts at the article's `<!-- INTERACTIVE -->` marker and the placeholder stops showing for that id.
- Copy `src/components/interactive/_TEMPLATE.tsx` to start; `SampleToy.tsx` is a working example.

## Strings vs. data

UI strings live in one dictionary. Split by kind:

- **Chrome** (labels, buttons, tooltips, aria text) → `src/i18n/ui.ts`, **namespaced by component id**:
  `'soundShift.tryTitle'`, `'familyTree.hideExtinct'`. Add both `en` and `uk`. Never hardcode
  user-facing text in JSX.
- **Bulky bilingual content data** (word lists, era snippets, quiz items, map nodes, glosses) →
  co-locate as `src/components/interactive/<name>.data.ts`, typed, with per-item `{ en, uk }`. It's
  article-derived *content*, not chrome, and would bloat `ui.ts`.

## Styling — use the topic variables

The page sets the accent on `<body data-topic="…">` (see `BaseLayout.astro`), so a component nested
in `.interactive-wrap` inherits these custom properties and auto-matches the article's color in light
**and** dark mode:

```
--accent  --accent-soft  --accent-2  --bg  --bg-elev  --text  --muted
--line  --shadow  --shadow-lg  --radius  --radius-sm  --on-accent
```

- **Never hardcode hex.** Map any prototype color to the nearest variable.
- Scope your CSS so it can't leak into `.prose` (a scoped `<style>` in the island, a CSS module, or a
  unique class prefix like `.ss-…`).

## Motion

Global CSS already neutralizes **CSS** animations/transitions under `prefers-reduced-motion`. For
**JS-driven** motion (requestAnimationFrame, autoplay, JS-toggled transitions), gate on the shared
`useReducedMotion()` hook and render a sensible static end-state.

## Accessibility & mobile

- Prefer native controls (`<input type="range">`, `<button>`) — keyboard-accessible for free. Custom
  widgets need roles, `tabindex`, and key handlers. Focus ring is provided globally.
- Every control has a **bilingual** `aria-label`/alt pulled from `ui.ts`.
- Must work at **375px**. Any drag interaction needs a tap/step fallback.

## Facts

No invented data. Every number, date, and word must trace to the article. Missing value →
`TODO(owner): …` in the code **and** in the task's Done note.

## Standard acceptance checklist

Every `int-*` task is done only when:

- [ ] `npm run build` → 0 errors.
- [ ] Renders and is fully usable in both `en` and `uk`.
- [ ] No hardcoded user-facing strings (all via `ui.ts` / `.data.ts`).
- [ ] Uses topic CSS variables; correct in light **and** dark.
- [ ] `prefers-reduced-motion` honored (JS motion gated).
- [ ] Keyboard-navigable; controls have bilingual aria/alt.
- [ ] Works at 375px.
- [ ] Every fact traces to the article (or is marked `TODO(owner)`).
- [ ] Registered in `Interactive.astro`; placeholder no longer shows for that id.
- [ ] File moved to `tasks/done/` with a `## Done` note.

## Adding a new article — integration checklist

A new article is NOT done when the two MD files land. Wire it into the aggregating features in the
same change set or an immediately following task:

1. **Topic + interactive metadata.** Add the topic to `topicNames` and the interactive to
   `interactiveInfo` in `src/i18n/ui.ts` (localized name + placeholder blurb, seeded from the article
   summary only). Add a `[data-topic='<topic>']` accent triplet in `src/styles/global.css` (light + dark).
2. **Each aggregating feature your project has.** e.g. master timeline (`src/data/timelineEvents.ts`)
   — add every *dated* event, `slug` pointing at the new article; journey/course — add the slug to a
   chapter + its checkpoint questions. (List your features here as you build them.)
3. **Interactive.** Spec in `CLAUDE.md`, an `interactiveInfo` entry, and a board task card if it isn't
   built in the same change.
4. **Stale counts.** Grep for hardcoded article/chapter counts and update them (home hero subtitle,
   any "N chapters" copy, docs). These go stale silently — check every time.
5. **Verify** the article appears on the home grid and topic filter, and that the UK pair exists (a
   missing `content/uk/<slug>.md` makes the language toggle 404 — flag it as a `TODO(owner)` content task).
