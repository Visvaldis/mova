// Content data for the `esperanto-machine` interactive (article: esperanto).
//
// SOURCING (per CLAUDE.md "no invented data"; acceptance allows "the article OR the
// standard Fundamento"):
//   • The san- word family (sana → malsana → malsanulo → malsanulejo) and the
//     endings -o/-a/-j, the prefix mal-, the suffixes -ul-/-ej-, and the tense
//     endings -as/-is/-os are all stated in the article, verbatim where it glosses
//     them. Marked source: 'article'.
//   • Additional roots (bon-, lern-, libr-, am-, vort-) and affixes (-in-, -ist-,
//     -et-, -eg-, -il-) and the tense endings -us/-u! are standard Fundamento
//     morphemes (the article's "sixteen rules, frozen in the Fundamento"). Marked
//     source: 'fundamento'. No meaning is invented: only FEATURED_WORDS assert an
//     idiomatic result, and each is either the article's own san- family or a
//     canonical Fundamento word (lernejo "learn-place" = school, the textbook
//     -ej- example, exact parallel to the article's malsanulejo); free
//     combinations show only the literal morpheme-by-morpheme gloss.
//   • The guessability words are the article's OWN Esperanto terms (Doktoro
//     Esperanto, interna ideo, Fundamento) — fully article-sourced, no invented
//     sentence.

import type { Lang } from '../../i18n/ui';

type Bi = Record<Lang, string>;
type Source = 'article' | 'fundamento';

/* ── (a) the word machine ───────────────────────────────────────────────── */
export interface Morpheme {
  id: string;
  form: string; // the letters added to the word
  gloss: Bi; // the morpheme-by-morpheme sense shown live
  kind: 'prefix' | 'root' | 'suffix' | 'ending';
  source: Source;
}

export const PREFIXES: Morpheme[] = [
  { id: 'mal', form: 'mal', gloss: { en: 'opposite', uk: 'протилежне' }, kind: 'prefix', source: 'article' },
];

export const ROOTS: Morpheme[] = [
  { id: 'san', form: 'san', gloss: { en: 'health', uk: 'здоров’я' }, kind: 'root', source: 'article' },
  { id: 'bon', form: 'bon', gloss: { en: 'good', uk: 'добрий' }, kind: 'root', source: 'fundamento' },
  { id: 'lern', form: 'lern', gloss: { en: 'learn', uk: 'вчити' }, kind: 'root', source: 'fundamento' },
  { id: 'libr', form: 'libr', gloss: { en: 'book', uk: 'книга' }, kind: 'root', source: 'fundamento' },
  { id: 'am', form: 'am', gloss: { en: 'love', uk: 'любов' }, kind: 'root', source: 'fundamento' },
  { id: 'vort', form: 'vort', gloss: { en: 'word', uk: 'слово' }, kind: 'root', source: 'fundamento' },
];

export const SUFFIXES: Morpheme[] = [
  { id: 'ul', form: 'ul', gloss: { en: 'person', uk: 'особа' }, kind: 'suffix', source: 'article' },
  { id: 'ej', form: 'ej', gloss: { en: 'place', uk: 'місце' }, kind: 'suffix', source: 'article' },
  { id: 'in', form: 'in', gloss: { en: 'female', uk: 'жіноче' }, kind: 'suffix', source: 'fundamento' },
  { id: 'ist', form: 'ist', gloss: { en: 'professional', uk: 'фахівець' }, kind: 'suffix', source: 'fundamento' },
  { id: 'et', form: 'et', gloss: { en: 'small', uk: 'мале' }, kind: 'suffix', source: 'fundamento' },
  { id: 'eg', form: 'eg', gloss: { en: 'large', uk: 'велике' }, kind: 'suffix', source: 'fundamento' },
  { id: 'il', form: 'il', gloss: { en: 'tool', uk: 'знаряддя' }, kind: 'suffix', source: 'fundamento' },
];

export const ENDINGS: Morpheme[] = [
  { id: 'o', form: 'o', gloss: { en: 'noun', uk: 'іменник' }, kind: 'ending', source: 'article' },
  { id: 'a', form: 'a', gloss: { en: 'adjective', uk: 'прикметник' }, kind: 'ending', source: 'article' },
  { id: 'j', form: 'j', gloss: { en: 'plural', uk: 'множина' }, kind: 'ending', source: 'article' },
];

export const ALL_MORPHEMES: Morpheme[] = [...PREFIXES, ...ROOTS, ...SUFFIXES, ...ENDINGS];

// Only these assert an idiomatic meaning — every one is the article's own example.
export interface FeaturedWord {
  parts: string[]; // morpheme ids, in order
  meaning: Bi;
}
export const FEATURED_WORDS: FeaturedWord[] = [
  { parts: ['san', 'a'], meaning: { en: 'healthy', uk: 'здоровий' } },
  { parts: ['mal', 'san', 'a'], meaning: { en: 'sick', uk: 'хворий' } },
  { parts: ['mal', 'san', 'ul', 'o'], meaning: { en: 'a sick person', uk: 'хвора людина' } },
  { parts: ['mal', 'san', 'ul', 'ej', 'o'], meaning: { en: 'a hospital', uk: 'лікарня' } },
  // lernejo "learn-place" = school: the canonical textbook example of -ej-, the
  // exact parallel to the article's malsanulejo. Standard Esperanto (Fundamento).
  { parts: ['lern', 'ej', 'o'], meaning: { en: 'a school', uk: 'школа' } },
];

// Challenge mode: "build the word for X". Answers are the article's word family,
// so every target is article-verifiable.
export interface Challenge {
  target: Bi;
  answer: string[]; // ordered morpheme ids
}
export const CHALLENGES: Challenge[] = [
  { target: { en: 'healthy', uk: 'здоровий' }, answer: ['san', 'a'] },
  { target: { en: 'sick', uk: 'хворий' }, answer: ['mal', 'san', 'a'] },
  { target: { en: 'a sick person', uk: 'хвора людина' }, answer: ['mal', 'san', 'ul', 'o'] },
  { target: { en: 'a hospital', uk: 'лікарня' }, answer: ['mal', 'san', 'ul', 'ej', 'o'] },
  { target: { en: 'a school', uk: 'школа' }, answer: ['lern', 'ej', 'o'] },
];

// The article's pull-quote, shown by the builder.
export const BUILDER_QUOTE: Bi = {
  en: 'Esperanto is the only language where you can be fluent in words you’ve never heard.',
  uk: 'Есперанто — єдина мова, якою можна вільно говорити словами, яких ти ніколи не чув.',
};

/* ── (b) the verb-tense dial ────────────────────────────────────────────────
   One root, every tense regular — the article's "no irregulars, ever". */
export interface Tense {
  ending: string;
  when: Bi; // the article's "now / before / after" tags (+ Fundamento moods)
  source: Source;
}
export const TENSES: Tense[] = [
  { ending: 'as', when: { en: 'now', uk: 'тепер' }, source: 'article' },
  { ending: 'is', when: { en: 'before', uk: 'раніше' }, source: 'article' },
  { ending: 'os', when: { en: 'after', uk: 'потім' }, source: 'article' },
  { ending: 'us', when: { en: 'would', uk: 'умовно' }, source: 'fundamento' },
  { ending: 'u', when: { en: 'command!', uk: 'наказ!' }, source: 'fundamento' },
];

export interface VerbRoot {
  form: string;
  base: Bi; // the dictionary sense
  forms: Record<string, Bi>; // tense ending → English/Ukrainian gloss of the conjugated form
}
export const VERB_ROOTS: VerbRoot[] = [
  {
    form: 'am',
    base: { en: 'to love', uk: 'любити' },
    forms: {
      as: { en: 'loves', uk: 'любить' },
      is: { en: 'loved', uk: 'любив' },
      os: { en: 'will love', uk: 'любитиме' },
      us: { en: 'would love', uk: 'любив би' },
      u: { en: 'love!', uk: 'люби!' },
    },
  },
  {
    form: 'lern',
    base: { en: 'to learn', uk: 'вчитися' },
    forms: {
      as: { en: 'learns', uk: 'вчиться' },
      is: { en: 'learned', uk: 'вчився' },
      os: { en: 'will learn', uk: 'вчитиметься' },
      us: { en: 'would learn', uk: 'вчився б' },
      u: { en: 'learn!', uk: 'вчися!' },
    },
  },
];

/* ── (c) the guessability meter ─────────────────────────────────────────────
   The article's OWN Esperanto terms — tap to reveal the European root. */
export interface GuessWord {
  w: string;
  gloss: Bi;
  root: Bi;
  familiar: boolean; // guessable from a major European root?
}
export const GUESS_WORDS: GuessWord[] = [
  { w: 'Doktoro', gloss: { en: 'doctor', uk: 'лікар' }, root: { en: 'international “doctor”', uk: 'інтернаціональне «доктор»' }, familiar: true },
  { w: 'interna', gloss: { en: 'internal', uk: 'внутрішній' }, root: { en: 'Latin internus → “internal”', uk: 'лат. internus → «внутрішній»' }, familiar: true },
  { w: 'ideo', gloss: { en: 'idea', uk: 'ідея' }, root: { en: 'Greek/Latin idea', uk: 'грец./лат. idea' }, familiar: true },
  { w: 'Fundamento', gloss: { en: 'foundation', uk: 'основа' }, root: { en: 'Latin fundamentum → “fundamental”', uk: 'лат. fundamentum → «фундамент»' }, familiar: true },
  { w: 'Esperanto', gloss: { en: 'one who hopes', uk: 'той, хто сподівається' }, root: { en: 'esper- “hope” (Latin sperare) — the language’s own name', uk: 'esper- «надія» (лат. sperare) — назва самої мови' }, familiar: false },
];
