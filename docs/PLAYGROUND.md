# PLAYGROUND.md — Tech & Design Doc

Spec for the **Playground** (`/[lang]/playground/`): a section of standalone, free-play language toys that don't belong to any single article. Complements `CLAUDE.md` (per-article interactives). Same stack, same rules: Astro 5 + React islands, static-only, fully bilingual, no invented data.

## 1. Why a playground

Article interactives explain *one* idea on rails. The playground is the opposite: open-ended tools where the user brings the input (their name, their text, their guesses) and the linguistics responds. Goals: repeat visits (daily game), shareability (results people screenshot), and a home for cross-article mechanics that no single article can host. Non-goals: accounts, backend, leaderboards, user-generated content storage.

## 2. Information architecture

```
/[lang]/playground/              hub: 6 toy cards (icon, blurb, est. time, "daily" badge)
/[lang]/playground/<toy>/        one page per toy
```

Nav gets a "Playground / Майданчик" item. Each toy page: title, 1-paragraph framing, the toy (React island, `client:visible`), "related articles" links back into content. Toys are registered like article interactives: `src/components/playground/registry.ts` mapping id → lazy component, so adding a toy is data + one component.

## 3. The six toys

Priority P1 = launch set, P2 = fast follow.

### 3.1 `word-time-machine` — Word Time Machine (P1)
**Pitch:** pick a word, ride it back 6,000 years.
**Mechanic:** search/select from a curated set (~120 words EN + UK); animated vertical chain renders each attested/reconstructed stage (e.g. *father ← fæder ← \*fadēr ← \*ph₂tḗr*) with century label, language, one-line note; cognate branches fan out (укр. *мати* and *mother* meet at \*méh₂tēr).
**UI:** timeline rail with stop-cards; "surprise me" button; share-card export (canvas → PNG of the chain).
**Data:** `src/data/playground/etymologies.json` — `{ id, lemma:{en,uk}, chain:[{form, lang, period, note:{en,uk}, reconstructed:bool}], cognates:[...], source }`. Every entry hand-curated from etymonline/ЕСУМ; `source` is mandatory; reconstructed forms always get `*`.
**Edge cases:** no free-text etymology lookup (we can't generate honest etymologies) — search matches the curated list only; empty-state explains why and links the myths article.

### 3.2 `sound-shift-sandbox` — Your Name Through the Laws (P1)
**Pitch:** what would *your name* sound like after Grimm's Law? After Ukrainian ikavism?
**Mechanic:** user types any string (Latin or Cyrillic); choice of rule packs: Grimm (p→f, t→θ, k→h, b→p, d→t, g→k…), Great Vowel Shift (approx, vowel table), Ukrainian o/e→i in closed syllables. Output renders with per-character diff highlighting and a step-by-step "which rules fired" log.
**UI:** input → animated transformation (reuse `prototype-sound-shift.html` pop animation); toggle IPA.
**Data:** rule packs as pure functions in `src/lib/soundlaws.ts`, each rule `{match, replace, label:{en,uk}}`. Honesty banner: "Toy approximation — real laws applied to one language at one time; see the sound-change article."
**Edge cases:** strings with no applicable segments → "your name is shift-proof 🛡" result (still shareable).

### 3.3 `babel-daily` — Babel: the Daily Language Game (P1)
**Pitch:** Wordle for languages — one puzzle per day, same for everyone.
**Mechanic:** show a sentence (UDHR Article 1 translations — public domain, consistent), user guesses the language in 4 tries; after each wrong guess a hint unlocks: family → region map → speaker count → script note. Daily index = `daysSince(epoch) % puzzles.length` so it's deterministic with no backend.
**UI:** guess input with autocomplete over ~80 languages; result tiles (🟥🟨🟩 by family-distance: wrong family / right family / right); streak + stats in `localStorage`; copyable emoji result like Wordle.
**Data:** `src/data/playground/babel.json` — 80+ entries `{ snippet, language:{en,uk}, family, branch, region, speakers, script }`. Family-distance scoring from the `language-families` tree data (reuse!).
**Edge cases:** UK/EN language names both accepted in either UI language; colorblind-safe tile palette + shapes.

### 3.4 `stratigraph` — Word Stratigraphy Analyzer (P2, flagship UA)
**Pitch:** paste a Ukrainian sentence — watch its words light up by origin layer, like the козак/майдан/кава/дах sentence from the word-origins article, but for *your* text.
**Mechanic:** tokenizer + lemma lookup against a curated lexicon (~1,500 high-frequency Ukrainian lemmas tagged by layer: Proto-Slavic core / Greek-church / Turkic / German-Polish / Latin-Romance / English-recent / coined-19c / unknown). Words not in lexicon render grey "не знаємо чесно" (honest-unknown). Summary bar chart: your text is X% inherited core, Y% borrowings…
**UI:** textarea → colorized text (layer legend = same colors as `roots-garden`); tap word → origin mini-card.
**Data:** `src/data/playground/uk-lexicon.json`, built by hand from ЕСУМ/ГОРОХ; each entry `{lemma, layer, note, source}`. Naive suffix-stripping stemmer in `src/lib/uk-stem.ts` (good enough; mark known-bad cases).
**Edge cases:** EN UI still works (explains the tool, accepts Ukrainian input); profanity in input is fine — we only color it.

### 3.5 `conlang-forge` — Conlang Forge (P2)
**Pitch:** design a language in 3 choices, then watch 500 years ruin it.
**Mechanic:** step 1: pick phoneme inventory (3 presets: "harsh", "flowing", "clicky-weird"); step 2: pick word order (SVO/SOV/VSO) + one morphology trait; step 3: forge → seeded generator produces a 12-word lexicon + 2 sample sentences with gloss. Then the kicker: "fast-forward" button applies 2 random sound changes and 1 analogy change, showing the drift — the whole site's thesis in 10 seconds.
**UI:** wizard → "language passport" result card (name auto-generated from its own phonology), PNG export.
**Data:** none external; pure seeded generation in `src/lib/conlang.ts` (seed shown, so results are shareable/reproducible).
**Edge cases:** generator must filter accidental real/offensive words against a small blocklist (en+uk).

### 3.6 `cognate-rush` — Cognate Rush (P2)
**Pitch:** 60-second arcade — match the cognates, dodge the false friends.
**Mechanic:** cards fall in two columns (e.g. *night* / *ніч* / *Nacht* / *noche*…); user pairs true cognates; **false friends** (укр. *магазин* vs eng. *magazine*) are traps worth −points with an explainer on miss. 3 rounds, score, best-streak in `localStorage`.
**Data:** `src/data/playground/cognates.json` — pairs with `{a, b, langs, pie_root?, isFalseFriend, note:{en,uk}}`, sourced from the families/sound-change articles + curated false-friend list.
**Edge cases:** `prefers-reduced-motion` → falling cards become a static grid matcher with timer.

## 4. Shared architecture

- **Routing/pages:** `src/pages/[lang]/playground/index.astro` + `[toy].astro` (static paths from registry). Breadcrumb + `withBase()` everywhere (GitHub Pages base `/mova`).
- **Components:** `src/components/playground/<Toy>.tsx` — React 19 islands, `client:visible`. Shared UI atoms: `ResultCard`, `ShareButton` (canvas PNG + navigator.share fallback copy), `Gauge`, `StreakBadge`.
- **State:** all persistence in `localStorage` under `mova:playground:<toy>` (versioned: `{v:1, ...}`); no cookies, no network.
- **i18n:** all strings through `src/i18n/ui.ts` (`playground.*` namespace); toy data files carry `{en,uk}` fields. A toy may not ship with untranslated strings — same bar as the rest of the site.
- **Data discipline:** every dataset entry carries `source`; anything uncertain is omitted or flagged in-UI. Reuse article datasets (family tree, sound rules) — single source of truth in `src/data/`, imported by both article interactives and toys.
- **Performance budget:** hub page ≤ 50KB JS; each toy island ≤ 75KB gz; no new runtime deps without need (d3 only if family-tree already pulled it; otherwise hand-rolled SVG).

## 5. Design language

Playground = the museum's kids' floor: same editorial type system, but warmer. Hub cards get a dedicated `playground` accent (sunflower) + per-toy use of their related article's accent. Looser shapes (slight card rotation on hover), confetti micro-burst on wins (skipped under `prefers-reduced-motion`). Share cards: 1200×630, dark variant, big result + tiny site mark — designed to be screenshotted.

Accessibility: every toy fully keyboard-playable; game timers pausable; color information always doubled by icon/label; `aria-live="polite"` for score updates; UK screen-reader strings reviewed (no machine-translated aria).

## 6. Milestones

1. **M1 — Hub + registry + Babel daily** (the retention hook; smallest data lift).
2. **M2 — Word Time Machine + Sound Shift Sandbox** (the shareables; reuse prototype + sound rules).
3. **M3 — Stratigraph** (largest data curation; start lexicon file early, ship at 800+ lemmas, grow).
4. **M4 — Conlang Forge + Cognate Rush** (pure-fun tier).
Each milestone: build green, Lighthouse ≥ 90, both languages complete, mobile 375px verified.

## 7. Risks & mitigations

- **Data curation is the real cost** (etymologies, lexicon, babel snippets). Mitigate: ship small-but-honest sets, mark size in UI ("120 words and growing"), grow per release. Never pad with unverified entries.
- **Free-text expectations:** users will type words we don't have. Empty states must teach (link the relevant article) rather than apologize.
- **Daily-game clock skew:** compute puzzle index from UTC date; show countdown to next puzzle.
- **Scope creep toward accounts/leaderboards:** explicitly out of scope; sharing is screenshot-based by design.

## 8. Definition of done (per toy)

Playable end-to-end in EN and UK · keyboard + reduced-motion paths verified · all data sourced · share card renders · `localStorage` schema versioned · linked from hub + ≥1 related article footer · zero console errors · added to PROGRESS.md table.
