// Data for the sound-shift interactive (Grimm's Law explorer).
// All facts match content/{en,uk}/sound-change.md — pater→father, pēs→foot,
// trēs→three, cornu→horn, piscis→fish, duo→two, dent-→tooth.
import type { Lang } from '../../i18n/ui';

export type RuleId =
  | 'bh>b' | 'dh>d' | 'gh>g'   // breathy → voiced
  | 'b>p'  | 'd>t'  | 'g>k'    // voiced → voiceless
  | 'p>f'  | 't>θ'  | 'k>h';   // voiceless → fricatives

export const RULES: RuleId[] = [
  'bh>b', 'dh>d', 'gh>g',
  'b>p', 'd>t', 'g>k',
  'p>f', 't>θ', 'k>h',
];

export const RULE_LABEL: Record<RuleId, string> = {
  'bh>b': 'bʰ → b',
  'dh>d': 'dʰ → d',
  'gh>g': 'gʰ → g',
  'b>p': 'b → p',
  'd>t': 'd → t',
  'g>k': 'g → k',
  'p>f': 'p → f',
  't>θ': 't → θ',
  'k>h': 'k → h',
};

export interface RuleGroup {
  id: 'breathy' | 'voiced' | 'voiceless';
  rules: RuleId[];
}

export const RULE_GROUPS: RuleGroup[] = [
  { id: 'breathy',   rules: ['bh>b', 'dh>d', 'gh>g'] },
  { id: 'voiced',    rules: ['b>p',  'd>t',  'g>k']  },
  { id: 'voiceless', rules: ['p>f',  't>θ',  'k>h']  },
];

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
    id: 'pes',
    ua: null,
    stages: [
      [['p', 'p>f'], ['ēs', null]],
      [['f', 'p>f'], ['ōt', null]],
      [['f', 'p>f'], ['oot', null]],
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
  pes: { en: 'foot', uk: 'стопа' },
  tres: { en: 'three', uk: 'три' },
  cornu: { en: 'horn', uk: 'ріг' },
  piscis: { en: 'fish', uk: 'риба' },
  duo: { en: 'two', uk: 'два' },
  dent: { en: 'tooth', uk: 'зуб' },
};
