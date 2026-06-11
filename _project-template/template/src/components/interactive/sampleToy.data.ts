// Bulky bilingual *content data* for an island lives here (not in ui.ts).
// This sample has no real content; it exists to show the file's shape and the
// `{ en, uk }` per-item pattern your real data files should follow.
import type { Lang } from '../../i18n/utils';

export interface Example {
  word: { en: string; uk: string };
}

export const EXAMPLES: Example[] = [
  { word: { en: 'language', uk: 'мова' } },
  { word: { en: 'story', uk: 'історія' } },
];

export const pick = (lang: Lang, e: Example) => e.word[lang];
