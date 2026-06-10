// Data for family-tree. Branch structure and the mother/three/night cognate
// device come from content/{en,uk}/language-families.md.
// TODO(seva): speaker counts and first-attestation dates are NOT in the article —
// they are rough public figures (Ethnologue-style ~L1+L2) added for the hover
// cards. Verify before publishing.
import type { Lang } from '../../i18n/ui';

export interface Leaf {
  id: string;
  name: Record<Lang, string>;
  extinct?: boolean;
  /** 'en' | 'uk' — the two "you are here" languages. */
  star?: 'en' | 'uk';
  speakers?: string; // rough, display-only
  attested?: Record<Lang, string>;
  /** mother / three / night (— = not confidently attested; see TODO note). */
  cognates: [string, string, string];
}

export interface Branch {
  id: string;
  name: Record<Lang, string>;
  extinct?: boolean;
  color: string;
  /** Rough geographic anchor for the schematic map view (0–100 viewbox %). */
  map: { x: number; y: number };
  leaves: Leaf[];
}

export const ROOT_NAME: Record<Lang, string> = {
  en: 'Proto-Indo-European (~5,000–6,000 years ago, Pontic-Caspian steppe)',
  uk: 'Праіндоєвропейська (~5 000–6 000 років тому, понтійсько-каспійський степ)',
};

export const BRANCHES: Branch[] = [
  {
    id: 'germanic',
    name: { en: 'Germanic', uk: 'Германська' },
    color: '#0d9488',
    map: { x: 38, y: 22 },
    leaves: [
      { id: 'english', name: { en: 'English', uk: 'Англійська' }, star: 'en', speakers: '~1.5B', attested: { en: '7th c. CE', uk: 'VII ст.' }, cognates: ['mother', 'three', 'night'] },
      { id: 'german', name: { en: 'German', uk: 'Німецька' }, speakers: '~130M', attested: { en: '8th c. CE', uk: 'VIII ст.' }, cognates: ['Mutter', 'drei', 'Nacht'] },
      { id: 'dutch', name: { en: 'Dutch', uk: 'Нідерландська' }, speakers: '~25M', attested: { en: '12th c. CE', uk: 'XII ст.' }, cognates: ['moeder', 'drie', 'nacht'] },
      { id: 'swedish', name: { en: 'Swedish', uk: 'Шведська' }, speakers: '~10M', attested: { en: '13th c. CE (runes earlier)', uk: 'XIII ст. (руни раніше)' }, cognates: ['moder', 'tre', 'natt'] },
    ],
  },
  {
    id: 'romance',
    name: { en: 'Romance (Italic)', uk: 'Романська (італьська)' },
    color: '#b45309',
    map: { x: 30, y: 42 },
    leaves: [
      { id: 'latin', name: { en: 'Latin', uk: 'Латина' }, extinct: true, attested: { en: '7th c. BCE', uk: 'VII ст. до н.е.' }, cognates: ['māter', 'trēs', 'nox'] },
      { id: 'spanish', name: { en: 'Spanish', uk: 'Іспанська' }, speakers: '~600M', attested: { en: '10th c. CE', uk: 'X ст.' }, cognates: ['madre', 'tres', 'noche'] },
      { id: 'french', name: { en: 'French', uk: 'Французька' }, speakers: '~320M', attested: { en: '9th c. CE', uk: 'IX ст.' }, cognates: ['mère', 'trois', 'nuit'] },
      { id: 'italian', name: { en: 'Italian', uk: 'Італійська' }, speakers: '~65M', attested: { en: '10th c. CE', uk: 'X ст.' }, cognates: ['madre', 'tre', 'notte'] },
      { id: 'romanian', name: { en: 'Romanian', uk: 'Румунська' }, speakers: '~24M', attested: { en: '16th c. CE', uk: 'XVI ст.' }, cognates: ['mamă', 'trei', 'noapte'] },
    ],
  },
  {
    id: 'baltoslavic',
    name: { en: 'Balto-Slavic', uk: 'Балто-слов’янська' },
    color: '#2563eb',
    map: { x: 52, y: 28 },
    leaves: [
      { id: 'ukrainian', name: { en: 'Ukrainian', uk: 'Українська' }, star: 'uk', speakers: '~40M', attested: { en: 'from Old East Slavic, 11th c. CE', uk: 'від давньоруської, XI ст.' }, cognates: ['мати', 'три', 'ніч'] },
      { id: 'polish', name: { en: 'Polish', uk: 'Польська' }, speakers: '~40M', attested: { en: '12th c. CE', uk: 'XII ст.' }, cognates: ['matka', 'trzy', 'noc'] },
      { id: 'czech', name: { en: 'Czech', uk: 'Чеська' }, speakers: '~11M', attested: { en: '12th c. CE', uk: 'XII ст.' }, cognates: ['matka', 'tři', 'noc'] },
      { id: 'serbian', name: { en: 'Serbian', uk: 'Сербська' }, speakers: '~8M', attested: { en: '12th c. CE', uk: 'XII ст.' }, cognates: ['мајка', 'три', 'ноћ'] },
      { id: 'lithuanian', name: { en: 'Lithuanian', uk: 'Литовська' }, speakers: '~3M', attested: { en: '16th c. CE', uk: 'XVI ст.' }, cognates: ['motina', 'trys', 'naktis'] },
      { id: 'latvian', name: { en: 'Latvian', uk: 'Латиська' }, speakers: '~1.5M', attested: { en: '16th c. CE', uk: 'XVI ст.' }, cognates: ['māte', 'trīs', 'nakts'] },
    ],
  },
  {
    id: 'indoiranian',
    name: { en: 'Indo-Iranian', uk: 'Індоіранська' },
    color: '#7c3aed',
    map: { x: 74, y: 52 },
    leaves: [
      { id: 'sanskrit', name: { en: 'Sanskrit', uk: 'Санскрит' }, extinct: true, attested: { en: '~15th c. BCE (Vedic)', uk: '~XV ст. до н.е. (ведійський)' }, cognates: ['mātár-', 'tráyas', 'nákt-'] },
      { id: 'hindi', name: { en: 'Hindi-Urdu', uk: 'Гінді-урду' }, speakers: '~600M', attested: { en: 'medieval', uk: 'середньовіччя' }, cognates: ['mātā', 'tīn', 'rāt'] },
      { id: 'bengali', name: { en: 'Bengali', uk: 'Бенгальська' }, speakers: '~270M', attested: { en: '~10th c. CE', uk: '~X ст.' }, cognates: ['mā', 'tin', 'rāt'] },
      { id: 'persian', name: { en: 'Persian', uk: 'Перська' }, speakers: '~80M', attested: { en: '6th c. BCE (Old Persian)', uk: 'VI ст. до н.е. (давньоперська)' }, cognates: ['mādar', 'se', 'šab'] },
    ],
  },
  {
    id: 'hellenic',
    name: { en: 'Hellenic', uk: 'Грецька' },
    color: '#db2777',
    map: { x: 48, y: 48 },
    leaves: [
      { id: 'greek', name: { en: 'Greek', uk: 'Грецька' }, speakers: '~13M', attested: { en: '~14th c. BCE (Linear B)', uk: '~XIV ст. до н.е. (лінійне письмо Б)' }, cognates: ['mitéra', 'tría', 'nýchta'] },
    ],
  },
  {
    id: 'celtic',
    name: { en: 'Celtic', uk: 'Кельтська' },
    color: '#65a30d',
    map: { x: 22, y: 26 },
    leaves: [
      { id: 'irish', name: { en: 'Irish', uk: 'Ірландська' }, speakers: '~1.9M (mostly L2)', attested: { en: '4th c. CE (ogham)', uk: 'IV ст. (огам)' }, cognates: ['máthair', 'trí', 'oíche'] },
      { id: 'welsh', name: { en: 'Welsh', uk: 'Валлійська' }, speakers: '~900K', attested: { en: '6th c. CE', uk: 'VI ст.' }, cognates: ['mam', 'tri', 'nos'] },
      { id: 'breton', name: { en: 'Breton', uk: 'Бретонська' }, speakers: '~200K', attested: { en: '8th c. CE', uk: 'VIII ст.' }, cognates: ['mamm', 'tri', 'noz'] },
    ],
  },
  {
    id: 'armenian',
    name: { en: 'Armenian', uk: 'Вірменська' },
    color: '#e11d48',
    map: { x: 60, y: 44 },
    leaves: [
      { id: 'armenian', name: { en: 'Armenian', uk: 'Вірменська' }, speakers: '~7M', attested: { en: '5th c. CE', uk: 'V ст.' }, cognates: ['mayr', 'erek’', 'gišer'] },
    ],
  },
  {
    id: 'albanian',
    name: { en: 'Albanian', uk: 'Албанська' },
    color: '#0891b2',
    map: { x: 45, y: 44 },
    leaves: [
      { id: 'albanian', name: { en: 'Albanian', uk: 'Албанська' }, speakers: '~7.5M', attested: { en: '15th c. CE', uk: 'XV ст.' }, cognates: ['nënë', 'tre', 'natë'] },
    ],
  },
  {
    id: 'anatolian',
    name: { en: 'Anatolian', uk: 'Анатолійська' },
    extinct: true,
    color: '#a16207',
    map: { x: 54, y: 50 },
    leaves: [
      { id: 'hittite', name: { en: 'Hittite', uk: 'Хетська' }, extinct: true, attested: { en: '~17th c. BCE — oldest attested IE', uk: '~XVII ст. до н.е. — найдавніша засвідчена ІЄ' }, cognates: ['—', 'teri-', 'nekuz'] },
    ],
  },
  {
    id: 'tocharian',
    name: { en: 'Tocharian', uk: 'Тохарська' },
    extinct: true,
    color: '#9333ea',
    map: { x: 88, y: 32 },
    leaves: [
      { id: 'tocharianb', name: { en: 'Tocharian B', uk: 'Тохарська Б' }, extinct: true, attested: { en: '5th–8th c. CE (Tarim Basin)', uk: 'V–VIII ст. (Таримська улоговина)' }, cognates: ['mācer', 'trai', '—'] },
    ],
  },
];

/** PIE forms shown in the cognate card header (from the article). */
export const PIE_FORMS: [string, string, string] = ['*méh₂tēr', '*tréyes', '*nókʷts'];
