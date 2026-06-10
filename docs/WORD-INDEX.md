# WORD-INDEX.md — the word index ("/words/")

Plan for `/{lang}/words/`: one alphabetical, searchable index of **every word the site
knows something about**, aggregated at build time from the datasets we already curate.
The site quietly became a small etymological encyclopedia (~1,400 hand-verified word
facts); this page is where that asset becomes visible — to readers and to search engines.

## 1. Sources (all existing, no new data)

| Dataset | Entries | What an index entry gets |
|---|---|---|
| `etymologies.json` (Word Time Machine) | 53 chains | full chain teaser + deep link |
| `word-atlas.json` | 24 words × ~30 forms | gloss + origin group + deep link |
| `cognates.json` (Cognate Rush) | 42 pairs | PIE root, true/false-friend badge |
| `uk-lexicon.json` (Stratigraph) | 490 lemmas | origin layer + note where present |
| `babel.json` | 54 languages | indexed as language names |

Estimated ~900–1,100 unique keys after merging (e.g. **чай** appears in the atlas, an
etymology chain, and the lexicon → one entry, three appearance links).

## 2. Build-time aggregation

`src/lib/word-index.ts` — a pure function that imports the five JSONs and emits a
normalized index at build time (no runtime cost):

```ts
interface IndexEntry {
  key: string;            // normalized lookup form (lowercased, apostrophes unified)
  display: string;        // "чай / chai" — native + romanized where applicable
  gloss?: Record<Lang, string>;
  appearances: Array<{
    kind: 'etymology' | 'atlas' | 'cognate' | 'lexicon' | 'language';
    label: Record<Lang, string>;   // e.g. "Word Time Machine — travel chain"
    href: string;                  // deep link (see §4)
    snippet?: Record<Lang, string>; // note/source teaser from the dataset
  }>;
}
```

Merging rule: same normalized key ⇒ one entry, appearances concatenated. Dataset `source`
fields ride along — the index inherits the site's honesty for free.

## 3. The page

- `/{lang}/words/` — statically rendered full list grouped by first letter (two scripts:
  А–Я and A–Z sections; an entry sorts by its display form's script). Static HTML =
  every word is crawlable; a small island adds instant filter-as-you-type on top.
- Entry row: display form · gloss · kind badges (🕰 atlas, ⏳ chain, ⚡ cognate, 🪨 layer).
  Expanding shows appearance links + snippets. Lexicon-only entries (the long tail of
  490) render compactly — one line each — so the page stays scannable.
- Header stats line: "1,0XX words · every one sourced" with links to the datasets' methods
  (the about-page honesty note).
- Topic accent: `borrowing` (sky) — it's the borrowing article's spiritual sibling.

## 4. Deep links into the toys (small enabler task)

Toys currently have no URL state. Add **read-only query params** (no history churn):
- `playground/word-atlas?word=tea` — WordAtlas reads `?word=` on mount.
- `playground/word-time-machine?w=robot` — same pattern.
- Stratigraph/Cognate Rush: link to the toy page (no param needed for v1).
These params also make every atlas map shareable by URL — a free side benefit.

## 5. Cross-links back (the graph closes)

- Article "Explore further" panels gain one automatic line when an article's topic words
  exist in the index ("Words from this article in the index → …") — v2, optional.
- The 404 page suggests the index ("looking for a word?").

## 6. Architecture & budget

- `src/pages/[lang]/words/index.astro` (static, builds the list from `word-index.ts`)
  + `src/components/words/WordFilter.tsx` (tiny island: filter input, ≤ 4 KB gz —
  it filters DOM nodes by `data-key`, no data duplication in JS).
- i18n `words.*` strings; nav: under the Playground item? No — footer link + home card
  + 404 link for v1 (nav stays 5 items max with Journey).
- Page weight: ~1,000 entries as HTML ≈ 60–90 KB gz — acceptable for a reference page;
  if it grows past ~2,000 entries, split per-letter pages (v2).

## 7. Milestones

1. **M1** — aggregator + page with etymologies, atlas, cognates (~120 rich entries),
   filter island, deep-link params in the two toys.
2. **M2** — fold in the 490-lemma lexicon (compact rows) + babel language names; stats header.
3. **M3** — article cross-link line, per-letter splitting if needed, OG description.

## 8. Risks

- **Merge collisions** (same key, different words — e.g. lexicon "три" vs cognate "три"
  are the same; but atlas "te" vs lexicon "те"? normalization must keep language context).
  Rule: merge only within same script + same gloss family; when unsure, two entries beat
  one wrong entry.
- **Long-tail blandness**: 490 one-line lexicon rows could bury the rich entries —
  solved by sort order (rich entries first within each letter) and compact styling.

## Out of scope

Full-text article search, fuzzy search, server anything.
