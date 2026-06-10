// Playground toy registry. Adding a toy = one entry here + one component.
// Pages (hub + per-toy) are generated from this list.

export interface ToyMeta {
  id: string;
  icon: string;
  /** i18n key prefix: `${key}.title` and `${key}.blurb` must exist in ui.ts */
  key: string;
  /** Rough minutes of play, shown on the hub card. */
  minutes: number;
  daily?: boolean;
  /** Article slugs for the "related articles" links. */
  related: string[];
}

export const TOYS: ToyMeta[] = [
  {
    id: 'babel-daily',
    icon: '🌍',
    key: 'pg.babel',
    minutes: 2,
    daily: true,
    related: ['language-families', 'dialects-and-accents'],
  },
  {
    id: 'word-time-machine',
    icon: '⏳',
    key: 'pg.wtm',
    minutes: 5,
    related: ['everyday-etymologies', 'ukrainian-word-origins', 'traveling-words'],
  },
  {
    id: 'sound-shift-sandbox',
    icon: '🔀',
    key: 'pg.sss',
    minutes: 3,
    related: ['sound-change', 'language-families'],
  },
];
