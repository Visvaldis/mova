// Content data for the `name-map` interactive (article: names-and-places).
// Every etymology, gloss and date below is taken from the article; gaps the
// article does not fill are marked TODO(seva) and surfaced honestly in the UI.
//
// Three datasets:
//   1. TOPONYMS / UKRAINE_OUTLINE — a schematic map of Ukraine + place names.
//   2. MONTHS — the 12-month wheel (Roman vs nature calendar).
//   3. SURNAMES — occupational surname twins.

import type { Lang } from '../../i18n/ui';

type Bi = Record<Lang, string>;

/* ── 1. Toponyms ──────────────────────────────────────────────────────────
   A self-contained equirectangular projection for Ukraine (decoupled from the
   world map in lib/geo). Bounds chosen to frame the mainland + Crimea; the
   pixels-per-degree are corrected by cos(mid-latitude) so the shape isn't
   stretched. The outline is a hand-simplified national border — schematic, not
   survey-grade, but recognisably Ukraine with Crimea. */

const LON_MIN = 21.5;
const LON_MAX = 40.5;
const LAT_MIN = 43.8;
const LAT_MAX = 52.7;
export const UA_VIEW = { w: 750, h: 528 };

export function uaProject(lat: number, lon: number): { x: number; y: number } {
  const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * UA_VIEW.w;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * UA_VIEW.h;
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

/** Simplified Ukraine border, [lat, lon], traced clockwise from the NW. */
export const UKRAINE_OUTLINE: [number, number][] = [
  // north (Belarus), west → east
  [51.6, 23.6], [51.9, 24.4], [51.5, 26.2], [51.9, 28.0], [51.5, 30.4],
  [52.0, 31.6], [52.3, 32.3],
  // east (Russia), north → south
  [51.3, 34.2], [50.4, 35.4], [50.0, 36.3], [49.9, 37.6], [49.9, 38.9],
  [49.6, 40.1], [48.6, 39.9], [48.0, 39.7], [47.6, 38.8], [47.1, 38.2],
  // Sea of Azov mainland coast, east → west
  [46.9, 37.0], [46.7, 35.9], [46.3, 35.0], [46.15, 34.0],
  // Crimea — dip south, loop the peninsula, return to the Perekop neck
  [45.5, 35.4], [45.3, 36.5], [44.8, 35.0], [44.4, 34.1], [44.6, 33.5],
  [45.3, 32.6], [45.9, 33.5], [46.15, 33.7],
  // Black Sea mainland coast, east → west
  [46.6, 32.0], [46.6, 31.0], [46.45, 30.7], [45.9, 30.1], [45.4, 29.7],
  // south-west border (Moldova / Romania) → up
  [47.8, 27.5], [48.3, 26.6], [48.1, 24.5],
  // west border (Carpathians / Zakarpattia)
  [47.95, 22.9], [48.1, 22.1], [49.0, 22.6], [49.6, 22.9], [50.4, 23.6],
];

export interface Toponym {
  id: string;
  name: string; // shown verbatim (a Ukrainian place name)
  lat: number;
  lon: number;
  origin: Bi; // short origin-layer tag
  story: Bi;
}

export const TOPONYMS: Toponym[] = [
  {
    id: 'kyiv',
    name: 'Київ',
    lat: 50.45,
    lon: 30.52,
    origin: { en: 'Slavic', uk: 'Слов’янська' },
    story: {
      en: 'Per the Primary Chronicle, Kyiv is “Kyi’s town” — founded by three brothers, Kyi, Shchek and Khoryv, and their sister Lybid. The old possessive suffix -iv still answers the question buried in the name: whose city? Kyi’s.',
      uk: 'За Повістю временних літ, Київ — «місто Кия», засноване трьома братами (Кий, Щек, Хорив) і сестрою Либіддю. Давній присвійний суфікс -ів досі відповідає на питання, сховане в назві: чиє місто? Києве.',
    },
  },
  {
    id: 'dnipro',
    name: 'Дніпро',
    lat: 48.46,
    lon: 35.04,
    origin: { en: 'Iranian (Scythian)', uk: 'Іранська (скіфська)' },
    story: {
      en: 'The river’s name is Iranian — Scythian water-naming that has outlasted the Scythians themselves by well over two thousand years.',
      uk: 'Назва річки — іранська: скіфське називання води, що пережило самих скіфів більш ніж на дві тисячі років.',
    },
  },
  {
    id: 'krym',
    name: 'Крим',
    lat: 45.0,
    lon: 34.1,
    origin: { en: 'Turkic', uk: 'Тюркська' },
    story: {
      en: 'Crimea’s name is Turkic — one layer among the many peoples who have named this peninsula.',
      uk: 'Назва Криму — тюркська: один із багатьох шарів народів, що давали імена цьому півострову.',
    },
  },
  {
    id: 'odesa',
    name: 'Одеса',
    lat: 46.48,
    lon: 30.73,
    origin: { en: 'Greek', uk: 'Грецька' },
    story: {
      en: 'Odesa is a Greek revival name, chosen by decree — a deliberate classical flourish rather than an inherited word.',
      uk: 'Одеса — грецька назва-відродження, обрана указом: свідомий класичний жест, а не успадковане слово.',
    },
  },
];

/** The "-слав / -город" naming pattern. TODO(seva): the article describes the
    pattern but names no specific towns, so this is a card, not a map pin. */
export const SLAV_HOROD = {
  name: '-слав / -город',
  origin: { en: 'Slavic', uk: 'Слов’янська' } as Bi,
  story: {
    en: 'Dozens of Ukrainian town names end in -слав or -город — pure Slavic word-building, the bedrock layer of the map. (The article describes the pattern but names no specific towns.)',
    uk: 'Десятки українських міст закінчуються на -слав або -город — чиста слов’янська словотворчість, корінний шар мапи. (Стаття описує патерн, але не називає конкретних міст.)',
  } as Bi,
};

/** Україна — the contested name of the country itself, presented with both
    views fairly (per the article). */
export const UKRAINA_DEBATE = {
  name: 'Україна',
  views: [
    {
      label: { en: '“Borderland” (окраїна)', uk: '«Окраїна» (прикордоння)' } as Bi,
      text: {
        en: 'The traditional reading ties Україна to окраїна, “borderland” — a frame imperial politics was happy to amplify.',
        uk: 'Традиційне прочитання пов’язує «Україна» з «окраїна», прикордонням, — рамка, яку охоче підсилювала імперська політика.',
      } as Bi,
    },
    {
      label: { en: '“Land, country” (країна)', uk: '«Земля, край» (країна)' } as Bi,
      text: {
        en: 'Ukrainian linguists, notably Hryhoriy Pivtorak, argue країна / у-країна simply meant “land, one’s own territory” — from краяти, “to cut”: a cut-out portion of land. It appears in chronicles from 1187.',
        uk: 'Українські мовознавці, насамперед Григорій Півторак, доводять: «країна / у-країна» означало просто «земля, своя територія» — від «краяти»: викроєна ділянка землі. Засвідчене в літописах від 1187 року.',
      } as Bi,
    },
  ],
  note: {
    en: 'Etymology is never politically neutral when empires are involved.',
    uk: 'Етимологія ніколи не буває політично нейтральною, коли поруч імперії.',
  } as Bi,
};

/* ── 2. Months ────────────────────────────────────────────────────────────
   The wheel toggles between the English (Roman) names and the Ukrainian
   (nature) names. A gloss is shown only where the article supplies one; the
   rest are left blank on purpose (see TODO list). */

export interface Month {
  en: string;
  uk: string;
  enGloss?: Bi; // meaning of the English (Roman) name, per the article
  ukGloss?: Bi; // meaning of the Ukrainian (nature) name, per the article
}

export const MONTHS: Month[] = [
  {
    en: 'January',
    uk: 'січень',
    enGloss: {
      en: 'Janus — the two-faced Roman god of doorways and beginnings',
      uk: 'Янус — дволикий римський бог дверей і початків',
    },
    ukGloss: { en: 'from січе — “it cuts” (frost, or timber)', uk: 'від «січе» — морозом чи лісом' },
  },
  {
    en: 'February',
    uk: 'лютий',
    // enGloss TODO(seva): article does not gloss February.
    ukGloss: { en: '“the fierce one” — лютує', uk: '«лютий» — лютує' },
  },
  {
    en: 'March',
    uk: 'березень',
    enGloss: { en: 'Mars — the Roman god of war', uk: 'Марс — римський бог війни' },
    ukGloss: { en: 'birch-time — береза', uk: 'час беріз — береза' },
  },
  {
    en: 'April',
    uk: 'квітень',
    // enGloss TODO(seva): article does not gloss April.
    ukGloss: { en: 'blossom-time — квітне', uk: 'пора цвітіння — квітне' },
  },
  {
    en: 'May',
    uk: 'травень',
    // enGloss TODO(seva): article does not gloss May.
    ukGloss: { en: 'grass — трава', uk: 'трави — трава' },
  },
  {
    en: 'June',
    uk: 'червень',
    // enGloss + ukGloss TODO(seva): article does not gloss June / червень.
  },
  {
    en: 'July',
    uk: 'липень',
    enGloss: { en: 'Julius Caesar', uk: 'Юлій Цезар' },
    // ukGloss TODO(seva): article does not gloss липень.
  },
  {
    en: 'August',
    uk: 'серпень',
    enGloss: { en: 'Augustus Caesar', uk: 'Август Цезар' },
    ukGloss: { en: 'the sickle of harvest — серп', uk: 'серп жнив — серп' },
  },
  {
    en: 'September',
    uk: 'вересень',
    enGloss: {
      en: '“seventh” — a fossil of the old ten-month calendar',
      uk: '«сьомий» — скам’янілість старого десятимісячного календаря',
    },
    // ukGloss TODO(seva): article does not gloss вересень.
  },
  {
    en: 'October',
    uk: 'жовтень',
    enGloss: { en: '“eighth” (old ten-month calendar)', uk: '«восьмий» (старий десятимісячний календар)' },
    ukGloss: { en: 'the yellowing — жовтіє', uk: 'жовтить листя — жовтий' },
  },
  {
    en: 'November',
    uk: 'листопад',
    enGloss: { en: '“ninth” (old ten-month calendar)', uk: '«дев’ятий» (старий десятимісячний календар)' },
    ukGloss: { en: 'leaf-fall — листя падає', uk: 'падолист — листя падає' },
  },
  {
    en: 'December',
    uk: 'грудень',
    enGloss: { en: '“tenth” (old ten-month calendar)', uk: '«десятий» (старий десятимісячний календар)' },
    // ukGloss TODO(seva): article does not gloss грудень.
  },
];

/* ── 3. Surnames ──────────────────────────────────────────────────────────
   Occupational twins. Baker has no Ukrainian partner in the article — kept as
   an open "?" card rather than inventing one (TODO(seva)). */

export interface SurnamePair {
  id: string;
  en: string;
  uk: string; // '?' when the article leaves it open
  trade?: Bi; // the shared occupation
  open?: boolean;
  note?: Bi; // explanation for the open case
}

export const SURNAMES: SurnamePair[] = [
  {
    id: 'smith',
    en: 'Smith',
    uk: 'Коваль',
    trade: { en: 'the one who works metal', uk: 'той, що кує метал' },
  },
  {
    id: 'miller',
    en: 'Miller',
    uk: 'Мельник',
    trade: { en: 'the one who grinds grain', uk: 'той, що меле зерно' },
  },
  {
    id: 'baker',
    en: 'Baker',
    uk: '?',
    open: true,
    note: {
      en: 'The article doesn’t name the Ukrainian twin for Baker. (Пекар — “baker” — is the natural guess, but that isn’t from the article.)',
      uk: 'Стаття не називає українського відповідника для Baker. («Пекар» — природний здогад, але це не зі статті.)',
    },
  },
];

export const SURNAMES_PAYOFF: Bi = {
  en: 'Across Europe, the commonest surname is just “the one who works metal,” in twenty languages.',
  uk: 'По всій Європі найпоширеніше прізвище — це просто «той, що кує метал», двадцятьма мовами.',
};
