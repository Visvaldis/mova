// Data for origins-timeline. Explainers are condensed from
// content/{en,uk}/origins-of-language.md. Dates not stated in the article are
// flagged TODO(seva) below.
import type { Lang } from '../../i18n/ui';

export interface Milestone {
  id: string;
  /** Years before present (for the log-scale axis). */
  ybp: number;
  /** TODO(seva): date not given in the article — verify before publishing. */
  dateTodo?: boolean;
  icon: string;
  title: Record<Lang, string>;
  text: Record<Lang, string>;
}

export const MILESTONES: Milestone[] = [
  {
    id: 'split',
    ybp: 7_000_000,
    icon: '🦍',
    title: { en: 'Split from the chimpanzee lineage', uk: 'Відокремлення від лінії шимпанзе' },
    text: {
      en: 'Somewhere between our split from the chimpanzee lineage roughly seven million years ago and the first cave paintings, something happened that has no parallel in the history of life.',
      uk: 'Десь між нашим відокремленням від лінії шимпанзе близько семи мільйонів років тому і першими наскельними малюнками сталося щось, що не має аналогів в історії життя.',
    },
  },
  {
    id: 'erectus',
    ybp: 1_900_000,
    dateTodo: true, // TODO(seva): article names Homo erectus but gives no date
    icon: '🚶',
    title: { en: 'Homo erectus', uk: 'Homo erectus' },
    text: {
      en: 'Researchers triangulate from genes, skulls and archaeology. Homo erectus is a key milestone on the hominin line — whether it had any protolanguage is exactly what the gradualist hypothesis debates.',
      uk: 'Дослідники тріангулюють з генів, черепів та археології. Homo erectus — ключова віха на лінії гомінінів; чи мав він протомову — саме про це сперечається градуалістська гіпотеза.',
    },
  },
  {
    id: 'foxp2',
    ybp: 600_000,
    dateTodo: true, // TODO(seva): article mentions FOXP2 but gives no date
    icon: '🧬',
    title: { en: 'FOXP2 — the articulation gene', uk: 'FOXP2 — ген артикуляції' },
    text: {
      en: 'Human speech anatomy — a lowered larynx, fine breath control, the FOXP2 gene variant tied to articulation — looks heavily selected. Ancient DNA is now recovering speech-related gene variants from Neanderthal genomes.',
      uk: 'Анатомія людського мовлення — опущена гортань, тонкий контроль дихання, варіант гена FOXP2, пов’язаний з артикуляцією, — виглядає результатом сильного добору. Давня ДНК нині відновлює мовні варіанти генів із геномів неандертальців.',
    },
  },
  {
    id: 'capacity',
    ybp: 135_000,
    icon: '🧠',
    title: { en: 'Linguistic capacity (Miyagawa 2025)', uk: 'Мовна здатність (Міяґава 2025)' },
    text: {
      en: 'Every human population alive today has language, so language capacity must predate the earliest population split — which genomic data places around 135,000 years ago. We may have carried language inwardly, as a tool of thought, before it reshaped culture.',
      uk: 'Усі сучасні людські популяції мають мову, отже мовна здатність мусить передувати найранішому розділенню популяцій — яке геномні дані датують приблизно 135 000 років тому. Можливо, ми носили мову всередині, як інструмент мислення, перш ніж вона перетворила культуру.',
    },
  },
  {
    id: 'symbolic',
    ybp: 100_000,
    icon: '🐚',
    title: { en: 'Symbolic behavior', uk: 'Символічна поведінка' },
    text: {
      en: 'Archaeological traces of symbolic behavior — ochre engraving, shell beads, burial goods — cluster around 100,000 years ago, when language became widely used, fueling symbolic thought and cultural evolution.',
      uk: 'Археологічні сліди символічної поведінки — гравірування вохрою, намистини з мушель, поховальні дари — групуються близько 100 000 років тому, коли мова стала широко вживаною, живлячи символічне мислення та культурну еволюцію.',
    },
  },
  {
    id: 'writing',
    ybp: 5_200,
    icon: '𓂀',
    title: { en: 'Writing (~5,200 years ago)', uk: 'Письмо (~5 200 років тому)' },
    text: {
      en: 'Writing is the technology that froze sound — invented from scratch only about four times, starting in Mesopotamia. For 95% of our speaking history, every word ever said vanished as it was spoken.',
      uk: 'Письмо — технологія, що заморозила звук; його винаходили з нуля лише близько чотирьох разів, починаючи з Месопотамії. Протягом 95% нашої мовної історії кожне сказане слово зникало в момент вимови.',
    },
  },
];

/** Hypothesis bands (ranges are schematic — the article describes the hypotheses,
 *  not exact spans; rendered with an explicit "schematic" caption). */
export interface Band {
  id: string;
  from: number; // ybp
  to: number; // ybp
  color: string;
  label: Record<Lang, string>;
  desc: Record<Lang, string>;
}

export const BANDS: Band[] = [
  {
    id: 'gesture',
    from: 2_000_000,
    to: 135_000,
    color: '#0d9488',
    label: { en: 'Gesture-first', uk: 'Спершу жест' },
    desc: {
      en: 'Apes gesture flexibly but vocalize rigidly; sign languages are full languages. Perhaps language began in the hands and migrated to the mouth.',
      uk: 'Мавпи жестикулюють гнучко, а вокалізують жорстко; жестові мови — повноцінні мови. Можливо, мова народилася в руках і потім перейшла до рота.',
    },
  },
  {
    id: 'vocal',
    from: 600_000,
    to: 100_000,
    color: '#db2777',
    label: { en: 'Vocal-first', uk: 'Спершу голос' },
    desc: {
      en: 'Speech anatomy looks heavily selected — why pay that evolutionary cost if voice came late?',
      uk: 'Анатомія мовлення виглядає результатом сильного добору — навіщо платити таку еволюційну ціну, якщо голос з’явився пізно?',
    },
  },
  {
    id: 'gradual',
    from: 1_900_000,
    to: 50_000,
    color: '#b45309',
    label: { en: 'Gradualism', uk: 'Поступовість' },
    desc: {
      en: 'No single leap: protolanguage — words without much grammar — may have existed for hundreds of thousands of years, with full syntax arriving late and possibly fast.',
      uk: 'Жодного стрибка: протомова — слова майже без граматики — могла існувати сотні тисяч років, а повний синтаксис прийшов пізно і, можливо, швидко.',
    },
  },
];

export const AXIS_MIN = 4_000; // ybp (right edge)
export const AXIS_MAX = 8_000_000; // ybp (left edge)
