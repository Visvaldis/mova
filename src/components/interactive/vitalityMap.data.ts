// Data for the vitality-map interactive.
// Everything traces to content/{en,uk}/language-death-and-revival.md.
//
// What the article gives us directly:
//   • ~7,000 living languages; linguists classify ~40% as endangered.
//   • "A language loses its last speaker every few weeks"; at current rates half
//     of today's languages may fall silent this century.
//   • Languages die by SHIFT, not by speakers dying: grandparents fluent →
//     parents understand but answer in the dominant language → children catch
//     only fragments. "Three generations is all it takes."
//   • Eyak / Marie Smith Jones: died January 21, 2008, in Anchorage, Alaska; the
//     last person on Earth who spoke Eyak, a language thousands of years old.
//   • Hebrew: in 1880 it had not been a mother tongue for ~1,700 years; Eliezer
//     Ben-Yehuda raised his son as the first native speaker in centuries, coined
//     thousands of words, pushed it into schools; within two generations it was a
//     society's native tongue — today ~9 million speakers. The only complete
//     revival of a language with zero native speakers.
//   • Revival ingredients: prestige (must feel like the future), schools, media,
//     state status — and above all the hardest, intergenerational use at home.
//     "A million apps cannot replace one grandmother."
//   • Mini-cases: Welsh (legal status, mandatory schooling, S4C TV — growing
//     among the young); Māori (kōhanga reo "language nests", elders immerse
//     preschoolers, model copied worldwide); Hawaiian (Pūnana Leo, same model);
//     Cornish & Manx (a "dead" language with good records can return to families);
//     Crimean Tatar (severely endangered after the 1944 deportation; intense
//     revival work — corpora, schooling, broadcasting — under the hardest
//     conditions).
import type { Lang } from '../../i18n/ui';

/* ----------------------------------------------------------------
   Headline figures (article-stated).
   ---------------------------------------------------------------- */
export const STATS = {
  living: 7000, // "~7,000 languages"
  endangeredPct: 40, // "around 40%"
};

/* ----------------------------------------------------------------
   (Left) Death — last-speaker story + the three-generation shift.

   TODO(seva): the article documents only ONE last-speaker story in detail
   (Eyak / Marie Smith Jones). More named last-speaker stories would each need
   to be added to an article first, then surfaced here.
   ---------------------------------------------------------------- */
export interface LastSpeaker {
  id: string;
  language: Record<Lang, string>;
  name: Record<Lang, string>;
  died: Record<Lang, string>;
  place: Record<Lang, string>;
  story: Record<Lang, string>;
}

export const LAST_SPEAKERS: LastSpeaker[] = [
  {
    id: 'eyak',
    language: { en: 'Eyak', uk: 'Еяк' },
    name: { en: 'Marie Smith Jones', uk: 'Марі Сміт Джонс' },
    died: { en: 'January 21, 2008', uk: '21 січня 2008 року' },
    place: { en: 'Anchorage, Alaska', uk: 'Анкоридж, Аляска' },
    story: {
      en: 'When Marie Smith Jones died, she was the last person on Earth who spoke Eyak. The language had existed for thousands of years; that morning, it stopped being anyone’s language at all.',
      uk: 'Коли померла Марі Сміт Джонс, вона була останньою людиною на Землі, що говорила мовою еяк. Мова існувала тисячі років; того ранку вона перестала бути будь-чиєю мовою взагалі.',
    },
  },
];

export interface ShiftStep {
  id: string;
  who: Record<Lang, string>;
  state: Record<Lang, string>;
  /** 0..1 — how much of the language this generation still carries. */
  fluency: number;
}

export const SHIFT: ShiftStep[] = [
  {
    id: 'grandparents',
    who: { en: 'Grandparents', uk: 'Дідусі й бабусі' },
    state: { en: 'Fluent', uk: 'Говорять вільно' },
    fluency: 1,
  },
  {
    id: 'parents',
    who: { en: 'Parents', uk: 'Батьки' },
    state: {
      en: 'Understand, but answer in the dominant language',
      uk: 'Розуміють, але відповідають домінантною мовою',
    },
    fluency: 0.5,
  },
  {
    id: 'children',
    who: { en: 'Children', uk: 'Діти' },
    state: { en: 'Catch only fragments', uk: 'Ловлять лише уривки' },
    fluency: 0.12,
  },
];

/* ----------------------------------------------------------------
   (Right) Revival — the Hebrew curve.

   Two article anchor points only: ≈0 native speakers in 1880 (not a mother
   tongue for ~1,700 years) → ~9 million today. The curve BETWEEN them is
   schematic (constant exponential growth = a straight line on the log axis),
   not measured year-by-year data. `endYear` only places the right edge; the UI
   labels it "today", never a specific year.
   ---------------------------------------------------------------- */
export const HEBREW = {
  startYear: 1880,
  endYear: 2025,
  startSpeakers: 0, // "had not been anyone’s mother tongue for ~1,700 years"
  endSpeakers: 9_000_000, // "around nine million speakers"
  dormantYears: 1700,
};

/* ----------------------------------------------------------------
   (Right) Mini-cases — other revivals named in the article.
   ---------------------------------------------------------------- */
export interface MiniCase {
  id: string;
  name: Record<Lang, string>;
  tag: Record<Lang, string>;
  detail: Record<Lang, string>;
}

export const MINI_CASES: MiniCase[] = [
  {
    id: 'welsh',
    name: { en: 'Welsh', uk: 'Валлійська' },
    tag: { en: 'growing among the young', uk: 'росте серед молоді' },
    detail: {
      en: 'Legal status, mandatory schooling, and the S4C television channel — Welsh is now growing among the young.',
      uk: 'Юридичний статус, обов’язкова школа і телеканал S4C — валлійська тепер росте серед молоді.',
    },
  },
  {
    id: 'maori',
    name: { en: 'Māori', uk: 'Маорі' },
    tag: { en: 'the language-nest model', uk: 'модель «мовних гнізд»' },
    detail: {
      en: 'Kōhanga reo — “language nests” where elders immerse preschoolers in the language. The model has been copied worldwide.',
      uk: 'Kōhanga reo — «мовні гнізда», де старші занурюють дошкільнят у мову. Модель скопіювали по всьому світу.',
    },
  },
  {
    id: 'hawaiian',
    name: { en: 'Hawaiian', uk: 'Гавайська' },
    tag: { en: 'Pūnana Leo nests', uk: 'гнізда Pūnana Leo' },
    detail: {
      en: 'Hawaiian built its own language nests — Pūnana Leo — on the Māori model.',
      uk: 'Гавайська створила власні мовні гнізда — Pūnana Leo — за моделлю маорі.',
    },
  },
  {
    id: 'crimean-tatar',
    name: { en: 'Crimean Tatar', uk: 'Кримськотатарська' },
    tag: { en: 'severely endangered, reviving', uk: 'серйозно загрожена, відроджується' },
    detail: {
      en: 'Classified severely endangered after the 1944 deportation, it is the object of intense revival work — corpora, schooling, broadcasting — under the hardest possible conditions.',
      uk: 'Класифікована як серйозно загрожена після депортації 1944 року, вона є об’єктом інтенсивної відроджувальної роботи — корпуси, школи, мовлення — у найважчих можливих умовах.',
    },
  },
  {
    id: 'cornish-manx',
    name: { en: 'Cornish & Manx', uk: 'Корнська і менська' },
    tag: { en: 'back from “dead”', uk: 'повернулися з «мертвих»' },
    detail: {
      en: 'They show that even a “dead” language with good records can return to families.',
      uk: 'Вони показують: навіть «мертва» мова з добрими записами може повернутися в родини.',
    },
  },
];

/* ----------------------------------------------------------------
   (Bottom) Revival recipe — ingredients + weights.

   The five ingredients are exactly the article's: "prestige …, schools, media,
   state status — and above all, the hardest one, intergenerational use at home."
   Home use is weighted heaviest by design (0.40) — it lifts the gauge more than
   any other single switch, and nothing reaches full vitality without it. The
   other weights are an illustrative ordering, not measured coefficients.
   ---------------------------------------------------------------- */
export interface Ingredient {
  id: string;
  label: Record<Lang, string>;
  emoji: string;
  weight: number;
  note: Record<Lang, string>;
}

export const RECIPE: Ingredient[] = [
  {
    id: 'home',
    label: { en: 'Home use', uk: 'Вживання вдома' },
    emoji: '🏡',
    weight: 0.4,
    note: {
      en: 'Intergenerational use at home — the hardest ingredient, and the one that matters most. A million apps cannot replace one grandmother.',
      uk: 'Міжпоколіннєве вживання вдома — найважчий інгредієнт і найважливіший. Мільйон застосунків не замінить однієї бабусі.',
    },
  },
  {
    id: 'school',
    label: { en: 'Schools', uk: 'Школи' },
    emoji: '🏫',
    weight: 0.2,
    note: {
      en: 'Mandatory schooling in the language.',
      uk: 'Обов’язкова шкільна освіта мовою.',
    },
  },
  {
    id: 'state',
    label: { en: 'State status', uk: 'Державний статус' },
    emoji: '🏛️',
    weight: 0.16,
    note: {
      en: 'Official, legal standing for the language.',
      uk: 'Офіційний, юридичний статус мови.',
    },
  },
  {
    id: 'media',
    label: { en: 'Media', uk: 'Медіа' },
    emoji: '📺',
    weight: 0.12,
    note: {
      en: 'Television, radio, and online media in the language — Welsh’s S4C is the classic example.',
      uk: 'Телебачення, радіо й онлайн-медіа мовою — валлійський S4C є класичним прикладом.',
    },
  },
  {
    id: 'prestige',
    label: { en: 'Prestige', uk: 'Престиж' },
    emoji: '✨',
    weight: 0.12,
    note: {
      en: 'The language must feel like the future, not the past.',
      uk: 'Мова має відчуватися майбутнім, а не минулим.',
    },
  },
];

/** Gauge bands keyed by lower bound of vitality % (descriptive, not statistics). */
export interface Band {
  min: number;
  label: Record<Lang, string>;
}

export const BANDS: Band[] = [
  { min: 100, label: { en: 'Thriving', uk: 'Процвітає' } },
  { min: 75, label: { en: 'Reviving', uk: 'Відроджується' } },
  { min: 50, label: { en: 'Holding on', uk: 'Тримається' } },
  { min: 25, label: { en: 'Endangered', uk: 'Загрожена' } },
  { min: 1, label: { en: 'Falling silent', uk: 'Замовкає' } },
  { min: 0, label: { en: 'Silent', uk: 'Тиша' } },
];

export function bandFor(pct: number): Band {
  return BANDS.find((b) => pct >= b.min) ?? BANDS[BANDS.length - 1];
}
