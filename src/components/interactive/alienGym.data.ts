// Data for the alien-grammar-gym interactive.
// Sources: content/{en,uk}/hollywood-conlangs.md (OVS = "among the rarest
// arrangements", the retroflex D / uvular q / tlh ensemble, the designers and
// their methods). Word-order percentages are approximate shares of surveyed
// languages from WALS (wals.info, feature 81A) — cited in the UI caption, as
// the article itself only says "rarest".
import type { Lang } from '../../i18n/ui';

export const WORDS: Record<'S' | 'V' | 'O', Record<Lang, string>> = {
  S: { en: 'the captain', uk: 'капітан' },
  V: { en: 'sees', uk: 'бачить' },
  O: { en: 'the ship', uk: 'корабель' },
};

export interface OrderInfo {
  id: string; // e.g. 'SOV'
  /** Approximate % of surveyed languages (WALS 81A); 0.5 renders as "<1%". */
  pct: number;
}

export const ORDERS: OrderInfo[] = [
  { id: 'SOV', pct: 41 },
  { id: 'SVO', pct: 35 },
  { id: 'VSO', pct: 7 },
  { id: 'VOS', pct: 2 },
  { id: 'OVS', pct: 1 },
  { id: 'OSV', pct: 0.5 },
];

/* ----------------------------------------------------------------
   Alien-o-meter. rarity: 0 = common everywhere, 1 = uncommon,
   2 = the article's Okrand ensemble (retroflex D, uvular q, tlh).
   The trick scored here is the ensemble, not any single sound.
   ---------------------------------------------------------------- */
export interface Phoneme {
  id: string;
  label: string;
  desc: Record<Lang, string>;
  rarity: 0 | 1 | 2;
}

export const PHONEMES: Phoneme[] = [
  { id: 'm', label: 'm', desc: { en: 'plain nasal — in nearly every language', uk: 'звичайний носовий — майже в кожній мові' }, rarity: 0 },
  { id: 'k', label: 'k', desc: { en: 'plain stop — about as common as sounds get', uk: 'звичайний проривний — найпоширеніший тип звука' }, rarity: 0 },
  { id: 's', label: 's', desc: { en: 'plain sibilant — extremely widespread', uk: 'звичайний свистячий — надзвичайно поширений' }, rarity: 0 },
  { id: 'a', label: 'a', desc: { en: 'the most universal vowel', uk: 'найуніверсальніший голосний' }, rarity: 0 },
  { id: 'glottal', label: 'ʔ', desc: { en: 'glottal stop — common, just unwritten in English', uk: 'гортанне зімкнення — поширене, просто не записується' }, rarity: 1 },
  { id: 'ejective', label: 'kʼ', desc: { en: 'ejective — real, but a minority taste (Frommer gave Na’vi these)', uk: 'еєктивний — справжній, але на любителя (Фроммер дав такі на’ві)' }, rarity: 1 },
  { id: 'retroD', label: 'D', desc: { en: 'retroflex D — real sound, odd neighbor (Klingon)', uk: 'ретрофлексний D — справжній звук, дивний сусід (клінгонська)' }, rarity: 2 },
  { id: 'uvularQ', label: 'q', desc: { en: 'uvular q — real sound, odd neighbor (Klingon)', uk: 'увулярний q — справжній звук, дивний сусід (клінгонська)' }, rarity: 2 },
  { id: 'tlh', label: 'tlh', desc: { en: 'lateral affricate — real sound, odd neighbor (Klingon)', uk: 'бокова африката — справжній звук, дивний сусід (клінгонська)' }, rarity: 2 },
];

export const OKRAND_SET = new Set(['retroD', 'uvularQ', 'tlh']);
export const METER_MAX = 6; // three rarity-2 picks

/* ----------------------------------------------------------------
   Designer match.
   ---------------------------------------------------------------- */
export interface Designer {
  id: string;
  name: string;
  langId: string;
  language: Record<Lang, string>;
  method: Record<Lang, string>;
}

export const DESIGNERS: Designer[] = [
  {
    id: 'okrand',
    name: 'Marc Okrand',
    langId: 'klingon',
    language: { en: 'Klingon', uk: 'Клінгонська' },
    method: {
      en: 'PhD on Mutsun, an extinct Californian language; built Klingon to violate human defaults — nothing impossible, the ensemble is.',
      uk: 'Дисертація про мутсун, вимерлу каліфорнійську мову; збудував клінгонську всупереч людським налаштуванням — неможливого нічого, неможливий ансамбль.',
    },
  },
  {
    id: 'frommer',
    name: 'Paul Frommer',
    langId: 'navi',
    language: { en: 'Na’vi', uk: 'На’ві' },
    method: {
      en: 'USC linguist; gave Na’vi ejective consonants and verb infixes — and still fields vocabulary requests on his blog.',
      uk: 'Лінгвіст з USC; дав на’ві еєктивні приголосні та дієслівні інфікси — і досі приймає запити на слова у своєму блозі.',
    },
  },
  {
    id: 'peterson',
    name: 'David J. Peterson',
    langId: 'dothraki',
    language: { en: 'Dothraki & High Valyrian', uk: 'Дотракійська і високовалірійська' },
    method: {
      en: 'Won the Language Creation Society contest; the Tolkien method industrialized — proto-language, sound laws, evolved season by season.',
      uk: 'Виграв конкурс Language Creation Society; індустріалізований метод Толкіна — прамова, звукові закони, еволюція сезон за сезоном.',
    },
  },
];
