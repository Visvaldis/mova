// Naive Ukrainian lemma lookup for the Stratigraph toy.
// Strategy: exact match → suffix-strip → stem-index match. Deliberately conservative:
// a miss renders as honest-unknown, never as a guess.

export interface LexEntry {
  l: string; // lemma
  y: string; // layer id
  n?: { en: string; uk: string };
  f?: string[]; // extra stems (e.g. і↔о alternation: ніч → ноч)
}

// Inflectional endings, longest first (nouns, adjectives, common verb forms).
const SUFFIXES = [
  'ються', 'еться', 'ється', 'иться', 'атися', 'ятися', 'увати', 'ювати',
  'ували', 'ювали', 'уємо', 'юємо', 'уєте', 'юєте',
  'ами', 'ями', 'ові', 'еві', 'єві', 'ого', 'ому', 'ими', 'іми', 'ній', 'ньо',
  'ємо', 'емо', 'имо', 'ете', 'ите', 'уть', 'ють', 'ать', 'ять',
  'еш', 'иш', 'єш', 'уй', 'юй', 'нули', 'нула', 'нуло', 'нув', 'нути', 'ив',
  'ах', 'ях', 'ам', 'ям', 'ів', 'їв', 'ей', 'ою', 'ею', 'єю', 'ом', 'ем', 'єм',
  'ий', 'ій', 'им', 'ім', 'их', 'іх', 'ть', 'ти', 'ла', 'ло', 'ли', 'ле',
  'ві', 'ці',
  'а', 'я', 'о', 'е', 'є', 'у', 'ю', 'и', 'і', 'ї', 'в', 'ь',
];

/** Lemma → stem: cut one final vowel/soft sign so inflected forms can reach it. */
function stemOf(lemma: string): string {
  if (lemma.endsWith('тися') && lemma.length > 6) return lemma.slice(0, -4); // reflexive verbs
  if (lemma.endsWith('ти') && lemma.length > 4) return lemma.slice(0, -2); // verbs
  const last = lemma[lemma.length - 1];
  if ('аяоеєуюиіїь'.includes(last) && lemma.length > 3) return lemma.slice(0, -1);
  return lemma;
}

/** Common verb prefixes — tried as a last resort (за-постив → постив → пост). */
const PREFIXES = [
  'пере', 'роз', 'від', 'під', 'при', 'про', 'за', 'по', 'на', 'ви', 'до', 'об', 'з', 'у', 'в',
];

export interface Lexicon {
  exact: Map<string, LexEntry>;
  stems: Map<string, LexEntry>;
}

export function buildLexicon(entries: LexEntry[]): Lexicon {
  const exact = new Map<string, LexEntry>();
  const stems = new Map<string, LexEntry>();
  for (const e of entries) {
    exact.set(e.l, e);
    const s = stemOf(e.l);
    if (!stems.has(s)) stems.set(s, e);
    for (const alt of e.f ?? []) {
      if (!exact.has(alt)) exact.set(alt, e);
      if (!stems.has(alt)) stems.set(alt, e);
    }
  }
  return { exact, stems };
}

export function normalizeToken(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[’ʼ`]/g, "'")
    .replace(/[^а-щьюяґєіїa-z']/gi, '');
}

function lookupOnce(lex: Lexicon, token: string): LexEntry | null {
  if (lex.exact.has(token)) return lex.exact.get(token)!;
  if (lex.stems.has(token)) return lex.stems.get(token)!;
  for (const suf of SUFFIXES) {
    if (token.length - suf.length >= 2 && token.endsWith(suf)) {
      const rest = token.slice(0, -suf.length);
      if (lex.exact.has(rest)) return lex.exact.get(rest)!;
      if (lex.stems.has(rest)) return lex.stems.get(rest)!;
      // Second pass: a thematic vowel may sit between stem and ending
      // (чита-є-мо, бач-и-ли) — strip one trailing vowel and retry.
      const last = rest[rest.length - 1];
      if (rest.length > 2 && 'аяоеєуюиіїь'.includes(last)) {
        const rest2 = rest.slice(0, -1);
        if (lex.exact.has(rest2)) return lex.exact.get(rest2)!;
        if (lex.stems.has(rest2)) return lex.stems.get(rest2)!;
      }
    }
  }
  return null;
}

export function lookup(lex: Lexicon, rawToken: string): LexEntry | null {
  const token = normalizeToken(rawToken);
  if (token.length === 0) return null;
  if (lex.exact.has(token)) return lex.exact.get(token)!;
  if (token.length < 2) return null;
  // Reflexive verbs: strip -ся/-сь and retry (сміється → сміє- → сміятися).
  if (token.length > 4 && (token.endsWith('ся') || token.endsWith('сь'))) {
    const hit = lookupOnce(lex, token.slice(0, -2));
    if (hit) return hit;
  }
  const direct = lookupOnce(lex, token);
  if (direct) return direct;
  // Last resort: strip one common verb prefix (з-будував, за-постив).
  for (const pre of PREFIXES) {
    if (token.startsWith(pre) && token.length - pre.length >= 4) {
      const hit = lookupOnce(lex, token.slice(pre.length));
      if (hit) return hit;
    }
  }
  return null;
}

/** Split text into word / non-word runs, preserving everything for re-render. */
export function tokenize(text: string): { text: string; isWord: boolean }[] {
  const out: { text: string; isWord: boolean }[] = [];
  const re = /[а-щьюяґєіїА-ЩЬЮЯҐЄІЇa-zA-Z'’ʼ]+|[^а-щьюяґєіїА-ЩЬЮЯҐЄІЇa-zA-Z'’ʼ]+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    out.push({ text: m[0], isWord: /[а-щьюяґєіїa-z]/i.test(m[0]) });
  }
  return out;
}
