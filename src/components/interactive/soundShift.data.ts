// Data for the sound-shift interactive (Grimm's Law explorer).
// All facts match content/{en,uk}/sound-change.md — pater→father, trēs→three,
// cornu→horn, dent-→tooth, два/two. Ported from prototype-sound-shift.html.
import type { Lang } from '../../i18n/ui';

export type RuleId = 'p>f' | 't>θ' | 'k>h' | 'd>t';

export const RULES: RuleId[] = ['p>f', 't>θ', 'k>h', 'd>t'];
export const RULE_LABEL: Record<RuleId, string> = {
  'p>f': 'p → f',
  't>θ': 't → θ',
  'k>h': 'k → h',
  'd>t': 'd → t',
};

/** Each stage = list of [text, ruleId | null] segments; rule segments highlight/animate. */
export type Segment = [string, RuleId | null];

export interface ShiftWord {
  id: string;
  /** Ukrainian cognate that kept the old consonant (shown as a footnote). */
  ua: string | null;
  stages: [Segment[], Segment[], Segment[]];
}

export const WORDS: ShiftWord[] = [
  {
    id: 'pater',
    ua: null,
    stages: [
      [['p', 'p>f'], ['a', null], ['t', 't>θ'], ['er', null]],
      [['f', 'p>f'], ['a', null], ['þ', 't>θ'], ['er', null]],
      [['f', 'p>f'], ['a', null], ['th', 't>θ'], ['er', null]],
    ],
  },
  {
    id: 'tres',
    ua: 'три',
    stages: [
      [['t', 't>θ'], ['rēs', null]],
      [['þ', 't>θ'], ['rēs', null]],
      [['th', 't>θ'], ['ree', null]],
    ],
  },
  {
    id: 'cornu',
    ua: null,
    stages: [
      [['c', 'k>h'], ['ornu', null]],
      [['h', 'k>h'], ['ornu', null]],
      [['h', 'k>h'], ['orn', null]],
    ],
  },
  {
    id: 'piscis',
    ua: null,
    stages: [
      [['p', 'p>f'], ['iscis', null]],
      [['f', 'p>f'], ['iscis', null]],
      [['f', 'p>f'], ['ish', null]],
    ],
  },
  {
    id: 'duo',
    ua: 'два',
    stages: [
      [['d', 'd>t'], ['uo', null]],
      [['t', 'd>t'], ['uo', null]],
      [['t', 'd>t'], ['wo', null]],
    ],
  },
  {
    id: 'dent',
    ua: null,
    stages: [
      [['d', 'd>t'], ['en', null], ['t', 't>θ'], ['-', null]],
      [['t', 'd>t'], ['an', null], ['þ', 't>θ'], ['-', null]],
      [['t', 'd>t'], ['oo', null], ['th', 't>θ'], ['', null]],
    ],
  },
];

export const GLOSSES: Record<string, Record<Lang, string>> = {
  pater: { en: 'father', uk: 'батько' },
  tres: { en: 'three', uk: 'три' },
  cornu: { en: 'horn', uk: 'ріг' },
  piscis: { en: 'fish', uk: 'риба' },
  duo: { en: 'two', uk: 'два' },
  dent: { en: 'tooth', uk: 'зуб' },
};
