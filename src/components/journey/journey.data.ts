// Journey chapter map (docs/JOURNEY.md) — orchestration only, no facts.
import type { Lang } from '../../i18n/ui';

export interface Chapter {
  num: number;
  icon: string;
  title: Record<Lang, string>;
  slugs: string[];
  toy: string; // playground toy id
}

export const CHAPTERS: Chapter[] = [
  {
    num: 1, icon: '🦴',
    title: { en: 'Where language comes from', uk: 'Звідки береться мова' },
    slugs: ['origins-of-language', 'new-languages', 'language-and-thought'],
    toy: 'babel-daily',
  },
  {
    num: 2, icon: '🌳',
    title: { en: 'How languages change', uk: 'Як мови змінюються' },
    slugs: ['language-families', 'sound-change', 'dialects-and-accents'],
    toy: 'sound-shift-sandbox',
  },
  {
    num: 3, icon: '🇺🇦',
    title: { en: 'The Ukrainian story', uk: 'Українська історія' },
    slugs: ['ukrainian-language-history', 'ukrainian-word-origins', 'names-and-places'],
    toy: 'stratigraph',
  },
  {
    num: 4, icon: '🚢',
    title: { en: 'Words on the move', uk: 'Слова в дорозі' },
    slugs: ['traveling-words', 'everyday-etymologies', 'etymology-myths'],
    toy: 'word-atlas',
  },
  {
    num: 5, icon: '✍️',
    title: { en: 'Freezing and reviving', uk: 'Заморозити й відродити' },
    slugs: ['writing-systems', 'who-wrote-first', 'language-death-and-revival'],
    toy: 'word-time-machine',
  },
  {
    num: 6, icon: '🤖',
    title: { en: 'New frontiers', uk: 'Нові кордони' },
    slugs: ['internet-language', 'ai-and-language', 'constructed-languages', 'machine-languages'],
    toy: 'conlang-forge',
  },
  {
    num: 7, icon: '🛸',
    title: { en: 'The invented tongues', uk: 'Вигадані мови' },
    slugs: ['esperanto', 'tolkien-languages', 'hollywood-conlangs'],
    toy: 'conlang-forge',
  },
];
