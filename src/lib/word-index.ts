// Build-time aggregator for the /words/ index (docs/WORD-INDEX.md).
// Pure function over the five curated playground datasets — no new facts here.
// Merge rule: same normalized key ⇒ one entry, appearances concatenated;
// when identity is uncertain, two entries beat one wrong entry.
import type { Lang } from '../i18n/ui';
import etymologies from '../data/playground/etymologies.json';
import atlas from '../data/playground/word-atlas.json';
import cognates from '../data/playground/cognates.json';
import lexicon from '../data/playground/uk-lexicon.json';
import babel from '../data/playground/babel.json';

export type AppearanceKind = 'etymology' | 'atlas' | 'cognate' | 'lexicon' | 'language';

export interface Appearance {
  kind: AppearanceKind;
  label: Record<Lang, string>;
  /** App-relative path WITHOUT lang prefix, e.g. "playground/word-atlas?word=tea". */
  href: string;
  snippet?: Record<Lang, string>;
}

export interface IndexEntry {
  key: string;
  display: string;
  gloss?: Record<Lang, string>;
  appearances: Appearance[];
  /** Rich = anything beyond a lone lexicon row; sorts first within a letter. */
  rich: boolean;
}

const KIND_LABEL: Record<AppearanceKind, Record<Lang, string>> = {
  etymology: { en: 'Word Time Machine — etymology chain', uk: 'Машина часу — етимологічний ланцюг' },
  atlas: { en: 'Word Atlas — across the world', uk: 'Атлас слів — по світу' },
  cognate: { en: 'Cognate Rush — EN↔UK pair', uk: 'Когнатний забіг — пара EN↔UK' },
  lexicon: { en: 'Stratigraph — origin layer', uk: 'Стратиграф — шар походження' },
  language: { en: 'Babel Daily — language', uk: 'Вавилон щодня — мова' },
};

function norm(s: string): string {
  return s.toLowerCase().replace(/[’ʼ`]/g, "'").replace(/[*().]/g, '').trim();
}

export function buildWordIndex(): IndexEntry[] {
  const map = new Map<string, IndexEntry>();

  const add = (
    rawKey: string,
    display: string,
    kind: AppearanceKind,
    href: string,
    gloss?: Record<Lang, string>,
    snippet?: Record<Lang, string>,
  ) => {
    const key = norm(rawKey);
    if (key.length < 2 && !/[а-яa-z]/i.test(key)) return;
    let e = map.get(key);
    if (!e) {
      e = { key, display, appearances: [], rich: false };
      map.set(key, e);
    }
    if (display.length > e.display.length) e.display = display;
    if (gloss && !e.gloss) e.gloss = gloss;
    // De-dup identical hrefs (e.g. the same atlas word adding gloss + form).
    if (!e.appearances.some((a) => a.href === href && a.kind === kind)) {
      e.appearances.push({ kind, label: KIND_LABEL[kind], href, snippet });
    }
  };

  // 1) Etymology chains
  for (const w of (etymologies as any).words) {
    const first = w.chain[0]?.form ?? '';
    const last = w.chain[w.chain.length - 1]?.form ?? '';
    const snippet = {
      en: `${w.chain[0]?.reconstructed ? '*' : ''}${first} → … → ${last}`,
      uk: `${w.chain[0]?.reconstructed ? '*' : ''}${first} → … → ${last}`,
    };
    for (const part of String(w.lemma.en).split('/')) {
      add(part, part.trim(), 'etymology', `playground/word-time-machine?w=${w.id}`, undefined, snippet);
    }
  }

  // 2) Atlas: headline words + every individual form
  for (const w of (atlas as any).words) {
    add(w.gloss.en, w.gloss.en, 'atlas', `playground/word-atlas?word=${w.id}`, w.gloss);
    add(w.gloss.uk, w.gloss.uk, 'atlas', `playground/word-atlas?word=${w.id}`, w.gloss);
    for (const f of w.forms) {
      const langName = (atlas as any).languages[f.lang]?.name as Record<Lang, string> | undefined;
      const snippet = langName
        ? { en: `${langName.en} for “${w.gloss.en}”`, uk: `${langName.uk}: «${w.gloss.uk}»` }
        : undefined;
      add(f.form, f.native ?? f.form, 'atlas', `playground/word-atlas?word=${w.id}`, w.gloss, snippet);
      if (f.native) add(f.native, f.native, 'atlas', `playground/word-atlas?word=${w.id}`, w.gloss, snippet);
    }
  }

  // 3) Cognate pairs (both sides)
  for (const p of (cognates as any).pairs) {
    const snippet = p.false
      ? { en: `false friend — ${p.note.en}`, uk: `фальшивий друг — ${p.note.uk}` }
      : { en: `PIE root ${p.root}`, uk: `ПІЄ-корінь ${p.root}` };
    add(p.a, p.a, 'cognate', 'playground/cognate-rush', undefined, snippet);
    add(p.b, p.b, 'cognate', 'playground/cognate-rush', undefined, snippet);
  }

  // 4) Stratigraph lexicon (the long tail)
  const layers = (lexicon as any).layers as Record<string, { en: string; uk: string }>;
  for (const w of (lexicon as any).words) {
    const layer = layers[w.y];
    const snippet = w.n
      ? { en: `${layer.en} — ${w.n.en}`, uk: `${layer.uk} — ${w.n.uk}` }
      : { en: layer.en, uk: layer.uk };
    add(w.l, w.l, 'lexicon', 'playground/stratigraph', undefined, snippet);
  }

  // 5) Babel language names
  for (const l of (babel as any).languages) {
    const fams = (babel as any).families as Record<string, Record<Lang, string>>;
    const snippet = fams[l.family]
      ? { en: `${fams[l.family].en} family`, uk: `родина: ${fams[l.family].uk}` }
      : undefined;
    add(l.name.en, l.name.en, 'language', 'playground/babel-daily', undefined, snippet);
    add(l.name.uk, l.name.uk, 'language', 'playground/babel-daily', undefined, snippet);
  }

  const entries = [...map.values()];
  for (const e of entries) {
    e.rich = e.appearances.length > 1 || e.appearances.some((a) => a.kind !== 'lexicon');
  }
  return entries.sort((a, b) => a.key.localeCompare(b.key, 'uk'));
}

/** Group entries by first letter: Cyrillic А–Я first, then Latin A–Z, then #. */
export function groupByLetter(entries: IndexEntry[]): { letter: string; entries: IndexEntry[] }[] {
  const groups = new Map<string, IndexEntry[]>();
  for (const e of entries) {
    const c = e.key[0]?.toUpperCase() ?? '#';
    const letter = /[А-ЩЬЮЯҐЄІЇ]/.test(c) || /[A-Z]/.test(c) ? c : '#';
    if (!groups.has(letter)) groups.set(letter, []);
    groups.get(letter)!.push(e);
  }
  const isCyr = (ch: string) => /[А-ЩЬЮЯҐЄІЇ]/.test(ch);
  const sorted = [...groups.entries()].sort(([a], [b]) => {
    if (isCyr(a) !== isCyr(b)) return isCyr(a) ? -1 : 1;
    return a.localeCompare(b, 'uk');
  });
  return sorted.map(([letter, list]) => ({
    letter,
    entries: list.sort((a, b) => (a.rich !== b.rich ? (a.rich ? -1 : 1) : a.key.localeCompare(b.key, 'uk'))),
  }));
}
