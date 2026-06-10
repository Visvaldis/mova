// Data for the word-xray interactive. Every etymology, gloss, story, doublet and
// the sample sentence trace to content/{en,uk}/everyday-etymologies.md.
//
// What the article gives directly (used as the anchors here):
//   • muscle    ← Latin musculus, "little mouse" (the bulge looked like a mouse).
//   • disaster  ← Italian disastro, dis- + astro, "ill-starred".
//   • companion ← Latin com + panis, "with-bread person".
//   • sarcasm   ← Greek sarkazein, "to tear flesh like a dog".
//   • candidate ← Latin candidus, "dazzling white" (bleached togas).
//   • salary    ← Latin salarium ~ sal, "salt" (used in the sample sentence).
//   • deadline  ← a line around a Civil War prison camp; cross it and you're shot.
//   • вікно     ← око, "eye" — the house's eye (cf. window ← vindauga, "wind-eye").
//   • ведмідь   ← "honey-eater", a taboo replacement; the IE word (→ ursus) was lost.
//   • doublets  ← royal/regal (regalis), skirt/shirt (one Germanic garment),
//                 captive/caitiff (cattivus), город/град & молоко/млеко (UK pairs).
//   • sample sentence ← the article's own: "the candidate's salary was a disaster"
//                       / «платня кандидата виявилася катастрофою».

import type { Lang } from '../../i18n/ui';

/** Minimal line-drawing illustrations rendered by the component. */
export type ArtKey = 'mouse' | 'star' | 'bread' | 'dog' | 'toga' | 'line' | 'eye' | 'honey';

export interface Morpheme {
  /** The piece as written (the source form). */
  form: string;
  /** What this piece meant. */
  gloss: Record<Lang, string>;
}

export interface WordEntry {
  id: string;
  /** Headword on the card — a specific EN or UK word, never translated. */
  word: string;
  /** Source etymon label, e.g. "Latin musculus". */
  origin: Record<Lang, string>;
  /** The buried picture, broken into its meaningful pieces. */
  morphemes: Morpheme[];
  /** The whole word's literal, forgotten meaning. */
  literal: Record<Lang, string>;
  /** One-sentence story, condensed from the article. */
  story: Record<Lang, string>;
  art: ArtKey;
}

// The eight cards named in the task, in article order.
export const WORDS: WordEntry[] = [
  {
    id: 'muscle',
    word: 'muscle',
    origin: { en: 'Latin musculus', uk: 'латинське musculus' },
    morphemes: [
      { form: 'mūs', gloss: { en: 'mouse', uk: 'миша' } },
      { form: '-culus', gloss: { en: 'little (diminutive)', uk: 'маленький (зменш.)' } },
    ],
    literal: { en: 'a little mouse', uk: 'мишеня' },
    story: {
      en: 'Romans thought the bulge rippling under the skin looked like a small mouse running.',
      uk: 'Римлянам здавалося, що горбик, який біжить під шкірою, схожий на маленьку мишу.',
    },
    art: 'mouse',
  },
  {
    id: 'disaster',
    word: 'disaster',
    origin: { en: 'Italian disastro', uk: 'італійське disastro' },
    morphemes: [
      { form: 'dis-', gloss: { en: 'ill, bad', uk: 'лихий, поганий' } },
      { form: 'astro', gloss: { en: 'star', uk: 'зірка' } },
    ],
    literal: { en: 'an ill-starred calamity', uk: 'лиха зірка' },
    story: {
      en: 'Call something a disaster and you are practising astrology — a calamity written in the heavens.',
      uk: 'Назвати щось катастрофою — це астрологія: лихо, написане на небесах.',
    },
    art: 'star',
  },
  {
    id: 'companion',
    word: 'companion',
    origin: { en: 'Latin com + panis', uk: 'латинське com + panis' },
    morphemes: [
      { form: 'com', gloss: { en: 'with', uk: 'з, разом' } },
      { form: 'panis', gloss: { en: 'bread', uk: 'хліб' } },
    ],
    literal: { en: 'a with-bread person', uk: 'спів-хлібна людина' },
    story: {
      en: 'Your companion is, literally, someone you break bread with.',
      uk: 'Компаньйон — буквально той, з ким ти ламаєш хліб.',
    },
    art: 'bread',
  },
  {
    id: 'sarcasm',
    word: 'sarcasm',
    origin: { en: 'Greek sarkazein', uk: 'грецьке sarkazein' },
    morphemes: [
      { form: 'sark-', gloss: { en: 'flesh', uk: 'плоть' } },
      { form: '-azein', gloss: { en: 'to tear, like a dog', uk: 'шматувати, як пес' } },
    ],
    literal: { en: 'to tear flesh', uk: 'шматувати плоть' },
    story: {
      en: 'Sarcasm is nastier than you thought: sarkazein, “to tear flesh like a dog.”',
      uk: 'Сарказм гидкіший, ніж здається: sarkazein — «шматувати плоть, як пес».',
    },
    art: 'dog',
  },
  {
    id: 'candidate',
    word: 'candidate',
    origin: { en: 'Latin candidātus', uk: 'латинське candidātus' },
    morphemes: [
      { form: 'candid-', gloss: { en: 'dazzling white', uk: 'сліпучо-білий' } },
      { form: '-ātus', gloss: { en: 'clothed in', uk: 'вбраний у' } },
    ],
    literal: { en: 'a person in dazzling white', uk: 'людина в сліпучо-білому' },
    story: {
      en: 'Roman office-seekers bleached their togas white to look trustworthy.',
      uk: 'Римські претенденти на посади вибілювали тоги, щоб виглядати гідними довіри.',
    },
    art: 'toga',
  },
  {
    id: 'deadline',
    word: 'deadline',
    origin: { en: 'English dead + line', uk: 'англійське dead + line' },
    morphemes: [
      { form: 'dead', gloss: { en: 'dead', uk: 'мертвий' } },
      { form: 'line', gloss: { en: 'line', uk: 'лінія' } },
    ],
    literal: { en: 'a line you die crossing', uk: 'лінія, за яку — смерть' },
    story: {
      en: 'A deadline was once a line around a Civil War prison camp — cross it and you would be shot.',
      uk: 'Колись deadline був лінією навколо табору військовополонених: перетнеш — і стрілятимуть.',
    },
    art: 'line',
  },
  {
    id: 'vikno',
    word: 'вікно',
    origin: { en: 'from око, “eye”', uk: 'від «око»' },
    morphemes: [{ form: 'око', gloss: { en: 'eye', uk: 'око' } }],
    literal: { en: 'the house’s eye', uk: 'око хати' },
    story: {
      en: 'A window is the house’s eye — English once agreed: window is Old Norse vindauga, “wind-eye.”',
      uk: 'Вікно — це око хати; англійське window колись теж: давньоскандинавське vindauga, «вітрове око».',
    },
    art: 'eye',
  },
  {
    id: 'vedmid',
    word: 'ведмідь',
    origin: { en: 'Proto-Slavic, a taboo name', uk: 'праслов’янське, табу-заміна' },
    morphemes: [
      { form: 'мед', gloss: { en: 'honey', uk: 'мед' } },
      { form: '-їд', gloss: { en: 'eater', uk: 'той, хто їсть' } },
    ],
    literal: { en: 'a honey-eater', uk: 'той, хто їсть мед' },
    story: {
      en: 'Slavs avoided the bear’s true name lest they summon it; the original word (which gave Latin ursus) was lost entirely.',
      uk: 'Слов’яни уникали справжнього імені звіра, щоб не накликати його; первісне слово (що дало латинське ursus) зникло повністю.',
    },
    art: 'honey',
  },
];

// ── Mode 2: the literal sentence ────────────────────────────────────────────
// The article's own example sentence, in each language. Plain strings stay put;
// objects are the tappable words that swap to their buried, literal meaning.
// (Ukrainian «платня» is left un-tappable: it is English "salary" that hides
// the salt, not Ukrainian платня — so only кандидат and катастрофа swap there.)
export type SentenceToken = string | { surface: string; literal: Record<Lang, string> };

export const LITERAL_SENTENCE: Record<Lang, SentenceToken[]> = {
  en: [
    'The ',
    { surface: 'candidate', literal: { en: 'dazzling-white-robed one', uk: 'людини в білому' } },
    '’s ',
    { surface: 'salary', literal: { en: 'salt-money', uk: 'соляних грошей' } },
    ' was a ',
    { surface: 'disaster', literal: { en: 'bad star', uk: 'лиха зірка' } },
    '.',
  ],
  uk: [
    'Платня ',
    { surface: 'кандидата', literal: { en: 'one in dazzling white', uk: 'людини в сліпучо-білому' } },
    ' виявилася ',
    { surface: 'катастрофою', literal: { en: 'a bad star', uk: 'лихою зіркою' } },
    '.',
  ],
};

// ── Mode 3: doublet matcher ─────────────────────────────────────────────────
// One word that entered a language twice by different routes and split in meaning.
export interface Doublet {
  id: string;
  a: string;
  b: string;
  origin: Record<Lang, string>;
}

export const DOUBLETS: Doublet[] = [
  {
    id: 'royal-regal',
    a: 'royal',
    b: 'regal',
    origin: {
      en: 'Both from Latin regalis — royal arrived through French, regal straight from Latin.',
      uk: 'Обидва — від латинського regalis: royal прийшло через французьку, regal — прямо з латини.',
    },
  },
  {
    id: 'skirt-shirt',
    a: 'skirt',
    b: 'shirt',
    origin: {
      en: 'The same Germanic garment — skirt went viking and came back Norse; shirt stayed home.',
      uk: 'Той самий германський одяг: skirt сходило у вікінги й повернулося норвезьким, shirt лишилося вдома.',
    },
  },
  {
    id: 'captive-caitiff',
    a: 'captive',
    b: 'caitiff',
    origin: {
      en: 'Both from Latin cattivus, “captive” — one kept the meaning, the other soured into “wretch.”',
      uk: 'Обидва — від латинського cattivus, «полонений»: одне зберегло значення, друге зіпсулося до «негідник».',
    },
  },
  {
    id: 'horod-hrad',
    a: 'город',
    b: 'град',
    origin: {
      en: 'A native Ukrainian word beside its Church-Slavonic twin.',
      uk: 'Питоме українське слово поруч із церковнослов’янським близнюком.',
    },
  },
  {
    id: 'moloko-mleko',
    a: 'молоко',
    b: 'млеко',
    origin: {
      en: 'The everyday word beside its poetic Church-Slavonic form.',
      uk: 'Щоденне слово поруч із поетичною церковнослов’янською формою.',
    },
  },
];
