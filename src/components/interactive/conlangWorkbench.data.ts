// Content data for the `conlang-workbench` interactive (article: constructed-languages).
//
// SOURCING:
//   • CONLANG_TIMELINE — names, dates, authors and fates are from the article
//     (content/{en,uk}/constructed-languages.md): verbatim where it gives a phrase,
//     condensed where it gives prose. TWO exceptions, both flagged TODO(seva) inline
//     and historically verifiable: Volapük's creator (the article doesn't name one)
//     and Peterson's dates (the article doesn't date Na'vi/Dothraki/Valyrian).
//   • TOKIPONA — the article states only `jan pona` = "good person" = friend. The
//     other word glosses come from the cited official source (tokipona.org); the
//     `telo nasa` = alcohol combo comes from CLAUDE.md's component spec. Flagged
//     TODO(seva) in the component's Done note.
//   • ESPERANTO — the article says Esperanto has "transparent European vocabulary"
//     and "sixteen grammar rules, no exceptions" but gives no sample sentence. The
//     sentence below is constructed to demonstrate that transparency; glosses/roots
//     trace to the cited Esperanto Wikipedia source. Flagged TODO(seva).

import type { Lang } from '../../i18n/ui';

type Bi = Record<Lang, string>;

/* ── (a) Toki Pona builder ──────────────────────────────────────────────────
   A small slice of the ~120–140-word vocabulary (the article's headline number).
   Glosses are the canonical ones from tokipona.org. */

export interface TokiWord {
  word: string;
  gloss: Bi; // the one-word sense shown on the tile and in the literal build-up
}

export const TOKIPONA_WORDS: TokiWord[] = [
  { word: 'jan', gloss: { en: 'person', uk: 'людина' } },
  { word: 'pona', gloss: { en: 'good', uk: 'добрий' } },
  { word: 'ike', gloss: { en: 'bad', uk: 'поганий' } },
  { word: 'telo', gloss: { en: 'water', uk: 'вода' } },
  { word: 'nasa', gloss: { en: 'weird', uk: 'дивний' } },
  { word: 'moku', gloss: { en: 'food', uk: 'їжа' } },
  { word: 'suli', gloss: { en: 'big', uk: 'великий' } },
  { word: 'lili', gloss: { en: 'small', uk: 'малий' } },
  { word: 'tomo', gloss: { en: 'house', uk: 'дім' } },
  { word: 'ilo', gloss: { en: 'tool', uk: 'знаряддя' } },
  { word: 'suno', gloss: { en: 'sun', uk: 'сонце' } },
  { word: 'mi', gloss: { en: 'I / we', uk: 'я / ми' } },
];

export interface TokiCombo {
  parts: string[]; // exact sequence of tile words
  literal: Bi; // word-for-word
  meaning: Bi; // the idiomatic result
  featured: boolean; // article (jan pona) or spec (telo nasa) — gets a "recognized" badge
}

export const TOKIPONA_COMBOS: TokiCombo[] = [
  {
    parts: ['jan', 'pona'],
    literal: { en: 'good person', uk: 'добра людина' },
    meaning: { en: 'friend', uk: 'друг' },
    featured: true, // from the article
  },
  {
    parts: ['telo', 'nasa'],
    literal: { en: 'weird water', uk: 'дивна вода' },
    meaning: { en: 'alcohol', uk: 'алкоголь' },
    featured: true, // from CLAUDE.md spec
  },
];

/* ── (b) Conlang timeline ───────────────────────────────────────────────────
   Lingua Ignota → … → Toki Pona. Every datum below is from the article. */

export interface ConlangEntry {
  id: string;
  name: string;
  when: Bi; // the article gives a century for Lingua Ignota, years for the rest
  by: Bi; // author / creator as the article names them
  fate: Bi; // one-line "fate", condensed from the article
  kind: 'auxiliary' | 'mystical' | 'fictional' | 'minimal';
}

export const CONLANG_TIMELINE: ConlangEntry[] = [
  {
    id: 'lingua-ignota',
    name: 'Lingua Ignota',
    when: { en: '12th century', uk: 'XII століття' },
    by: { en: 'Hildegard of Bingen', uk: 'Гільдеґарда Бінгенська' },
    fate: {
      en: 'The first on record — built by an abbess for mystical purposes.',
      uk: 'Перша в історії — збудована абатисою для містичних потреб.',
    },
    kind: 'mystical',
  },
  {
    id: 'volapuk',
    name: 'Volapük',
    when: { en: '1879', uk: '1879' },
    // TODO(seva): the article doesn't name Volapük's creator; Schleyer is the
    // historically documented author, added here for the timeline. Verify/keep?
    by: { en: 'Johann Martin Schleyer', uk: 'Йоганн Мартін Шлеєр' },
    fate: {
      en: 'Gathered hundreds of thousands — then tore itself apart in schisms over grammar.',
      uk: 'Зібрав сотні тисяч — а тоді роздер себе на схизми через граматику.',
    },
    kind: 'auxiliary',
  },
  {
    id: 'esperanto',
    name: 'Esperanto',
    when: { en: '1887', uk: '1887' },
    by: { en: 'L. L. Zamenhof', uk: 'Л. Л. Заменгоф' },
    fate: {
      en: 'Sixteen rules, no exceptions. Survived two world wars; up to two million learners and perhaps a thousand native speakers.',
      uk: 'Шістнадцять правил, жодних винятків. Пережило дві світові війни; до двох мільйонів учнів і, можливо, тисяча носіїв від народження.',
    },
    kind: 'auxiliary',
  },
  {
    id: 'klingon',
    name: 'Klingon',
    when: { en: '1984', uk: '1984' },
    by: { en: 'Marc Okrand', uk: 'Марк Окранд' },
    fate: {
      en: 'Built deliberately alien (object-verb-subject) — yet acquired Shakespeare translations and Sunday meetups.',
      uk: 'Навмисно збудована чужою (порядок «об’єкт-дієслово-підмет») — а обросла перекладами Шекспіра й недільними зустрічами.',
    },
    kind: 'fictional',
  },
  {
    id: 'peterson',
    name: 'Na’vi · Dothraki · High Valyrian',
    // TODO(seva): the article doesn't date these; 2009–2013 spans Avatar →
    // Game of Thrones (historically documented), added for timeline order. Verify?
    when: { en: '2009–2013', uk: '2009–2013' },
    by: { en: 'David J. Peterson', uk: 'Девід Дж. Петерсон' },
    fate: {
      en: 'Raised the craft to art: full historical phonologies, with fake sound changes obeying real Grimm-style logic.',
      uk: 'Підняли ремесло до мистецтва: повні історичні фонології з вигаданими звуковими зсувами за логікою закону Ґрімма.',
    },
    kind: 'fictional',
  },
  {
    id: 'toki-pona',
    name: 'Toki Pona',
    when: { en: '2001', uk: '2001' },
    by: { en: 'Sonja Lang', uk: 'Соня Ланг' },
    fate: {
      en: 'A language of almost nothing: 120–140 words. Complexity assembled, Lego-like, from radical simplicity.',
      uk: 'Мова майже нічого: 120–140 слів. Складність збирається, як з Lego, з радикальної простоти.',
    },
    kind: 'minimal',
  },
];

// The article's thesis, used as a pull-quote in the timeline tab.
export const TIMELINE_QUOTE: Bi = {
  en: 'Every successful conlang has the same biography: built as a tool, escaped as a species.',
  uk: 'Кожна успішна сконструйована мова має ту саму біографію: збудована як інструмент — утекла як біологічний вид.',
};

/* ── (c) Esperanto decoder ──────────────────────────────────────────────────
   A simple sentence demonstrating the article's claim of "transparent European
   vocabulary". Glosses + the European cognate that gives each word away trace to
   the cited Esperanto Wikipedia. `familiar` = guessable from a major European
   root (drives the recognizability meter). TODO(seva): confirm sentence choice. */

export interface EoWord {
  w: string;
  gloss: Bi;
  root: Bi; // the European cognate that "gives it away"
  familiar: boolean;
}

export const ESPERANTO = {
  sentence: [
    { w: 'La', gloss: { en: 'the', uk: '(артикль)' }, root: { en: 'Romance la / le', uk: 'романське la / le' }, familiar: true },
    { w: 'nova', gloss: { en: 'new', uk: 'новий' }, root: { en: 'Latin novus → “novel”', uk: 'лат. novus → «новий»' }, familiar: true },
    { w: 'lingvo', gloss: { en: 'language', uk: 'мова' }, root: { en: 'Latin lingua → “linguistic”', uk: 'лат. lingua → «лінгвістика»' }, familiar: true },
    { w: 'estas', gloss: { en: 'is', uk: 'є' }, root: { en: 'Latin est → “is”', uk: 'лат. est → «є»' }, familiar: true },
    { w: 'facila', gloss: { en: 'easy', uk: 'легкий' }, root: { en: 'Latin facilis → “facile”', uk: 'лат. facilis → «легкий»' }, familiar: true },
    { w: 'kaj', gloss: { en: 'and', uk: 'і' }, root: { en: 'Greek καί — less obvious', uk: 'грец. καί — менш очевидне' }, familiar: false },
    { w: 'internacia', gloss: { en: 'international', uk: 'міжнародний' }, root: { en: '“international”', uk: '«інтернаціональний»' }, familiar: true },
  ] as EoWord[],
  translation: {
    en: 'The new language is easy and international.',
    uk: 'Нова мова — легка й міжнародна.',
  } as Bi,
};
