// Data for the word-traveler interactive ("Stowaways: Words That Travel the World").
// Everything traces to content/{en,uk}/traveling-words.md.
//
// What the article gives us directly:
//   • TEA splits into two world-words by 17th-c. trade: coastal nations buying by
//     SEA from Dutch traders at the Fujian port of Amoy took Min "te" (French thé,
//     German Tee, Indonesian teh); land routes through Central Asia took
//     Mandarin-Persian "cha → chay" (Ukrainian чай, Hindi chai, Turkish çay,
//     Japanese cha).
//   • ORANGE: Sanskrit nāraṅga → Persian nārang → Arabic nāranj → Spanish naranja
//     → French (une norenge → une orenge, lost initial n) → English orange (then a
//     colour name).
//   • SUGAR: Sanskrit śarkarā ("gravel") → Persian shakar → Arabic sukkar →
//     medieval Latin succarum → English sugar; AND via German Zucker + Polish
//     cukier → Ukrainian цукор. (Same Indian gravel, different middlemen.)
//   • кава: Arabic qahwa → Turkish kahve → Ukrainian кава.
//   • майдан: from Persian via Turkic (intermediate forms not given).
//   • козак: a Turkic word.
//   • Exports: borshch (борщ), varenyky, and steppe (from степ) into the world's
//     menus and dictionaries — steppe is in "every geography textbook on Earth".
import type { Lang } from '../../i18n/ui';

export interface Stop {
  lat: number;
  lon: number;
  place: Record<Lang, string>;
  /** The word's form here. Omitted when the article doesn't record it. */
  form?: string;
  note?: Record<Lang, string>;
}

export interface Branch {
  id: string;
  /** Only tea uses these — colours the sea vs land routes. */
  group?: 'sea' | 'land';
  stops: Stop[];
}

export interface Word {
  id: string;
  emoji: string;
  name: Record<Lang, string>;
  kind: 'import' | 'export';
  /** route = a sequential journey; radial = spokes from one origin (tea). */
  layout: 'route' | 'radial';
  gloss: Record<Lang, string>;
  origin: Stop;
  branches: Branch[];
}

// Coordinates place a dot via the shared equirectangular projection; they are
// approximate regional centroids, not precise points.
export const WORDS: Word[] = [
  {
    id: 'tea',
    emoji: '🍵',
    name: { en: 'tea / чай', uk: 'чай / tea' },
    kind: 'import',
    layout: 'radial',
    gloss: {
      en: 'One leaf, two words. Buy it by sea and it’s “te”; carry it overland and it’s “cha”. The split is a 400-year-old map of trade.',
      uk: 'Один листок — два слова. Купуєш морем — це «те»; везеш суходолом — це «ча». Цей поділ — 400-річна мапа торгівлі.',
    },
    origin: {
      lat: 24.5,
      lon: 118.1,
      place: { en: 'Amoy, Fujian (China)', uk: 'Амой, Фуцзянь (Китай)' },
      form: 'tê / chá',
      note: {
        en: 'At the Fujian port of Amoy, Dutch traders bought tea by sea and took the local Min pronunciation “te”. Everyone on the land routes through Central Asia took Mandarin-Persian “cha”.',
        uk: 'У фуцзяньському порту Амой голландські купці купували чай морем і взяли місцеву мінську вимову «te». Усі на суходільних шляхах через Середню Азію взяли мандаринсько-перське «cha».',
      },
    },
    branches: [
      {
        id: 'sea',
        group: 'sea',
        stops: [
          { lat: 46.5, lon: 2.3, place: { en: 'France', uk: 'Франція' }, form: 'thé' },
          { lat: 51.1, lon: 10.4, place: { en: 'Germany', uk: 'Німеччина' }, form: 'Tee' },
          { lat: -2.5, lon: 118.0, place: { en: 'Indonesia', uk: 'Індонезія' }, form: 'teh' },
        ],
      },
      {
        id: 'land',
        group: 'land',
        stops: [
          { lat: 49.0, lon: 31.5, place: { en: 'Ukraine', uk: 'Україна' }, form: 'чай' },
          { lat: 22.0, lon: 79.0, place: { en: 'India', uk: 'Індія' }, form: 'chai' },
          { lat: 39.0, lon: 35.2, place: { en: 'Turkey', uk: 'Туреччина' }, form: 'çay' },
          { lat: 36.2, lon: 138.3, place: { en: 'Japan', uk: 'Японія' }, form: 'cha' },
        ],
      },
    ],
  },
  {
    id: 'orange',
    emoji: '🍊',
    name: { en: 'orange', uk: 'orange (помаранч)' },
    kind: 'import',
    layout: 'route',
    gloss: {
      en: 'A fruit that became a colour, after a journey from India to England that even lost a letter on the way.',
      uk: 'Плід, що став кольором, після подорожі з Індії до Англії, яка дорогою навіть загубила літеру.',
    },
    origin: {
      lat: 22.0,
      lon: 79.0,
      place: { en: 'India — Sanskrit', uk: 'Індія — санскрит' },
      form: 'nāraṅga',
      note: {
        en: 'It began in India as the Sanskrit nāraṅga.',
        uk: 'Усе почалося в Індії як санскритське nāraṅga.',
      },
    },
    branches: [
      {
        id: 'main',
        stops: [
          { lat: 32.4, lon: 53.7, place: { en: 'Persia', uk: 'Персія' }, form: 'nārang' },
          { lat: 24.0, lon: 45.0, place: { en: 'Arab world', uk: 'Арабський світ' }, form: 'nāranj' },
          { lat: 40.0, lon: -3.7, place: { en: 'Spain', uk: 'Іспанія' }, form: 'naranja' },
          {
            lat: 46.5,
            lon: 2.3,
            place: { en: 'France', uk: 'Франція' },
            form: 'orenge',
            note: {
              en: 'In French “une norenge” was re-cut as “une orenge” — the word quietly lost its initial n.',
              uk: 'У французькій «une norenge» переосмислили як «une orenge» — слово тихо втратило початкову n.',
            },
          },
          {
            lat: 52.5,
            lon: -1.5,
            place: { en: 'England', uk: 'Англія' },
            form: 'orange',
            note: {
              en: 'Only then did it become the name of a colour.',
              uk: 'І лише тоді воно стало назвою кольору.',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'sugar',
    emoji: '🧂',
    name: { en: 'sugar / цукор', uk: 'цукор / sugar' },
    kind: 'import',
    layout: 'route',
    gloss: {
      en: 'English and Ukrainian bought the same Indian “gravel” from different middlemen — and the word forks to prove it.',
      uk: 'Англійська й українська купили той самий індійський «гравій» у різних посередників — і слово роздвоюється на доказ цього.',
    },
    origin: {
      lat: 22.0,
      lon: 79.0,
      place: { en: 'India — Sanskrit', uk: 'Індія — санскрит' },
      form: 'śarkarā',
      note: {
        en: 'Sanskrit śarkarā literally meant “gravel”.',
        uk: 'Санскритське śarkarā буквально означало «гравій».',
      },
    },
    branches: [
      {
        id: 'english',
        stops: [
          { lat: 32.4, lon: 53.7, place: { en: 'Persia', uk: 'Персія' }, form: 'shakar' },
          { lat: 24.0, lon: 45.0, place: { en: 'Arab world', uk: 'Арабський світ' }, form: 'sukkar' },
          { lat: 41.9, lon: 12.5, place: { en: 'Medieval Latin', uk: 'Середньовічна латина' }, form: 'succarum' },
          { lat: 52.5, lon: -1.5, place: { en: 'England', uk: 'Англія' }, form: 'sugar' },
        ],
      },
      {
        id: 'ukrainian',
        stops: [
          { lat: 32.4, lon: 53.7, place: { en: 'Persia', uk: 'Персія' }, form: 'shakar' },
          { lat: 24.0, lon: 45.0, place: { en: 'Arab world', uk: 'Арабський світ' }, form: 'sukkar' },
          { lat: 51.1, lon: 10.4, place: { en: 'Germany', uk: 'Німеччина' }, form: 'Zucker' },
          { lat: 52.1, lon: 19.4, place: { en: 'Poland', uk: 'Польща' }, form: 'cukier' },
          { lat: 49.0, lon: 31.5, place: { en: 'Ukraine', uk: 'Україна' }, form: 'цукор' },
        ],
      },
    ],
  },
  {
    id: 'kava',
    emoji: '☕',
    name: { en: 'кава (coffee)', uk: 'кава' },
    kind: 'import',
    layout: 'route',
    gloss: {
      en: 'Ukraine’s coffee poured in from Arabia through a Turkish cup.',
      uk: 'Українська кава прилилася з Аравії через турецький горнятко.',
    },
    origin: {
      lat: 17.0,
      lon: 44.2,
      place: { en: 'Arab world', uk: 'Арабський світ' },
      form: 'qahwa',
      note: { en: 'It starts as Arabic qahwa.', uk: 'Усе починається з арабського qahwa.' },
    },
    branches: [
      {
        id: 'main',
        stops: [
          { lat: 39.0, lon: 35.2, place: { en: 'Turkey', uk: 'Туреччина' }, form: 'kahve' },
          { lat: 49.0, lon: 31.5, place: { en: 'Ukraine', uk: 'Україна' }, form: 'кава' },
        ],
      },
    ],
  },
  {
    id: 'maidan',
    emoji: '🟦',
    name: { en: 'майдан', uk: 'майдан' },
    kind: 'import',
    layout: 'route',
    gloss: {
      en: 'A square with a Persian heart, carried into Ukrainian by Turkic speakers.',
      uk: 'Площа з перським серцем, принесена в українську тюркомовними.',
    },
    origin: {
      lat: 32.4,
      lon: 53.7,
      place: { en: 'Persia', uk: 'Персія' },
      note: {
        en: 'майдан came from Persian. (The article doesn’t record the intermediate forms.)',
        uk: 'майдан прийшов із перської. (Стаття не подає проміжних форм.)',
      },
    },
    branches: [
      {
        id: 'main',
        stops: [
          {
            lat: 44.0,
            lon: 64.0,
            place: { en: 'Turkic languages', uk: 'Тюркські мови' },
            note: {
              en: 'It travelled into Ukrainian via Turkic.',
              uk: 'Воно потрапило в українську через тюркські мови.',
            },
          },
          { lat: 49.0, lon: 31.5, place: { en: 'Ukraine', uk: 'Україна' }, form: 'майдан' },
        ],
      },
    ],
  },
  {
    id: 'kozak',
    emoji: '🐎',
    name: { en: 'козак', uk: 'козак' },
    kind: 'import',
    layout: 'route',
    gloss: {
      en: 'The very word for a Cossack is a Turkic loan.',
      uk: 'Саме слово «козак» — тюркське запозичення.',
    },
    origin: {
      lat: 46.0,
      lon: 62.0,
      place: { en: 'Turkic languages', uk: 'Тюркські мови' },
      note: {
        en: 'козак itself is a Turkic word.',
        uk: 'козак сам по собі — тюркське слово.',
      },
    },
    branches: [
      {
        id: 'main',
        stops: [{ lat: 49.0, lon: 31.5, place: { en: 'Ukraine', uk: 'Україна' }, form: 'козак' }],
      },
    ],
  },
  {
    id: 'steppe',
    emoji: '🌾',
    name: { en: 'степ → steppe', uk: 'степ → steppe' },
    kind: 'export',
    layout: 'route',
    gloss: {
      en: 'An export: степ became “steppe” — one of the few Ukrainian-region words in every geography textbook on Earth.',
      uk: 'Експорт: степ став «steppe» — одне з небагатьох слів українського регіону в кожному підручнику географії на Землі.',
    },
    origin: {
      lat: 47.5,
      lon: 35.0,
      place: { en: 'Ukraine — степ', uk: 'Україна — степ' },
      form: 'степ',
      note: {
        en: 'The Ukrainian степ names the vast grassland.',
        uk: 'Українське степ називає безкраї трав’яні рівнини.',
      },
    },
    branches: [
      {
        id: 'main',
        stops: [
          {
            lat: 52.5,
            lon: -1.5,
            place: { en: 'World geography', uk: 'Світова географія' },
            form: 'steppe',
            note: {
              en: 'It rode into English — and into every geography textbook on Earth.',
              uk: 'Воно в’їхало в англійську — і в кожен підручник географії на Землі.',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'borshch',
    emoji: '🥣',
    name: { en: 'борщ → borshch', uk: 'борщ → borshch' },
    kind: 'export',
    layout: 'route',
    gloss: {
      en: 'An export onto the world’s menus, alongside varenyky.',
      uk: 'Експорт у меню світу, поряд із варениками.',
    },
    origin: {
      lat: 49.0,
      lon: 31.5,
      place: { en: 'Ukraine — борщ', uk: 'Україна — борщ' },
      form: 'борщ',
      note: {
        en: 'borshch is one of Ukraine’s exports into the world’s menus.',
        uk: 'борщ — один з українських експортів у меню світу.',
      },
    },
    branches: [
      {
        id: 'main',
        stops: [
          {
            lat: 52.5,
            lon: -1.5,
            place: { en: 'World menus', uk: 'Меню світу' },
            form: 'borshch',
            note: {
              en: 'It travels into the world’s dictionaries and menus as borshch.',
              uk: 'Воно мандрує у словники й меню світу як borshch.',
            },
          },
        ],
      },
    ],
  },
];

/* ----------------------------------------------------------------
   Quiz — "guess where this word started" (5 words). Origins article-sourced.
   ---------------------------------------------------------------- */

export interface QuizQ {
  id: string;
  word: Record<Lang, string>;
  options: Record<Lang, string>[];
  /** Index of the correct option. */
  answer: number;
  explain: Record<Lang, string>;
}

export const QUIZ: QuizQ[] = [
  {
    id: 'tea',
    word: { en: 'tea / чай', uk: 'чай / tea' },
    options: [
      { en: 'China', uk: 'Китай' },
      { en: 'India', uk: 'Індія' },
      { en: 'Britain', uk: 'Британія' },
      { en: 'Persia', uk: 'Персія' },
    ],
    answer: 0,
    explain: {
      en: 'Both world-words for tea start at the Fujian port of Amoy in China — “te” by sea, “cha” by land.',
      uk: 'Обидва світові слова для чаю починаються у фуцзяньському порту Амой у Китаї — «te» морем, «cha» суходолом.',
    },
  },
  {
    id: 'orange',
    word: { en: 'orange', uk: 'orange (помаранч)' },
    options: [
      { en: 'Spain', uk: 'Іспанія' },
      { en: 'India', uk: 'Індія' },
      { en: 'China', uk: 'Китай' },
      { en: 'Arab world', uk: 'Арабський світ' },
    ],
    answer: 1,
    explain: {
      en: 'Orange left India as Sanskrit nāraṅga, long before it reached Spanish naranja or English orange.',
      uk: 'Orange полишило Індію як санскритське nāraṅga, задовго до іспанського naranja чи англійського orange.',
    },
  },
  {
    id: 'kava',
    word: { en: 'кава (coffee)', uk: 'кава' },
    options: [
      { en: 'Turkey', uk: 'Туреччина' },
      { en: 'Ukraine', uk: 'Україна' },
      { en: 'Arab world', uk: 'Арабський світ' },
      { en: 'India', uk: 'Індія' },
    ],
    answer: 2,
    explain: {
      en: 'кава poured in through Turkish kahve — but the source is Arabic qahwa.',
      uk: 'кава прилилася через турецьке kahve — але джерело — арабське qahwa.',
    },
  },
  {
    id: 'kozak',
    word: { en: 'козак', uk: 'козак' },
    options: [
      { en: 'Ukraine', uk: 'Україна' },
      { en: 'Turkic languages', uk: 'Тюркські мови' },
      { en: 'Poland', uk: 'Польща' },
      { en: 'Persia', uk: 'Персія' },
    ],
    answer: 1,
    explain: {
      en: 'козак itself is a Turkic word — borrowed, like so much else, from Ukraine’s steppe neighbours.',
      uk: 'козак сам по собі — тюркське слово, запозичене, як і багато іншого, у степових сусідів України.',
    },
  },
  {
    id: 'maidan',
    word: { en: 'майдан', uk: 'майдан' },
    options: [
      { en: 'Ukraine', uk: 'Україна' },
      { en: 'Poland', uk: 'Польща' },
      { en: 'Persia', uk: 'Персія' },
      { en: 'Greece', uk: 'Греція' },
    ],
    answer: 2,
    explain: {
      en: 'майдан came from Persian, carried into Ukrainian via Turkic.',
      uk: 'майдан прийшов із перської, принесений в українську через тюркські мови.',
    },
  },
];
