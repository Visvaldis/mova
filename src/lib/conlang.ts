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

export interface Conlang {
  seed: number;
  name: string;
  lexicon: Record<Concept, string>;
  plural: (word: string) => string;
  pluralLabel: string;
}

export function forge(seed: number, preset: Preset, pluralStyle: PluralStyle): Conlang {
  const r = rng(seed);
  const lexicon = {} as Record<Concept, string>;
  const used = new Set<string>();
  for (const c of CONCEPTS) {
    let w = makeWord(r, preset, r() < 0.45 ? 1 : 2);
    while (used.has(w)) w = makeWord(r, preset, 2);
    used.add(w);
    lexicon[c] = w;
  }
  const pluralMorph = makeWord(r, preset, 1);
  const plural =
    pluralStyle === 'suffix'
      ? (w: string) => w + '-' + pluralMorph
      : pluralStyle === 'prefix'
        ? (w: string) => pluralMorph + '-' + w
        : (w: string) => w + '-' + w;
  const pluralLabel =
    pluralStyle === 'suffix' ? `X-${pluralMorph}` : pluralStyle === 'prefix' ? `${pluralMorph}-X` : 'X-X';
  // Language name from its own phonology, capitalized.
  const raw = makeWord(r, preset, 2);
  const name = raw.charAt(0).toUpperCase() + raw.slice(1);
  return { seed, name, lexicon, plural, pluralLabel };
}

export function sentence(lang: Conlang, order: WordOrder): string[] {
  const S = lang.lexicon.friend;
  const V = lang.lexicon.see;
  const O = lang.lexicon.bird;
  if (order === 'SOV') return [S, O, V];
  if (order === 'VSO') return [V, S, O];
  return [S, V, O];
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

export interface Drifted {
  rules: DriftRule[];
  analogy: Record<Lang, string>;
  lexicon: Record<Concept, string>;
  newPlural: (word: string) => string;
}

export function fastForward(lang: Conlang, seed: number): Drifted {
  const r = rng(seed * 7 + 13);
  const shuffled = [...DRIFT_RULES].sort(() => r() - 0.5);
  const rules = shuffled.slice(0, 2);
  const lexicon = {} as Record<Concept, string>;
  for (const c of CONCEPTS) {
    let w = lang.lexicon[c];
    for (const rule of rules) w = rule.apply(w);
    lexicon[c] = w;
  }
  // Analogy: the old plural is replaced by the most frequent pattern (here: plain suffix -i).
  const newPlural = (w: string) => w + 'i';
  const analogy: Record<Lang, string> = {
    en: `Analogy: speakers regularized the old plural (${lang.pluralLabel}) into a simple -i — the same force that turned English "kine" into "cows".`,
    uk: `Аналогія: мовці вирівняли стару множину (${lang.pluralLabel}) до простого -i — та сама сила, що замінила англійське "kine" на "cows".`,
  };
  return { rules, analogy, lexicon, newPlural };
}
