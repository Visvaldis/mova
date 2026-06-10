// Content data for the `code-vs-speech` interactive (article: machine-languages).
//
// SOURCING (per CLAUDE.md "no invented data"):
//   • Every Hockett feature, every pass/fail verdict, and every one-liner below is
//     from the article (content/{en,uk}/machine-languages.md) — verbatim where the
//     article gives a phrase, lightly condensed where it gives prose. The article
//     names which features code passes (discreteness, productivity, duality) and
//     which it fails (ambiguity, lying/irony, acquisition). A natural language
//     passes all of Hockett's features — the standard baseline the article assumes.
//   • The two column samples (a Ukrainian sentence, a Python snippet) are
//     illustrative scaffolding the spec asks for, not claims of fact.
//   • MIT_RESULT and MODALITY_NOTE are quoted VERBATIM from the article's "brain's
//     verdict" section (CLAUDE.md: "Keep the MIT result verbatim from the article").

import type { Lang } from '../../i18n/ui';

type Bi = Record<Lang, string>;

/* ── the two columns being scored ───────────────────────────────────────────
   Representative samples (illustrative, per the spec's "a Ukrainian sentence vs
   a Python snippet"). Not asserted as facts. */
export const COLUMNS = {
  natural: {
    sample: 'Ця мова жива.',
    sampleGloss: { en: '“This language is alive.”', uk: '«Ця мова жива.»' } as Bi,
  },
  code: {
    sample: 'print("Hello, world")',
  },
};

/* ── Hockett's design-feature checklist ─────────────────────────────────────
   3 features code passes, 3 it fails — exactly as the article lays them out. */
export interface Feature {
  key: string;
  name: Bi;
  gloss: Bi; // what the feature means
  natural: { pass: boolean; note: Bi }; // the Ukrainian / natural-language column
  code: { pass: boolean; note: Bi }; // the Python column
}

export const FEATURES: Feature[] = [
  {
    key: 'discreteness',
    name: { en: 'Discreteness', uk: 'Дискретність' },
    gloss: { en: 'Distinct, separable symbols', uk: 'Чіткі, окремі символи' },
    natural: {
      pass: true,
      note: { en: 'Distinct sounds and letters.', uk: 'Чіткі звуки й літери.' },
    },
    code: {
      pass: true,
      note: { en: 'Distinct symbols.', uk: 'Чіткі символи.' },
    },
  },
  {
    key: 'productivity',
    name: { en: 'Productivity', uk: 'Продуктивність' },
    gloss: {
      en: 'Infinite novel messages from finite rules',
      uk: 'Нескінченні нові повідомлення зі скінченних правил',
    },
    natural: {
      pass: true,
      note: { en: 'Endlessly many new sentences.', uk: 'Безліч нових речень.' },
    },
    code: {
      pass: true,
      note: {
        en: 'Infinite novel programs from finite rules.',
        uk: 'Нескінченні нові програми зі скінченних правил.',
      },
    },
  },
  {
    key: 'duality',
    name: { en: 'Duality of patterning', uk: 'Подвійне членування' },
    gloss: {
      en: 'Meaningless units combine into meaningful ones',
      uk: 'Безглузді одиниці складаються в осмислені',
    },
    natural: {
      pass: true,
      note: { en: 'Sounds combine into words.', uk: 'Звуки складаються у слова.' },
    },
    code: {
      pass: true,
      note: {
        en: 'Meaningless characters build meaningful units.',
        uk: 'Безглузді символи будують осмислені одиниці.',
      },
    },
  },
  {
    key: 'ambiguity',
    name: { en: 'Ambiguity', uk: 'Неоднозначність' },
    gloss: { en: 'Meaning negotiated in context', uk: 'Зміст узгоджується в контексті' },
    natural: {
      pass: true,
      note: {
        en: 'Gloriously ambiguous, negotiated in context.',
        uk: 'Розкішно багатозначна, узгоджується в контексті.',
      },
    },
    code: {
      pass: false,
      note: {
        en: 'Code must not be: a compiler that interprets creatively is called broken.',
        uk: 'Код не сміє таким бути — компілятор, що інтерпретує творчо, називається зламаним.',
      },
    },
  },
  {
    key: 'lying',
    name: { en: 'Lying & irony', uk: 'Брехня та іронія' },
    gloss: {
      en: 'Saying what is false, absent, or ironic',
      uk: 'Сказати хибне, відсутнє чи іронічне',
    },
    natural: {
      pass: true,
      note: { en: 'You can be ironic, lie, imagine.', uk: 'Можна іронізувати, брехати, уявляти.' },
    },
    code: {
      pass: false,
      note: {
        en: 'You can’t write Python that is ironic.',
        uk: 'Неможливо написати іронічний Python.',
      },
    },
  },
  {
    key: 'acquisition',
    name: { en: 'Child acquisition', uk: 'Засвоєння дитиною' },
    gloss: {
      en: 'Children pick it up natively from exposure',
      uk: 'Діти підхоплюють її з оточення як рідну',
    },
    natural: {
      pass: true,
      note: { en: 'Children acquire it natively.', uk: 'Діти засвоюють її як рідну.' },
    },
    code: {
      pass: false,
      note: {
        en: 'No child anywhere picks up JavaScript natively from exposure — the decisive failure.',
        uk: 'Жодна дитина ніде не підхоплює JavaScript з оточення як рідну — вирішальний провал.',
      },
    },
  },
];

/* ── the brain panel ────────────────────────────────────────────────────────
   Two networks; reading a natural language vs reading code lights different ones. */
export interface BrainRegion {
  key: 'language' | 'md';
  name: Bi;
  desc: Bi;
}

export const BRAIN_REGIONS: BrainRegion[] = [
  {
    key: 'language',
    name: { en: 'Language network', uk: 'Мовна мережа' },
    desc: {
      en: 'Lights up for speech, sign, Esperanto — any natural language.',
      uk: 'Загоряється від мовлення, жестів, есперанто — будь-якої природної мови.',
    },
  },
  {
    key: 'md',
    name: { en: 'Multiple-demand network', uk: 'Мережа множинних завдань' },
    desc: {
      en: 'The circuitry of logic puzzles and math.',
      uk: 'Схеми логічних головоломок і математики.',
    },
  },
];

// Which network each column recruits, per the article.
export const COLUMN_NETWORK: Record<'natural' | 'code', BrainRegion['key']> = {
  natural: 'language',
  code: 'md',
};

// VERBATIM from the article (CLAUDE.md: keep the MIT result verbatim).
export const MIT_RESULT: Bi = {
  en: 'MIT’s Fedorenko lab scanned programmers reading code and found the language network largely silent; code instead recruits the multiple-demand network — the circuitry of logic puzzles and math. Your brain files Python with Sudoku, not with Ukrainian.',
  uk: 'Лабораторія Федоренко в MIT сканувала програмістів за читанням коду: мовна мережа здебільшого мовчала; натомість код вмикає мережу множинних завдань — схеми логічних головоломок і математики. Ваш мозок кладе Python на полицю до судоку, а не до української.',
};

// The article's modality footnote, verbatim.
export const MODALITY_NOTE: Bi = {
  en: 'Signed languages light the network like spoken ones — modality doesn’t matter, humanity does.',
  uk: 'Жестові мови запалюють мережу так само, як усні, — модальність не важлива, людськість важлива.',
};

// The article's pull-quote, used to close the island.
export const VERDICT_QUOTE: Bi = {
  en: 'Code is all grammar and no conversation: a language with perfect syntax and no native speakers.',
  uk: 'Код — це сама граматика без розмови: мова з досконалим синтаксисом і нулем носіїв.',
};
