// Seeded toy language generator for Conlang Forge.
// Same seed + same choices → same language (shareable/reproducible).
import type { Lang } from '../i18n/ui';

// Mulberry32 PRNG — tiny, deterministic.
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Preset {
  id: 'harsh' | 'flowing' | 'weird';
  onsets: string[];
  vowels: string[];
  codas: string[]; // '' = open syllable allowed
}

export const PRESETS: Preset[] = [
  { id: 'harsh', onsets: ['k', 'g', 'kr', 'gr', 'd', 'dr', 't', 'tr', 'z', 'r', 'kh', 'br'], vowels: ['a', 'o', 'u', 'au'], codas: ['k', 'r', 'g', 'rt', 'n', '', ''] },
  { id: 'flowing', onsets: ['m', 'l', 'n', 's', 'v', 'h', 'w', 'sh', 'y', 'r'], vowels: ['a', 'e', 'i', 'o', 'ea', 'ai', 'ia'], codas: ['', '', '', 'n', 'l', 'm'] },
  { id: 'weird', onsets: ['q', 'ts', 'x', 'kʼ', 'tl', 'ǂ', 'mb', 'nd', 'ʔ'], vowels: ['i', 'u', 'a', 'oa', 'ɨ'], codas: ['', '', 'q', 'ʔ', ''] },
];

export type WordOrder = 'SVO' | 'SOV' | 'VSO';
export type PluralStyle = 'suffix' | 'redup' | 'prefix';
export type PastStyle = 'suffix' | 'prefix' | 'ablaut';
export type WordLength = 'short' | 'medium' | 'long';
export type AdjOrder = 'AN' | 'NA';
export type QStyle = 'end' | 'start' | 'intonation';

export interface ForgeOptions {
  plural: PluralStyle;
  past: PastStyle;
  wordLength: WordLength;
  /** Pitch melody on every word, Mandarin/Yoruba-style. */
  tones: boolean;
  /** All vowels in a word agree front/back, Turkish/Finnish-style. */
  harmony: boolean;
}

// Concepts to generate; glossed via i18n at render time.
export const CONCEPTS = [
  'water', 'sun', 'friend', 'big', 'small', 'eat', 'see', 'stone', 'bird', 'night', 'good', 'speak',
  'moon', 'fire', 'hand', 'tree', 'fish', 'dog',
] as const;
export type Concept = (typeof CONCEPTS)[number];

export const CONCEPT_GLOSS: Record<Concept, Record<Lang, string>> = {
  water: { en: 'water', uk: 'вода' },
  sun: { en: 'sun', uk: 'сонце' },
  friend: { en: 'friend', uk: 'друг' },
  big: { en: 'big', uk: 'великий' },
  small: { en: 'small', uk: 'малий' },
  eat: { en: 'eat', uk: 'їсти' },
  see: { en: 'see', uk: 'бачити' },
  stone: { en: 'stone', uk: 'камінь' },
  bird: { en: 'bird', uk: 'птах' },
  night: { en: 'night', uk: 'ніч' },
  good: { en: 'good', uk: 'добрий' },
  speak: { en: 'speak', uk: 'говорити' },
  moon: { en: 'moon', uk: 'місяць' },
  fire: { en: 'fire', uk: 'вогонь' },
  hand: { en: 'hand', uk: 'рука' },
  tree: { en: 'tree', uk: 'дерево' },
  fish: { en: 'fish', uk: 'риба' },
  dog: { en: 'dog', uk: 'пес' },
};

const BLOCKLIST = ['fuck', 'shit', 'cunt', 'dick', 'nazi', 'хуй', 'хуи', 'бля', 'пизд', 'їбат', 'ебат', 'сук'];

function syllable(r: () => number, p: Preset): string {
  const pick = <T,>(xs: T[]) => xs[Math.floor(r() * xs.length)];
  return pick(p.onsets) + pick(p.vowels) + pick(p.codas);
}

function makeWord(r: () => number, p: Preset, syllables: number): string {
  for (let attempt = 0; attempt < 10; attempt++) {
    let w = '';
    for (let i = 0; i < syllables; i++) w += syllable(r, p);
    if (!BLOCKLIST.some((b) => w.includes(b))) return w;
  }
  return syllable(r, p) + syllable(r, p);
}

// ---- post-processing decorations ----------------------------------------

/** Toy vowel harmony: the first vowel decides the word's class (front e/i vs
 *  back a/o/u); later vowels are pulled into the same class, Turkish-style. */
const FRONT = new Set(['e', 'i', 'ö', 'ü']);
const TO_FRONT: Record<string, string> = { a: 'e', o: 'ö', u: 'ü' };
const TO_BACK: Record<string, string> = { e: 'a', i: 'u', ö: 'o', ü: 'u' };
export function harmonize(w: string): string {
  const first = [...w].find((ch) => 'aeiouöü'.includes(ch));
  if (!first) return w;
  const map = FRONT.has(first) ? TO_FRONT : TO_BACK;
  let seen = false;
  return [...w]
    .map((ch) => {
      if ('aeiouöü'.includes(ch)) {
        if (!seen) {
          seen = true;
          return ch; // the first vowel sets the class and stays put
        }
        return map[ch] ?? ch;
      }
      return ch;
    })
    .join('');
}

/** Toy tones: every word gets a pitch melody on its first vowel — high (´),
 *  low (`), or falling (ˆ). Deterministic per word so re-renders are stable. */
export function tonalize(w: string): string {
  const TONES = ['́', '̀', '̂']; // combining acute / grave / circumflex
  let hash = 0;
  for (const ch of w) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  const tone = TONES[Math.abs(hash) % TONES.length];
  let done = false;
  return [...w]
    .map((ch) => {
      if (!done && 'aeiouöüɨ'.includes(ch)) {
        done = true;
        return (ch + tone).normalize('NFC');
      }
      return ch;
    })
    .join('');
}

/** English-style ablaut: shift the first vowel (sing → sang, write → wrote). */
const ABLAUT: Record<string, string> = { a: 'o', e: 'a', i: 'a', o: 'u', u: 'o' };
function ablaut(w: string): string {
  let done = false;
  return [...w]
    .map((ch) => {
      if (!done && ch in ABLAUT) {
        done = true;
        return ABLAUT[ch];
      }
      return ch;
    })
    .join('');
}

export interface Conlang {
  seed: number;
  name: string;
  lexicon: Record<Concept, string>;
  plural: (word: string) => string;
  pluralLabel: string;
  past: (word: string) => string;
  pastLabel: string;
  /** Question particle (used by QStyle 'end' / 'start'). */
  qParticle: string;
  /** Decoration applied to every displayed word (tones / harmony). */
  decorate: (word: string) => string;
}

const sylCount = (r: () => number, len: WordLength): number => {
  if (len === 'short') return 1;
  if (len === 'long') return r() < 0.4 ? 2 : 3;
  return r() < 0.45 ? 1 : 2; // medium — the original behavior
};

export function forge(seed: number, preset: Preset, opts: ForgeOptions): Conlang {
  const r = rng(seed);
  const decorate = (w: string) => {
    let out = w;
    if (opts.harmony) out = harmonize(out);
    if (opts.tones) out = tonalize(out);
    return out;
  };
  const lexicon = {} as Record<Concept, string>;
  const used = new Set<string>();
  for (const c of CONCEPTS) {
    let w = makeWord(r, preset, sylCount(r, opts.wordLength));
    while (used.has(w)) w = makeWord(r, preset, 2);
    used.add(w);
    lexicon[c] = w;
  }
  // Morphs are always drawn in the same order so the rng stream — and thus the
  // lexicon for a given seed — stays stable across plural/past/question toggles.
  const pluralMorph = makeWord(r, preset, 1);
  const pastMorph = makeWord(r, preset, 1);
  const qParticle = makeWord(r, preset, 1);

  const plural =
    opts.plural === 'suffix'
      ? (w: string) => w + '-' + pluralMorph
      : opts.plural === 'prefix'
        ? (w: string) => pluralMorph + '-' + w
        : (w: string) => w + '-' + w;
  const pluralLabel =
    opts.plural === 'suffix' ? `X-${pluralMorph}` : opts.plural === 'prefix' ? `${pluralMorph}-X` : 'X-X';

  const past =
    opts.past === 'suffix'
      ? (w: string) => w + '-' + pastMorph
      : opts.past === 'prefix'
        ? (w: string) => pastMorph + '-' + w
        : ablaut;
  const pastLabel =
    opts.past === 'suffix' ? `X-${pastMorph}` : opts.past === 'prefix' ? `${pastMorph}-X` : 'a → o';

  // Language name from its own phonology, capitalized.
  const raw = decorate(makeWord(r, preset, 2));
  const name = raw.charAt(0).toUpperCase() + raw.slice(1);
  return { seed, name, lexicon, plural, pluralLabel, past, pastLabel, qParticle, decorate };
}

// ---- sample sentences -----------------------------------------------------

export interface SentenceOpts {
  order: WordOrder;
  adj: AdjOrder;
  q: QStyle;
}

const arrange = (order: WordOrder, S: string[], V: string[], O: string[]): string[] => {
  if (order === 'SOV') return [...S, ...O, ...V];
  if (order === 'VSO') return [...V, ...S, ...O];
  return [...S, ...V, ...O];
};

/** "the friend sees the big bird" with the chosen order + adjective position. */
export function statement(lex: Record<Concept, string>, opts: SentenceOpts): string[] {
  const obj = opts.adj === 'AN' ? [lex.big, lex.bird] : [lex.bird, lex.big];
  return arrange(opts.order, [lex.friend], [lex.see], obj);
}

/** "does the friend see the bird?" — particle at start/end, or intonation only. */
export function question(lex: Record<Concept, string>, qParticle: string, opts: SentenceOpts): string {
  const core = arrange(opts.order, [lex.friend], [lex.see], [lex.bird]).join(' ');
  if (opts.q === 'start') return `${qParticle} ${core}?`;
  if (opts.q === 'end') return `${core} ${qParticle}?`;
  return `${core}? ↗`;
}

/** "the friend saw the bird" using the past-tense rule. */
export function pastSentence(
  lex: Record<Concept, string>,
  past: (w: string) => string,
  opts: SentenceOpts,
): string[] {
  return arrange(opts.order, [lex.friend], [past(lex.see)], [lex.bird]);
}

// ---- 500 years of drift -------------------------------------------------
export interface DriftRule {
  id: string;
  label: string;
  note: Record<Lang, string>;
  apply: (w: string) => string;
}

const DRIFT_RULES: DriftRule[] = [
  { id: 'k>h', label: 'k → h', note: { en: 'Lenition — the same softening as Grimm’s Law.', uk: 'Леніція — те саме пом’якшення, що в законі Ґрімма.' }, apply: (w) => w.replace(/k(?!ʼ)/g, 'h') },
  { id: 't>ts', label: 't → ts', note: { en: 'Affrication, as in High German Zeit.', uk: 'Африкатизація, як у верхньонімецькому Zeit.' }, apply: (w) => w.replace(/t(?![sl])/g, 'ts') },
  { id: 'finalV', label: 'final vowel lost', note: { en: 'Final vowels erode — English did exactly this.', uk: 'Кінцеві голосні стираються — англійська пройшла саме це.' }, apply: (w) => w.replace(/[aeiou]$/g, '') },
  { id: 'voice', label: 'p,t,k → b,d,g between vowels', note: { en: 'Intervocalic voicing, as in Spanish.', uk: 'Міжголоснева дзвінкість, як в іспанській.' }, apply: (w) => w.replace(/([aeiou])p(?=[aeiou])/g, '$1b').replace(/([aeiou])t(?=[aeiou])/g, '$1d').replace(/([aeiou])k(?=[aeiou])/g, '$1g') },
  { id: 'l>r', label: 'l → r', note: { en: 'Liquids swap constantly across languages.', uk: 'Плавні постійно міняються місцями в мовах світу.' }, apply: (w) => w.replace(/l/g, 'r') },
  { id: 's>sh', label: 's → sh', note: { en: 'Palatalization — a favorite move of Slavic.', uk: 'Палаталізація — улюблений хід слов’янських мов.' }, apply: (w) => w.replace(/s(?!h)/g, 'sh') },
];

export const MAX_DRIFT_ROUNDS = 3; // 2 rules per round, 6 rules total

export interface Drifted {
  rules: DriftRule[];
  analogy: Record<Lang, string>;
  lexicon: Record<Concept, string>;
  newPlural: (word: string) => string;
  /** The same cumulative changes, applicable to any word (morphs, names). */
  transform: (word: string) => string;
}

/**
 * Apply `rounds` × 500 years of drift. Rules are drawn without repetition from
 * a seed-shuffled deck, so round 2 extends round 1 instead of replacing it.
 */
export function fastForward(lang: Conlang, seed: number, rounds = 1): Drifted {
  const r = rng(seed * 7 + 13);
  const shuffled = [...DRIFT_RULES].sort(() => r() - 0.5);
  const rules = shuffled.slice(0, Math.min(rounds, MAX_DRIFT_ROUNDS) * 2);
  const transform = (word: string) => {
    let w = word;
    for (const rule of rules) w = rule.apply(w);
    return w;
  };
  const lexicon = {} as Record<Concept, string>;
  for (const c of CONCEPTS) lexicon[c] = transform(lang.lexicon[c]);
  // Analogy: the old plural is replaced by the most frequent pattern (here: plain suffix -i).
  const newPlural = (w: string) => w + 'i';
  const analogy: Record<Lang, string> = {
    en: `Analogy: speakers regularized the old plural (${lang.pluralLabel}) into a simple -i — the same force that turned English "kine" into "cows".`,
    uk: `Аналогія: мовці вирівняли стару множину (${lang.pluralLabel}) до простого -i — та сама сила, що замінила англійське "kine" на "cows".`,
  };
  return { rules, analogy, lexicon, newPlural, transform };
}
