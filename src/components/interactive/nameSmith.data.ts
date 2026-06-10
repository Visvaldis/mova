// Data for the name-smith interactive.
// Everything traces to content/{en,uk}/tolkien-languages.md — the six elements
// and three canonical names are exactly the ones the article parses
// (Mor-dor "black land", Mor-ia "black pit", Mith-randir "grey wanderer",
// elen "star" from the Quenya sample line). No invented Elvish: combinations
// outside CANON get an "unattested" badge and only the literal element
// glosses, never a fabricated canonical meaning.
import type { Lang } from '../../i18n/ui';

export interface Element {
  id: string;
  form: string;
  gloss: Record<Lang, string>;
}

export const ELEMENTS: Element[] = [
  { id: 'mor', form: 'mor', gloss: { en: 'dark, black', uk: 'темний, чорний' } },
  { id: 'mith', form: 'mith', gloss: { en: 'grey', uk: 'сірий' } },
  { id: 'el', form: 'elen', gloss: { en: 'star', uk: 'зірка' } },
  { id: 'dor', form: 'dor', gloss: { en: 'land', uk: 'земля, край' } },
  { id: 'ia', form: 'ia', gloss: { en: 'pit, abyss', uk: 'прірва, безодня' } },
  { id: 'randir', form: 'randir', gloss: { en: 'wanderer', uk: 'мандрівник' } },
];

export interface CanonName {
  first: string; // element id
  second: string; // element id
  name: string;
  gloss: Record<Lang, string>;
  note: Record<Lang, string>;
}

export const CANON: CanonName[] = [
  {
    first: 'mor',
    second: 'dor',
    name: 'Mordor',
    gloss: { en: 'black land', uk: 'чорна земля' },
    note: {
      en: 'The article’s textbook example: the map of Middle-earth is a lexicon in disguise.',
      uk: 'Хрестоматійний приклад зі статті: мапа Середзем’я — це замаскований лексикон.',
    },
  },
  {
    first: 'mor',
    second: 'ia',
    name: 'Moria',
    gloss: { en: 'black pit', uk: 'чорна прірва' },
    note: {
      en: 'Same first element as Mordor — elements recur, which is why the names feel solid.',
      uk: 'Той самий перший елемент, що в Mordor: елементи повторюються, тому імена відчуваються міцними.',
    },
  },
  {
    first: 'mith',
    second: 'randir',
    name: 'Mithrandir',
    gloss: { en: 'grey wanderer', uk: 'сірий мандрівник' },
    note: {
      en: 'Gandalf’s Elvish name.',
      uk: 'Ельфійське ім’я Ґандальфа.',
    },
  },
];

/* ----------------------------------------------------------------
   Sound-palette comparator — both columns sourced from the article.
   ---------------------------------------------------------------- */
export interface Palette {
  id: 'quenya' | 'sindarin';
  name: Record<Lang, string>;
  model: Record<Lang, string>;
  mood: Record<Lang, string>;
  sample: string;
  sampleGloss: Record<Lang, string> | null;
  /** Regex (as string) marking the phonemic flavor to highlight in the sample. */
  flavorPattern: string;
  flavorNote: Record<Lang, string>;
}

export const PALETTES: Palette[] = [
  {
    id: 'quenya',
    name: { en: 'Quenya', uk: 'Квенья' },
    model: { en: 'Finnish (via the Kalevala) + Latin', uk: 'Фінська (через «Калевалу») + латина' },
    mood: {
      en: 'Ceremonial “Elf-Latin”: long vowels, soft consonants.',
      uk: 'Церемоніальна «ельфійська латина»: довгі голосні, м’які приголосні.',
    },
    sample: 'elen síla lúmenn’ omentielvo',
    sampleGloss: {
      en: 'a star shines on the hour of our meeting',
      uk: 'зірка сяє над годиною нашої зустрічі',
    },
    flavorPattern: '[áéíóú]|ie|lv',
    flavorNote: {
      en: 'Highlighted: the long vowels and liquid clusters Tolkien loved in Finnish.',
      uk: 'Підсвічено: довгі голосні та плавні сполуки, які Толкін любив у фінській.',
    },
  },
  {
    id: 'sindarin',
    name: { en: 'Sindarin', uk: 'Сіндарин' },
    model: { en: 'Welsh', uk: 'Валлійська' },
    mood: {
      en: 'The living vernacular: mutating consonants, falling rhythms.',
      uk: 'Жива розмовна мова: мутації приголосних, спадні ритми.',
    },
    sample: 'A Elbereth Gilthoniel',
    sampleGloss: null, // the article quotes the line without translating it
    flavorPattern: 'th|lb|G',
    flavorNote: {
      en: 'Highlighted: the Welsh-flavored consonant clusters and th sounds.',
      uk: 'Підсвічено: «валлійські» сполуки приголосних і звуки th.',
    },
  },
];
