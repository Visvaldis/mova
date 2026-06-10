# Progress — Mova / Tongue

_Last updated: 2026-06-09_

Narrative status. `CLAUDE.md` is the product spec; `README.md` is setup/deploy.
**The live, actionable backlog now lives in [`tasks/`](tasks/README.md)** — one file per task,
status tracked by folder (`todo/` → `doing/` → `done/`). To advance the build, tell an agent
*"do the next task"* (protocol in `tasks/README.md`). This file is the high-level summary.

Legend: ✅ done · 🟡 placeholder/partial · ⬜ not started

---

## ✅ Done — base structure (deployable shell)

- **Project scaffold** — Astro 5 + `@astrojs/react`, `marked`, strict TS. `npm run build` → 0 errors, 36 pages.
- **GitHub Pages wiring** — `astro.config.mjs` (`site` + `base: '/mova'`, `trailingSlash: 'always'`),
  `.github/workflows/deploy.yml` (Astro action → Pages), `public/.nojekyll`, base-path-safe links via `withBase()`.
- **Content layer** — `src/content.config.ts` globs `content/<lang>/<slug>.md` with **path-based ids**
  (`en/…`, `uk/…`) so EN/UK don't collide on the shared `slug`. Zod schema matches frontmatter.
- **Bilingual system** — `src/i18n/ui.ts` (every UI string EN+UK, 14 topic names, 14 interactive blurbs) +
  `src/i18n/utils.ts` (lang detection, `useTranslations`, `withBase`, `localizedPath`).
- **Language toggle** — top-right on every page; stays on the same article, persists to `localStorage`,
  restores scroll; root `/` redirects by saved → browser → default language.
- **Pages** — home (hero + 14-card grid), article (`[lang]/[slug]`), timeline, about, 404.
- **Article rendering** — body split at `<!-- INTERACTIVE -->` marker (fallback: before first H2) with the
  interactive mounted between; large pull-quotes; reading-progress bar; "Explore further" sources panel
  (external-link icons); prev/next nav.
- **Design** — light/dark via `prefers-color-scheme`, per-topic accent colors (all 14 topics),
  `prefers-reduced-motion` honored, mobile-first (verified at 375px), Inter (Cyrillic subset) via Google Fonts.
- **Git** — initial commit on `main`, remote `origin` → `git@github.com:Visvaldis/mova.git` (not pushed).

---

## ⬜ To do — next (see [`tasks/`](tasks/README.md) for the live backlog)

**The core work is the interactive components** — all currently render a 🟡 placeholder via the
registry in `src/components/Interactive.astro`. Then features, then a playground, then ship.
Granular task files live in `tasks/todo/`; tell an agent *"do the next task"* to advance.

Phases:

1. **Foundation** (`010`) + **new-article wiring** (`050`/`055`) — shared island infra and metadata
   for the two newest articles.
2. **Interactives** (`100`–`250`) — one island per article. 14 have specs in `CLAUDE.md`; **start with
   `sound-shift`** (a prototype exists in `prototype-sound-shift.html`). The two newest ones
   (`thought-lens`, `accent-atlas`) carry their own design step inside the task (done in plan mode).
3. **Features** (`300`–`340`) — master timeline page, topic selection/filtering, animated home-card previews.
4. **Playground** (`400`) — open-ended; designs (in plan mode) and builds in one task.
5. **Polish & ship** (`900`–`920`) — accessibility + Lighthouse ≥ 90, self-hosted fonts, deploy.

### Current content snapshot
- **16 articles** authored (`content/en/` has 16; `content/uk/` has 15) — all render today (placeholders).
- ⚠️ **`content/uk/dialects-and-accents.md` is missing** → the EN page works but the language toggle
  404s for it. Article prose is hand-authored, so this is a `TODO(seva)` writing task.
- ⚠️ Topics `thought` / `dialects` and interactives `thought-lens` / `accent-atlas` are **not yet wired**
  into `src/i18n/ui.ts` (topic names + blurbs) or `src/styles/global.css` (accent colors) → tasks `050`/`055`.

---

## Notes / decisions

- **16 articles and growing.** `CLAUDE.md` carries full interactive specs for 14 of them; the two
  newest (`language-and-thought` → `thought-lens`, `dialects-and-accents` → `accent-atlas`) post-date
  the spec, so their tasks (`tasks/240`/`250`) design **and** build in one go — the design step runs
  in plan mode for review. Placeholder blurbs are derived from each article's authored `summary` —
  no invented data. New articles get onboarded via the checklist in `tasks/README.md`.
- **Loader gotcha (resolved).** Astro's glob loader uses frontmatter `slug` as the id by default, collapsing
  EN+UK; `generateId` forces path-based ids. See comment in `src/content.config.ts`.
- **Base path.** Every internal link must go through `withBase()` / `localizedPath()` or it 404s under `/mova/`.
  Local dev serves at `http://localhost:4321/mova/`, not bare `/`.
- **No backend / CMS / search / analytics** — out of scope per spec.

---

## ✅ Update — 2026-06-10 (content/playground session)

- **Content complete: 18 articles × 2 languages.** The previously-missing `content/uk/dialects-and-accents.md`
  now exists, plus `constructed-languages` and `machine-languages` (EN+UK). All EN/UK pairs verified.
- **`CLAUDE.md` now has specs for all 18 interactives** (added `thought-lens`, `accent-atlas`,
  `conlang-workbench`, `code-vs-speech`) — the "needs design" gap is closed.
- **Wiring done** (former tasks `050`/`055` scope): `src/i18n/ui.ts` has topic names + interactive blurbs for
  `thought` / `dialects` / `conlangs` / `machine`; `src/styles/global.css` has their light+dark accents.
- **Playground P1 shipped** (spec: `docs/PLAYGROUND.md`):
  - Hub `/{lang}/playground/` + nav link; registry in `src/components/playground/registry.ts`.
  - `babel-daily` — daily guess-the-language (UDHR Art. 1, 41 languages), hints, streak/stats in
    `localStorage` (`mova:playground:babel`), emoji share, practice mode.
  - `word-time-machine` — 15 hand-curated etymology chains (`src/data/playground/etymologies.json`,
    every entry sourced: etymonline/ЕСУМ), cognate fans, * marks reconstructions.
  - `sound-shift-sandbox` — Grimm / Ukrainian ikavism / Great Vowel Shift rule packs in
    `src/lib/soundlaws.ts` (single-pass chain-shift application), per-character diff highlighting.
  - Shared `.toy` / `.pg-card` styles in `global.css`; `prefers-reduced-motion` honored; all strings i18n'd.
- **Build verified: 52 pages, zero errors.** (Sandbox note: ran with a temp config overriding
  `outDir`/`cacheDir`; repo `dist/` is stale — rebuild on host with plain `npm run build`.)
- **P2 remaining** (per `docs/PLAYGROUND.md`): `stratigraph`, `conlang-forge`, `cognate-rush`.

## ✅ Update — 2026-06-10 (Playground P2)

- **All six toys from `docs/PLAYGROUND.md` are now live**: added `stratigraph` (255-lemma curated
  ЕСУМ-sourced lexicon + conservative stemmer in `src/lib/uk-stem.ts` — misses render honest-grey),
  `conlang-forge` (seeded generator in `src/lib/conlang.ts`: 3 phoneme presets × word order × plural
  style → 12-word lexicon, sample sentence, "fast-forward 500 years" drift with 2 sound laws + analogy),
  and `cognate-rush` (60-second EN↔UK match game, 18 true cognate pairs + 6 false friends, best score
  in `localStorage`).
- Datasets: `src/data/playground/uk-lexicon.json`, `src/data/playground/cognates.json` — every entry sourced.
- Build verified green (64 pages). Logic smoke-tested via node (stemmer hits козак/майдан/ночі/словами;
  generator deterministic per seed).

## ✅ Update — 2026-06-10 (first article interactives)

- **`sound-shift` is live** (task 100): prototype ported to `src/components/interactive/SoundShift.tsx`
  + `soundShift.data.ts`; chrome strings in `ui.ts` (`soundShift.*`); topic CSS vars (no hardcoded hex);
  pop animation gated on `useReducedMotion`; internal lang-toggle removed per CONVENTIONS.
- **`myth-buster` is live** (task 230): 8 claims from the article in `mythBuster.data.ts`,
  real/myth buttons, per-claim explanations, score + ranking end screen.
- **Registry note:** Astro can't put client directives on dynamic component variables —
  `Interactive.astro` now uses explicit `{id === '…' && <Comp client:visible …/>}` renders plus a
  `BUILT` set for the placeholder fallback. Follow this pattern for the remaining 16.
- Board: moved 050, 055, 100, 230, 400 → done (050/055 were closed by the content session; 400 by
  Playground P1+P2). Build green: 64 pages.

## ✅ Update — 2026-06-10 (interactives 110 + 120)

- **`origins-timeline` live** (task 110): log-scale SVG axis 7 Mya → today, six milestone nodes
  (click + keyboard + prev/next step buttons for mobile), explainer cards condensed from the article,
  compare-hypotheses toggle with three schematic bands. Undated-in-article milestones (Homo erectus,
  FOXP2) carry `dateTodo` / `TODO(seva)` flags in `originsTimeline.data.ts`.
- **`family-tree` live** (task 120): collapsible PIE tree — 10 branches, 27 languages; EN/UK
  "you are here" stars; extinct = dashed/grey/†; hover = speakers + first attestation; click a leaf →
  mother/three/night cognate card with PIE forms; tree ⇄ schematic-map toggle (map dots open the
  branch in tree view). `TODO(seva)`: speaker counts & attestation dates in `familyTree.data.ts`
  are rough public figures, not from the article — verify before publishing.
- Board: 110, 120 → done. Build green: 64 pages, islands verified SSR in both languages.

## ✅ Update — 2026-06-10 (interactive 130)

- **`ukrainian-timeline` live** (task 130): vertical scroll-driven timeline, 9 article-grounded eras
  (Kyivan Rus → Eneida 1798 → Kobzar 1840 → Valuev 1863 → Ems 1876 → korenizatsiia → Executed
  Renaissance/russification → state language 1989–91 → post-2014/2022 revival). Spine + dots track the
  active era via IntersectionObserver; Prev/Next + clickable status-chart points give the tap/keyboard
  fallback. Bans get a red strikethrough motif (`--ut-ban` token, light+dark); the abolished letter ґ is
  struck through. Each era card carries an article-sourced language sample. A schematic SVG "official
  standing" line chart stands in for the speakers chart.
- `TODO(seva)` in `ukrainianTimeline.data.ts`: (1) Galicia-Volhynia & Lithuanian-Polish era are in the
  spec but not the article — omitted, not invented; (2) no speaker figures in the article, so the chart
  is a schematic status arc, not measured counts; (3) no verbatim period line for *Eneida*/*Kobzar* —
  work titles stand in.
- Board: 130 → done. Build green: 58 pages, island verified SSR in both EN and UK.

## ✅ Update — 2026-06-10 (Stratigraph expansion)

- Lexicon grown 255 → **490 lemmas** (all layers; layer labels widened: Germanic now covers
  Gothic-era loans like хліб/князь/скло, Eastern covers Arabic via French like магазин,
  coined covers 19th–20th c. like світлина/довкілля).
- Stemmer (`uk-stem.ts`): reflexive -ся/-сь handling, present-tense endings, -нути verbs,
  thematic-vowel second pass, verb-prefix stripping (з-будував → будувати), і↔о alternation
  stems on more lemmas. Test paragraph coverage: 41/41; function words don't false-positive.

## ✅ Update — 2026-06-10 (playground dataset expansion)

- **Babel Daily: 41 → 54 languages** (+Russian, Serbian, Slovenian, Macedonian, Welsh, Azerbaijani,
  Kazakh, Uzbek, Mongolian, Thai, Tagalog, Tamil; +3 family defs: Kra-Dai, Mongolic, Dravidian).
  Daily-pick stride still co-prime (gcd(17,54)=1).
- **Cognate Rush: 24 → 42 pairs** (30 true incl. widow/вдова, sew/шити, corn/зерно; 12 false friends
  incl. інсульт/insult, батон/baton, акуратний/accurate).
- **Word Time Machine: 15 → 24 chains** (+wheel/коло, school/школа, robot/робот (Slavic export!),
  disaster, companion, candidate, deadline, цибуля, salt/сіль).
- **Conlang Forge: 12 → 18 concepts** (+moon, fire, hand, tree, fish, dog).
- All entries sourced; data-integrity script passes (no dup ids, bilingual notes complete); build green.

## ✅ Update — 2026-06-10 (Word Time Machine ×2)

- **24 → 53 etymology chains**, every stage sourced (etymonline / ЕСУМ / Wiktionary PIE).
  New deep-roots set (heart, eye, two, widow, son, daughter, mouse, name…), travelers
  (paper, checkmate, lemon, bank, alcohol, jeans, гроші, парасолька, краватка, вокзал),
  Ukrainian stories (вирій, лелека, кохати, паляниця, хата, степ — debated origins say
  "неясно" out loud), modern (quarantine, vaccine).
- Picker now grouped into 4 labeled sections (data carries bilingual group names); search
  still filters across all. No ui.ts changes (agent was mid-flight on task 150 there).

## 📐 Planned — 2026-06-10 (Ask-AI selection chat)

- New feature spec: `docs/ASK-AI.md` — BYOK "select text → ask AI" chat drawer (Anthropic browser
  CORS as primary path, OpenAI-compatible as secondary; key in localStorage with session-only
  option, forget-key, honest security copy). Board task: `tasks/todo/500-ask-ai-selection-chat.md`.

## ✅ Update — 2026-06-10 (Ask-AI shipped, task 500)

- **Ask-AI selection chat is live** (spec: `docs/ASK-AI.md`): select text → "✨ Ask about this" pill →
  chat drawer (right panel; bottom sheet ≤640px). BYOK: setup sheet validates the key with a 1-token
  ping before storing (`mova:askai:v1`, localStorage or session-only), forget-key in the footer.
- `src/lib/llm.ts`: anthropic (direct-browser CORS header) + openai-compatible adapters, manual SSE
  streaming, AbortController; SSE parser + 401→auth error mapping unit-tested against fixtures.
- `src/lib/askai-store.ts`: config + per-page thread (sessionStorage, dies with tab).
- `src/components/askai/AskAi.tsx` mounted `client:idle` in BaseLayout — **5.5 KB gz** (budget 25).
- Context sent: title + selection + surrounding paragraph (truncated); system prompt forbids invented
  etymologies; suggested questions; streaming with stop; Esc/focus-return; aria-live log.
- Board: 500 → done. Build green. NOTE for deploy: feature calls api.anthropic.com / user's base URL
  from the browser — if a CSP is ever added, allow-list these.

## ✅ Update — 2026-06-10 (Ask-AI: history + export)

- **Chat history**: conversations now persist in `localStorage` (`mova:askai:history:v1`, capped at
  50 convos / 40 msgs each). 🕘 History view in the drawer header: reopen, export, or delete any past
  chat; "clear all history" button. New selection always starts a new conversation.
- **Export**: ⤓ exports the full chat as Markdown (.md download) — title, page URL, date, quoted
  selection, You/Mova-AI turns (context block stripped from the first message). Export also available
  per-conversation from the history list. Export format unit-tested.
- AskAi bundle: 6.5 KB gz (budget 25). Note: forget-key does NOT wipe history (separate concerns);
  clear-history is its own button.

## 📐 Planned — 2026-06-10 (Word Atlas)

- New playground toy spec: `docs/WORD-ATLAS.md` — world map of how a word sounds across ~30
  languages, dots colored by etymological origin group (tea/chai generalized). 24 curated words,
  hero-8 first (tea, coffee, pineapple/ananas, tomato, chocolate, mother, robot, sugar).
  Board task: `tasks/todo/510-word-atlas.md`.

## ✅ Update — 2026-06-10 (Word Atlas M1, task 510)

- **Word Atlas live** (spec: `docs/WORD-ATLAS.md`): world map of how a word sounds in ~30 languages,
  dots colored by etymological origin group. Hero-8 words shipped: tea (te/cha split), coffee
  (one qahwa, every continent), pineapple (ananas vs lonely English), chocolate & tomato (Nahuatl),
  mother (the dot colors trace the IE family border), robot (Prague 1920), sugar (śarkarā vs 糖).
- `src/lib/geo.ts`: equirectangular projection + schematic world silhouette from lat/lon rings
  (no D3/topojson). `src/data/playground/word-atlas.json`: 31-language registry (capital anchors),
  241 forms, every word sourced; native scripts included; "other" group renders hollow/dashed.
- Component: picker pills, tap-to-isolate legend, origin-point pulse (reduced-motion gated,
  finite repeat), detail card with native script + family, keyboard focus targets on dots,
  horizontal-pan map under 640px. Island 11.3 KB gz incl. data.
- Integrity script: no unknown langs/origins, bilingual notes complete. Board: 510 → done.
- M2 backlog: remaining 16 words; M3: speechSynthesis 🔊, arrow-key dot walk, PNG share.

## ✅ Update — 2026-06-10 (Word Atlas real coastlines)

- Replaced the hand-traced map blobs with **real Natural Earth coastlines** (land-110m via the
  `world-atlas` npm package), processed at build time and embedded as a constant in `src/lib/geo.ts`
  — still zero runtime map libraries. Pipeline: equirectangular projection (75°N–55°S, −170..180) →
  rings split at antimeridian jumps (fixes the Chukotka/Fiji full-width sliver; Eurasia stays intact) →
  Douglas-Peucker eps 1.3px (closed-ring midpoint split to avoid the degenerate-baseline collapse) →
  islets < 50px² and Antarctica dropped. Result: 34 rings, ~15 KB raw / 6.3 KB gz.
- WordAtlas island: 17.6 KB gz total (was 11.3). Visual QA: Eurasia/Americas/Africa/Australia/
  Greenland all present, dots land on the right coasts.
- **Regenerate**: `npm i --no-save world-atlas topojson-client`, then the generator script in this
  entry's commit (gen-world) → paste output into `WORLD_PATH`.

## ✅ Update — 2026-06-10 (Word Atlas: choropleth regions)

- Dots → **colored country regions** (Amazing-Maps style): ~60 countries extracted from Natural
  Earth countries-110m into `src/data/playground/word-atlas-regions.json` (keyed by language id,
  13 KB gz; same projection/simplification pipeline as the land silhouette). Each region fills with
  its language's origin-group color for the selected word; uppercase form labels with halo sit on
  the regions; dashed translucent fill = independent local words; grey land = language not in set.
- Country→language assignment is deliberately coarse (one primary language per country, only
  clear-cut cases; multilingual states skipped or simplified) and the map caption says so.
- Click region or label → detail card; legend isolation dims whole regions. Island 24 KB gz.

## ✅ Update — 2026-06-10 (Word Atlas zoom & pan)

- Map is now zoomable: viewBox-based, zero libs. Inputs: +/−/⊙ buttons (top-right), double-click
  to zoom at point, Ctrl/Cmd+scroll (plain scroll untouched), two-finger pinch, one-finger drag
  to pan when zoomed (touchAction flips to 'none' only while zoomed, so page scroll survives).
- Labels/strokes/pulse scale inversely with zoom — constant on-screen size, so zooming genuinely
  declutters dense Europe. Click-vs-drag disambiguated (pan movement suppresses region clicks).
  View clamped to map bounds; max zoom 8×.

## ✅ Update — 2026-06-10 (Word Atlas M2 complete: 24 words)

- **+16 words → all 24 from the spec**: wine (Caucasus homeland, *wayn wander-word, Hungarian bor
  outlier), beer (bier/pivo/cerveza/ale four-way), bread (Gothic hlaifs in хліб; Japanese pan via
  Portuguese missionaries), salt, orange (the PORTUGAL group: portokáli/burtuqāl/портокал!),
  potato (Brandenburg→brambor, Jakarta→jagaimo, 'earth-apple' calques), lemon (limon vs citron),
  night, three (PIE/Semitic/Uralic/Sinitic/Austronesian — five families on one map), name (the
  Uralic nimi lookalike + Japanese namae coincidence), water, school (scholḗ 'leisure'; Swahili
  shule via German colonists), church (kyriakón vs ekklēsía two routes; Polish kościół ← castellum),
  bank (Greek trápeza 'table' — the lone metaphor hold-out), computer (the calque resistance:
  ordinateur, dator, bilgisayar, 电脑 'electric brain'), internet (the fastest conquest; only
  Chinese translated it).
- 725 total forms, all integrity-checked (no unknown langs/origins/dups, bilingual notes complete).
- Island now 41.5 KB gz (data-heavy; M3 candidate: split word data into a lazy sub-chunk).

## 📐 Planned — 2026-06-10 (Journey + Word Index)

- `docs/JOURNEY.md` — guided course mode: 6 chapters over all 18 articles + 6 toys, 36 sourced
  checkpoint questions, localStorage progress, Grimm's-Law certificate PNG. Board: tasks/todo/520.
- `docs/WORD-INDEX.md` — `/words/`: build-time aggregation of the five curated datasets
  (~1,000 entries) into one searchable, crawlable index; deep-link params for WordAtlas/WTM.
  Board: tasks/todo/530.

## ✅ Update — 2026-06-10 (Word Index + Journey shipped, tasks 530 + 520)

- **/words/ live** (spec: docs/WORD-INDEX.md): build-time aggregator (`src/lib/word-index.ts`)
  over the five playground datasets → **1,527 entries**, 59 letter sections (А–Я then A–Z),
  rich-first ordering, `<details>` expansion (works JS-off), filter island (DOM-filtering, no
  data payload), letter jump-nav. Multi-source merge verified (чай/робот show ⏳🌐 badges).
  Page 47 KB gz. Deep links added: WordAtlas `?word=`, WordTimeMachine `?w=` (maps now shareable).
- **/journey/ live** (spec: docs/JOURNEY.md): 6 chapters over all 18 articles + 6 toys;
  36 bilingual checkpoint questions in `src/data/journey-questions.json` (each carries its
  source article slug; pass 2/3, free retry); visit beacon in the article page (local-only,
  3 lines); progress `mova:journey:v1`; completion unlocks the canvas certificate —
  name + its Grimm's-Law transformation via `soundlaws.ts`. Nav: + Journey, + Words (6 items —
  verify 375px wrap in the a11y pass, task 900).
- ui.ts partial-staged again (agent mid-flight on roots-garden strings). Board: 520, 530 → done.

## ✅ Update — 2026-06-10 (codebase audit)

Audit run: `tsc --noEmit` (after `astro sync`), i18n parity script, t()-usage vs ui.ts keys,
journey-question integrity, hardcoded-href scan, manual review of risk spots. Findings & fixes:

1. **Journey answer-position bias (real bug):** all 36 questions stored correct=0 and were served
   unshuffled — "always pick the first" would pass every checkpoint. Fixed: options shuffled
   per-serve in `startQuiz`, correct index remapped.
2. **Stratigraph dark mode:** the dataset's `colorDark` variants were never used — light layer
   colors rendered in dark mode. Fixed: theme-aware `layerColor` via matchMedia (SSR-safe).
3. **Nav overflow:** 6 nav items + lang toggle had no flex-wrap → overflow at 375px. Fixed in CSS.
4. **TS strict errors:** `WordFilter` useRef without initial value; `aiLanguageLab.data.ts`
   literal-type narrowing from `as const` (`series`, `d`). Fixed; `tsc --noEmit` now 0 errors.
5. Verified clean: i18n en/uk parity (517/517 keys), no missing t() keys (480 used), no
   hardcoded internal hrefs, journey covers all 18 articles with 6 valid Qs/chapter, Babel
   streak logic traced correct, no console.log leftovers. Build green.

Note: `tsc` requires `.astro/types.d.ts` (run `npx astro sync` first) or it false-positives on
CSS modules.

## ✅ Update — 2026-06-10 (mobile styles pass)

- **Word Atlas on phones**: the full world at 375px rendered labels ~4px. Map now keeps a 640px
  minimum width inside a horizontally-pannable wrapper (zoom buttons sit outside it, always
  visible); `touch-action: manipulation` when unzoomed so container pan + page scroll both work,
  `none` only while zoomed.
- **/words/ letter nav**: 59 letters collapsed to one horizontally-scrollable strip ≤540px;
  badge row wraps under the entry.
- **Global ≤540px**: header drops the tagline and wraps cleanly with 6 nav items; tighter toy/card
  paddings, smaller pills, clamped big-word sizes, reduced section padding; hover transforms off.
- Build green; astro sync + tsc clean. (Reminder: run `npx astro sync` before `tsc`.)

## 2026-06-10 — Master timeline (tasks 300 + 310)

- `src/data/timelineEvents.ts`: ~40 dated events across all 18 articles (−7,000,000 chimp-lineage split → 2023 AI), bilingual title+blurb, topic + source slug per event. Every fact traced to article text; BCE encoded as negative years.
- `src/components/interactive/MasterTimeline.tsx`: log-scaled axis (8M ybp → today), topic-colored nodes with staggered heights for the dense modern end, tap-to-isolate topic legend, keyboard-focusable node hit targets, Earlier/Later step buttons for mobile, event card linking to the source article via `localizedPath`.
- `src/pages/[lang]/timeline.astro`: placeholder replaced with `client:visible` island.
- i18n: 7 new `timeline.*` chrome keys (EN+UK).
- Verified: tsc clean, static build clean, island + localized content present in both `/en/timeline/` and `/uk/timeline/`, bundle ~8.4 KB gz.

## 2026-06-10 — Vitality-map refinement (user request)

- Article (EN+UK): "How a language actually dies" now names six last speakers (Pentreath/Cornish 1777, Udaina/Dalmatian 1898, Maddrell/Manx 1974, Esenç/Ubykh 1992, Smith Jones/Eyak 2008, Boa Sr/Aka-Bo 2010); revival playbook adds Wampanoag (reawakened from written records). Keeps the no-invented-data rule intact.
- Death panel: single Eyak accordion → memory wall of six candle nodes (1777→2010), tap to open the story; Cornish/Manx stories cross-link to their revival case in the right panel. Three-generation shift is now a stepper — advance generations, then flip "parents keep speaking it at home" to see the chain hold (SHIFT_KEPT variant).
- Revival panel: each mini-case shows its article-credited ingredient chips and a "Try this recipe" button that loads that language's playbook into the vitality gauge (also under the Hebrew curve); gauge shows whose playbook is loaded; manual toggles clear it.
- 14 new/updated vitalityMap.* keys (EN+UK); new CSS honors prefers-reduced-motion.
- Verified: tsc clean, build clean, new names render in both languages, data integrity script ALL OK, bundle ~7.5 KB gz.

## 2026-06-10 — Home topic filter (task 320)

- Home grid gets a topic chip row (All + 18 topics, derived from the live article set, labeled via topicNames). Chips pick up their topic accent colors from the existing [data-topic] CSS vars.
- Progressive enhancement: cards render in Astro; a small inline script toggles [hidden] via data-topic. JS off → all cards show. Filter is shareable via #topic=<id> and restored on load.
- 2 new home.filter* keys (EN+UK). Keyboard: native buttons + aria-pressed. Chips wrap at 375px.
- Verified: build clean, 19 chips and localized labels in both /en/ and /uk/, filter script inlined.
