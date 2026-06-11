// Content data for the `writing-detective` interactive (article: who-wrote-first).
//
// SOURCING (per CLAUDE.md "no invented data"):
//   • Every candidate, artifact, and claim traces to the article
//     (content/{en,uk}/who-wrote-first.md) and its cited sources.
//   • Dates use the articles' own approximations.
//   • Scholarly-status labels (consensus/debated/rejected) reflect mainstream
//     archaeological consensus as described in the article and sources.

import type { Lang } from '../../i18n/ui';

type Bi = Record<Lang, string>;

/* ── Definition-lab candidates ─────────────────────────────────────────────
   Each candidate has three boolean flags matching the three progressive
   definition criteria:
     any       = "any systematic marks"
     language  = "encodes a specific language"
     phonetic  = "phonetic / sound encoding"
   Stricter criteria are subsets: phonetic ⊂ language ⊂ any. */

export interface Candidate {
  id: string;
  name: Bi;
  year: number; // negative = BCE (plot anchor)
  dateLabel: Bi; // display string
  location: Bi;
  any: boolean;
  language: boolean;
  phonetic: boolean;
  note: Bi; // one-liner shown on timeline
}

export const CANDIDATES: Candidate[] = [
  {
    id: 'jiahu',
    name: { en: 'Jiahu symbols', uk: 'Символи Цзяху' },
    year: -6600,
    dateLabel: { en: '~6600 BCE', uk: '~6600 до н.е.' },
    location: { en: 'Central China', uk: 'Центральний Китай' },
    any: true, language: false, phonetic: false,
    note: {
      en: 'Repeated marks on tortoise shells — systematic, but no evidence of encoding language.',
      uk: 'Повторювані позначки на черепашачих панцирах — систематичні, але без ознак кодування мови.',
    },
  },
  {
    id: 'vinca',
    name: { en: 'Vinca symbols', uk: 'Символи Вінча' },
    year: -5500,
    dateLabel: { en: '~5500 BCE', uk: '~5500 до н.е.' },
    location: { en: 'Southeastern Europe', uk: 'Південно-Східна Європа' },
    any: true, language: false, phonetic: false,
    note: {
      en: 'Recurring signs on pottery. Some call them "Old European script", most scholars disagree.',
      uk: 'Повторювані знаки на кераміці. Дехто називає їх «давньоєвропейським письмом», більшість вчених не погоджуються.',
    },
  },
  {
    id: 'dispilio',
    name: { en: 'Dispilio tablet', uk: 'Табличка з Діспіліо' },
    year: -5260,
    dateLabel: { en: '~5260 BCE', uk: '~5260 до н.е.' },
    location: { en: 'Northern Greece', uk: 'Північна Греція' },
    any: true, language: false, phonetic: false,
    note: {
      en: 'Rows of incised marks that look organized — but no proof they encode language.',
      uk: 'Ряди вирізьблених позначок, що виглядають впорядковано — але без доказів кодування мови.',
    },
  },
  {
    id: 'sumerian',
    name: { en: 'Sumerian cuneiform', uk: 'Шумерський клинопис' },
    year: -3400,
    dateLabel: { en: '~3400 BCE', uk: '~3400 до н.е.' },
    location: { en: 'Mesopotamia (Uruk)', uk: 'Месопотамія (Урук)' },
    any: true, language: true, phonetic: true,
    note: {
      en: 'Clay tokens → envelopes → tablets. The best-documented gradual evolution from accounting to writing.',
      uk: 'Глиняні жетони → конверти → таблички. Найкраще задокументована поступова еволюція від обліку до письма.',
    },
  },
  {
    id: 'egyptian',
    name: { en: 'Egyptian hieroglyphs', uk: 'Єгипетські ієрогліфи' },
    year: -3250,
    dateLabel: { en: '~3250 BCE', uk: '~3250 до н.е.' },
    location: { en: 'Egypt (Abydos)', uk: 'Єгипет (Абідос)' },
    any: true, language: true, phonetic: true,
    note: {
      en: 'Tomb U-j tags — possibly as old as Sumerian. Many scholars now lean toward independent invention.',
      uk: 'Таблички з гробниці U-j — можливо, такі ж давні, як шумерські. Багато вчених схиляються до незалежного винаходу.',
    },
  },
  {
    id: 'proto-elamite',
    name: { en: 'Proto-Elamite', uk: 'Протоеламське' },
    year: -3100,
    dateLabel: { en: '~3100 BCE', uk: '~3100 до н.е.' },
    location: { en: 'Iran (Susa)', uk: 'Іран (Суза)' },
    any: true, language: true, phonetic: false,
    note: {
      en: 'Still undeciphered. Records accounting, but whether it encodes phonetics remains unknown.',
      uk: 'Досі не розшифроване. Фіксує облік, але чи кодує фонетику — невідомо.',
    },
  },
  {
    id: 'indus',
    name: { en: 'Indus Valley script', uk: 'Письмо долини Інду' },
    year: -2600,
    dateLabel: { en: '~2600 BCE', uk: '~2600 до н.е.' },
    location: { en: 'South Asia', uk: 'Південна Азія' },
    any: true, language: false, phonetic: false,
    note: {
      en: 'Still undeciphered. Whether it is "true writing" is actively debated among scholars.',
      uk: 'Досі не розшифроване. Чи це «справжнє письмо» — серед вчених тривають активні дискусії.',
    },
  },
  {
    id: 'chinese',
    name: { en: 'Chinese oracle bones', uk: 'Китайські ворожильні кістки' },
    year: -1200,
    dateLabel: { en: '~1200 BCE', uk: '~1200 до н.е.' },
    location: { en: 'China (Anyang)', uk: 'Китай (Аньян)' },
    any: true, language: true, phonetic: true,
    note: {
      en: 'Shang dynasty inscriptions — already complex, suggesting earlier origins now lost.',
      uk: 'Написи династії Шан — уже складні, що вказує на давніше, втрачене походження.',
    },
  },
];

/* ── Artifact explorer ─────────────────────────────────────────────────────
   Key discoveries in the priority debate. Each card has a scholarly-status
   badge and a 2-sentence detail. */

export type ArtifactStatus = 'consensus' | 'debated' | 'rejected';

export interface Artifact {
  id: string;
  name: Bi;
  date: Bi;
  location: Bi;
  desc: Bi;
  detail: Bi;
  status: ArtifactStatus;
}

export const ARTIFACTS: Artifact[] = [
  {
    id: 'uruk-tablets',
    name: { en: 'Uruk IV tablets', uk: 'Таблички Уруку IV' },
    date: { en: '~3400–3100 BCE', uk: '~3400–3100 до н.е.' },
    location: { en: 'Mesopotamia', uk: 'Месопотамія' },
    desc: {
      en: 'Clay tablets recording grain and livestock — the first cuneiform.',
      uk: 'Глиняні таблички з обліком зерна й худоби — перший клинопис.',
    },
    detail: {
      en: 'Found in the temple complex of ancient Uruk (modern Warka, Iraq). Schmandt-Besserat traced their evolution from small clay tokens used for millennia. The transition from tokens to tablets is the best-documented origin of writing anywhere.',
      uk: 'Знайдені в храмовому комплексі стародавнього Уруку (сучасна Варка, Ірак). Шмандт-Бессера простежила їхню еволюцію від маленьких глиняних жетонів, що використовувалися тисячоліттями. Перехід від жетонів до табличок — найкраще задокументоване походження письма в світі.',
    },
    status: 'consensus',
  },
  {
    id: 'abydos-tags',
    name: { en: 'Abydos tomb tags', uk: 'Таблички з Абідоса' },
    date: { en: '~3250 BCE', uk: '~3250 до н.е.' },
    location: { en: 'Egypt', uk: 'Єгипет' },
    desc: {
      en: '~200 bone and ivory tags inscribed with early hieroglyphic signs.',
      uk: '~200 кісткових та з слонової кістки табличок з ранніми ієрогліфічними знаками.',
    },
    detail: {
      en: 'Excavated by Gunter Dreyer in 1988 from Tomb U-j at Abydos. The tags record the origin of goods buried with a pre-dynastic ruler. Their date — barely a century after the earliest Uruk tablets — reopened the question of who wrote first.',
      uk: 'Розкопані Гюнтером Дрейєром 1988 року з гробниці U-j в Абідосі. Таблички фіксують походження товарів, похованих із додинастичним правителем. Їхня дата — ледь на століття після найдавніших табличок Уруку — знову відкрила питання, хто писав першим.',
    },
    status: 'consensus',
  },
  {
    id: 'vinca-pottery',
    name: { en: 'Vinca pottery signs', uk: 'Знаки на кераміці Вінча' },
    date: { en: '~5500–4500 BCE', uk: '~5500–4500 до н.е.' },
    location: { en: 'Serbia / SE Europe', uk: 'Сербія / Пд.-Сх. Європа' },
    desc: {
      en: 'Recurring symbols on Neolithic pottery — systematic but not linguistic.',
      uk: 'Повторювані символи на неолітичній кераміці — систематичні, але не лінгвістичні.',
    },
    detail: {
      en: 'The Vinca culture left thousands of pottery fragments with repeated signs. Some researchers have proposed an "Old European script", but mainstream archaeology considers them ownership marks, religious symbols, or decorative patterns — not encoding of language.',
      uk: 'Культура Вінча залишила тисячі фрагментів кераміки з повторюваними знаками. Деякі дослідники пропонували «давньоєвропейське письмо», але археологічний мейнстрім вважає їх позначками власності, релігійними символами чи декоративними візерунками — не кодуванням мови.',
    },
    status: 'rejected',
  },
  {
    id: 'jiahu-shells',
    name: { en: 'Jiahu tortoise shells', uk: 'Черепашачі панцирі Цзяху' },
    date: { en: '~6600 BCE', uk: '~6600 до н.е.' },
    location: { en: 'China', uk: 'Китай' },
    desc: {
      en: 'Marks on turtle shells — the oldest known systematic symbols.',
      uk: 'Позначки на панцирах черепах — найдавніші відомі систематичні символи.',
    },
    detail: {
      en: 'Found at the Neolithic site of Jiahu in Henan province. Some marks resemble later Chinese characters, but the gap of 5,000+ years makes direct connection speculative. Too few and isolated to determine if they represent language.',
      uk: 'Знайдені на неолітичній стоянці Цзяху в провінції Хенань. Деякі позначки нагадують пізніші китайські ієрогліфи, але розрив у 5000+ років робить прямий зв\'язок спекулятивним. Занадто мало й ізольовано, щоб визначити, чи вони передають мову.',
    },
    status: 'rejected',
  },
  {
    id: 'dispilio-tab',
    name: { en: 'Dispilio tablet', uk: 'Табличка з Діспіліо' },
    date: { en: '~5260 BCE', uk: '~5260 до н.е.' },
    location: { en: 'Greece', uk: 'Греція' },
    desc: {
      en: 'Wooden tablet with organized incised marks — heavily debated.',
      uk: 'Дерев\'яна табличка з упорядкованими вирізьбленими позначками — дуже дискусійна.',
    },
    detail: {
      en: 'Discovered in 1993 at a Neolithic lakeside settlement in northern Greece. The tablet deteriorated after excavation, making further study difficult. Whether the marks represent proto-writing or something else remains unresolved.',
      uk: 'Відкрита 1993 року на неолітичному озерному поселенні в Північній Греції. Табличка зіпсувалася після розкопок, ускладнивши подальше вивчення. Чи позначки є протописемністю чи чимось іншим — залишається невирішеним.',
    },
    status: 'debated',
  },
  {
    id: 'proto-elamite-tab',
    name: { en: 'Proto-Elamite tablets', uk: 'Протоеламські таблички' },
    date: { en: '~3100–2900 BCE', uk: '~3100–2900 до н.е.' },
    location: { en: 'Iran', uk: 'Іран' },
    desc: {
      en: 'Accounting script from Susa — still undeciphered after a century.',
      uk: 'Обліковий запис із Сузи — досі не розшифрований після століття.',
    },
    detail: {
      en: 'One of the earliest writing systems, used briefly across the Iranian plateau. Clearly records numerical accounts, but the non-numerical signs remain undeciphered. Some scholars think it adapted cuneiform ideas; others see an independent system.',
      uk: 'Одна з найдавніших систем письма, що нетривало використовувалася на Іранському нагір\'ї. Чітко фіксує числові записи, але нечислові знаки залишаються нерозшифрованими. Деякі вчені вважають, що вона адаптувала ідеї клинопису; інші бачать незалежну систему.',
    },
    status: 'debated',
  },
];

/* ── Claims quiz ───────────────────────────────────────────────────────────
   Statements about writing origins. Each has a correct answer and a
   one-sentence explanation traced to the article. */

export type ClaimAnswer = 'true' | 'false' | 'debated';

export interface Claim {
  id: string;
  statement: Bi;
  answer: ClaimAnswer;
  explanation: Bi;
}

export const CLAIMS: Claim[] = [
  {
    id: 'cuneiform-oldest',
    statement: {
      en: 'Cuneiform is definitively the oldest writing system in the world.',
      uk: 'Клинопис — безперечно найдавніша система письма у світі.',
    },
    answer: 'debated',
    explanation: {
      en: 'Egyptian hieroglyphs from Abydos (~3250 BCE) are nearly as old and may be an independent invention.',
      uk: 'Єгипетські ієрогліфи з Абідоса (~3250 до н.е.) майже так само давні й можуть бути незалежним винаходом.',
    },
  },
  {
    id: 'egypt-borrowed',
    statement: {
      en: 'Egyptian hieroglyphs were inspired by Sumerian cuneiform.',
      uk: 'Єгипетські ієрогліфи були натхненні шумерським клинописом.',
    },
    answer: 'debated',
    explanation: {
      en: 'The two systems share no signs and no structure. Many scholars now lean toward independent invention.',
      uk: 'Дві системи не мають спільних знаків і структури. Багато вчених схиляються до незалежного винаходу.',
    },
  },
  {
    id: 'vinca-writing',
    statement: {
      en: 'The Vinca symbols (5500 BCE) are a form of writing older than cuneiform.',
      uk: 'Символи Вінча (5500 до н.е.) — форма письма, давніша за клинопис.',
    },
    answer: 'false',
    explanation: {
      en: 'Most scholars consider them ownership marks or decorative patterns — systematic, but not encoding language.',
      uk: 'Більшість вчених вважають їх позначками власності або декоративними візерунками — систематичними, але такими, що не кодують мову.',
    },
  },
  {
    id: 'writing-once',
    statement: {
      en: 'Writing was invented only once and spread from a single source.',
      uk: 'Письмо було винайдене лише один раз і поширилося з одного джерела.',
    },
    answer: 'false',
    explanation: {
      en: 'Writing was independently invented at least four times: Mesopotamia, Egypt, China, and Mesoamerica.',
      uk: 'Письмо було незалежно винайдене щонайменше чотири рази: в Месопотамії, Єгипті, Китаї та Мезоамериці.',
    },
  },
  {
    id: 'first-docs',
    statement: {
      en: 'The oldest known written documents are religious prayers.',
      uk: 'Найдавніші відомі письмові документи — це релігійні молитви.',
    },
    answer: 'false',
    explanation: {
      en: 'The first cuneiform tablets are grain inventories and livestock receipts — accounting, not literature.',
      uk: 'Перші клинописні таблички — описи зерна та квитанції на худобу — бухгалтерія, не література.',
    },
  },
];
