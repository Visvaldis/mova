# CLAUDE.md — {{PROJECT_NAME}}

Build spec for a coding agent. Read this fully before writing code. This file is
**what we're building** (the product). How each interactive island is built lives in
`tasks/CONVENTIONS.md`; the live backlog lives in `tasks/`; narrative status in `PROGRESS.md`.

> Fill every `{{PLACEHOLDER}}`. Delete this quote block when you do. The bracketed
> "EXAMPLE (mova)" notes show how the reference project answered each section — replace,
> don't keep them.

## What you are building

**{{PROJECT_NAME}}** — a highly interactive, **bilingual (English + Ukrainian)** website that
turns a set of authored articles about **{{THEME}}** into an interactive storybook. Content lives
in `content/en/*.md` and `content/uk/*.md` (authored separately — do **not** rewrite article
content). Your job: turn each article into an interactive web page and build the site shell around them.

> EXAMPLE (mova): theme = "the evolution of language"; 21 articles, each with a signature
> hands-on component (a Grimm's-Law explorer, a zoomable language family tree, …).

## Hard requirements

1. **Bilingual toggle.** Site-wide EN ⇄ УК switcher on every page (top right). Switching keeps the
   user on the same article (slugs are identical across languages) and preserves scroll where feasible.
   Persist choice in `localStorage`; default to browser language (`uk` → Ukrainian, else English).
2. **Every article gets its interactive component.** Each article's frontmatter has an `interactive`
   field naming a component. These are the heart of the site — never ship a page as plain text. Until a
   component is built, its article renders a topic-styled **placeholder** (already wired) — not raw text.
3. **All UI strings localized.** Nav, buttons, footer, component labels, tooltips — everything has EN
   and UK variants in one `i18n` dictionary (`src/i18n/ui.ts`).
4. **Sources rendered as a styled "Explore further" panel** at the end of each article (from the
   `sources` frontmatter list), with external-link icons.
5. **Static-deployable.** No backend. Builds to static files (GitHub Pages / Netlify / Vercel).

## Recommended stack

Astro + a UI-framework island (React, preferred) for the interactive components. D3 or plain SVG for
visualizations; no heavy charting libs unless needed. This starter ships exactly that, building to
static output. The stack is swappable, but the patterns below assume it.

## Content model

```
content/
  en/<slug>.md
  uk/<slug>.md      # same slug, same frontmatter except lang/title/summary
```

Frontmatter fields: `slug`, `lang`, `title`, `summary`, `order`, `topic`, `readingTime`,
`interactive` (component id), `sources` (list of `{title, url, note}`). Schema enforced in
`src/content.config.ts`. Authoring template: `docs/ARTICLE-TEMPLATE.md`.

Render markdown body → page. Pull-quotes (`> blockquote`) are styled large. The `interactive`
component mounts where the body contains the marker `<!-- INTERACTIVE -->`; if no marker, it mounts
after the intro (first H2).

## Pages

- **Home** `/{lang}/` — hero + tagline, grid of article cards (title, summary, topic tag, reading
  time), topic filter. *(Shipped.)*
- **Article** `/{lang}/{slug}/` — body with embedded interactive, reading-progress bar, "Explore
  further" panel, prev/next nav. *(Shipped.)*
- **About** `/{lang}/about/` — short; explain the project and its bilingual nature. *(Shipped.)*
- **Aggregating features** (build as the catalogue grows) — e.g. a **master timeline** of dated
  events from every article, or a guided **journey/course** through all of them. Spec each in its own
  `docs/<FEATURE>.md` (see `docs/FEATURE-DOC-TEMPLATE.md`) and add its nav link in `Nav.astro`.

> EXAMPLE (mova): also has a master `/timeline`, a `/playground` of free-play toys, a `/journey`
> course, and a `/words` index. Yours will differ — design the ones your theme wants.

## The interactive catalogue

This is the project's outline: one row per article, naming its signature interactive. **Fill this in**
with your articles, then write a spec for each interactive in the section below.

| Article (`slug`) | Topic | Interactive id | Status |
|---|---|---|---|
| sample-entry-one | sample | `sample-toy` | built (demo) |
| sample-entry-two | history | `sample-two` | placeholder |
| _{{your-slug}}_ | _{{topic}}_ | _{{interactive-id}}_ | todo |

## Interactive component specs (one per article)

Each interactive gets a short spec: what the reader does, what they see, and which article facts it
draws on. Keep specs concrete (name the exact inputs/outputs). **No invented data** — every number,
date, and word must trace to the article; if you need a value the article lacks, mark it
`TODO(owner)`.

### Spec format (copy per interactive)

> ### `{{interactive-id}}` — for `{{article-slug}}`
> One-paragraph pitch: what the reader manipulates and what changes on screen. List the concrete
> elements (controls, panels, modes) and the article-sourced data each uses. Note any second tab/mode.

> EXAMPLE (mova) — `sound-shift` for `sound-change`: "Grimm's Law explorer. Input row of PIE/Latin
> words (pater, piscis, tres…); animate the consonant transforming (p→f, t→θ, k→h) into the English
> word as the user drags a slider. 'Try it' mode fires one rule across all words at once. Show the
> three chain shifts as a circular diagram."

## Design direction

- Feel: editorial + playful science museum. Big type, generous whitespace, **one accent color per
  topic area** (set on `<body data-topic="…">`; components inherit `--accent`, `--accent-soft`,
  `--accent-2` automatically in light **and** dark mode). Add each topic's accent triplet in
  `src/styles/global.css` (light + dark blocks).
- Dark/light mode respecting `prefers-color-scheme`.
- Typography must handle Cyrillic well (the starter uses a system stack; self-host Inter/Fixel/
  e-Ukraine for polish).
- Mobile-first; interactives degrade to tap/step interactions at **375px**.
- Accessibility: all interactives keyboard-navigable, `prefers-reduced-motion` honored, alt/aria text
  in both languages.

## Adding new articles later

A new article is **not done** when the two MD files land. It must also be wired into the site's
aggregating features and any hardcoded counts — full checklist in `tasks/CONVENTIONS.md` § "Adding a
new article". The recurring loop: drop `content/{en,uk}/<slug>.md` → wire topic + interactive metadata
→ build the interactive → wire into aggregating features → update stale counts.

## Quality bar / definition of done

- `npm run build` produces static output with **zero errors**.
- Lighthouse ≥ 90 performance & accessibility on article pages.
- Language toggle works on every page; no untranslated UI strings.
- Every interactive functional on mobile (375px), keyboard-navigable, reduced-motion safe.
- Every fact shown inside an interactive traces to an article — no invented data (`TODO(owner)` otherwise).

## Out of scope

CMS, comments, search, user accounts, analytics — unless a `docs/<FEATURE>.md` explicitly adds one.
