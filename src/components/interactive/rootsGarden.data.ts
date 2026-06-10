// Data for the roots-garden interactive ("Where Ukrainian words come from").
// Every word, layer, origin and date traces to content/{en,uk}/ukrainian-word-origins.md.
//
// What the article gives directly (the anchors used here):
//   • The deep core descends from Proto-Slavic and, behind it, PIE. мати = PIE
//     *méh₂tēr, "essentially the same word our steppe ancestors said six millennia
//     ago"; брат, сестра, два, три, небо, вода, жито are the inherited core
//     (kinship, body, numbers, weather, grain).
//   • вирій preserves a pre-Christian Slavic otherworld; ведмідь is the taboo
//     "honey-eater" that replaced the bear's forbidden true name (the IE word that
//     gave Latin ursus was lost).
//   • лелека ("stork") is borrowed from Turkic leylek, ultimately echoing the
//     bird's call in Arabic laqlaq — "even national symbols have passports".
//   • Greek through the church: церква, ангел, книга (possibly via Gothic).
//   • Turkic from the steppe frontier: козак, майдан, кавун, тютюн.
//   • German craft/town words through Polish: цегла (Ziegel), дах (Dach),
//     друкувати (drucken), ринок (Ring).
//   • Deliberately coined, mostly 19th c.: мрія (Mykhailo Starytsky, from the verb
//     мріти "to shimmer dimly"; the largest aircraft ever built was named after
//     it), майбутнє ("the future"), байдужість ("indifference").
//   • A modern 21st-c. flood of English — but the article names NO specific
//     examples, so the English layer carries no word-cards. TODO(seva): add
//     article-sourced 21st-c. English loanwords if any are written into the piece.
//
// Layer split note: the article groups мати/брат/сестра/два/три/небо/вода/жито as
// one "inherited core (Proto-Slavic, behind it PIE)". The PIE vs Proto-Slavic
// division below follows the article's explicit cues (мати = PIE *méh₂tēr;
// вирій/ведмідь = Slavic) and places the grain word жито in Proto-Slavic.

import type { Lang } from '../../i18n/ui';

export type LayerId =
  | 'pie'
  | 'slavic'
  | 'greek'
  | 'turkic'
  | 'german'
  | 'coined'
  | 'english';

export interface GeoPoint {
  lat: number;
  lon: number;
  place: Record<Lang, string>;
}

export interface Layer {
  id: LayerId;
  name: Record<Lang, string>;
  /** Qualitative era label — only PIE carries a number (article: six millennia). */
  era: Record<Lang, string>;
  blurb: Record<Lang, string>;
}

export interface BirthCert {
  author: Record<Lang, string>;
  date: Record<Lang, string>;
  sourceVerb: string;
  verbMeaning: Record<Lang, string>;
  note: Record<Lang, string>;
}

export interface RootWord {
  id: string;
  /** The Ukrainian word — never translated. */
  word: string;
  gloss: Record<Lang, string>;
  layer: LayerId;
  /** Short source label, e.g. "German Dach (via Polish)". */
  origin: Record<Lang, string>;
  story: Record<Lang, string>;
  /** Where the route starts. Omitted for words born in Ukraine. */
  source?: GeoPoint;
  /** Optional intermediate hop (Polish, for the German layer). */
  via?: GeoPoint;
  /** Coined words were born in Ukraine — show a "born here" marker, no route. */
  bornHere?: boolean;
  /** Only мрія: the famous word with a documented author and date. */
  birthCert?: BirthCert;
}

// Route maps always end here. Approx. central Ukraine (Kyiv-ish) for the dot.
export const UKRAINE: GeoPoint = {
  lat: 49.0,
  lon: 31.2,
  place: { en: 'Ukraine', uk: 'Україна' },
};

// Layers, oldest → newest (the component stacks them newest-on-top, like sediment).
export const LAYERS: Layer[] = [
  {
    id: 'pie',
    name: { en: 'Proto-Indo-European core', uk: 'Праіндоєвропейське ядро' },
    era: { en: '~6,000 years ago', uk: '~6 000 років тому' },
    blurb: {
      en: 'The deepest layer — kinship, numbers, weather — inherited straight from the steppe.',
      uk: 'Найглибший шар — спорідненість, числа, погода — успадковані прямо зі степу.',
    },
  },
  {
    id: 'slavic',
    name: { en: 'Proto-Slavic', uk: 'Праслов’янське' },
    era: { en: 'the common Slavic past', uk: 'спільнослов’янська давнина' },
    blurb: {
      en: 'Words shared across the Slavic world — some carrying old mythology inside them.',
      uk: 'Слова, спільні для слов’янського світу, — деякі несуть у собі давню міфологію.',
    },
  },
  {
    id: 'greek',
    name: { en: 'Greek, through the church', uk: 'Грецьке, через церкву' },
    era: { en: 'with Christianity', uk: 'із християнством' },
    blurb: {
      en: 'Christianity arrived in Greek, and its vocabulary came with it.',
      uk: 'Християнство прийшло грецькою, і його словник прийшов разом із ним.',
    },
  },
  {
    id: 'turkic',
    name: { en: 'Turkic, from the steppe', uk: 'Тюркське, зі степу' },
    era: { en: 'the steppe frontier', uk: 'степове прикордоння' },
    blurb: {
      en: 'Words from the steppe frontier — even the most Ukrainian of birds is an immigrant.',
      uk: 'Слова зі степового прикордоння — навіть найукраїнськіший із птахів є іммігрантом.',
    },
  },
  {
    id: 'german',
    name: { en: 'German, via Polish', uk: 'Німецьке, через польську' },
    era: { en: 'town & craft words', uk: 'міські й ремісничі слова' },
    blurb: {
      en: 'German craft and town vocabulary that reached Ukrainian through Polish.',
      uk: 'Німецька реміснича й міська лексика, що дійшла до української через польську.',
    },
  },
  {
    id: 'coined',
    name: { en: 'Deliberately coined', uk: 'Свідомо вигадане' },
    era: { en: '19th century', uk: 'XIX століття' },
    blurb: {
      en: 'Words invented to build a modern vocabulary — one of them has a birthday.',
      uk: 'Слова, вигадані, щоб збудувати модерний словник, — одне з них має день народження.',
    },
  },
  {
    id: 'english',
    name: { en: 'English', uk: 'Англійське' },
    era: { en: '21st century', uk: 'XXI століття' },
    blurb: {
      en: 'A modern flood of English borrowings — the newest sediment of all.',
      uk: 'Сучасна повінь англізмів — найновіший осад з усіх.',
    },
  },
];

// Source regions (approximate regional centroids for the route mini-maps).
const STEPPE: GeoPoint = { lat: 48, lon: 47, place: { en: 'the steppe', uk: 'степ' } };
const SLAVIC_HOME: GeoPoint = {
  lat: 51.5,
  lon: 27,
  place: { en: 'the Slavic homeland', uk: 'слов’янська прабатьківщина' },
};
const GREECE: GeoPoint = { lat: 40, lon: 26, place: { en: 'Byzantium / Greece', uk: 'Візантія / Греція' } };
const TURKESTAN: GeoPoint = {
  lat: 44,
  lon: 64,
  place: { en: 'the Turkic steppe', uk: 'тюркський степ' },
};
const ANATOLIA: GeoPoint = { lat: 39, lon: 35, place: { en: 'Anatolia', uk: 'Анатолія' } };
const GERMANY: GeoPoint = { lat: 51, lon: 10, place: { en: 'Germany', uk: 'Німеччина' } };
const POLAND: GeoPoint = { lat: 52, lon: 20, place: { en: 'Poland', uk: 'Польща' } };

export const WORDS: RootWord[] = [
  // ── Proto-Indo-European core ──────────────────────────────────────────────
  {
    id: 'maty',
    word: 'мати',
    gloss: { en: 'mother', uk: 'мати' },
    layer: 'pie',
    origin: { en: 'PIE *méh₂tēr', uk: 'ПІЄ *méh₂tēr' },
    story: {
      en: 'Essentially the same word our steppe ancestors said six millennia ago — older than the pyramids, and still in your mouth every day.',
      uk: 'По суті те саме слово, яке наші степові предки казали шість тисячоліть тому, — старше за піраміди й досі у вас на вустах щодня.',
    },
    source: STEPPE,
  },
  {
    id: 'brat',
    word: 'брат',
    gloss: { en: 'brother', uk: 'брат' },
    layer: 'pie',
    origin: { en: 'inherited PIE kinship', uk: 'успадкована ПІЄ спорідненість' },
    story: {
      en: 'Part of the small inherited core that still does the daily work — kinship words run straight back to Proto-Indo-European.',
      uk: 'Частина невеликого успадкованого ядра, що й досі виконує щоденну роботу: слова спорідненості сягають прямо праіндоєвропейської.',
    },
    source: STEPPE,
  },
  {
    id: 'sestra',
    word: 'сестра',
    gloss: { en: 'sister', uk: 'сестра' },
    layer: 'pie',
    origin: { en: 'inherited PIE kinship', uk: 'успадкована ПІЄ спорідненість' },
    story: {
      en: 'Another piece of the deep kinship core — a couple of thousand inherited roots that carry most of everyday speech.',
      uk: 'Ще один шматок глибокого ядра спорідненості — кілька тисяч успадкованих коренів, що несуть більшість щоденного мовлення.',
    },
    source: STEPPE,
  },
  {
    id: 'dva',
    word: 'два',
    gloss: { en: 'two', uk: 'два' },
    layer: 'pie',
    origin: { en: 'inherited PIE numeral', uk: 'успадкований ПІЄ числівник' },
    story: {
      en: 'Numbers are bedrock vocabulary; this one is a Proto-Indo-European inheritance shared right across the family.',
      uk: 'Числа — це фундаментальна лексика; це праіндоєвропейський спадок, спільний для всієї родини.',
    },
    source: STEPPE,
  },
  {
    id: 'try',
    word: 'три',
    gloss: { en: 'three', uk: 'три' },
    layer: 'pie',
    origin: { en: 'inherited PIE numeral', uk: 'успадкований ПІЄ числівник' },
    story: {
      en: 'One of the numbers in the inherited core — the same root surfaces as English "three" and Latin "tres".',
      uk: 'Один із числівників успадкованого ядра — той самий корінь дає англійське «three» й латинське «tres».',
    },
    source: STEPPE,
  },

  // ── Proto-Slavic ──────────────────────────────────────────────────────────
  {
    id: 'zhyto',
    word: 'жито',
    gloss: { en: 'rye, grain', uk: 'жито, збіжжя' },
    layer: 'slavic',
    origin: { en: 'Proto-Slavic', uk: 'праслов’янське' },
    story: {
      en: 'Grain belongs to the deep agricultural core the article describes — weather, grain, the daily work of staying alive.',
      uk: 'Збіжжя належить до глибокого хліборобського ядра, яке описує стаття: погода, зерно, щоденна робота виживання.',
    },
    source: SLAVIC_HOME,
  },
  {
    id: 'vyrii',
    word: 'вирій',
    gloss: {
      en: 'the warm land birds fly to each autumn',
      uk: 'тепла земля, куди щоосені відлітають птахи',
    },
    layer: 'slavic',
    origin: { en: 'Proto-Slavic mythology', uk: 'праслов’янська міфологія' },
    story: {
      en: 'It preserves a pre-Christian Slavic otherworld — the word outlived the very religion that built it.',
      uk: 'Воно зберігає дохристиянський слов’янський потойбіч — слово пережило саму релігію, що його збудувала.',
    },
    source: SLAVIC_HOME,
  },
  {
    id: 'vedmid',
    word: 'ведмідь',
    gloss: { en: 'bear (lit. "honey-eater")', uk: 'ведмідь (букв. «той, хто їсть мед»)' },
    layer: 'slavic',
    origin: { en: 'Proto-Slavic taboo name', uk: 'праслов’янська табу-назва' },
    story: {
      en: 'A taboo nickname — Slavs avoided the bear’s true name lest they summon it, and the original word (which gave Latin ursus) vanished entirely.',
      uk: 'Табуїстичне прізвисько — слов’яни уникали справжнього імені звіра, щоб не накликати його, і первісне слово (що дало латинське ursus) зникло повністю.',
    },
    source: SLAVIC_HOME,
  },

  // ── Greek, through the church ──────────────────────────────────────────────
  {
    id: 'tserkva',
    word: 'церква',
    gloss: { en: 'church', uk: 'церква' },
    layer: 'greek',
    origin: { en: 'Greek, via the church', uk: 'грецьке, через церкву' },
    story: {
      en: 'The institution and its name arrived together — Christianity came in Greek, and brought its vocabulary with it.',
      uk: 'Установа та її назва прийшли разом — християнство прийшло грецькою і принесло свій словник.',
    },
    source: GREECE,
  },
  {
    id: 'anhel',
    word: 'ангел',
    gloss: { en: 'angel', uk: 'ангел' },
    layer: 'greek',
    origin: { en: 'Greek, via the church', uk: 'грецьке, через церкву' },
    story: {
      en: 'A church word through and through — part of the Greek stratum that came with the new religion.',
      uk: 'Наскрізь церковне слово — частина грецького пласта, що прийшов із новою релігією.',
    },
    source: GREECE,
  },
  {
    id: 'knyha',
    word: 'книга',
    gloss: { en: 'book', uk: 'книга' },
    layer: 'greek',
    origin: { en: 'Greek — possibly via Gothic', uk: 'грецьке — можливо, через готську' },
    story: {
      en: 'A church-era word whose road is debated — it may have been carried in through Gothic before it reached Slavic.',
      uk: 'Слово церковної доби зі спірним шляхом — можливо, його занесли через готську, перш ніж воно дійшло до слов’ян.',
    },
    source: GREECE,
  },

  // ── Turkic, from the steppe frontier ──────────────────────────────────────
  {
    id: 'kozak',
    word: 'козак',
    gloss: { en: 'Cossack', uk: 'козак' },
    layer: 'turkic',
    origin: { en: 'Turkic', uk: 'тюркське' },
    story: {
      en: 'A Turkic word from the steppe frontier — the same border country that handed Ukrainian майдан and кавун.',
      uk: 'Тюркське слово зі степового прикордоння — того самого пограниччя, що дало українській майдан і кавун.',
    },
    source: TURKESTAN,
  },
  {
    id: 'maidan',
    word: 'майдан',
    gloss: { en: 'square, maidan', uk: 'майдан, площа' },
    layer: 'turkic',
    origin: { en: 'Turkic (steppe frontier)', uk: 'тюркське (степове прикордоння)' },
    story: {
      en: 'From the steppe frontier — the open square at the heart of a town, and of a revolution.',
      uk: 'Зі степового прикордоння — відкрита площа в серці міста і в серці революції.',
    },
    source: TURKESTAN,
  },
  {
    id: 'kavun',
    word: 'кавун',
    gloss: { en: 'watermelon', uk: 'кавун' },
    layer: 'turkic',
    origin: { en: 'Turkic', uk: 'тюркське' },
    story: {
      en: 'Steppe-frontier vocabulary — the melon arrived carrying its Turkic name.',
      uk: 'Лексика степового прикордоння — диня прибула зі своєю тюркською назвою.',
    },
    source: TURKESTAN,
  },
  {
    id: 'tiutiun',
    word: 'тютюн',
    gloss: { en: 'tobacco', uk: 'тютюн' },
    layer: 'turkic',
    origin: { en: 'Turkic', uk: 'тюркське' },
    story: {
      en: 'Another borrowing from the steppe frontier, alongside козак, майдан and кавун.',
      uk: 'Ще одне запозичення зі степового прикордоння, поряд із козак, майдан і кавун.',
    },
    source: TURKESTAN,
  },
  {
    id: 'leleka',
    word: 'лелека',
    gloss: { en: 'stork', uk: 'лелека' },
    layer: 'turkic',
    origin: { en: 'Turkic leylek ← Arabic laqlaq', uk: 'тюркське leylek ← арабське laqlaq' },
    story: {
      en: 'The most Ukrainian of birds is an immigrant — borrowed from Turkic leylek, ultimately echoing the bird’s clattering call in Arabic laqlaq. Even national symbols have passports.',
      uk: 'Найукраїнськіший із птахів — іммігрант: запозичення з тюркського leylek, що зрештою відлунює клекіт птаха в арабському laqlaq. Навіть національні символи мають паспорти.',
    },
    source: ANATOLIA,
  },

  // ── German, via Polish ────────────────────────────────────────────────────
  {
    id: 'tsehla',
    word: 'цегла',
    gloss: { en: 'brick', uk: 'цегла' },
    layer: 'german',
    origin: { en: 'German Ziegel (via Polish)', uk: 'німецьке Ziegel (через польську)' },
    story: {
      en: 'German craft vocabulary that reached Ukrainian through Polish — the building trade brought its words along with its bricks.',
      uk: 'Німецька реміснича лексика, що дійшла до української через польську, — будівельний фах приніс слова разом із цеглою.',
    },
    source: GERMANY,
    via: POLAND,
  },
  {
    id: 'dakh',
    word: 'дах',
    gloss: { en: 'roof', uk: 'дах' },
    layer: 'german',
    origin: { en: 'German Dach (via Polish)', uk: 'німецьке Dach (через польську)' },
    story: {
      en: 'The roof over your head is German — Dach, arriving through Polish. A Ukrainian house is practically a museum diorama.',
      uk: 'Дах над головою — німецький: Dach, що прийшов через польську. Українська хата — практично музейна діорама.',
    },
    source: GERMANY,
    via: POLAND,
  },
  {
    id: 'drukuvaty',
    word: 'друкувати',
    gloss: { en: 'to print', uk: 'друкувати' },
    layer: 'german',
    origin: { en: 'German drucken (via Polish)', uk: 'німецьке drucken (через польську)' },
    story: {
      en: 'The printing trade brought its German verb, drucken, through Polish into Ukrainian.',
      uk: 'Друкарський фах приніс своє німецьке дієслово drucken через польську в українську.',
    },
    source: GERMANY,
    via: POLAND,
  },
  {
    id: 'rynok',
    word: 'ринок',
    gloss: { en: 'market', uk: 'ринок' },
    layer: 'german',
    origin: { en: 'German Ring (via Polish)', uk: 'німецьке Ring (через польську)' },
    story: {
      en: 'From German Ring — the town’s ring-shaped square. Town life came with German words through Polish.',
      uk: 'Від німецького Ring — кільцевої міської площі. Міське життя прийшло з німецькими словами через польську.',
    },
    source: GERMANY,
    via: POLAND,
  },

  // ── Deliberately coined, 19th century ─────────────────────────────────────
  {
    id: 'mriia',
    word: 'мрія',
    gloss: { en: 'dream, reverie', uk: 'мрія' },
    layer: 'coined',
    origin: { en: 'coined, 1870s', uk: 'вигадане, 1870-ті' },
    story: {
      en: 'The crown jewel of invented words — it filled a real gap, caught on instantly, and today feels so native that most speakers would swear it is ancient.',
      uk: 'Перлина корони серед вигаданих слів — воно заповнило справжню прогалину, миттєво прижилося й сьогодні відчувається таким питомим, що більшість мовців присягнулися б у його давності.',
    },
    bornHere: true,
    birthCert: {
      author: { en: 'Mykhailo Starytsky', uk: 'Михайло Старицький' },
      date: { en: '1870s (19th c.)', uk: '1870-ті (XIX ст.)' },
      sourceVerb: 'мріти',
      verbMeaning: { en: 'to shimmer dimly', uk: 'тьмяно мерехтіти' },
      note: {
        en: 'An aircraft — the largest ever built — was later named after it.',
        uk: 'Згодом його іменем назвали найбільший літак в історії.',
      },
    },
  },
  {
    id: 'maibutnie',
    word: 'майбутнє',
    gloss: { en: 'the future', uk: 'майбутнє' },
    layer: 'coined',
    origin: { en: 'coined, 19th c.', uk: 'вигадане, XIX ст.' },
    story: {
      en: 'Among the dozens credited to Starytsky and his contemporaries, who were building a full modern vocabulary under the bans.',
      uk: 'Серед десятків, що приписують Старицькому та його сучасникам, які будували повний модерний словник під заборонами.',
    },
    bornHere: true,
  },
  {
    id: 'baiduzhist',
    word: 'байдужість',
    gloss: { en: 'indifference', uk: 'байдужість' },
    layer: 'coined',
    origin: { en: 'coined, 19th c.', uk: 'вигадане, XIX ст.' },
    story: {
      en: 'Another of the deliberate 19th-century coinages — proof that a language is a living, made thing.',
      uk: 'Ще одне зі свідомих витворів XIX століття — доказ, що мова є живою, твореною річчю.',
    },
    bornHere: true,
  },
];

// ── The tappable sentence ───────────────────────────────────────────────────
// "козак на майдані п'є каву під дахом" — in one phrase, four empires hand you
// their business cards (article). The four content words are borrowings; на/п'є/під
// are the native Slavic frame.
//
// NOTE: каву (кава) is one of the article's "four empires", but THIS article does
// not give its etymology. Its full route (Arabic qahwa → Turkish kahve → кава) is
// in the traveling-words article; here it is tagged Turkic (Ottoman) as the
// immediate donor, cross-referenced rather than re-derived. TODO(seva): confirm
// the layer you want shown for кава in this article's context.
export interface SentenceToken {
  text: string;
  /** Omitted for spacing/punctuation. */
  layer?: LayerId;
  note?: Record<Lang, string>;
}

export const SENTENCE: SentenceToken[] = [
  {
    text: 'козак',
    layer: 'turkic',
    note: { en: 'Turkic — from the steppe frontier.', uk: 'Тюркське — зі степового прикордоння.' },
  },
  {
    text: 'на',
    layer: 'pie',
    note: { en: 'Native Slavic frame — inherited, not borrowed.', uk: 'Питомий слов’янський каркас — успадковане, не запозичене.' },
  },
  {
    text: 'майдані',
    layer: 'turkic',
    note: { en: 'Turkic (steppe frontier) — майдан.', uk: 'Тюркське (степове прикордоння) — майдан.' },
  },
  {
    text: "п'є",
    layer: 'pie',
    note: { en: 'Native Slavic frame — the inherited verb пити.', uk: 'Питомий слов’янський каркас — успадковане дієслово пити.' },
  },
  {
    text: 'каву',
    layer: 'turkic',
    note: {
      en: 'A borrowing via Ottoman Turkish kahve (full route in the borrowing article).',
      uk: 'Запозичення через османсько-турецьке kahve (повний маршрут — у статті про мандрівні слова).',
    },
  },
  {
    text: 'під',
    layer: 'pie',
    note: { en: 'Native Slavic frame — inherited preposition.', uk: 'Питомий слов’янський каркас — успадкований прийменник.' },
  },
  {
    text: 'дахом',
    layer: 'german',
    note: { en: 'German Dach, via Polish — дах.', uk: 'Німецьке Dach, через польську — дах.' },
  },
];
