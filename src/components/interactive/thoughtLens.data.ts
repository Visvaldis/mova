// Content data for the `thought-lens` interactive (article: language-and-thought).
// Every word, adjective, sentence and claim below is taken from the article; the
// one place the article gives no exact figure (the colour boundary) is marked
// illustrative in the UI, not invented as fact.
//
// Four datasets, one per tab:
//   COLOR   — the two-blues boundary lab (синій / блакитний vs one English "blue").
//   SPACE   — egocentric vs geocentric direction (Guugu Yimithirr).
//   GENDER  — the bridge: grammatical gender colouring associations (contested).
//   GRAMMAR — what each grammar *obliges* you to encode (Deutscher's thesis).

import type { Lang } from '../../i18n/ui';

type Bi = Record<Lang, string>;

/* ── 1. Colour ─────────────────────────────────────────────────────────────
   The gradient itself uses literal blues (defined in the CSS module) because
   blue *is* the subject of this experiment — that is content, not theming. */
export const COLOR = {
  // Ukrainian splits the strip into two basic colours; English has one word.
  ukLight: { term: 'блакитний', gloss: { en: 'light blue', uk: 'світло-синій' } as Bi },
  ukDark: { term: 'синій', gloss: { en: 'dark blue', uk: 'темно-синій' } as Bi },
  enWord: { term: 'blue', gloss: { en: 'one basic colour', uk: 'один базовий колір' } as Bi },

  // Where Ukrainian conventionally cuts the strip (0 = lightest … 1 = darkest).
  // ILLUSTRATIVE — the article gives no precise boundary. Surfaced as such in UI.
  ukSplit: 0.46,

  explainer: {
    en: 'In the famous “Russian blues” study, speakers whose language splits light- and dark-blue told two blues apart faster across that line than English speakers — and the advantage vanished when their words were kept busy. Language doing the work in real time. Ukrainian’s синій/блакитний predicts the same.',
    uk: 'У знаменитому дослідженні «російських синіх» мовці, чия мова розділяє світло- й темно-синій, розрізняли два сині через цю межу швидше за англомовних — і перевага зникала, коли їхні слова були зайняті. Мова працює в реальному часі. Українські синій/блакитний дають той самий прогноз.',
  } as Bi,
};

/* ── 2. Space ───────────────────────────────────────────────────────────────
   The cup sits north of the plate. The viewer changes seats (west edge ⇄ east
   edge); the egocentric label flips, the geocentric one never moves. */
export const SPACE = {
  geoCaption: {
    en: 'The cup is north of the plate.',
    uk: 'Чашка на північ від тарілки.',
  } as Bi,
  // Egocentric caption depends on where the viewer sits.
  egoLeft: {
    en: 'The cup is on your left.',
    uk: 'Чашка ліворуч від вас.',
  } as Bi,
  egoRight: {
    en: 'The cup is on your right.',
    uk: 'Чашка праворуч від вас.',
  } as Bi,
  explainer: {
    en: 'Guugu Yimithirr (Australia) has no “left” or “right” — only compass directions. Speakers keep flawless track of north, even indoors, and grow into it from childhood like a superpower. Watch: when you switch seats, “left/right” flips — but “north” never does.',
    uk: 'Гуугу-їмітір (Австралія) не має «ліворуч» чи «праворуч» — лише напрямки за компасом. Її носії бездоганно тримають північ, навіть у приміщенні, і виростають у це з дитинства, наче в суперсилу. Дивіться: коли ви пересідаєте, «ліворуч/праворуч» міняється — а «північ» ніколи.',
  } as Bi,
};

/* ── 3. Gender ──────────────────────────────────────────────────────────────
   Only the adjectives the article actually quotes. Heavily caveated. */
export type GenderKey = 'de' | 'es';
export const GENDER: Record<
  GenderKey,
  { word: string; gender: Bi; adjectives: Bi[] }
> = {
  de: {
    word: 'die Brücke',
    gender: { en: 'feminine', uk: 'жіночий рід' },
    adjectives: [
      { en: 'elegant', uk: 'елегантний' },
      { en: 'slender', uk: 'стрункий' },
    ],
  },
  es: {
    word: 'el puente',
    gender: { en: 'masculine', uk: 'чоловічий рід' },
    adjectives: [
      { en: 'strong', uk: 'міцний' },
      { en: 'towering', uk: 'величний' },
    ],
  },
};
export const GENDER_CAVEAT: Bi = {
  en: 'The best-known version of this study was never fully published, and replications are mixed. Love the story — check the evidence.',
  uk: 'Найвідоміша версія цього дослідження так і не була повністю опублікована, а реплікації неоднозначні. Любіть історію — перевіряйте докази.',
};

/* ── 4. Grammar ─────────────────────────────────────────────────────────────
   Two fixed sentences shown together (always both languages, whatever the UI
   language). Token text is fixed; glosses are bilingual for the reader. */
export type GToken = { text: string; gloss?: Bi };

export const GRAMMAR: {
  en: { sentence: GToken[]; notForced: Bi };
  uk: { sentence: GToken[]; notForced: Bi };
  closing: Bi;
} = {
  en: {
    sentence: [
      { text: 'Friend,' },
      { text: 'you' },
      { text: 'drank' },
      { text: 'the', gloss: { en: 'definiteness — the/a, you must choose', uk: 'означеність — the/a, треба обрати' } },
      { text: 'blue', gloss: { en: 'one “blue” — no light/dark split', uk: 'один «blue» — без поділу на світлий/темний' } },
      { text: 'tea.' },
    ],
    notForced: {
      en: 'Doesn’t force: verb aspect, or a special form to address someone.',
      uk: 'Не змушує: вид дієслова чи окрему форму звертання.',
    },
  },
  uk: {
    sentence: [
      { text: 'Друже,', gloss: { en: 'vocative case — друг → друже to address you', uk: 'кличний відмінок — друг → друже для звертання' } },
      { text: 'ти' },
      { text: 'випив', gloss: { en: 'aspect — випив (finished) vs пив (was drinking)', uk: 'вид — випив (доконаний) проти пив (недоконаний)' } },
      { text: 'синій', gloss: { en: 'must pick синій or блакитний', uk: 'треба обрати синій чи блакитний' } },
      { text: 'чай.' },
    ],
    notForced: {
      en: 'Doesn’t force: definiteness — there is no the/a.',
      uk: 'Не змушує: означеність — немає the/a.',
    },
  },
  closing: {
    en: 'You already ran this experiment — every time you tapped the language switch at the top of this page.',
    uk: 'Ви вже провели цей експеримент — щоразу, коли торкалися перемикача мови вгорі цієї сторінки.',
  },
};
