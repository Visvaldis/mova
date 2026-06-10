# Conventions — interactive islands & features

Shared decisions so every component task stays small. Read once; follow in every build task.

## Island contract

- File: `src/components/interactive/<PascalName>.tsx`. Default export a React component.
- **Single prop:** `{ lang: 'en' | 'uk' }`. Each language is its own static page, so the component
  just receives `lang` — **no internal language toggle** (the site toggle in the nav drives it).
- Register by interactive id in `src/components/Interactive.astro`:
  ```ts
  import SoundShift from './interactive/SoundShift.tsx';
  const registry: Record<string, any> = { 'sound-shift': SoundShift };
  ```
  It then auto-mounts at the article's `<!-- INTERACTIVE -->` marker with `client:visible`, and the
  placeholder disappears for that id.

## Strings vs. data

The spec requires UI strings in a single dictionary. Split by kind:

- **Chrome** (labels, buttons, tooltips, aria text) → `src/i18n/ui.ts`, **namespaced by component
  id**: `'soundShift.tryTitle'`, `'familyTree.hideExtinct'`, … Add both `en` and `uk`. Never
  hardcode user-facing text in JSX.
- **Bulky bilingual content data** (word lists, era snippets, quiz items, map nodes, glosses) →
  co-locate as `src/components/interactive/<name>.data.ts`, typed, with per-item `{ en, uk }` (or
  `{ en: [...], uk: [...] }`). It's article-derived *content*, not chrome, and would bloat `ui.ts`.

## Styling — use the topic variables

The page sets the accent on `<body data-topic="...">` (see `BaseLayout.astro`), so a component
nested in `.interactive-wrap` inherits these CSS custom properties and auto-matches the article's
color in light **and** dark mode:

```
--accent  --accent-soft  --accent-2  --bg  --bg-elev  --text  --muted
--line  --shadow  --shadow-lg  --radius  --radius-sm
```

- **Never hardcode hex.** (Porting the prototype: its violet `#7c3aed` → `var(--accent)`, etc.)
- Scope your CSS so it can't leak into `.prose` (CSS module, or a unique class prefix like `.ss-…`).

## Motion

Global CSS already neutralizes **CSS** animations/transitions under `prefers-reduced-motion`. For
**JS-driven** motion (requestAnimationFrame, autoplay, transitions toggled from JS), gate on the
shared `useReducedMotion()` hook (created in task `010`) and render a sensible static end-state.

## Accessibility & mobile

- Prefer native controls (`<input type="range">`, `<button>`) — they're keyboard-accessible for free.
  Custom widgets need roles, `tabindex`, and key handlers. Focus ring is provided globally.
- Every control has a **bilingual** `aria-label`/alt pulled from `ui.ts`.
- Must work at **375px**. Any drag interaction needs a tap/step fallback.

## Facts

No invented data. Every number, date, and word must trace to the article. Missing value →
`TODO(seva): …` in code **and** in the task's Done note.

## Standard acceptance checklist

Every `int-*` task is done only when:

- [ ] `npm run build` → 0 errors.
- [ ] Renders and is fully usable in both `en` and `uk`.
- [ ] No hardcoded user-facing strings (all via `ui.ts` / `.data.ts`).
- [ ] Uses topic CSS variables; correct in light **and** dark.
- [ ] `prefers-reduced-motion` honored (JS motion gated).
- [ ] Keyboard-navigable; controls have bilingual aria/alt.
- [ ] Works at 375px.
- [ ] Every fact traces to the article (or is marked `TODO(seva)`).
- [ ] Registered in `Interactive.astro`; the placeholder no longer shows for that id.
- [ ] File moved to `tasks/done/` with a `## Done` note.

## Adding a new article — integration checklist

A new article is NOT done when the two MD files land. Every new article must also be wired into
the site's aggregating features, in the same change set or an immediately following task:

1. **Master timeline** (`src/data/timelineEvents.ts`): add every *dated* event the article
   contains, `slug` pointing at the new article. If an event already exists from an older survey
   article, re-point it to the deeper article rather than duplicating the year.
2. **Journey** (`src/components/journey/journey.data.ts` + `src/data/journey-questions.json`):
   add the slug to an existing chapter or create a new one; every chapter needs 6 questions
   (2 per article is the norm), bilingual, `correct: 0` (the UI shuffles at runtime).
3. **Interactive**: spec in `CLAUDE.md`, `interactiveInfo` entry in `ui.ts` (localized
   placeholder), and a board task card if the component isn't built in the same change.
4. **Stale counts**: grep for hardcoded article/chapter counts and update them —
   `home.hero.subtitle`, `journey.done.body` (EN+UK), `docs/JOURNEY.md`, `Journey.tsx` header.
   (These have gone stale twice already; check every time.)
5. Topic hubs, word index, home grid, and topic filter pick the article up automatically —
   no action needed, but verify in the built output.
