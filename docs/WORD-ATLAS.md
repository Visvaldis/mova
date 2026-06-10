# WORD-ATLAS.md — "How the world says it" map (playground toy)

Plan for `word-atlas`: pick a common word → a world map shows how it sounds in ~30 languages,
with dots **colored by etymological origin** — same color = same source word. The "tea if by sea,
cha if by land" map, generalized to a whole curated vocabulary. Companion to the
`traveling-words` article and the seventh playground toy (spec conventions: `docs/PLAYGROUND.md`).

## 1. The idea in one screen

A word like **pineapple** paints the map two colors: nearly the whole planet says some form of
*ananas* (one Tupi-Guarani source carried by Portuguese traders), while English stands almost
alone with *pineapple*. **Tea** splits by trade route, **chocolate** is Nahuatl everywhere,
**mother** is half-PIE and the color boundary traces the family border. The color mapping makes
the invisible visible: vocabulary IS history, and you can see the empires, trade routes, and
language families at a glance.

## 2. UX

- **Word picker**: a row of pills (grouped like the Word Time Machine: drinks & food / family &
  body / civilization / modern), preselected on `tea` — the most famous map.
- **Map**: equirectangular world, clipped to ~75°N–55°S. Each language = a dot + the romanized
  form as a small always-on label. Dot fill = origin group. The origin language(s) get a ring
  marker (📍 "where it started") with a one-time pulse (skipped under `prefers-reduced-motion`).
- **Legend**: one chip per origin group — label + micro-story, e.g. *“te — Min Chinese, by sea
  (Dutch traders out of Amoy)” / “cha → chay — by land (Silk Road via Persian)”*. Tapping a chip
  dims all other groups.
- **Detail card** on dot tap: language name, form in native script + romanization, group origin
  note, and the language's family (links the families article mentally).
- **Pronunciation (M3, optional)**: a 🔊 button using the browser's `speechSynthesis` where a
  matching voice exists — feature-detected, never required.
- Bilingual UI as always (`pg.atlas.*` in `ui.ts`); the word gloss and every note in EN+UK.

## 3. Color = origin similarity

- Groups are **cognate/source clusters**, hand-assigned per word in the data (this is the
  editorial heart of the toy — never auto-guessed from spelling).
- Palette: 6 fixed distinguishable colors (teal, amber, violet, rose, blue, green) + grey for
  **`unclear`** — the honest group for debated etymologies, rendered hollow. Colors are assigned
  per word by group order; they don't carry meaning across words (the legend always explains).
- Same-source-different-route stays one group with route noted per form (e.g. кава and coffee are
  both the *qahwa* group), so the map shows *origin* similarity, not surface similarity. Surface
  similarity is what the labels themselves show.

## 4. Data model

```
src/data/playground/word-atlas.json
{
  "languages": { "<id>": { "name": {en,uk}, "lat": 50.4, "lon": 30.5, "family": "slavic" } },
  "words": [{
    "id": "tea", "gloss": {en,uk}, "icon": "🍵", "group" /* picker group */: "food",
    "origins": [
      { "id": "te",  "label": "te (Min Chinese)",  "story": {en,uk} },
      { "id": "cha", "label": "chá (Sinitic → Persian chay)", "story": {en,uk} }
    ],
    "originPoint": "min",          // language id(s) where it started
    "forms": [
      { "lang": "english",   "form": "tea",  "native": null,    "origin": "te"  },
      { "lang": "ukrainian", "form": "chai", "native": "чай",   "origin": "cha" },
      ...
    ],
    "source": "qz.com/1176962; etymonline; Wiktionary translations"
  }]
}
```

- **Languages registry (~32)**: reuse Babel Daily's language set + coordinates of a representative
  point (capital-ish). Lat/lon → x/y by linear equirectangular projection at build/run time; rare
  label collisions resolved by an optional per-form `dy` nudge in data.
- **Word list v1 (24)** — chosen for documented, story-rich patterns:
  - *Drinks & food*: tea ★, coffee ★, sugar, wine, beer, bread, salt, **pineapple ★ (ananas)**,
    orange, tomato ★ (Nahuatl), chocolate ★ (Nahuatl), potato, lemon.
  - *Family & nature*: mother ★ (PIE vs the rest), night, three, name, water.
  - *Civilization & modern*: school, church, bank, robot ★ (Slavic export), computer, internet.
  - ★ = hero maps that teach the most; ship these 8 first (M1).
- Every word entry carries `source`; forms verified against Wiktionary translation tables
  cross-checked with etymonline/ЕСУМ/WOLD before inclusion. A form we can't verify is omitted —
  fewer dots beats wrong dots. Debated origin → the grey `unclear` group, never a guess.

## 5. Architecture

- `src/components/playground/WordAtlas.tsx` — one island, `client:visible`, like the other toys.
- Map base: a single simplified world silhouette path (hand-traced equirectangular, ~3 KB SVG,
  same schematic style as family-tree's map but global). No D3, no topojson.
- `src/lib/geo.ts`: tiny `project(lat, lon) → {x, y}` + the land path constant.
- Registry entry in `registry.ts` (icon 🌐, ~5 min, related: traveling-words, language-families,
  sound-change). Strings `pg.atlas.*`.
- Budget: island ≤ 25 KB gz code; word data lazy in the island chunk (~50–70 KB raw JSON ≈
  ~12 KB gz). Mobile: map pans horizontally under 480px (overflow-x scroll), detail card becomes
  a bottom strip; everything tappable at 44px targets.

## 6. Milestones

1. **M1 — base + 8 hero words**: geo lib, silhouette, dots/labels/legend/detail card, languages
   registry, tea/coffee/pineapple/tomato/chocolate/mother/robot/sugar. Build green, both languages.
2. **M2 — full 24 words** + group-dimming, origin pulse, per-form nudges where labels collide.
3. **M3 — polish**: optional speechSynthesis 🔊, keyboard walk across dots (arrow keys), share
   PNG of the current map (canvas redraw, like the doc'd playground share cards).

## 7. Risks

- **Data accuracy is the real work.** 24 words × ~28 forms ≈ 670 facts. Mitigations: ship hero-8
  first; "N words — and growing" copy; every entry sourced; `unclear` group; forms I can't verify
  get dropped, not guessed.
- **Label overlap** in dense Europe: smaller font + leader-line nudges stored in data; tap always
  wins over hover.
- **Projection honesty**: equirectangular distorts; a one-line caption says positions are
  schematic anchors (capital cities), not language territories — dots, not borders, deliberately.

## 8. Definition of done

Playable in EN+UK · all forms sourced · unclear group used where debate exists · keyboard + 375px
verified · `prefers-reduced-motion` honored · added to hub + PROGRESS.md · build green.
