// Content data for the `accent-atlas` interactive (article: dialects-and-accents).
//
// SOURCING: every claim traces to content/en/dialects-and-accents.md. There is
// no content/uk/dialects-and-accents.md yet, so the Ukrainian strings below are
// faithful translations of the article-sourced English — the component is built
// bilingual via `lang`, but the UK *page* (and the toggle to it) won't exist
// until Seva writes the UK article. Gaps the article does not fill are TODO(seva).
//
// Three datasets, one per tab:
//   1. DIALECT_ZONES / SURZHYK — the three dialect groups on a schematic map.
//   2. CONTINUUM_CASES         — real "dialect vs language" cases from the article.
//   3. SHIBBOLETH              — the паляниця password + the Biblical original.

import type { Lang } from '../../i18n/ui';
// Reuse NameMap's self-contained Ukraine projection so we don't duplicate the
// hand-traced national border.
import { UKRAINE_OUTLINE, UA_VIEW, uaProject } from './nameMap.data';

export { UKRAINE_OUTLINE, UA_VIEW, uaProject };

type Bi = Record<Lang, string>;

/* ── 1. Dialect zones ───────────────────────────────────────────────────────
   The article names three groups and their rough geography (northern across the
   marshes, southwestern in the Carpathians, southeastern as the standard base)
   but gives NO survey-grade isoglosses. The polygons below are therefore
   SCHEMATIC — they convey "three regions", not exact borders (surfaced in the
   UI caption). [lat, lon], clockwise. */

export interface DialectZone {
  id: 'north' | 'southwest' | 'southeast';
  name: Bi;
  short: Bi; // compact label drawn on the map
  poly: [number, number][];
  labelAt: [number, number]; // [lat, lon]
  features: Bi;
  varieties?: Bi; // named sub-dialects, where the article lists them
}

export const DIALECT_ZONES: DialectZone[] = [
  {
    id: 'north',
    name: { en: 'Northern (Polissian)', uk: 'Північне (поліське)' },
    short: { en: 'Northern', uk: 'Північне' },
    poly: [
      [51.6, 23.6], [51.9, 28.0], [52.0, 31.6], [52.3, 32.3], [51.3, 34.2],
      [50.6, 34.0], [50.4, 30.5], [50.3, 27.0], [50.4, 24.0],
    ],
    labelAt: [51.3, 28.5],
    features: {
      en: 'Spoken across the northern marshes, these dialects share features with Belarusian — proof that the continuum doesn’t stop politely at the national border.',
      uk: 'Поширені на північних болотах, ці говірки мають спільні риси з білоруською — доказ, що континуум не зупиняється ввічливо на державному кордоні.',
    },
  },
  {
    id: 'southwest',
    name: { en: 'Southwestern', uk: 'Південно-західне' },
    short: { en: 'Southwestern', uk: 'Пд.-західне' },
    poly: [
      [50.4, 24.0], [50.3, 27.0], [48.5, 27.5], [47.8, 27.5], [48.3, 26.6],
      [48.1, 24.5], [47.95, 22.9], [48.1, 22.1], [49.0, 22.6], [49.6, 22.9], [50.4, 23.6],
    ],
    labelAt: [48.7, 24.2],
    features: {
      en: 'The most diverse group — Hutsul, Boyko, Lemko and Transcarpathian — famous for archaisms and a mountain-valley variety so deep that some argue Rusyn is a language in its own right (see: army and navy).',
      uk: 'Найрозмаїтіша група — гуцульське, бойківське, лемківське й закарпатське — відома архаїзмами та гірсько-долинним розмаїттям, таким глибоким, що дехто вважає русинську окремою мовою (див.: армія і флот).',
    },
    varieties: {
      en: 'Hutsul · Boyko · Lemko · Transcarpathian',
      uk: 'гуцульське · бойківське · лемківське · закарпатське',
    },
  },
  {
    id: 'southeast',
    name: { en: 'Southeastern', uk: 'Південно-східне' },
    short: { en: 'Southeastern', uk: 'Пд.-східне' },
    poly: [
      [50.3, 27.0], [50.4, 30.5], [50.6, 34.0], [49.9, 37.6], [49.6, 40.1],
      [48.6, 39.9], [47.6, 38.8], [47.1, 38.2], [46.9, 37.0], [46.3, 35.0],
      [46.15, 34.0], [45.5, 35.4], [44.8, 35.0], [44.4, 34.1], [45.3, 32.6],
      [46.15, 33.7], [46.6, 32.0], [46.45, 30.7], [45.9, 30.1], [45.4, 29.7],
      [47.8, 27.5], [48.5, 27.5],
    ],
    labelAt: [48.4, 34.5],
    features: {
      en: 'The youngest and most uniform group — and the base standard Ukrainian is built on. “Standard” never meant better grammar; it’s simply the dialect that got the schoolbooks.',
      uk: 'Наймолодша й найоднорідніша група — і основа, на якій збудовано літературну українську. «Стандарт» ніколи не означав кращу граматику: це просто говірка, що отримала підручники.',
    },
  },
];

/** Surzhyk — not a region but a reality the article foregrounds. Presented as a
    chip beside the map, not a map zone. */
export const SURZHYK = {
  name: { en: 'Surzhyk', uk: 'Суржик' } as Bi,
  tag: { en: 'a mixed lect, not a region', uk: 'мішана говірка, не регіон' } as Bi,
  features: {
    en: 'The Ukrainian-Russian mixed speech of millions. Long shamed as “impurity,” it is now studied (notably by Laada Bilaniuk) as exactly what it is: a predictable outcome of contact and pressure. Mixed lects are not decay — they are sociolinguistic evidence.',
    uk: 'Українсько-російське мішане мовлення мільйонів. Довго ганьблене як «нечистота», нині воно вивчається (зокрема Ладою Біланюк) як те, чим є насправді: передбачуваний наслідок контакту й тиску. Мішані говірки — не занепад, а соціолінгвістичний доказ.',
  } as Bi,
};

/* ── 2. "Dialect vs language" — real cases from the article ──────────────────
   The continuum slider (below) is an explicit visual metaphor; these four cases
   are the article's actual evidence that the dialect/language line is political,
   not linguistic. */

export interface ContinuumCase {
  id: string;
  pair: Bi; // what's being compared
  verdict: Bi; // the "label" politics assigns
  reality: Bi; // what linguistics sees
  flips: 'splits' | 'lumps'; // splits one continuum, or lumps unintelligible ones
}

export const CONTINUUM_CASES: ContinuumCase[] = [
  {
    id: 'scandinavian',
    pair: { en: 'Danish · Norwegian · Swedish', uk: 'данська · норвезька · шведська' },
    verdict: { en: 'three separate languages', uk: 'три окремі мови' },
    reality: {
      en: 'Danes, Norwegians and Swedes converse across the borders — one smooth continuum, three flags.',
      uk: 'Данці, норвежці й шведи розуміють одне одного через кордони — один плавний континуум, три прапори.',
    },
    flips: 'splits',
  },
  {
    id: 'chinese',
    pair: { en: 'the “dialects” of Chinese', uk: '«діалекти» китайської' },
    verdict: { en: 'one language', uk: 'одна мова' },
    reality: {
      en: 'Many of them are mutually unintelligible — by the folk test they’d be separate languages. One flag, many tongues.',
      uk: 'Багато з них взаємно незрозумілі — за народним критерієм це були б окремі мови. Один прапор, багато мов.',
    },
    flips: 'lumps',
  },
  {
    id: 'german',
    pair: { en: 'Bavarian · Hamburg German', uk: 'баварська · гамбурзька німецька' },
    verdict: { en: 'one German', uk: 'одна німецька' },
    reality: {
      en: 'A Bavarian and a Hamburger can defeat each other inside “one” German.',
      uk: 'Баварець і гамбуржець можуть не зрозуміти одне одного всередині «однієї» німецької.',
    },
    flips: 'lumps',
  },
  {
    id: 'ukrainian',
    pair: { en: 'Ukrainian, per the empires', uk: 'українська, очима імперій' },
    verdict: { en: 'a “dialect” of Russian', uk: '«діалект» російської' },
    reality: {
      en: 'Calling Ukrainian a “dialect” was never a linguistic claim — only a political one wearing a lab coat.',
      uk: 'Називати українську «діалектом» — ніколи не було лінгвістичним твердженням, лише політичним у халаті науковця.',
    },
    flips: 'lumps',
  },
];

/** The continuum slider's labels. The gradient itself is an explicit metaphor
    (a smooth colour ramp = speech blending village to village), NOT sampled
    dialect data — stated plainly in the UI. */
export const CONTINUUM = {
  villages: 9,
  cityA: { en: 'City A', uk: 'Місто А' } as Bi,
  cityB: { en: 'City B', uk: 'Місто Б' } as Bi,
  langA: { en: 'Language A', uk: 'Мова А' } as Bi,
  langB: { en: 'Language B', uk: 'Мова Б' } as Bi,
};

/* ── 3. The shibboleth ──────────────────────────────────────────────────────
   паляниця, and the Biblical original. The betraying rendering "palyanitsa" is
   the article's own transliteration; the two tells (и, ц) are named verbatim. */

export interface ShibTell {
  ch: string; // the grapheme that betrays a non-native
  label: Bi;
  note: Bi;
}

export const SHIBBOLETH = {
  word: 'паляниця',
  // how Russian speakers reliably render it — the articles' own transliterations
  betrays: { en: 'palyanitsa', uk: 'палянітса' } as Bi,
  tells: [
    {
      ch: 'и',
      label: { en: 'the Ukrainian и', uk: 'українська и' },
      note: {
        en: 'The Ukrainian и is trivial for natives and treacherous for everyone else — it slides toward an “ee”, and out comes “-nitsa”.',
        uk: 'Українська и — дрібниця для носіїв і пастка для решти: вона з’їжджає в «і», і виходить «-ніца».',
      },
    },
    {
      ch: 'ц',
      label: { en: 'the soft ц', uk: 'м’яка ц' },
      note: {
        en: 'The soft ц is the second tell — easy if it’s in your first language, oddly hard if it isn’t.',
        uk: 'М’яка ц — другий маркер: легка, якщо вона є в твоїй першій мові, і дивно важка, якщо ні.',
      },
    },
  ] as ShibTell[],
  payoff: {
    en: 'A one-word border control: the phonology of a first language that no spy training quite erases.',
    uk: 'Прикордонний контроль завдовжки в одне слово: фонологія першої мови, яку не стирає жодне навчання шпигуна.',
  } as Bi,
  biblical: {
    en: 'The word shibboleth itself comes from the Bible: the Gileadites identified Ephraimites by their inability to say the “sh” sound — accents used as passwords for three thousand years.',
    uk: 'Саме слово «шиболет» — із Біблії: гілеадці впізнавали єфремлян за нездатністю вимовити звук «ш». Акценти як паролі — уже три тисячі років.',
  } as Bi,
};

/* ── Framing strings shared across tabs (article's thesis & pull-quote) ─────── */
export const FRAMING = {
  everyoneAccent: {
    en: 'You have an accent. So does everyone. “Accentless” speech is just the accent that holds the microphone.',
    uk: 'Ви маєте акцент. Як і всі. «Безакцентне» мовлення — просто акцент, що тримає мікрофон.',
  } as Bi,
  pullQuote: {
    en: 'Nobody speaks “the language.” Everybody speaks a dialect of it — including you, the news anchor, and the dictionary’s editors.',
    uk: 'Ніхто не говорить «мовою». Усі говорять її діалектом — і ви, і диктор новин, і редактори словника.',
  } as Bi,
};
