// Data for the sound-shift interactive (Grimm's Law explorer).
// Core examples from article: pater→father, pēs→foot, trēs→three,
// cornu→horn, piscis→fish, duo→two, dent-→tooth.
// Additional standard Grimm's Law examples for full rule coverage:
// bʰrāter→brother, médʰu→mead, gʰostis→guest, dʰeub→deep, genu→knee.
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
  /* ---- voiceless → fricatives (p>f, t>θ, k>h) ---- */
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
  /* ---- voiced → voiceless (b>p, d>t, g>k) ---- */
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
  {
    // PIE *dʰewb- → PGmc *deupaz → deep (dʰ→d + b→p)
    id: 'dheub',
    ua: null,
    stages: [
      [['dʰ', 'dh>d'], ['eu', null], ['b', 'b>p']],
      [['d', 'dh>d'], ['eu', null], ['p', 'b>p']],
      [['d', 'dh>d'], ['ee', null], ['p', 'b>p']],
    ],
  },
  {
    // PIE *ǵénu → Latin genū → PGmc *knewą → knee (g→k)
    id: 'genu',
    ua: null,
    stages: [
      [['g', 'g>k'], ['enu', null]],
      [['k', 'g>k'], ['niu', null]],
      [['k', 'g>k'], ['nee', null]],
    ],
  },
  /* ---- breathy → voiced (bh>b, dh>d, gh>g) ---- */
  {
    // PIE *bʰráh₂tēr → PGmc *brōþēr → brother (bʰ→b + t→θ)
    id: 'bhrater',
    ua: null,
    stages: [
      [['bʰ', 'bh>b'], ['rā', null], ['t', 't>θ'], ['er', null]],
      [['b', 'bh>b'], ['rō', null], ['þ', 't>θ'], ['er', null]],
      [['b', 'bh>b'], ['ro', null], ['th', 't>θ'], ['er', null]],
    ],
  },
  {
    // PIE *médʰu → PGmc *meduz → mead (dʰ→d)
    id: 'medhu',
    ua: 'мед',
    stages: [
      [['me', null], ['dʰ', 'dh>d'], ['u', null]],
      [['me', null], ['d', 'dh>d'], ['u', null]],
      [['mea', null], ['d', 'dh>d'], ['', null]],
    ],
  },
  {
    // PIE *gʰóstis → PGmc *gastiz → guest (gʰ→g)
    id: 'ghostis',
    ua: null,
    stages: [
      [['gʰ', 'gh>g'], ['ostis', null]],
      [['g', 'gh>g'], ['astiz', null]],
      [['g', 'gh>g'], ['uest', null]],
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
  dheub: { en: 'deep', uk: 'глибокий' },
  genu: { en: 'knee', uk: 'коліно' },
  bhrater: { en: 'brother', uk: 'брат' },
  medhu: { en: 'mead', uk: 'мед' },
  ghostis: { en: 'guest', uk: 'гість' },
};
