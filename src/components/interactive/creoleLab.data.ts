// Data for the creole-lab interactive.
// Everything traces to content/{en,uk}/new-languages.md.
//
// What the article gives us directly:
//   • Nicaragua: before 1977 deaf kids had only family "home signs"; schools
//     opened in Managua; the lip-reading/Spanish method failed, the playground
//     succeeded. Hundreds pooled their home signs into a rough common system.
//   • The SECOND cohort transformed it: faster, more fluid, and grammatical —
//     "consistent word order, verb agreement, spatial grammar to track who did
//     what to whom."
//   • Decomposition: older signers expressed "rolling down" as one holistic
//     gesture; younger ones broke it into discrete parts — roll + down —
//     "recombinable like words" (the combinatorial signature of language).
//   • NSL/ISN is now a full language with native signers and poetry.
//   • Pidgin = a stripped-down code built by ADULTS thrown together without a
//     common language: small vocabulary, little grammar, nobody's mother tongue.
//   • Creole = what CHILDREN make of a pidgin they grow up on: a complete
//     natural language with stable grammar.
//   • Named contact languages: Haitian Creole, Tok Pisin (Papua New Guinea),
//     Jamaican Patois, and Nicaraguan Sign Language.
//   • Bickerton's "bioprogram" (innate default grammar) is debated; creolists
//     point instead to continuity from the parent languages.
import type { Lang } from '../../i18n/ui';

/* ----------------------------------------------------------------
   (a) Generation simulator — the SAME message at three stages.

   The grammatical features shown (holistic→discrete decomposition,
   shared vocabulary, fixed word order, verb agreement / spatial grammar
   for "who did what to whom") are all article-stated. The concrete scene
   below is an illustrative vehicle for those features.
   ---------------------------------------------------------------- */

export const SCENE: Record<Lang, string> = {
  en: 'A girl rolls a ball down to a boy.',
  uk: 'Дівчинка котить м’яч униз до хлопчика.',
};

export type StageId = 'homesign' | 'pidgin' | 'creole';
export type ChipRole = 'agent' | 'object' | 'verb' | 'dir' | 'recipient' | 'holistic';

export interface Chip {
  key: string;
  label: Record<Lang, string>;
  glyph: string;
  role: ChipRole;
  /** Highlight: newly added or newly split at this stage. */
  isNew?: boolean;
}

export interface Stage {
  id: StageId;
  /** The article's term for this layer. */
  name: Record<Lang, string>;
  /** Who builds it. */
  cohort: Record<Lang, string>;
  layout: 'scatter' | 'string' | 'grammar';
  chips: Chip[];
  /** Spatial-grammar arc (creole only): the verb moves from→to through space. */
  agreement?: { from: string; to: string };
  note: Record<Lang, string>;
  /** Is "who did what to whom" recoverable from the form alone? */
  ambiguous: boolean;
  /** What this cohort added vs. the previous one (article-sourced). */
  added: Array<Record<Lang, string>>;
}

export const STAGES: Stage[] = [
  {
    id: 'homesign',
    name: { en: 'Home signs', uk: 'Домашні жести' },
    cohort: { en: 'Isolated children', uk: 'Ізольовані діти' },
    layout: 'scatter',
    chips: [
      { key: 'girl', glyph: '👧', role: 'agent', label: { en: 'girl?', uk: 'дівчинка?' } },
      {
        key: 'event',
        glyph: '🌀',
        role: 'holistic',
        label: { en: 'rolls-down-to-someone', uk: 'котить-униз-до-когось' },
      },
      { key: 'boy', glyph: '👦', role: 'recipient', label: { en: 'boy?', uk: 'хлопчик?' } },
    ],
    note: {
      en: 'Before the schools, each deaf child has only private home signs. The whole event is one holistic gesture; who did what to whom is guessed from context, not built into any code.',
      uk: 'До шкіл кожна глуха дитина має лише власні домашні жести. Уся подія — один цілісний жест; хто що кому зробив, угадують із контексту, а не з самого коду.',
    },
    ambiguous: true,
    added: [],
  },
  {
    id: 'pidgin',
    name: { en: 'Pidgin', uk: 'Піджин' },
    cohort: { en: 'First cohort', uk: 'Перша когорта' },
    layout: 'string',
    chips: [
      { key: 'girl', glyph: '👧', role: 'agent', label: { en: 'girl', uk: 'дівчинка' }, isNew: true },
      { key: 'ball', glyph: '⚪', role: 'object', label: { en: 'ball', uk: 'м’яч' }, isNew: true },
      {
        key: 'rolldown',
        glyph: '🌀',
        role: 'holistic',
        label: { en: 'roll-down', uk: 'котити-вниз' },
        isNew: true,
      },
      { key: 'boy', glyph: '👦', role: 'recipient', label: { en: 'boy', uk: 'хлопчик' }, isNew: true },
    ],
    note: {
      en: 'Thrown together, the first cohort pools everyone’s home signs into one rough system — a telegraphic word string. The vocabulary is now shared, but order is loose and “roll-down” is still one lump; who rolled to whom stays ambiguous.',
      uk: 'Опинившись разом, перша когорта зливає домашні жести в одну грубу систему — телеграфний рядок слів. Словник тепер спільний, але порядок хисткий, а «котити-вниз» досі один згусток; хто кому котить — лишається неоднозначним.',
    },
    ambiguous: true,
    added: [
      {
        en: 'A shared vocabulary — home signs pooled into one common system.',
        uk: 'Спільний словник — домашні жести злито в одну спільну систему.',
      },
      {
        en: 'A rough word string: small vocabulary, little grammar, nobody’s mother tongue.',
        uk: 'Грубий рядок слів: малий словник, майже без граматики, нічия рідна мова.',
      },
    ],
  },
  {
    id: 'creole',
    name: { en: 'Creole / NSL', uk: 'Креол / НЖМ' },
    cohort: { en: 'Second cohort', uk: 'Друга когорта' },
    layout: 'grammar',
    chips: [
      { key: 'girl', glyph: '👧', role: 'agent', label: { en: 'girl', uk: 'дівчинка' } },
      { key: 'roll', glyph: '🔄', role: 'verb', label: { en: 'roll', uk: 'котити' }, isNew: true },
      { key: 'down', glyph: '⬇️', role: 'dir', label: { en: 'down', uk: 'вниз' }, isNew: true },
      { key: 'ball', glyph: '⚪', role: 'object', label: { en: 'ball', uk: 'м’яч' } },
      { key: 'boy', glyph: '👦', role: 'recipient', label: { en: 'boy', uk: 'хлопчик' } },
    ],
    agreement: { from: 'girl', to: 'boy' },
    note: {
      en: 'The second cohort makes it grammatical: a consistent word order, the holistic gesture split into discrete parts (roll + down), and spatial grammar — the verb moves girl→boy, so who did what to whom is built into the language itself.',
      uk: 'Друга когорта робить її граматичною: стабільний порядок слів, цілісний жест розпадається на дискретні частини (котити + вниз), і просторова граматика — дієслово рухається дівчинка→хлопчик, тож хто що кому зробив вшито в саму мову.',
    },
    ambiguous: false,
    added: [
      {
        en: 'Consistent word order.',
        uk: 'Стабільний порядок слів.',
      },
      {
        en: 'Verb agreement & spatial grammar — the sign moves girl→boy, marking who did what to whom.',
        uk: 'Узгодження дієслова й просторова граматика — жест рухається дівчинка→хлопчик, позначаючи, хто що кому зробив.',
      },
      {
        en: 'Holistic gestures split into discrete, recombinable parts: roll + down.',
        uk: 'Цілісні жести розпадаються на дискретні, комбіновані частини: котити + вниз.',
      },
    ],
  },
];

/* ----------------------------------------------------------------
   (b) Map of newborn / contact languages named in the article.

   Coordinates are only for placing a dot (equirectangular projection,
   x = lon + 180, y = 90 − lat). Origin + type are article-sourced.

   TODO(seva): the article names these four contact languages but does NOT
   name the specific parent languages of the three spoken creoles (it only
   says creolists trace "continuity from the parent languages" in general).
   `parents` below carries that article-true generic line; if you want the
   specific source languages (e.g. French/West-African for Haitian Creole,
   English-lexified for Tok Pisin & Jamaican Patois) add them to an article
   first, then surface them here.
   ---------------------------------------------------------------- */

export type ContactType = 'sign' | 'creole';

export interface ContactLang {
  id: string;
  name: Record<Lang, string>;
  place: Record<Lang, string>;
  lat: number;
  lon: number;
  type: ContactType;
  origin: Record<Lang, string>;
  parents: Record<Lang, string>;
}

export const CONTACT: ContactLang[] = [
  {
    id: 'nsl',
    name: { en: 'Nicaraguan Sign Language (ISN)', uk: 'Нікарагуанська жестова мова (ISN)' },
    place: { en: 'Managua, Nicaragua', uk: 'Манагуа, Нікарагуа' },
    lat: 12.9,
    lon: -85.2,
    type: 'sign',
    origin: {
      en: 'Deaf children pooled their family home signs after schools opened in the late 1970s; the second cohort made it grammatical. The only time scientists watched a language emerge from nothing, in real time.',
      uk: 'Глухі діти злили домашні жести після відкриття шкіл наприкінці 1970-х; друга когорта зробила мову граматичною. Єдиний раз, коли науковці спостерігали виникнення мови з нічого в реальному часі.',
    },
    parents: {
      en: 'None spoken — built from scattered home signs, not from a parent language.',
      uk: 'Жодної усної — збудована зі скупчених домашніх жестів, а не з мови-батька.',
    },
  },
  {
    id: 'haitian',
    name: { en: 'Haitian Creole', uk: 'Гаїтянський креол' },
    place: { en: 'Haiti', uk: 'Гаїті' },
    lat: 18.9,
    lon: -72.3,
    type: 'creole',
    origin: {
      en: 'A pidgin built by adults thrown together around plantations and ports, then expanded by their children — who grew up on it — into a full creole with stable grammar.',
      uk: 'Піджин, що його збудували дорослі, зведені разом навколо плантацій і портів, а потім розгорнули в повний креол зі стабільною граматикою їхні діти, які на ньому виросли.',
    },
    parents: {
      en: 'Creolists trace continuity from the parent languages of the people brought together (the article does not name them individually).',
      uk: 'Креолісти простежують спадковість від мов-батьків зведених разом людей (стаття не називає їх поіменно).',
    },
  },
  {
    id: 'tokpisin',
    name: { en: 'Tok Pisin', uk: 'Ток-пісін' },
    place: { en: 'Papua New Guinea', uk: 'Папуа-Нова Гвінея' },
    lat: -6.3,
    lon: 144.0,
    type: 'creole',
    origin: {
      en: 'Began as a contact pidgin and, as children grew up speaking it, expanded into a full creole — one of the languages of Papua New Guinea today.',
      uk: 'Почався як контактний піджин і, коли діти зростали, говорячи ним, розгорнувся в повний креол — одна з мов Папуа-Нової Гвінеї сьогодні.',
    },
    parents: {
      en: 'Creolists trace continuity from the parent languages of the people brought together (the article does not name them individually).',
      uk: 'Креолісти простежують спадковість від мов-батьків зведених разом людей (стаття не називає їх поіменно).',
    },
  },
  {
    id: 'patois',
    name: { en: 'Jamaican Patois', uk: 'Ямайський патуа' },
    place: { en: 'Jamaica', uk: 'Ямайка' },
    lat: 18.1,
    lon: -77.3,
    type: 'creole',
    origin: {
      en: 'Carries the same origin story: a stripped-down pidgin among adults without a common language, turned by the next generation of children into a complete natural language.',
      uk: 'Несе ту саму історію походження: обдертий піджин серед дорослих без спільної мови, що його наступне покоління дітей перетворило на повноцінну природну мову.',
    },
    parents: {
      en: 'Creolists trace continuity from the parent languages of the people brought together (the article does not name them individually).',
      uk: 'Креолісти простежують спадковість від мов-батьків зведених разом людей (стаття не називає їх поіменно).',
    },
  },
];
