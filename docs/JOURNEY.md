# JOURNEY.md — guided course mode ("The Journey / Мандрівка")

Plan for `/{lang}/journey/`: a guided path through the whole site — 18 articles and 7 toys
organized into 6 chapters, each with a 3-question checkpoint, progress tracked in
`localStorage`, ending in a generated, downloadable certificate. Pure orchestration of
existing content: **no new facts are written for this feature** — questions are derived
from article text, the certificate generator reuses `soundlaws.ts`.

## 1. Why

The site is a buffet; this gives it a menu. A visitor who finishes one article has no
obvious next step, and the toys don't know the articles exist as a sequence. The Journey
turns a 20-minute visit into a multi-session habit, and gives completionists a reason to
read all 18.

## 2. The path — 6 chapters

Each chapter = 2–4 articles + 1 toy + 1 checkpoint. Order teaches deliberately
(mechanisms before case studies before frontiers):

1. **Where language comes from** — origins-of-language, new-languages, language-and-thought · toy: Babel Daily
2. **How languages change** — language-families, sound-change, dialects-and-accents · toy: Sound Shift Sandbox
3. **The Ukrainian story** — ukrainian-language-history, ukrainian-word-origins, names-and-places · toy: Stratigraph
4. **Words on the move** — traveling-words, everyday-etymologies, etymology-myths · toy: Word Atlas
5. **Freezing and reviving** — writing-systems, language-death-and-revival · toy: Word Time Machine
6. **New frontiers** — internet-language, ai-and-language, constructed-languages, machine-languages · toy: Conlang Forge

A chapter is complete when all its articles are **visited** and the checkpoint is **passed**
(2 of 3 correct; retry freely — this is a museum, not an exam).

## 3. Checkpoints — the question bank

`src/data/journey-questions.json`: 36 hand-written multiple-choice questions (6 per
chapter; each serving picks 3 at random), every one **derived from a specific article**
and carrying its `article` slug — the rule from CLAUDE.md applies: no invented facts,
each question's answer must be verifiable in the named article. Wrong options reuse the
myths article's energy (plausible folk-etymologies as distractors). Format:

```json
{ "chapter": 2, "article": "sound-change",
  "q": {en,uk}, "options": [{en,uk} ×3], "correct": 0,
  "why": {en,uk} }   // one-line explanation shown after answering
```

## 4. Progress tracking (local, honest)

`localStorage` `mova:journey:v1`: `{ v, startedAt, visited: string[], passed: number[] }`.
Article pages get a 3-line inline script (in the article layout) that appends their slug
to `visited` — local only, no analytics, stated on the Journey page ("progress lives in
this browser"). The Journey island reads it and renders chapter rings.

## 5. The certificate

On completing all 6 chapters: a canvas-generated PNG (1200×850, both themes) —
"Folk-Etymology-Proof / Стійкість до народної етимології", the user's typed name **plus
its Grimm's Law transformation** (reusing `applyPack` from `soundlaws.ts` — the site's
running joke pays off), date, chapter list. Download button; name never leaves the browser.

## 6. Architecture

- `src/pages/[lang]/journey/index.astro` + `src/components/journey/Journey.tsx`
  (one island, `client:visible`) + `journey.module.css`.
- Visit-beacon: small addition to the article page template (no new island).
- Strings `journey.*` in `ui.ts` (EN+UK); questions file carries its own bilingual text.
- Nav: add "Journey / Мандрівка" (nav has room for a fifth item; verify 375px wrap).
- Reduced-motion: progress-ring animations gated; certificate has no motion.
- Budget: island ≤ 20 KB gz + questions ~8 KB gz.

## 7. Milestones

1. **M1** — path UI, visit tracking, checkpoints for chapters 1–2 (12 questions), progress rings.
2. **M2** — all 36 questions, certificate generator, completion flow.
3. **M3** — polish: per-chapter "continue where you left off" deep links, confetti
   (reduced-motion-gated), home-page Journey teaser card.

## 8. Risks

- **Question quality is content work** — every question hand-checked against its article;
  the `why` line must quote or closely paraphrase the article.
- **localStorage fragility** — state is versioned; losing it loses progress (acceptable;
  stated in UI). No sync, by design.
- **Nav crowding at 375px** — test; fallback is moving Journey into the hero CTA instead.

## Out of scope

Accounts, server-side progress, timed exams, leaderboards.
