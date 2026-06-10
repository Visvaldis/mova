// Data for ukrainian-timeline. Eras, bodies, and language samples are condensed
// from content/{en,uk}/ukrainian-language-history.md. Every fact traces to the
// article; gaps are flagged TODO(seva) below.
//
// TODO(seva): the spec also lists "Galicia-Volhynia" and the "Lithuanian-Polish
//   era" between Rus and Kotliarevsky, but the article does not mention either —
//   omitted rather than invented. Add article prose if you want them as nodes.
// TODO(seva): the article gives NO speaker figures over time, so the status chart
//   plots a *schematic* official-standing arc (each point an article-stated status
//   event), not measured speaker counts. Add sourced numbers to make it a true
//   speakers chart.
// TODO(seva): no verbatim period line is quoted for Kotliarevsky's *Eneida* or
//   Shevchenko's *Kobzar* in the article (`sample.todo`) — the work title stands
//   in as the era's language landmark.
import type { Lang } from '../../i18n/ui';

export type Tone = 'ban' | 'revival' | 'neutral';

export interface Era {
  id: string;
  /** For ordering only; the chart spaces eras evenly by index. */
  year: number;
  dateLabel: Record<Lang, string>;
  tone: Tone;
  title: Record<Lang, string>;
  body: Record<Lang, string>;
  /** Article-sourced material showing the period's language / its fate. */
  sample: {
    label: Record<Lang, string>;
    text: Record<Lang, string>;
    /** Strikethrough motif (an abolished form). */
    strike?: boolean;
    /** No verbatim period line in the article — title stands in. TODO(seva). */
    todo?: boolean;
  };
  /** Schematic official-standing level for the status chart (0 suppressed … 4 state). */
  statusLevel: number;
}

export const STATUS_MAX = 4;

export const ERAS: Era[] = [
  {
    id: 'rus',
    year: 900,
    dateLabel: { en: '9th–13th c.', uk: 'IX–XIII ст.' },
    tone: 'neutral',
    title: { en: 'Kyivan Rus · Old East Slavic', uk: 'Київська Русь · давньоруська' },
    body: {
      en: 'The language of Kyivan Rus (9th–13th c.) — a granddaughter of Proto-Slavic. After Kyiv’s destruction in 1240 the East Slavic continuum broke apart, and Ukrainian, Belarusian and Russian gradually crystallized. Shevelov argued proto-Ukrainian features formed even earlier, straight out of Proto-Slavic.',
      uk: 'Мова Київської Русі (IX–XIII ст.) — онука праслов’янської. Після зруйнування Києва 1240 року східнослов’янський континуум розпався, і поступово викристалізувалися українська, білоруська та російська. Шевельов доводив, що протоукраїнські риси формувалися ще раніше — просто з праслов’янської.',
    },
    sample: {
      label: { en: 'Signature developments', uk: 'Питомі риси' },
      text: {
        en: 'ніч · кінь · голова · борода — o, e → i in closed syllables, full pleophony, and the vocative case Ukrainian kept',
        uk: 'ніч · кінь · голова · борода — о, е → і в закритих складах, повноголосся і кличний відмінок, який українська зберегла',
      },
    },
    statusLevel: 3,
  },
  {
    id: 'eneida',
    year: 1798,
    dateLabel: { en: '1798', uk: '1798' },
    tone: 'neutral',
    title: { en: 'Kotliarevsky’s Eneida', uk: '«Енеїда» Котляревського' },
    body: {
      en: 'Ivan Kotliarevsky’s burlesque retelling of Virgil in the living vernacular — conventionally the start of modern literary Ukrainian.',
      uk: 'Бурлескний переспів Верґілія живою народною мовою Івана Котляревського — традиційно початок нової української літературної мови.',
    },
    sample: {
      label: { en: 'The work that began it', uk: 'Твір, що започаткував' },
      text: { en: '«Eneida» (1798)', uk: '«Енеїда» (1798)' },
      todo: true,
    },
    statusLevel: 2,
  },
  {
    id: 'kobzar',
    year: 1840,
    dateLabel: { en: '1840', uk: '1840' },
    tone: 'neutral',
    title: { en: 'Shevchenko’s Kobzar', uk: '«Кобзар» Шевченка' },
    body: {
      en: 'Taras Shevchenko’s poetry raised the peasant vernacular into a national literary language of the first rank.',
      uk: 'Поезія Тараса Шевченка піднесла народну мову до національної літератури першого рівня.',
    },
    sample: {
      label: { en: 'Vernacular → national literature', uk: 'Народна мова → національна література' },
      text: { en: '«Kobzar» (1840)', uk: '«Кобзар» (1840)' },
      todo: true,
    },
    statusLevel: 3,
  },
  {
    id: 'valuev',
    year: 1863,
    dateLabel: { en: '1863', uk: '1863' },
    tone: 'ban',
    title: { en: 'Valuev Circular', uk: 'Валуєвський циркуляр' },
    body: {
      en: 'The Valuev Circular restricted Ukrainian-language publishing, with the notorious claim that a separate Ukrainian language never existed and could not exist.',
      uk: 'Валуєвський циркуляр обмежив українське книгодрукування зі скандальним твердженням, що окремої української мови не було й бути не може.',
    },
    sample: {
      label: { en: 'The ban, in its own words', uk: 'Заборона власними словами' },
      text: {
        en: '“…never existed, does not exist, and cannot exist.”',
        uk: '«…не було, немає і бути не може»',
      },
    },
    statusLevel: 1,
  },
  {
    id: 'ems',
    year: 1876,
    dateLabel: { en: '1876', uk: '1876' },
    tone: 'ban',
    title: { en: 'Ems Ukaz', uk: 'Емський указ' },
    body: {
      en: 'The Ems Ukaz went further — banning the printing and import of Ukrainian books, Ukrainian theater, and even Ukrainian lyrics printed under songs.',
      uk: 'Емський указ пішов далі — заборонив друк і ввезення українських книжок, український театр і навіть українські тексти під нотами пісень.',
    },
    sample: {
      label: { en: 'What was forbidden', uk: 'Що заборонили' },
      text: {
        en: 'books · theater · even lyrics under songs',
        uk: 'книжки · театр · навіть тексти під піснями',
      },
    },
    statusLevel: 0,
  },
  {
    id: 'korenizatsiia',
    year: 1925,
    dateLabel: { en: '1920s', uk: '1920-ті' },
    tone: 'revival',
    title: { en: 'Korenizatsiia', uk: 'Коренізація' },
    body: {
      en: 'The 1920s korenizatsiia policy briefly promoted Ukrainian in schools and publishing; the language was codified in the 1928 orthography.',
      uk: 'Політика коренізації 1920-х ненадовго просунула українську в школи та видавництва; мову кодифікував правопис 1928 року.',
    },
    sample: {
      label: { en: 'Briefly codified', uk: 'Нетривале кодифікування' },
      text: { en: 'the 1928 orthography', uk: 'правопис 1928 року' },
    },
    statusLevel: 3,
  },
  {
    id: 'executed',
    year: 1933,
    dateLabel: { en: '1930s', uk: '1930-ті' },
    tone: 'ban',
    title: { en: 'Executed Renaissance · russification', uk: 'Розстріляне відродження · русифікація' },
    body: {
      en: 'A brutal reversal: the writers of the 1930s “Executed Renaissance” were repressed or killed, the 1928 orthography was scrapped as “nationalist”, the letter ґ was abolished in 1933, and decades of russification pushed Ukrainian out of cities, science and prestige.',
      uk: 'Брутальний розворот: письменників «Розстріляного відродження» 1930-х репресували або вбили, правопис 1928 року скасували як «націоналістичний», літеру ґ ліквідували 1933-го, а десятиліття русифікації витісняли українську з міст, науки та престижних сфер.',
    },
    sample: {
      label: { en: 'A letter erased', uk: 'Стерта літера' },
      text: { en: 'ґ — abolished 1933', uk: 'ґ — ліквідована 1933' },
      strike: true,
    },
    statusLevel: 1,
  },
  {
    id: 'state',
    year: 1989,
    dateLabel: { en: '1989–1991', uk: '1989–1991' },
    tone: 'revival',
    title: { en: 'State language · the letter returns', uk: 'Державна мова · літера повертається' },
    body: {
      en: 'Ukrainian became the state language in 1989, ahead of independence in 1991; the letter ґ was restored in 1990.',
      uk: 'Українська стала державною мовою 1989 року, ще до незалежності 1991-го; літеру ґ повернули 1990-го.',
    },
    sample: {
      label: { en: 'The letter returns', uk: 'Літера повертається' },
      text: { en: 'ґ — restored 1990', uk: 'ґ — повернена 1990' },
    },
    statusLevel: 4,
  },
  {
    id: 'revival',
    year: 2022,
    dateLabel: { en: '2014 · 2022', uk: '2014 · 2022' },
    tone: 'revival',
    title: { en: 'Revival in real time', uk: 'Відродження в реальному часі' },
    body: {
      en: 'After 2014, and overwhelmingly after the full-scale invasion of 2022, millions of habitual Russian speakers switched to Ukrainian by choice — one of the fastest large-scale language shifts ever observed in Europe.',
      uk: 'Після 2014-го, і особливо після повномасштабного вторгнення 2022 року, мільйони звичних російськомовних свідомо перейшли на українську — один із найшвидших масових мовних зсувів, будь-коли зафіксованих у Європі.',
    },
    sample: {
      label: { en: 'Living laboratory', uk: 'Жива лабораторія' },
      text: {
        en: 'surzhyk — now studied and debated, not just stigmatized',
        uk: 'суржик — тепер предмет дослідження і дискусії, а не лише стигми',
      },
    },
    statusLevel: 4,
  },
];
