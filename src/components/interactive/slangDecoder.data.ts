// Data for the slang-decoder interactive. Everything traces to
// content/{en,uk}/internet-language.md.
//
// What the article gives us directly (used verbatim as anchors):
//   • "informal writing" is the article's name for the phenomenon part (a) shows.
//   • "typographical tone of voice": ok / ok. / OK / okay!! / kk encode attitude.
//   • lol (title) — the native word of informal writing.
//   • 💀 — in the pull-quote "punctuation, capitals, and 💀"; emoji as emphasis.
//   • 😉 — "doesn't replace a sentence; it tells you how to take one" (irony/tone).
//   • Emoji "do in writing what hands, eyebrows, and tone do in speech" (gesture).
//   • "dropping emoji from a friendly message can read as cold" (tone softener).
//   • UK attested tokens: лол, кринж, рофлити, скролити, забанити, бавовна, приліт, двіж.
//
// TODO(seva): the article does NOT give a verbatim four-era sentence — part (a)'s
//   renderings are an *illustrative reconstruction* of "informal writing" built only
//   from article-attested atoms (lol/лол, CAPS, 😂/💀), captioned as illustrative in
//   the UI. Likewise the article names 😉 (irony) and 💀 (emphasis) explicitly but
//   only states the *principle* behind "gesture replacement" (🤷) and "tone softener"
//   (😊); those two emoji instantiate the article's claim rather than being named in it.
import type { Lang } from '../../i18n/ui';

export type EraId = 'irc' | 'sms' | 'twitter' | 'tiktok';

export interface Era {
  id: EraId;
  /** Decade label (numeric — same in both languages). */
  decade: string;
  /** Platform name (proper noun, but provide both for script/markup parity). */
  name: Record<Lang, string>;
  /** The one message rendered in this era's conventions. */
  text: Record<Lang, string>;
  /** One line on what this era added to informal writing. */
  note: Record<Lang, string>;
}

// One message ("that's so funny"), flipped across four eras.
export const ERAS: Era[] = [
  {
    id: 'irc',
    decade: '1990s',
    name: { en: 'IRC', uk: 'IRC' },
    text: { en: 'lol that is so funny', uk: 'лол це так смішно' },
    note: {
      en: '“lol” is born — the first native word of informal writing, typed fast and lower-case.',
      uk: '«лол» народжується — перше питоме слово неформального письма, набране швидко й малими літерами.',
    },
  },
  {
    id: 'sms',
    decade: '2000s',
    name: { en: 'SMS', uk: 'SMS' },
    text: { en: 'lol thats so funny im ded', uk: 'лол дуже смішно я не можу' },
    note: {
      en: 'Character limits squeeze out apostrophes and vowels; a misspelling like “ded” carries the tone.',
      uk: 'Ліміт символів витискає апострофи й зайве; написання «не можу» несе тон, а не зміст.',
    },
  },
  {
    id: 'twitter',
    decade: '2010s',
    name: { en: 'Twitter', uk: 'Twitter' },
    text: { en: 'i’m crying 😂 that is SO funny', uk: 'я плачу 😂 це ТАК смішно' },
    note: {
      en: 'Emoji arrive as gesture and CAPS become a “typographical tone of voice”.',
      uk: 'Емодзі входять як жест, а ВЕЛИКІ літери стають «типографічним тоном голосу».',
    },
  },
  {
    id: 'tiktok',
    decade: '2020s',
    name: { en: 'TikTok', uk: 'TikTok' },
    text: { en: 'that’s so funny im 💀', uk: 'це так смішно я 💀' },
    note: {
      en: '💀 (“dying”) stands in for the whole reaction — tone rebuilt out of punctuation, capitals, and 💀.',
      uk: '💀 («вмираю») заміняє цілу реакцію — тон зібрано заново з пунктуації, великих літер і 💀.',
    },
  },
];

export type FnId = 'softener' | 'irony' | 'gesture' | 'emphasis';

export interface EmojiFn {
  id: FnId;
  /** The emoji whose job this is. */
  emoji: string;
  label: Record<Lang, string>;
  /** Shown once matched — ties the job back to the article. */
  blurb: Record<Lang, string>;
}

// Emoji ⇄ the gesture-like job it does, per McCulloch (via the article).
export const EMOJI_FNS: EmojiFn[] = [
  {
    id: 'softener',
    emoji: '😊',
    label: { en: 'Tone softener', uk: 'Помʼякшувач тону' },
    blurb: {
      en: 'A friendly message with no emoji can read as cold — a 😊 warms the tone back up.',
      uk: 'Дружнє повідомлення без емодзі може здатися холодним — 😊 повертає теплий тон.',
    },
  },
  {
    id: 'irony',
    emoji: '😉',
    label: { en: 'Irony marker', uk: 'Маркер іронії' },
    blurb: {
      en: 'A 😉 doesn’t replace a sentence — it tells you how to take one (here: don’t take it straight).',
      uk: '😉 не замінює речення — воно каже, як його сприймати (тут: не буквально).',
    },
  },
  {
    id: 'gesture',
    emoji: '🤷',
    label: { en: 'Gesture replacement', uk: 'Заміна жесту' },
    blurb: {
      en: 'Emoji do in writing what hands, eyebrows, and tone do in speech — a 🤷 is a gesture you can type.',
      uk: 'Емодзі роблять у письмі те, що руки, брови й інтонація — у мовленні; 🤷 — це жест, який можна надрукувати.',
    },
  },
  {
    id: 'emphasis',
    emoji: '💀',
    label: { en: 'Emphasis', uk: 'Підсилення' },
    blurb: {
      en: 'We rebuilt tone out of punctuation, capitals, and 💀 — here it cranks the reaction to the max.',
      uk: 'Тон ми зібрали заново з пунктуації, великих літер і 💀 — тут воно підкручує реакцію на максимум.',
    },
  },
];
