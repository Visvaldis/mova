// Data for the script-evolver interactive ("Freezing Sound: How Humans Learned to Write").
// Everything traces to content/{en,uk}/writing-systems.md.
//
// What the article gives us directly:
//   • Writing was invented from scratch ~4 times: Mesopotamia (~3300 BCE),
//     Egypt (~3200 BCE), China (~1200 BCE), Mesoamerica (~600 BCE). Everything
//     else descends or borrows.
//   • Cuneiform began as ACCOUNTING: clay tokens counted sheep & grain, got
//     pressed into clay envelopes, the impressions stood in for the tokens, then
//     the marks alone sufficed. The first documents are receipts (Schmandt-Besserat).
//   • The rebus principle: a picture used for its SOUND, not its meaning. Sumerian
//     arrow (ti) wrote the identical-sounding word "life" (ti).
//   • The alphabet: ~1900–1700 BCE Semitic workers in Egypt took a handful of
//     hieroglyphs and used each for the FIRST sound of its Semitic name —
//     house (bayt) = b, water (mem) = m, ox head (ʾalp) = the glottal ʾa.
//     ~30 signs "a child could master."
//   • That experiment (Proto-Sinaitic) → Phoenician (went viral on trade routes)
//     → Greek (added full vowels) → Latin (via the Etruscans) and, in the 9th c.
//     CE, Cyrillic (Cyril & Methodius's students in Bulgaria built it from Greek
//     letterforms). The letter А, in both Latin and Cyrillic, is still a flipped
//     ox head, 4,000 years on. Ukrainian's alphabet is Phoenician's grandchild.
//   • Other paths: Chinese characters (longer learning curve, but bridge mutually
//     unintelligible spoken varieties across millennia; Japanese mixes three
//     scripts); Korean Hangul — designed deliberately by King Sejong's court in
//     1443, each letter shaped after the tongue & lips: the only widely used
//     script whose letters are diagrams of articulation.
//
// TODO(seva): the INTERMEDIATE glyph shapes (Proto-Sinaitic / Phoenician / Greek
// letterforms) are illustrative line-drawings of the known historical forms — they
// are paleographic common knowledge, not stated in this article. The article
// directly attests the ox/house/water pictographic origins and the A = flipped
// ox-head claim (Latin + Cyrillic); the drawn morph is the vehicle for that fact.
import type { Lang } from '../../i18n/ui';

/* ----------------------------------------------------------------
   (1) Letter time machine.

   A Glyph is a list of SVG stroke paths drawn in a 0 0 100 100 box
   (line-drawing: no fill, currentColor stroke). STAGES holds the
   shared, article-sourced metadata for each step; each LETTER supplies
   its glyph at every stage plus a final Cyrillic form.
   ---------------------------------------------------------------- */

export type Glyph = string[];

export interface Stage {
  id: 'pictograph' | 'protosinaitic' | 'phoenician' | 'greek' | 'modern';
  name: Record<Lang, string>;
  era: Record<Lang, string>;
  note: Record<Lang, string>;
}

export const STAGES: Stage[] = [
  {
    id: 'pictograph',
    name: { en: 'Egyptian pictograph', uk: 'Єгипетський малюнок' },
    era: { en: 'before ~1900 BCE', uk: 'до ~1900 до н.е.' },
    note: {
      en: 'Writing starts as pictures. Each future letter begins life as a tiny drawing of a thing — an ox, a house, water.',
      uk: 'Письмо починається з малюнків. Кожна майбутня літера народжується як крихітне зображення речі — вола, дому, води.',
    },
  },
  {
    id: 'protosinaitic',
    name: { en: 'Proto-Sinaitic', uk: 'Протосинайське письмо' },
    era: { en: '~1900–1700 BCE', uk: '~1900–1700 до н.е.' },
    note: {
      en: 'Semitic workers in Egypt used each picture for only the FIRST sound of its name — about thirty signs a child could master.',
      uk: 'Семітські робітники в Єгипті використали кожен малюнок лише для ПЕРШОГО звука його назви — близько тридцяти знаків, які могла опанувати дитина.',
    },
  },
  {
    id: 'phoenician',
    name: { en: 'Phoenician', uk: 'Фінікійське письмо' },
    era: { en: 'spread on trade routes', uk: 'поширення торговими шляхами' },
    note: {
      en: 'The experiment became Phoenician — and Phoenician went viral along the trade routes.',
      uk: 'Експеримент став фінікійським письмом — і воно стрімко поширилося торговими шляхами.',
    },
  },
  {
    id: 'greek',
    name: { en: 'Greek', uk: 'Грецьке письмо' },
    era: { en: 'a crucial upgrade', uk: 'ключове оновлення' },
    note: {
      en: 'The Greeks adapted it and added a crucial invention — full vowels.',
      uk: 'Греки пристосували його й додали ключовий винахід — повноцінні голосні.',
    },
  },
  {
    id: 'modern',
    name: { en: 'Latin & Cyrillic', uk: 'Латиниця і кирилиця' },
    era: { en: '9th century CE → today', uk: 'IX століття н.е. → сьогодні' },
    note: {
      en: 'From Greek came Latin (westward, via the Etruscans) and, in the 9th century, Cyrillic — Cyril and Methodius’s students built it from Greek letterforms. Ukrainian’s alphabet is Phoenician’s grandchild.',
      uk: 'З грецького постала латиниця (на захід, через етрусків) і, у IX столітті, кирилиця — учні Кирила й Мефодія збудували її з грецьких накреслень. Українська абетка — онука фінікійського письма.',
    },
  },
];

export interface Letter {
  id: string;
  latin: string;
  cyrillic: string;
  /** Article-sourced pictographic origin. */
  picture: Record<Lang, string>;
  /** The Semitic name of the sign. */
  semitic: string;
  /** The sound it stood for. */
  sound: Record<Lang, string>;
  origin: Record<Lang, string>;
  /** One glyph per STAGES entry (Latin track). */
  glyphs: Glyph[];
  /** The final Cyrillic form (shown beside the Latin one at the modern stage). */
  cyrillicGlyph: Glyph;
}

export const LETTERS: Letter[] = [
  {
    id: 'A',
    latin: 'A',
    cyrillic: 'А',
    picture: { en: 'ox', uk: 'віл' },
    semitic: 'ʾalp',
    sound: { en: 'the glottal “ʾa”', uk: 'гортанне «ʾа»' },
    origin: {
      en: 'An ox head (ʾalp) stood for the glottal “ʾa”. The letter A — in both Latin and Cyrillic — is still a flipped ox head, four thousand years on.',
      uk: 'Голова вола (ʾalp) позначала гортанне «ʾа». Літера A — і в латиниці, і в кирилиці — досі перевернута голова вола, чотири тисячі років по тому.',
    },
    glyphs: [
      // pictograph — ox head with horns
      [
        'M36,46 C 36,33 64,33 64,46 C 70,74 30,74 36,46 Z',
        'M38,42 C 24,32 16,22 22,13',
        'M62,42 C 76,32 84,22 78,13',
      ],
      // proto-sinaitic — head rotated, horns to the left
      ['M60,34 C 78,34 78,66 60,66 C 42,66 42,34 60,34 Z', 'M46,44 L 22,33', 'M46,56 L 22,67'],
      // phoenician aleph — apex left, a reclining A
      ['M22,50 L 80,26', 'M22,50 L 80,74', 'M50,38 L 50,62'],
      // greek alpha — tilting upright
      ['M42,15 L 22,87', 'M42,15 L 66,85', 'M31,57 L 57,52'],
      // latin A
      ['M50,13 L 24,88', 'M50,13 L 76,88', 'M34,60 L 66,60'],
    ],
    cyrillicGlyph: ['M50,13 L 24,88', 'M50,13 L 76,88', 'M34,60 L 66,60'],
  },
  {
    id: 'B',
    latin: 'B',
    cyrillic: 'Б',
    picture: { en: 'house', uk: 'дім' },
    semitic: 'bayt',
    sound: { en: 'the sound “b”', uk: 'звук «б»' },
    origin: {
      en: 'A house (bayt) stood for the sound “b”. Its Greek descendant, beta, gave the Latin B — and the Cyrillic letters Ukrainian writes today.',
      uk: 'Дім (bayt) позначав звук «б». Його грецька нащадка, бета, дала латинську B — і кириличні літери, якими сьогодні пише українська.',
    },
    glyphs: [
      // pictograph — a house: roof, walls, doorway
      ['M22,47 L 50,21 L 78,47', 'M28,47 L 28,86 L 72,86 L 72,47', 'M44,86 L 44,66 L 58,66 L 58,86'],
      // proto-sinaitic — abstracted open box, leaning
      ['M35,73 L 30,27 L 71,22 L 74,55'],
      // phoenician bet — top loop + tail to lower-left
      ['M44,24 L 44,52', 'M44,24 C 70,24 70,52 44,52', 'M44,52 L 24,84'],
      // greek beta — two rounding bumps
      ['M34,16 L 34,86', 'M34,18 C 70,20 70,48 34,50', 'M34,50 C 74,52 74,84 34,84'],
      // latin B
      ['M32,14 L 32,88', 'M32,16 C 66,16 66,49 32,49', 'M32,49 C 72,49 72,88 32,88'],
    ],
    // cyrillic Б — stem, top bar, single belly
    cyrillicGlyph: ['M32,14 L 32,88', 'M32,14 L 62,14', 'M32,49 C 70,49 70,88 32,88'],
  },
  {
    id: 'M',
    latin: 'M',
    cyrillic: 'М',
    picture: { en: 'water', uk: 'вода' },
    semitic: 'mem',
    sound: { en: 'the sound “m”', uk: 'звук «м»' },
    origin: {
      en: 'Water (mem) stood for the sound “m” — its ripples are still visible in the peaks of the letter M, in Latin and Cyrillic alike.',
      uk: 'Вода (mem) позначала звук «м» — її брижі досі видно у вершинах літери М, як у латиниці, так і в кирилиці.',
    },
    glyphs: [
      // pictograph — two ripples of water
      [
        'M14,42 C 22,32 30,52 38,42 C 46,32 54,52 62,42 C 70,32 78,52 86,42',
        'M14,60 C 22,50 30,70 38,60 C 46,50 54,70 62,60 C 70,50 78,70 86,60',
      ],
      // proto-sinaitic mem — a single vertical wavy stroke
      ['M42,15 C 30,24 52,30 40,40 C 28,50 50,56 38,66 C 30,73 44,79 40,87'],
      // phoenician mem — zigzag with a left tail
      ['M26,84 L 32,30 L 46,58 L 58,32 L 70,56 L 76,42'],
      // greek mu
      ['M24,84 L 30,20 L 50,58 L 70,20 L 76,84'],
      // latin M
      ['M20,86 L 20,18 L 50,58 L 80,18 L 80,86'],
    ],
    cyrillicGlyph: ['M20,86 L 20,18 L 50,58 L 80,18 L 80,86'],
  },
];

/* ----------------------------------------------------------------
   (2) "Where writing began" — the ~4 from-scratch inventions, plus the
   alphabet branch (a descendant of Egyptian hieroglyphs) and Hangul
   (deliberately designed, kept separate so we don't miscount it).

   Icons are decorative. Dates + facts are article-sourced.
   ---------------------------------------------------------------- */

export interface TreeNode {
  id: string;
  icon: string;
  place: Record<Lang, string>;
  script: Record<Lang, string>;
  when: Record<Lang, string>;
  body: Record<Lang, string>;
  /** Descendant scripts shown as an indented branch. */
  children?: TreeNode[];
}

export const ROOTS: TreeNode[] = [
  {
    id: 'mesopotamia',
    icon: '🐑',
    place: { en: 'Mesopotamia', uk: 'Месопотамія' },
    script: { en: 'Cuneiform', uk: 'Клинопис' },
    when: { en: '~3300 BCE', uk: '~3300 до н.е.' },
    body: {
      en: 'Writing began as accounting. Clay tokens counted sheep and grain for millennia; pressed into clay envelopes, the impressions started standing in for the tokens, until the marks alone sufficed. The first written documents are receipts — literature came centuries later.',
      uk: 'Письмо почалося з бухгалтерії. Глиняні жетони тисячоліттями рахували овець і зерно; притиснуті до глиняних конвертів, відбитки почали заміняти жетони, аж доки самих позначок стало досить. Перші писемні документи — це квитанції; література прийшла на століття пізніше.',
    },
  },
  {
    id: 'egypt',
    icon: '👁️',
    place: { en: 'Egypt', uk: 'Єгипет' },
    script: { en: 'Hieroglyphs', uk: 'Ієрогліфи' },
    when: { en: '~3200 BCE', uk: '~3200 до н.е.' },
    body: {
      en: 'Egypt’s own from-scratch invention — and the unlikely parent of every alphabet on Earth. Around 1900–1700 BCE, Semitic workers borrowed a handful of these hieroglyphs and used each for the first sound of its name.',
      uk: 'Власний винахід Єгипту з нуля — і несподіваний прабатько кожної абетки на Землі. Близько 1900–1700 до н.е. семітські робітники запозичили жменю цих ієрогліфів і використали кожен для першого звука його назви.',
    },
    children: [
      {
        id: 'protosinaitic',
        icon: '🔤',
        place: { en: 'Proto-Sinaitic', uk: 'Протосинайське письмо' },
        script: { en: 'First alphabet', uk: 'Перша абетка' },
        when: { en: '~1900–1700 BCE', uk: '~1900–1700 до н.е.' },
        body: {
          en: 'A house (bayt) = b, water (mem) = m, an ox head (ʾalp) = the glottal ʾa. About thirty signs instead of hundreds — a system a child could master.',
          uk: 'Дім (bayt) = б, вода (mem) = м, голова вола (ʾalp) = гортанне ʾа. Близько тридцяти знаків замість сотень — система, яку могла опанувати дитина.',
        },
      },
      {
        id: 'phoenician',
        icon: '⛵',
        place: { en: 'Phoenician', uk: 'Фінікійське письмо' },
        script: { en: 'Went viral', uk: 'Стало вірусним' },
        when: { en: 'on the trade routes', uk: 'на торгових шляхах' },
        body: {
          en: 'Proto-Sinaitic became Phoenician, and Phoenician spread along the trade routes — the doodle experiment going global.',
          uk: 'Протосинайське письмо стало фінікійським, і воно поширилося торговими шляхами — експеримент-карлючка вийшов у світ.',
        },
      },
      {
        id: 'greek',
        icon: '🏛️',
        place: { en: 'Greek', uk: 'Грецьке письмо' },
        script: { en: 'Added vowels', uk: 'Додало голосні' },
        when: { en: 'a crucial upgrade', uk: 'ключове оновлення' },
        body: {
          en: 'The Greeks adapted it and added a crucial invention — full vowels. From Greek the alphabet forked west and east.',
          uk: 'Греки пристосували його й додали ключовий винахід — повноцінні голосні. Від грецького абетка розгалузилася на захід і схід.',
        },
      },
      {
        id: 'latincyrillic',
        icon: '🅰️',
        place: { en: 'Latin & Cyrillic', uk: 'Латиниця і кирилиця' },
        script: { en: 'Ukrainian is here', uk: 'Тут — українська' },
        when: { en: 'Latin via Etruscans; Cyrillic 9th c. CE', uk: 'латиниця через етрусків; кирилиця IX ст. н.е.' },
        body: {
          en: 'From Greek came Latin (westward, via the Etruscans) and, in the 9th century, the Slavic scripts: Cyril and Methodius devised Glagolitic, and their students in Bulgaria built Cyrillic from Greek letterforms. The alphabet Ukrainian uses today is Phoenician’s grandchild.',
          uk: 'З грецького постала латиниця (на захід, через етрусків) і, у IX столітті, слов’янські абетки: Кирило й Мефодій створили глаголицю, а їхні учні в Болгарії збудували кирилицю з грецьких накреслень. Абетка, якою сьогодні пише українська, — онука фінікійського письма.',
        },
      },
    ],
  },
  {
    id: 'china',
    icon: '🖌️',
    place: { en: 'China', uk: 'Китай' },
    script: { en: 'Chinese characters', uk: 'Китайські ієрогліфи' },
    when: { en: '~1200 BCE', uk: '~1200 до н.е.' },
    body: {
      en: 'A different solution, equally clever. Characters trade a longer learning curve for the ability to bridge mutually unintelligible spoken varieties across millennia. Japanese later mixes three scripts in one sentence with total fluency.',
      uk: 'Інше рішення, не менш дотепне. Ієрогліфи дають довшу криву навчання в обмін на здатність єднати взаємно незрозумілі усні різновиди крізь тисячоліття. Японська згодом змішує три системи письма в одному реченні цілком вільно.',
    },
  },
  {
    id: 'mesoamerica',
    icon: '🌽',
    place: { en: 'Mesoamerica', uk: 'Мезоамерика' },
    script: { en: 'Mesoamerican writing', uk: 'Мезоамериканське письмо' },
    when: { en: '~600 BCE', uk: '~600 до н.е.' },
    body: {
      en: 'The fourth time humans invented writing from scratch, an ocean away from all the others — proof that the idea can occur to people independently, given enough to record.',
      uk: 'Четвертий раз, коли люди винайшли письмо з нуля, за океан від усіх інших, — доказ, що ідея може спасти людям незалежно, коли є що записувати.',
    },
  },
];

/** Korean Hangul — designed, not evolved. Kept apart so it isn't counted as a fifth from-scratch invention. */
export const DESIGNED: TreeNode = {
  id: 'hangul',
  icon: '👄',
  place: { en: 'Korea', uk: 'Корея' },
  script: { en: 'Hangul', uk: 'Хангиль' },
  when: { en: '1443 CE', uk: '1443 р. н.е.' },
  body: {
    en: 'Designed deliberately by King Sejong’s court, with full knowledge that writing existed. Each letter is shaped after the position of the tongue and lips making the sound — the only widely used script whose letters are diagrams of articulation.',
    uk: 'Свідомо сконструйоване двором короля Седжона, з повним знанням, що письмо існує. Кожна літера має форму положення язика й губ, що творять звук, — єдине широковживане письмо, чиї літери є схемами артикуляції.',
  },
};

/* ----------------------------------------------------------------
   (3) Rebus machine — a picture stands for its SOUND, not its meaning.

   The shared opener is the article's own Sumerian example (arrow ti = life ti).
   The rest are language-specific, because a rebus only works in the language
   whose words the pictures name. EN and UK get their own playable sets.
   ---------------------------------------------------------------- */

export interface RebusTile {
  key: string;
  glyph: string;
  sound: Record<Lang, string>;
}

export interface Puzzle {
  id: string;
  prompt: Record<Lang, string>;
  /** Tiles shown, in display order (may include a distractor). */
  tiles: RebusTile[];
  /** Ordered tile keys that solve it. */
  solution: string[];
  /** The word the sounds spell. */
  answer: Record<Lang, string>;
  explain: Record<Lang, string>;
}

// Shared: the article's Sumerian arrow.
const ARROW: Puzzle = {
  id: 'arrow',
  prompt: { en: 'the word “life” — but you only have pictures', uk: 'слово «життя» — але є лише малюнки' },
  tiles: [{ key: 'arrow', glyph: '🏹', sound: { en: 'ti', uk: 'ті' } }],
  solution: ['arrow'],
  answer: { en: 'life (Sumerian ti)', uk: 'життя (шумерське ti)' },
  explain: {
    en: 'In Sumerian an arrow is “ti”. The word “life” is also “ti” — abstract and unpicturable, but you can write it with the arrow’s SOUND. That leap is the rebus principle: once symbols capture sounds, you can write anything sayable.',
    uk: 'Шумерською стріла — це «ti». Слово «життя» теж «ti» — абстрактне й не намалюєш, та його можна записати ЗВУКОМ стріли. Цей стрибок і є принцип ребуса: щойно символи передають звуки, можна записати все, що можна вимовити.',
  },
};

const REBUS_EN: Puzzle[] = [
  ARROW,
  {
    id: 'belief',
    prompt: { en: 'a word for what you hold to be true', uk: 'слово про те, у що ви вірите' },
    tiles: [
      { key: 'bee', glyph: '🐝', sound: { en: 'bee', uk: 'бі' } },
      { key: 'leaf', glyph: '🍃', sound: { en: 'leaf', uk: 'ліф' } },
      { key: 'eye', glyph: '👁️', sound: { en: 'eye', uk: 'ай' } },
    ],
    solution: ['bee', 'leaf'],
    answer: { en: 'belief', uk: 'belief (віра)' },
    explain: {
      en: 'A bee and a leaf, read for their sounds, say “be-leaf” → belief. Neither insect nor plant is meant — only the sound.',
      uk: 'Бджола й листок, прочитані за звуком, кажуть «bee-leaf» → belief. Ідеться не про комаху чи рослину — лише про звук.',
    },
  },
  {
    id: 'icy',
    prompt: { en: 'a word for a frozen lake’s surface', uk: 'слово про поверхню замерзлого озера' },
    tiles: [
      { key: 'eye', glyph: '👁️', sound: { en: 'eye', uk: 'ай' } },
      { key: 'sea', glyph: '🌊', sound: { en: 'sea', uk: 'сі' } },
      { key: 'bee', glyph: '🐝', sound: { en: 'bee', uk: 'бі' } },
    ],
    solution: ['eye', 'sea'],
    answer: { en: 'icy', uk: 'icy (крижаний)' },
    explain: {
      en: 'An eye and the sea say “eye-sea” → icy. The pictures lend only their sound, not their meaning.',
      uk: 'Око й море кажуть «eye-sea» → icy. Малюнки позичають лише звук, а не значення.',
    },
  },
];

const REBUS_UK: Puzzle[] = [
  ARROW,
  {
    id: 'simya',
    prompt: { en: 'the Ukrainian word for “family”', uk: 'українське слово «родина»' },
    tiles: [
      { key: 'seven', glyph: '7️⃣', sound: { en: 'sim', uk: 'сім' } },
      { key: 'ya', glyph: 'Я', sound: { en: 'ya', uk: 'я' } },
      { key: 'tea', glyph: '🍵', sound: { en: 'chai', uk: 'чай' } },
    ],
    solution: ['seven', 'ya'],
    answer: { en: 'сім’я (family)', uk: 'сім’я' },
    explain: {
      en: 'The digit 7 reads “сім”, the letter Я reads “я” — together they sound out сім’я, “family”. The number and letter stand for their sounds, not their values.',
      uk: 'Цифра 7 читається «сім», буква Я — «я» — разом вони озвучують сім’я. Число й буква означають свої звуки, а не свої значення.',
    },
  },
  {
    id: 'chaika',
    prompt: { en: 'the Ukrainian word for a “seagull”', uk: 'українське слово «мартин» (птах)' },
    tiles: [
      { key: 'tea', glyph: '🍵', sound: { en: 'chai', uk: 'чай' } },
      { key: 'ka', glyph: 'К', sound: { en: 'ka', uk: 'ка' } },
      { key: 'seven', glyph: '7️⃣', sound: { en: 'sim', uk: 'сім' } },
    ],
    solution: ['tea', 'ka'],
    answer: { en: 'чайка (seagull)', uk: 'чайка' },
    explain: {
      en: 'Tea is “чай”; the letter К is named “ка” — sounded together they make чайка, a seagull. The picture of tea lends only its sound.',
      uk: 'Чай — це «чай»; буква К зветься «ка» — озвучені разом, вони дають чайку. Малюнок чаю позичає лише свій звук.',
    },
  },
];

export const REBUS: Record<Lang, Puzzle[]> = {
  en: REBUS_EN,
  uk: REBUS_UK,
};
