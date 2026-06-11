// ============================================================================
// Single source of truth for every localized UI string (site chrome only).
// Article *content* lives in content/<lang>/<slug>.md — NOT here.
// Rules:
//   • Every key has both `en` and `uk`. Never hardcode user-facing text in JSX.
//   • Component chrome is namespaced by interactive id: 'sampleToy.title', etc.
//   • Bulky bilingual *content data* (word lists, quiz items) goes in a
//     co-located <name>.data.ts file, not here (see CONVENTIONS.md).
// ============================================================================

export const LANGS = ['en', 'uk'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';

export type UIKey = keyof (typeof ui)['en'];

export const ui = {
  en: {
    'brand': 'Storybook',
    'brand.tagline': 'an interactive field guide',
    'skip': 'Skip to content',

    'nav.home': 'Home',
    'nav.about': 'About',

    'lang.label': 'EN',
    'lang.full': 'English',
    'lang.switch': 'Switch language',

    'home.hero.kicker': 'Bilingual · interactive · open',
    'home.hero.title': 'A title for your storybook',
    'home.hero.subtitle':
      'One-line promise of what the reader will explore. Replace this in src/i18n/ui.ts.',
    'home.articles': 'Chapters',
    'home.filterAria': 'Filter chapters by topic',
    'home.filterAll': 'All topics',

    'card.read': 'Read',
    'card.minRead': 'min read',

    'article.previous': 'Previous',
    'article.next': 'Next',
    'article.allArticles': 'All chapters',

    'sources.title': 'Explore further',
    'sources.newTab': 'opens in a new tab',

    'interactive.badge': 'Interactive',
    'interactive.comingSoon': 'In progress',
    'interactive.note': "Here's what this hands-on component will let you do:",

    'about.title': 'About',
    'about.p1': 'What this project is. Replace in ui.ts.',
    'about.p2': 'Why it is bilingual (English + Ukrainian).',
    'about.p3': 'How it was built and who it is for.',

    'notfound.title': 'Page not found',
    'notfound.body': 'That page does not exist.',
    'notfound.home': 'Go home',

    'footer.tagline': '© Storybook — built as a static, bilingual site.',

    // --- per-interactive chrome (namespaced by id) -----------------------
    'sampleToy.title': 'Sample toy',
    'sampleToy.prompt': 'Type a word and watch it transform:',
    'sampleToy.placeholder': 'a word…',
    'sampleToy.reverse': 'Reverse',
    'sampleToy.upper': 'Shout',
    'sampleToy.reset': 'Reset',
    'sampleToy.outLabel': 'Result',
  },
  uk: {
    'brand': 'Storybook',
    'brand.tagline': 'інтерактивний путівник',
    'skip': 'Перейти до вмісту',

    'nav.home': 'Головна',
    'nav.about': 'Про проєкт',

    'lang.label': 'УК',
    'lang.full': 'Українська',
    'lang.switch': 'Змінити мову',

    'home.hero.kicker': 'Двомовний · інтерактивний · відкритий',
    'home.hero.title': 'Заголовок вашого storybook',
    'home.hero.subtitle':
      'Один рядок про те, що читач досліджуватиме. Замініть у src/i18n/ui.ts.',
    'home.articles': 'Розділи',
    'home.filterAria': 'Фільтрувати розділи за темою',
    'home.filterAll': 'Усі теми',

    'card.read': 'Читати',
    'card.minRead': 'хв читання',

    'article.previous': 'Назад',
    'article.next': 'Далі',
    'article.allArticles': 'Усі розділи',

    'sources.title': 'Дізнатися більше',
    'sources.newTab': 'відкриється в новій вкладці',

    'interactive.badge': 'Інтерактив',
    'interactive.comingSoon': 'У розробці',
    'interactive.note': 'Ось що дозволить робити цей інтерактивний компонент:',

    'about.title': 'Про проєкт',
    'about.p1': 'Що це за проєкт. Замініть в ui.ts.',
    'about.p2': 'Чому він двомовний (англійська + українська).',
    'about.p3': 'Як його зроблено і для кого.',

    'notfound.title': 'Сторінку не знайдено',
    'notfound.body': 'Такої сторінки не існує.',
    'notfound.home': 'На головну',

    'footer.tagline': '© Storybook — статичний двомовний сайт.',

    'sampleToy.title': 'Зразковий інтерактив',
    'sampleToy.prompt': 'Введіть слово й подивіться, як воно зміниться:',
    'sampleToy.placeholder': 'слово…',
    'sampleToy.reverse': 'Перевернути',
    'sampleToy.upper': 'Гукнути',
    'sampleToy.reset': 'Скинути',
    'sampleToy.outLabel': 'Результат',
  },
} as const;

// ---- Topic registry --------------------------------------------------------
// One entry per topic id used in article frontmatter. Add a matching accent
// triplet in src/styles/global.css ([data-topic='<id>'], light + dark).
export const topicNames: Record<string, { en: string; uk: string }> = {
  sample: { en: 'Sample topic', uk: 'Зразкова тема' },
  history: { en: 'History', uk: 'Історія' },
};

// ---- Interactive registry (metadata) --------------------------------------
// One entry per interactive id. `desc` seeds the placeholder shown before the
// real component is built — keep it derived from the article summary only.
export const interactiveInfo: Record<
  string,
  { icon: string; title: { en: string; uk: string }; desc: { en: string; uk: string } }
> = {
  'sample-toy': {
    icon: '🔤',
    title: { en: 'Sample toy', uk: 'Зразковий інтерактив' },
    desc: {
      en: 'A tiny demo island: transform a word you type. Replace with your real component.',
      uk: 'Маленький демо-острівець: перетворіть введене слово. Замініть власним компонентом.',
    },
  },
  'sample-two': {
    icon: '✦',
    title: { en: 'Second sample', uk: 'Другий зразок' },
    desc: {
      en: 'Not built yet — this id has no component, so the styled placeholder shows instead.',
      uk: 'Ще не зроблено — для цього id немає компонента, тож показано заглушку.',
    },
  },
};
