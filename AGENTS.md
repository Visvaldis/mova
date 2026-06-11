# AGENTS.md — Language Evolution Explorer

Build spec for a coding agent. Read this fully before writing code.

## What you are building

**Movа / Tongue** — a highly interactive, bilingual (English + Ukrainian) website about language evolution. Content lives in `content/en/*.md` and `content/uk/*.md` (already written — do NOT rewrite article content). Your job: turn each article into an interactive web page and build the site shell around them.

## Hard requirements

1. **Bilingual toggle.** Site-wide EN ⇄ УК switcher, visible on every page (top right). Switching languages keeps the user on the same article (slugs are identical across languages) and preserves scroll position where feasible. Persist choice in `localStorage`, default to browser language (`uk` → Ukrainian, else English).
2. **Every article gets its interactive component.** Each article's frontmatter has an `interactive` field naming a component. Component specs are below. These are the heart of the site — do not ship a page as plain text.
3. **All UI strings localized.** Nav, buttons, footer, component labels, tooltips — everything has EN and UK variants. Keep UI strings in a single `i18n` dictionary file.
4. **Sources rendered as a styled "Explore further" panel** at the end of each article (from the `sources` frontmatter list), with external-link icons.
5. **Static-deployable.** No backend. Must build to static files (deployable to GitHub Pages / Netlify / Vercel).

## Recommended stack

Astro + a UI-framework island (React or Svelte) for the interactive components, or Next.js static export. Astro preferred: markdown-native, fast, islands keep interactivity cheap. D3 or plain SVG for visualizations. No heavy charting libs unless needed.

## Content model

```
content/
  en/<slug>.md
  uk/<slug>.md      # same slug, same frontmatter except lang/title/summary
```

Frontmatter fields: `slug`, `lang`, `title`, `summary`, `order`, `topic`, `readingTime`, `interactive` (component id), `sources` (list of {title, url, note}).

Render markdown body → page. Pull-quotes (`> blockquote`) should be styled large. The `interactive` component mounts where the body contains the marker `<!-- INTERACTIVE -->`; if no marker, mount after the intro (first H2).

## Pages

- **Home**: hero + tagline, grid of article cards (title, summary, topic tag, reading time), each with a small animated preview of its interactive. Language toggle.
- **Article pages**: `/{lang}/{slug}/` — article body with embedded interactive component, reading progress bar, "Explore further" panel, prev/next navigation.
- **Timeline page** `/timeline`: a master interactive timeline aggregating key dated events from all articles (hardcode the events from article content; ~135,000 BCE → today, log-scaled).
- **About page**: short, explain the project and bilingual nature.
- **Playground** `/{lang}/playground/`: standalone free-play language toys — full spec in `docs/PLAYGROUND.md`.

## Interactive component specs (one per article)

### `origins-timeline` — for `origins-of-language`
Horizontal scrubbable deep-time timeline (log scale, 7 Mya → today). Milestones as nodes: split from chimp lineage, Homo erectus, FOXP2 evolution, ~135 kya linguistic capacity (Miyagawa 2025), ~100 kya symbolic behavior, writing (~5.2 kya). Clicking a node opens a card (title, 2–3 sentence explainer — pull text from article). Add a "compare hypotheses" toggle showing gesture-first vs vocal-first vs gradualist ranges as colored bands.

### `family-tree` — for `language-families`
Zoomable/collapsible Indo-European tree (D3 hierarchy or hand-built SVG). Root PIE → ~10 branches → modern languages. Ukrainian and English nodes highlighted ("you are here" for both site languages). Hover shows speaker counts + first attestation; click a leaf shows the word for "mother"/"three"/"night" in that language to make cognates visible. Extinct languages dashed/grey. Toggle: tree view ⇄ map view (simple SVG Eurasia map with branch regions colored).

### `sound-shift` — for `sound-change`
Grimm's Law explorer. Input row of PIE/Latin words (pater, piscis, cornu, tres, dent-…); animate the consonant transforming (p→f, t→θ, k→h …) into the English word as the user drags a slider or steps through. Include a "try it" mode: user picks a consonant, sees the rule fire across all example words simultaneously. Show the three Grimm chain shifts as a circular diagram.

### `ukrainian-timeline` — for `ukrainian-language-history`
Vertical scroll-driven timeline, ~860 CE → today: Kyivan Rus / Old East Slavic, Galicia-Volhynia, Lithuanian-Polish era, Kotliarevsky's Eneida (1798), Shevchenko, Valuev Circular (1863) & Ems Ukaz (1876) shown as "ban" markers, korenizatsiia, Executed Renaissance, Soviet russification, 1989/1991 official status, post-2014 and post-2022 revival. Each era card has a sample text snippet showing the language of that period. Bans rendered visually distinct (red strikethrough motif). A small line chart of estimated speakers/status over time.

### `slang-decoder` — for `internet-language`
Two-part component. (a) "Translate across generations": a sentence rendered in 1990s IRC style, 2000s SMS, 2010s Twitter, 2020s TikTok — user flips between eras. (b) Emoji-as-gesture matcher: drag emoji onto the function they serve (tone softener, irony marker, gesture replacement, emphasis) — based on McCulloch's analysis. Works in both UI languages with Ukrainian internet-slang equivalents (lol → лол, кек, ору).

### `ai-language-lab` — for `ai-and-language`
Interactive "drift simulator": toy simulation of word frequency change across generations of speakers, with sliders for "AI-generated text share" and "human innovation rate"; chart shows vocabulary homogenization vs diversification. Plus a quiz card: "human or AI phrasing?" — 6 sentence pairs, score at end. Keep the simulation honest: label it as an illustrative model, not research.

### `creole-lab` — for `new-languages`
Generation simulator: the same message shown in three panels — scattered home signs → pidgin (telegraphic word string) → grammaticalized creole/NSL (markers, fixed word order). User steps through generations and watches the system regularize; highlight what each cohort adds. Second tab: world map of major contact languages (Haitian Creole, Tok Pisin, Jamaican Patois, NSL) with parent languages on hover.

### `vitality-map` — for `language-death-and-revival`
Split view. Left: vitality counter (~7,000 living languages, ~40% endangered) with a "languages falling silent" ticker and clickable last-speaker stories (Eyak/Marie Smith Jones). Right: the Hebrew revival curve (native speakers ~0 in 1880 → ~9M today, log scale) plus mini-cases: Welsh, Māori, Hawaiian, Crimean Tatar. Interactive "revival recipe": toggles for school / media / state status / home use that animate a vitality gauge — home use weighted heaviest.

### `script-evolver` — for `writing-systems`
Letter time machine: pick a letter (A, B, M…) and scrub its 4,000-year morph: Egyptian pictograph → Proto-Sinaitic → Phoenician → Greek → Latin, with the Cyrillic branch drawn in parallel (highlight Ukrainian А, Б, М). Secondary view: script family tree (the ~4 independent inventions as roots). Mini-game: "rebus machine" — combine pictures to spell a sound-word, teaching the rebus principle.

### `word-traveler` — for `traveling-words`
Animated journey map: pick a word (tea/чай, sugar/цукор, orange, кава, майдан, козак; borshch/steppe as exports) and watch its route animate across a world map with a stop-card at each language showing the changing form. The tea map doubles as a sea-vs-land coloring of the world (te-by-sea vs cha-by-land). Quiz mode: "guess where this word started" with 5 words.

### `word-xray` — for `everyday-etymologies`
"X-ray machine": a row of word cards (muscle, disaster, companion, sarcasm, candidate, deadline, вікно, ведмідь). Click/tap → the word visually peels into morphemes with the literal image illustrated (little mouse, bad star, with-bread…) as a minimal line-drawing SVG + 1-sentence story. Mode 2: "literal sentence" — a sample sentence re-renders with literal meanings swapped in. Mode 3: doublet-matcher — connect pairs (royal/regal, skirt/shirt, город/град).

### `roots-garden` — for `ukrainian-word-origins`
A "stratigraphy" view: Ukrainian words as cards sorted into animated layers (Proto-Indo-European core → Proto-Slavic → Greek/church → Turkic → German-via-Polish → coined 19th c. → English 21st c.). Tap a word → origin story card with route mini-map. Special "birth certificate" treatment for мрія (author, date, source verb). Include the phrase "козак на майдані п'є каву під дахом" as a tappable sentence where each word lights up its layer.

### `name-map` — for `names-and-places`
Tabbed component. Tab 1: SVG map of Ukraine with tappable toponyms (Київ, Дніпро, Крим, Одеса, -слав/-город towns) → etymology cards; include the Україна "borderland vs homeland" debate card presenting both views. Tab 2: month-name wheel — 12 months as a ring, toggle EN (Roman gods/numbers) ⇄ UK (nature calendar), with literal glosses appearing on hover. Tab 3: surname matcher — match English surnames to their Ukrainian occupational twins (Smith↔Коваль, Baker↔?, Miller↔Мельник).

### `myth-buster` — for `etymology-myths`
Swipeable card quiz: "real or myth?" — 8 etymology claims (posh acronym, sirloin knighting, козак←коза, bridegroom reshaping, female respelling, salt salary, golf acronym, ведмідь taboo). User swipes/buttons true-false, gets explanation + running score; end screen ranks them "folk-etymology-proof". Visual style: tabloid-vs-dictionary card flip.

### `thought-lens` — for `language-and-thought`
Two experiments. (a) Blue-boundary lab: a continuous blue gradient strip; user drags to place the boundary where "one color becomes another", then overlays show where EN (one basic term) vs UK (синій/блакитний) conventionally split it. (b) Obligatory-info switcher: the same simple sentence shown as "what EN forces you to encode" vs "what UK forces you to encode" (articles vs aspect/vocative), with forced bits highlighted. Include a caveat badge on the gender-association demo (contested research).

### `accent-atlas` — for `dialects-and-accents`
Tab 1: SVG dialect map of Ukraine — three dialect groups colored (northern, southwestern, southeastern), tap a region for features + sample phrase. Tab 2: continuum slider — a row of "villages" between two cities; drag to hear/see speech gradually blending, with a movable "border" showing how language lines are arbitrary cuts. Tab 3: shibboleth tester — паляниця story card with phonetic breakdown of why it works (no audio recording required; visual phonetics).

### `conlang-workbench` — for `constructed-languages`
(a) Toki Pona builder: ~14 word tiles; user combines them (jan+pona=friend, telo+nasa="weird water"=alcohol) with live gloss. (b) Conlang timeline: Lingua Ignota → Volapük → Esperanto → Klingon → Na'vi → Dothraki/Valyrian → Toki Pona, each with one-line fate. (c) Esperanto decoder: a sentence shown; user hovers words to see how many they can guess from European roots — recognizability meter.

### `code-vs-speech` — for `machine-languages`
Hockett checklist scorecard: two columns (Ukrainian sentence vs Python snippet); user toggles each design feature (discreteness, productivity, ambiguity, lying/irony, child acquisition…) and sees pass/fail lights with a one-liner. Ends with brain panel: language network vs multiple-demand network — simple two-region brain SVG lighting up per column. Keep the MIT result verbatim from the article.

### `esperanto-machine` — for `esperanto`
Word-building machine. (a) Root tiles (san-, lern-, libr-, vort-, am-…) + affix tiles (mal-, -in-, -ej-, -ul-, -et-, -eg-, -ist-, -il-) snap together with a live morpheme-by-morpheme gloss: san+ul+ej+o → "health-person-place-noun" = hospital. Challenge mode: "build the word for X" (5 targets, e.g. hospital, library, school of bad people for laughs). (b) Verb-tense dial: one root on a rotary dial of -as/-is/-os/-us/-u! with instant gloss — showcasing zero irregularity. (c) Guessability meter: an Esperanto sentence; hover each word to reveal the European root it came from; meter shows % guessed. All example words must come from the article (san-/mal-/ul-/ej- family) or standard Fundamento affixes.

### `name-smith` — for `tolkien-languages`
Middle-earth name forge. (a) Element tiles from attested names ONLY (mor 'dark', dor 'land', ia 'pit', mith 'grey', randir 'wanderer', el/elen 'star'); combining two shows the literal gloss + the canonical example (mor+dor → Mordor "black land"). Invented combinations get a playful "unattested — Tolkien might object" badge, never invented glosses. (b) Sound-palette comparator: Quenya vs Sindarin side by side — each shows its real-world model (Finnish / Welsh), its sample line from the article (elen síla… / A Elbereth…), and a mood note; toggling highlights the phonemic flavor differences. (c) Mini diagram: Primitive Elvish → (sound laws) → Quenya + Sindarin, drawn like the family-tree component's PIE diagram — caption: "Grimm's Law, but fictional".

### `alien-grammar-gym` — for `hollywood-conlangs`
(a) OVS scrambler: tiles for a simple sentence; user arranges them into Klingon object–verb–subject order; a frequency strip shows how common each of the six orders is among human languages (SOV/SVO dominant → OVS rarest, ~1%). (b) "Design an alien": pick 3 phonemes from a palette; an alien-o-meter scores the ensemble — common combos read "too human", Okrand-style rare co-occurrences (retroflex D + uvular q + tlh) max it out; one-liner explains the trick is the ensemble, not the sounds. (c) Designer match: drag Okrand/Frommer/Peterson onto Klingon/Na'vi/Dothraki+Valyrian; correct match reveals the one-line method note from the article.

## Design direction

- Feel: editorial + playful science museum. Big type, generous whitespace, one accent color per topic area (origins=ochre, families=teal, sound=violet, ukrainian=blue/yellow duo, internet=pink, ai=green, birth=coral, revival=amber, writing=sepia, borrowing=sky, everyday=lime, roots=raspberry, names=plum, myths=rust, thought=indigo, dialects=olive, conlangs=magenta, machine=graphite).
- Dark/light mode respecting `prefers-color-scheme`.
- Typography must handle Cyrillic well (e.g. Inter, Fixel, or e-Ukraine font families).
- Mobile-first; interactives must degrade gracefully to tap/step interactions on small screens.
- Accessibility: all interactives keyboard-navigable, `prefers-reduced-motion` honored, alt/aria text in both languages.

## Adding new articles later

New articles are not done until they're integrated into the aggregating features — the master
timeline (`src/data/timelineEvents.ts`, dated events with the article's slug), the Journey course
(`journey.data.ts` chapter + 6 bilingual checkpoint questions), an interactive (spec here +
`interactiveInfo` entry), and any hardcoded counts (home hero subtitle, Journey done-screen,
docs). Full checklist: `tasks/CONVENTIONS.md` § "Adding a new article".

## Agent workflow rules

1. **Claim before you start.** Before beginning a task, check whether it is already claimed by another agent (marked "doing" or "in progress"). If unclaimed, create or move it to "doing" so no two agents duplicate work. If no task entry exists, create one and mark it as "doing".
2. **Commit only your own changes.** When a task is finished, commit only the files you changed for that task — do not stage or commit unrelated modifications unless explicitly told otherwise.

## Quality bar / definition of done

- `npm run build` produces static output with zero errors.
- Lighthouse ≥ 90 performance & accessibility on article pages.
- Language toggle works on every page, no untranslated UI strings.
- All 18 interactive components functional on mobile viewport (375px).
- Every fact shown inside interactives must come from the articles — no invented data. If you need a number that isn't in an article, mark it `TODO(seva)` in code and list it at the end of your run.

## Out of scope

CMS, comments, search, user accounts, analytics. Don't add them.
