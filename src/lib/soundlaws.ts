// Sound-law rule packs for the Sound Shift Sandbox.
// The rules are genuine historical correspondences (see content/*/sound-change.md);
// applying them to arbitrary modern strings is a deliberately-labeled toy.
import type { Lang } from '../i18n/ui';

export interface SoundRule {
  id: string;
  /** Human-readable rule, e.g. "p → f" */
  label: string;
  /** One-line explanation per UI language. */
  note: Record<Lang, string>;
  /** Find (regex, case-insensitive, applied to lowercase). */
  match: RegExp;
  replace: string;
}

export interface RulePack {
  id: string;
  name: Record<Lang, string>;
  desc: Record<Lang, string>;
  /** Which scripts it makes sense for: 'latin' | 'cyrillic' | 'both' */
  script: 'latin' | 'cyrillic' | 'both';
  rules: SoundRule[];
  /** Clickable example words that showcase the rules firing. */
  examples: string[];
}

export const RULE_PACKS: RulePack[] = [
  {
    id: 'grimm',
    name: { en: "Grimm's Law (~500 BCE)", uk: 'Закон Ґрімма (~500 до н.е.)' },
    desc: {
      en: 'The Germanic chain shift: voiceless stops → fricatives, voiced stops → voiceless, breathy stops → voiced.',
      uk: 'Германський ланцюговий зсув: глухі проривні → фрикативи, дзвінкі → глухі, придихові → дзвінкі.',
    },
    script: 'latin',
    examples: ['pater', 'tres', 'cornu', 'piscis', 'decem', 'genu'],
    rules: [
      { id: 'bh', label: 'bʰ → b', match: /bh/g, replace: 'b', note: { en: 'Breathy bʰ hardens to b.', uk: 'Придихове bʰ твердне в b.' } },
      { id: 'dh', label: 'dʰ → d', match: /dh/g, replace: 'd', note: { en: 'Breathy dʰ hardens to d.', uk: 'Придихове dʰ твердне в d.' } },
      { id: 'gh', label: 'gʰ → g', match: /gh/g, replace: 'g', note: { en: 'Breathy gʰ hardens to g.', uk: 'Придихове gʰ твердне в g.' } },
      { id: 'p', label: 'p → f', match: /p/g, replace: 'f', note: { en: 'Latin pater → father.', uk: 'Латинське pater → father.' } },
      { id: 't', label: 't → þ', match: /t/g, replace: 'þ', note: { en: 'Latin trēs → three (þ = th).', uk: 'Латинське trēs → three (þ = th).' } },
      { id: 'k', label: 'k/c → h', match: /[kc]/g, replace: 'h', note: { en: 'Latin cornu → horn.', uk: 'Латинське cornu → horn.' } },
      { id: 'b', label: 'b → p', match: /b(?!h)/g, replace: 'p', note: { en: 'Voiced b devoices to p.', uk: 'Дзвінке b оглушується в p.' } },
      { id: 'd', label: 'd → t', match: /d(?!h)/g, replace: 't', note: { en: 'Latin dent- → tooth; два → two.', uk: 'Латинське dent- → tooth; два → two.' } },
      { id: 'g', label: 'g → k', match: /g(?!h)/g, replace: 'k', note: { en: 'Latin genu → knee.', uk: 'Латинське genu → knee.' } },
    ],
  },
  {
    id: 'ikavism',
    name: { en: 'Ukrainian ikavism (o/e → i)', uk: 'Український ікавізм (о/е → і)' },
    desc: {
      en: "Ukrainian's signature shift: o and e became і in closed syllables — конь → кінь, ночь → ніч.",
      uk: 'Фірмовий український зсув: о та е перейшли в і в закритих складах — конь → кінь, ночь → ніч.',
    },
    script: 'cyrillic',
    examples: ['конь', 'ночь', 'печь', 'вовкь', 'шесть'],
    rules: [
      {
        id: 'o-closed', label: 'о → і (closed syllable)',
        match: /о(?=[бвгґджзйклмнпрстфхцчшщ](?:[ьъ]?(?:\s|$|[бвгґджзйклмнпрстфхцчшщ])))/g,
        replace: 'і',
        note: { en: 'o → i before a syllable-closing consonant (конь → кінь).', uk: 'о → і перед приголосним, що закриває склад (конь → кінь).' },
      },
      {
        id: 'e-closed', label: 'е → і (closed syllable)',
        match: /е(?=[бвгґджзйклмнпрстфхцчшщ](?:[ьъ]?(?:\s|$|[бвгґджзйклмнпрстфхцчшщ])))/g,
        replace: 'і',
        note: { en: 'e → i before a syllable-closing consonant (печь → піч).', uk: 'е → і перед приголосним, що закриває склад (печь → піч).' },
      },
    ],
  },
  {
    id: 'gvs',
    name: { en: 'Great Vowel Shift (1400–1700)', uk: 'Великий зсув голосних (1400–1700)' },
    desc: {
      en: 'English long vowels rotated upward — the reason English spelling preserves medieval pronunciation.',
      uk: 'Довгі голосні англійської піднялися по колу — тому англійський правопис зберігає середньовічну вимову.',
    },
    script: 'latin',
    examples: ['beet', 'moon', 'name', 'goose', 'make'],
    rules: [
      { id: 'ii', label: 'iː → aɪ', match: /ee/g, replace: 'igh', note: { en: 'Long ee became the "eye" diphthong — meet would now rhyme with might (bite was once "beet-eh").', uk: 'Довге ee стало дифтонгом «ай» — meet римувалося б із might (bite колись звучало як «біте»).' } },
      { id: 'uu', label: 'uː → aʊ', match: /oo/g, replace: 'ow', note: { en: 'Long oo became "ow" (house was "hoos").', uk: 'Довге oo стало «ау» (house звучало як «хус»).' } },
      { id: 'aa', label: 'aː → eɪ', match: /a(?=[bcdfghklmnprstvz]e\b)/g, replace: 'ei', note: { en: 'Long a raised to "ay" (name was "nah-meh").', uk: 'Довге a піднялося до «ей» (name звучало як «наме»).' } },
    ],
  },
];

export interface AppliedRule {
  rule: SoundRule;
  count: number;
}

export interface ShiftResult {
  output: string;
  fired: AppliedRule[];
  /** Indices in output that were produced by a rule (for highlighting). */
  changed: boolean[];
}

/** Apply a pack's rules simultaneously (single pass, as a chain shift works —
 *  otherwise p→f→…, d→t→þ would cascade, which is historically wrong). */
export function applyPack(pack: RulePack, input: string): ShiftResult {
  const src = input.toLowerCase();
  const fired = new Map<string, number>();
  // Tokenize into [index, length, replacement, ruleId] matches; rules earlier in the list win overlaps.
  type Hit = { start: number; end: number; out: string; ruleId: string };
  const hits: Hit[] = [];
  const taken = new Array(src.length).fill(false);
  for (const rule of pack.rules) {
    rule.match.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = rule.match.exec(src)) !== null) {
      const start = m.index;
      const end = start + m[0].length;
      if (m[0].length === 0) { rule.match.lastIndex++; continue; }
      let overlap = false;
      for (let i = start; i < end; i++) if (taken[i]) overlap = true;
      if (overlap) continue;
      for (let i = start; i < end; i++) taken[i] = true;
      hits.push({ start, end, out: rule.replace, ruleId: rule.id });
      fired.set(rule.id, (fired.get(rule.id) ?? 0) + 1);
    }
  }
  hits.sort((a, b) => a.start - b.start);
  let output = '';
  const changed: boolean[] = [];
  let cursor = 0;
  for (const h of hits) {
    for (let i = cursor; i < h.start; i++) { output += src[i]; changed.push(false); }
    for (const ch of h.out) { output += ch; changed.push(true); }
    cursor = h.end;
  }
  for (let i = cursor; i < src.length; i++) { output += src[i]; changed.push(false); }
  const firedList: AppliedRule[] = pack.rules
    .filter((r) => fired.has(r.id))
    .map((r) => ({ rule: r, count: fired.get(r.id)! }));
  return { output, fired: firedList, changed };
}
