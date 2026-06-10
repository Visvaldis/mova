// Data + the toy drift model for the ai-language-lab interactive.
// Everything traces to content/{en,uk}/ai-and-language.md.
//
// What the article gives us directly (used as anchors):
//   • The feedback loop: models train on human text; their output flows back into
//     the pool humans read, imitate, and train future models on.
//   • Three named, non-exclusive futures: Homogenization, Acceleration, Conservatism.
//   • Homogenization = "statistically safe, fluent, mid-Atlantic prose"; regional
//     flavor, idiosyncrasy and "wrongness" get sanded off.
//   • Early evidence: the chatbot-favored words "delve", "boast", and "tapestry"
//     spiked measurably in human-written abstracts and emails after 2023.
//   • Acceleration = new coinages/styles spread faster than ever.
//   • Conservatism = models trained on the past act as an anchor, re-injecting
//     yesterday's norms — "a great freezing" rather than acceleration.
//
// TODO(seva): the article gives NO verbatim "human vs AI" sentence pairs, and the
//   drift simulator is an illustrative toy (no real corpus). The quiz pairs below
//   are written to instantiate the article's own tells (the AI side leans on
//   "delve / boast / tapestry" and safe, fluent, generic prose; the human side
//   keeps the concrete, idiosyncratic detail the article says AI sands off). Both
//   are captioned as illustrative in the UI, per the spec's honesty requirement.
import type { Lang } from '../../i18n/ui';

/* ----------------------------------------------------------------
   (a) Drift simulator — an honest, illustrative toy model.

   One metric: "vocabulary diversity", indexed to 100 = today. Each
   generation, two forces from the article push it:
     • AI share (a) homogenizes — pulls diversity down toward the mean.
     • Human innovation (r) diversifies — pushes new variants up.

   D[t+1] = D[t] − a·K·D[t] + r·K·(CAP − D[t])
   Equilibrium D* = CAP·r / (a + r): a=r → 100 (stable), AI-only → 0,
   innovation-only → CAP. NOT research — a teaching cartoon.
   ---------------------------------------------------------------- */

export const SIM = {
  GENERATIONS: 14,
  BASELINE: 100, // diversity index of "today"
  CAP: 200, // ceiling of the index
  K: 0.2, // per-generation force strength (shared by both terms)
} as const;

/** Run the toy model. `ai` and `innovation` are 0..1. Returns the diversity
 *  index per generation (length GENERATIONS + 1, starting at BASELINE). */
export function simulate(ai: number, innovation: number): number[] {
  const { GENERATIONS, BASELINE, CAP, K } = SIM;
  const series: number[] = [BASELINE];
  let d: number = BASELINE;
  for (let g = 0; g < GENERATIONS; g++) {
    d = d - ai * K * d + innovation * K * (CAP - d);
    d = Math.max(0, Math.min(CAP, d));
    series.push(d);
  }
  return series;
}

export type OutcomeId = 'homogenization' | 'acceleration' | 'conservatism' | 'balanced';

/** Map the final diversity + AI share onto the article's three named futures
 *  (plus a "balanced" middle). Pure presentation of the toy model's end state. */
export function classify(series: number[], ai: number): OutcomeId {
  const final = series[series.length - 1];
  if (final <= 78) return 'homogenization';
  if (final >= 130) return 'acceleration';
  if (ai >= 0.5) return 'conservatism'; // near baseline but AI-dominated = frozen
  return 'balanced';
}

// Each outcome's name + one-line reading, lifted from the article's three
// "plausible futures" paragraphs (balanced = the article's "not mutually
// exclusive" middle). Article-derived content, so it lives here, not in ui.ts.
export const OUTCOMES: Record<OutcomeId, { name: Record<Lang, string>; blurb: Record<Lang, string> }> = {
  homogenization: {
    name: { en: 'Homogenization', uk: 'Гомогенізація' },
    blurb: {
      en: 'Regional flavor, idiosyncrasy and “wrongness” — the raw material of change — get sanded off toward safe, fluent, mid-Atlantic prose.',
      uk: 'Регіональний колорит, дивацтва та «неправильність» — сировина змін — стираються до безпечної, гладенької, усередненої прози.',
    },
  },
  acceleration: {
    name: { en: 'Acceleration', uk: 'Прискорення' },
    blurb: {
      en: 'New coinages and styles spread faster than ever; humans imitate the new prestige dialect or define themselves against it.',
      uk: 'Новотвори та стилі поширюються швидше, ніж будь-коли; люди наслідують новий престижний діалект або визначають себе всупереч йому.',
    },
  },
  conservatism: {
    name: { en: 'Conservatism', uk: 'Консерватизм' },
    blurb: {
      en: 'Trained on the past, models act as a giant anchor — re-injecting yesterday’s norms and slowing change. A “great freezing”.',
      uk: 'Навчені на минулому, моделі стають гігантським якорем — вприскують вчорашні норми й сповільнюють зміни. «Велике замороження».',
    },
  },
  balanced: {
    name: { en: 'Balanced drift', uk: 'Збалансований дрейф' },
    blurb: {
      en: 'The two forces roughly cancel — the messy real mix, where homogenization and innovation pull against each other (the futures are not mutually exclusive).',
      uk: 'Дві сили приблизно врівноважуються — реальна мішанина, де гомогенізація й новотвори тягнуть у різні боки (сценарії не взаємовиключні).',
    },
  },
};

/* ----------------------------------------------------------------
   (b) "Human or AI phrasing?" quiz — 6 pairs.
   ---------------------------------------------------------------- */

export interface QuizPair {
  id: string;
  /** Tiny label for what the two sentences are about. */
  topic: Record<Lang, string>;
  /** The human-written version (concrete, idiosyncratic). */
  human: Record<Lang, string>;
  /** The AI-flavored version (safe, fluent, generic). */
  ai: Record<Lang, string>;
  /** Why the AI line reads as AI — ties back to the article. */
  tell: Record<Lang, string>;
}

export const QUIZ: QuizPair[] = [
  {
    id: 'city',
    topic: { en: 'Describing a city', uk: 'Опис міста' },
    human: {
      en: 'This city smells like rain and diesel, and I love it.',
      uk: 'Це місто пахне дощем і дизелем, і я його люблю.',
    },
    ai: {
      en: 'Let us delve into the rich tapestry of this vibrant city’s culture.',
      uk: 'Зануримося в багате розмаїття культури цього яскравого міста.',
    },
    tell: {
      en: '“Delve” and “rich tapestry” are two of the chatbot-favored words the article notes spiked after 2023.',
      uk: '«Зануритися» і «багате розмаїття» — той самий гладенький регістр чат-ботів, що почастішав після 2023 року.',
    },
  },
  {
    id: 'food',
    topic: { en: 'A recommendation', uk: 'Порада' },
    human: {
      en: 'Get the dumplings. Skip everything else.',
      uk: 'Бери вареники. Решту пропусти.',
    },
    ai: {
      en: 'This restaurant boasts an impressive array of delectable options.',
      uk: 'Цей ресторан пропонує вражаючий асортимент вишуканих страв.',
    },
    tell: {
      en: '“Boasts an impressive array” is the statistically safe, fluent prose the article calls mid-Atlantic.',
      uk: '«Вражаючий асортимент» — статистично безпечна, гладенька проза, яку стаття зве усередненою.',
    },
  },
  {
    id: 'opinion',
    topic: { en: 'An opinion', uk: 'Думка' },
    human: {
      en: 'Honestly? They’re both wrong, just differently.',
      uk: 'Чесно? Обидва неправі, просто по-різному.',
    },
    ai: {
      en: 'It is important to note that there are valid points on both sides of this issue.',
      uk: 'Важливо зазначити, що в цьому питанні є слушні аргументи з обох боків.',
    },
    tell: {
      en: 'The AI hedges into safe, balanced phrasing; the human actually takes a side.',
      uk: 'ШІ страхується безпечним «з обох боків»; людина таки займає бік.',
    },
  },
  {
    id: 'opener',
    topic: { en: 'A story opener', uk: 'Початок історії' },
    human: {
      en: 'My phone died on the train and for twenty minutes I just stared out the window.',
      uk: 'У потязі сів телефон, і двадцять хвилин я просто дивився у вікно.',
    },
    ai: {
      en: 'In today’s fast-paced world, technology continues to reshape how we live.',
      uk: 'У сучасному швидкоплинному світі технології невпинно змінюють наше життя.',
    },
    tell: {
      en: 'A generic, fluent opener with no specific detail — exactly the flavor the article says AI sands off.',
      uk: 'Загальний гладенький зачин без жодної деталі — саме той колорит, що його ШІ стирає, за статтею.',
    },
  },
  {
    id: 'praise',
    topic: { en: 'A compliment', uk: 'Похвала' },
    human: {
      en: 'The third paragraph made me put the book down for a second.',
      uk: 'Через третій абзац я на секунду відклав книжку.',
    },
    ai: {
      en: 'Your work showcases a remarkable blend of creativity and precision.',
      uk: 'Ваша робота демонструє неабияке поєднання креативності та точності.',
    },
    tell: {
      en: 'AI smooths into balanced, generic praise; the human points to one concrete moment.',
      uk: 'ШІ згладжує у збалансовану загальну похвалу; людина вказує на один конкретний момент.',
    },
  },
  {
    id: 'ending',
    topic: { en: 'A conclusion', uk: 'Висновок' },
    human: {
      en: 'I don’t know how it ends yet. That’s kind of the point.',
      uk: 'Я ще не знаю, чим це скінчиться. У цьому, мабуть, і суть.',
    },
    ai: {
      en: 'Ultimately, the journey is just as important as the destination.',
      uk: 'Зрештою, подорож не менш важлива, ніж пункт призначення.',
    },
    tell: {
      en: 'A tidy, familiar maxim — the “anchor to yesterday’s norms” the article warns models re-inject.',
      uk: 'Охайна звична сентенція — той самий «якір до вчорашніх норм», який, за статтею, вприскують моделі.',
    },
  },
];
