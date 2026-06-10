---
id: 140-int-slang-decoder
title: Build the slang-decoder interactive
area: interactive
component: slang-decoder
article: internet-language
depends_on: [010-interactive-foundation]
order: 140
---

# Build the slang-decoder interactive

**Goal:** a two-part internet-language toy: era-translator + emoji-as-gesture matcher.

**Context:** spec → `CLAUDE.md` › `slang-decoder` · article → `content/{en,uk}/internet-language.md` ·
tech → `CONVENTIONS.md` · topic accent → `internet`.

## Steps

1. `src/components/interactive/SlangDecoder.tsx` (prop `lang`).
2. **(a) Translate across generations:** one sentence rendered in 1990s IRC, 2000s SMS, 2010s
   Twitter, 2020s TikTok — user flips between eras.
3. **(b) Emoji-as-gesture matcher:** drag emoji onto the function it serves (tone softener, irony
   marker, gesture replacement, emphasis) — per McCulloch. Drag needs a tap fallback (375px).
4. Works in both UI languages with Ukrainian slang equivalents (lol → лол, кек, ору) from the article.
5. Sentence variants + emoji mappings → `slangDecoder.data.ts`; chrome → `ui.ts` (`slangDecoder.*`).
6. Register in `Interactive.astro`.

## Acceptance

- See `CONVENTIONS.md` standard checklist, plus:
- [ ] Era flipping works for both EN and UK sentence sets.
- [ ] Emoji matcher gives feedback; works via tap on mobile.

## Notes

- Use only slang/examples present in the article; gaps → `TODO(seva)`.

## Done — 2026-06-10

Built the `slang-decoder` island: a two-view internet-language toy with a top tab switch.

**Files added:**
- `src/components/interactive/SlangDecoder.tsx` — `{lang}` island.
  - **(a) Across the eras:** one message flipped through 1990s IRC → 2000s SMS → 2010s Twitter →
    2020s TikTok via a pill selector; each era shows the styled message in a chat bubble plus a
    one-line note on what that era added. The bubble re-mounts on era change (`key`) to replay a
    pop animation that is progressive-enhancement only (`.enhanced` added post-mount **and** gated
    on `useReducedMotion`); SSR/no-JS markup is fully visible.
  - **(b) Emoji = gesture:** tap an emoji to select, then tap the job it does (tone softener, irony
    marker, gesture replacement, emphasis); correct match locks the bucket green and reveals an
    article-grounded blurb, wrong match flashes the bucket red with a retry hint. Native HTML5 drag
    is layered on as enhancement; **tap/keyboard is the primary path** (every control is a
    `<button>`), so it works at 375px and for keyboard/screen-reader users.
- `src/components/interactive/slangDecoder.data.ts` — typed `ERAS` (one message ×4 eras, EN+UK) and
  `EMOJI_FNS` (emoji ⇄ function, label + article-tied blurb). Header documents full provenance.
- `src/components/interactive/slangDecoder.module.css` — chat bubble, emoji tray/tiles, function
  buckets with drop states. Semantic match/miss green+red as scoped `--sd-ok`/`--sd-no` tokens
  (light + dark) — same precedent as UkrainianTimeline's `--ut-ban`; no bare hex elsewhere.

**Files touched:** `src/i18n/ui.ts` (`slangDecoder.*` chrome, EN+UK); `src/components/Interactive.astro`
(registered `slang-decoder`, removed from placeholder set).

**`TODO(seva)`** (all documented in `slangDecoder.data.ts` header):
1. The article gives no verbatim four-era sentence — part (a)'s renderings are an *illustrative
   reconstruction* of "informal writing", built only from article-attested atoms (lol/лол, CAPS,
   😂/💀) and captioned as illustrative in the UI.
2. The article names 😉 (irony) and 💀 (emphasis) explicitly, but only states the *principle* behind
   "gesture replacement" (🤷, "hands, eyebrows, and tone") and "tone softener" (😊, "a friendly
   message without emoji can read as cold") — those two emoji instantiate the article's claim rather
   than being named in it.
3. UK uses article-attested tokens (лол etc.). The task hint's кек/ору were **not** used — they are
   not in the article; only лол is.

**Verification:** `npm run build` → 0 errors, 58 pages. Confirmed in `dist` that both EN and UK
internet-language pages mount the real island (`data-interactive-id="slang-decoder"`, placeholder
gone), the eras-view chrome resolves per language, no raw `slangDecoder.*` keys leak, and the
emoji-view labels/blurbs (rendered only after a client tab switch) are present in the client bundle
for both languages. Built per `CONVENTIONS.md` standard checklist (both langs, no hardcoded user
strings, topic vars + light/dark, reduced-motion gated, keyboard-nav with bilingual aria, 375px-safe
via tap-first + 1-column buckets).

No follow-up tasks created.
