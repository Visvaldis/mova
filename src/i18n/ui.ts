// Single source of truth for every localized UI string.
// Article *content* lives in content/*.md — this file is only the site chrome:
// nav, buttons, labels, tooltips, placeholder copy, and the per-interactive blurbs.

export const LANGS = ['en', 'uk'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';

export type UIKey = keyof (typeof ui)['en'];

export const ui = {
  en: {
    'brand': 'Mova',
    'brand.tagline': 'the life of language',
    'skip': 'Skip to content',

    'nav.home': 'Home',
    'nav.timeline': 'Timeline',
    'nav.about': 'About',

    'lang.label': 'EN',
    'lang.full': 'English',
    'lang.switch': 'Switch language',

    'home.hero.kicker': 'Bilingual · interactive · open',
    'home.hero.title': 'How language evolves',
    'home.hero.subtitle':
      'From the first human words to artificial intelligence — six interactive stories about where language came from and where it is going.',
    'home.articles': 'Articles',

    'card.read': 'Read',
    'card.minRead': 'min read',

    'article.previous': 'Previous',
    'article.next': 'Next',
    'article.allArticles': 'All articles',
    'article.tableted': 'In this article',

    'sources.title': 'Explore further',
    'sources.newTab': 'opens in a new tab',

    'interactive.badge': 'Interactive',
    'interactive.comingSoon': 'In progress',
    'interactive.note': "Here's what this hands-on component will let you do:",

    'timeline.title': 'The whole story, on one timeline',
    'timeline.intro':
      'Key dated moments from every article, from deep prehistory to today.',

    'about.title': 'About Mova',
    'about.p1':
      'Mova — Ukrainian for “language” — is an interactive, bilingual project about how human language came to be, and how it keeps changing.',
    'about.p2':
      'Every article pairs a short, accessible read with a hands-on interactive you can explore. The whole site works in both English and Ukrainian — switch any time with the toggle in the top right, and you will stay on the same page.',
    'about.p3':
      'It is open and free, with sources linked under every article so you can dig deeper yourself.',

    'notfound.title': 'Page not found',
    'notfound.body': 'The page you are looking for does not exist.',
    'notfound.home': 'Go home',

    'footer.tagline': 'An open, bilingual project about the evolution of language.',
  },
  uk: {
    'brand': 'Мова',
    'brand.tagline': 'життя мови',
    'skip': 'Перейти до вмісту',

    'nav.home': 'Головна',
    'nav.timeline': 'Хронологія',
    'nav.about': 'Про проєкт',

    'lang.label': 'УК',
    'lang.full': 'Українська',
    'lang.switch': 'Змінити мову',

    'home.hero.kicker': 'Двомовний · інтерактивний · відкритий',
    'home.hero.title': 'Як еволюціонує мова',
    'home.hero.subtitle':
      'Від перших людських слів до штучного інтелекту — шість інтерактивних історій про те, звідки прийшла мова і куди вона прямує.',
    'home.articles': 'Статті',

    'card.read': 'Читати',
    'card.minRead': 'хв читання',

    'article.previous': 'Попередня',
    'article.next': 'Наступна',
    'article.allArticles': 'Усі статті',
    'article.tableted': 'У цій статті',

    'sources.title': 'Дослідити далі',
    'sources.newTab': 'відкривається в новій вкладці',

    'interactive.badge': 'Інтерактив',
    'interactive.comingSoon': 'у розробці',
    'interactive.note': 'Ось що дозволятиме цей інтерактивний компонент:',

    'timeline.title': 'Уся історія на одній шкалі',
    'timeline.intro':
      'Ключові датовані моменти з усіх статей — від глибокої праісторії до сьогодні.',

    'about.title': 'Про Мову',
    'about.p1':
      '«Мова» — це інтерактивний двомовний проєкт про те, як виникла людська мова і як вона невпинно змінюється.',
    'about.p2':
      'Кожна стаття поєднує коротку доступну розповідь з інтерактивом, який можна досліджувати. Увесь сайт працює англійською та українською — перемикайтеся будь-коли кнопкою вгорі праворуч, залишаючись на тій самій сторінці.',
    'about.p3':
      'Проєкт відкритий і безкоштовний, а під кожною статтею є джерела, щоб копнути глибше самостійно.',

    'notfound.title': 'Сторінку не знайдено',
    'notfound.body': 'Сторінки, яку ви шукаєте, не існує.',
    'notfound.home': 'На головну',

    'footer.tagline': 'Відкритий двомовний проєкт про еволюцію мови.',
  },
} as const;

// Topic accent names (the color itself is driven by CSS via data-topic).
export const topicNames: Record<string, Record<Lang, string>> = {
  origins: { en: 'Origins', uk: 'Витоки' },
  families: { en: 'Families', uk: 'Родини' },
  sound: { en: 'Sound change', uk: 'Звукові зміни' },
  ukrainian: { en: 'Ukrainian', uk: 'Українська' },
  internet: { en: 'Internet', uk: 'Інтернет' },
  ai: { en: 'AI', uk: 'ШІ' },
  birth: { en: 'Birth', uk: 'Народження' },
  revival: { en: 'Revival', uk: 'Відродження' },
  writing: { en: 'Writing', uk: 'Письмо' },
  borrowing: { en: 'Borrowing', uk: 'Запозичення' },
  everyday: { en: 'Everyday words', uk: 'Повсякденні слова' },
  roots: { en: 'Roots', uk: 'Корені' },
  names: { en: 'Names', uk: 'Назви' },
  myths: { en: 'Myths', uk: 'Міфи' },
};

// Per-interactive title + one-line description of what the (future) component does.
// Sourced from the CLAUDE.md component specs — no invented facts.
export const interactiveInfo: Record<
  string,
  { icon: string; title: Record<Lang, string>; desc: Record<Lang, string> }
> = {
  'origins-timeline': {
    icon: '🕰️',
    title: {
      en: 'Deep-time language timeline',
      uk: 'Хронологія мови в глибокому часі',
    },
    desc: {
      en: 'Scrub a log-scale timeline from 7 million years ago to today — the split with chimps, Homo erectus, FOXP2, the ~135,000-year linguistic capacity, and the first writing. Compare gesture-first, vocal-first, and gradualist hypotheses.',
      uk: 'Прокручуйте логарифмічну шкалу від 7 мільйонів років тому до сьогодні — розходження з шимпанзе, Homo erectus, FOXP2, мовну здатність ~135 000 років тому і першу писемність. Порівняйте гіпотези «спершу жест», «спершу голос» і градуалізм.',
    },
  },
  'family-tree': {
    icon: '🌳',
    title: {
      en: 'Indo-European family tree',
      uk: 'Дерево індоєвропейських мов',
    },
    desc: {
      en: 'Zoom and collapse the tree from Proto-Indo-European to modern languages. English and Ukrainian are highlighted — click a language to compare the words for “mother”, “three”, and “night”.',
      uk: 'Масштабуйте та згортайте дерево від праіндоєвропейської до сучасних мов. Англійська та українська виділені — натисніть на мову, щоб порівняти слова «мати», «три» і «ніч».',
    },
  },
  'sound-shift': {
    icon: '🔤',
    title: { en: "Grimm's Law explorer", uk: 'Дослідник закону Грімма' },
    desc: {
      en: 'Watch consonants transform by rule (p→f, t→θ, k→h …) as Latin and PIE words morph into English. Try a sound yourself and fire the rule across every example at once.',
      uk: 'Спостерігайте, як приголосні змінюються за правилом (p→f, t→θ, k→h …), перетворюючи латинські та праіндоєвропейські слова на англійські. Спробуйте звук самі й застосуйте правило до всіх прикладів одразу.',
    },
  },
  'ukrainian-timeline': {
    icon: '📜',
    title: { en: 'A thousand years of Ukrainian', uk: 'Тисяча років української' },
    desc: {
      en: 'Scroll from Kyivan Rus to today: Kotliarevsky, Shevchenko, the Valuev Circular and Ems Ukaz bans, the Executed Renaissance, and the modern revival — each era with a sample of the language.',
      uk: 'Прогорніть від Київської Русі до сьогодні: Котляревський, Шевченко, Валуєвський циркуляр та Емський указ, Розстріляне відродження і сучасне відродження — кожна епоха зі зразком мови.',
    },
  },
  'slang-decoder': {
    icon: '💬',
    title: { en: 'Internet slang decoder', uk: 'Декодер інтернет-сленгу' },
    desc: {
      en: 'Flip one sentence between 1990s IRC, 2000s SMS, 2010s Twitter, and 2020s TikTok — then match emoji to the job they do: tone, irony, emphasis, gesture.',
      uk: 'Перемикайте одне речення між IRC 1990-х, SMS 2000-х, твітами 2010-х і TikTok 2020-х — а потім зіставте емодзі з їхньою роллю: тон, іронія, акцент, жест.',
    },
  },
  'ai-language-lab': {
    icon: '🤖',
    title: { en: 'AI language lab', uk: 'Лабораторія мови та ШІ' },
    desc: {
      en: 'Run a toy drift simulator — slide “AI-generated text share” and “human innovation” and watch vocabulary homogenize or diversify. Then take the “human or AI?” quiz.',
      uk: 'Запустіть навчальний симулятор дрейфу — рухайте повзунки «частка тексту від ШІ» та «людська креативність» і дивіться, як словник уніфікується чи урізноманітнюється. Потім пройдіть тест «людина чи ШІ?».',
    },
  },
  'creole-lab': {
    icon: '👐',
    title: { en: 'Creole lab', uk: 'Лабораторія креолів' },
    desc: {
      en: 'See how brand-new languages are born — like the sign language deaf children built from nothing in 1980s Nicaragua, where scientists watched grammar appear.',
      uk: 'Подивіться, як народжуються цілком нові мови — як-от жестова мова, яку глухі діти створили з нічого в Нікарагуа 1980-х, де науковці побачили появу граматики.',
    },
  },
  'vitality-map': {
    icon: '🕯️',
    title: { en: 'Language vitality map', uk: 'Мапа життєздатності мов' },
    desc: {
      en: 'Trace how languages fall silent — roughly one every few weeks — and how Hebrew, Welsh, and Māori were brought back.',
      uk: 'Простежте, як мови замовкають — приблизно одна кожні кілька тижнів — і як іврит, валлійську та маорі повернули до життя.',
    },
  },
  'script-evolver': {
    icon: '✍️',
    title: { en: 'Script evolver', uk: 'Еволюція письма' },
    desc: {
      en: 'Watch writing get invented from scratch — and how the letter A morphed from a drawing of an ox.',
      uk: 'Подивіться, як письмо винаходили з нуля — і як літера А перетворилася з малюнка вола.',
    },
  },
  'word-traveler': {
    icon: '🚢',
    title: { en: 'Word traveler', uk: 'Мандрівник слів' },
    desc: {
      en: 'Follow borrowed words along the trade routes that carried them — say “tea” and you reveal a 400-year-old shipping line.',
      uk: 'Простежте запозичені слова вздовж торгових шляхів, що їх принесли — скажіть «чай» і викриєте морський маршрут 400-річної давнини.',
    },
  },
  'word-xray': {
    icon: '🔍',
    title: { en: 'Word X-ray', uk: 'Рентген слів' },
    desc: {
      en: 'X-ray everyday words to their hidden roots: a muscle is a little mouse, a disaster is a bad star, a companion shares your bread.',
      uk: 'Просвітіть повсякденні слова до прихованих коренів: м’яз — маленька миша, катастрофа — лиха зірка, компаньйон ділить із вами хліб.',
    },
  },
  'roots-garden': {
    icon: '🌱',
    title: { en: 'Roots garden', uk: 'Сад коренів' },
    desc: {
      en: 'Dig into where Ukrainian words come from — some 6,000 years old, and one beloved word coined by a poet in the 1870s.',
      uk: 'Покопайтеся, звідки походять українські слова — деяким 6 000 років, а одне улюблене вигадав поет у 1870-х.',
    },
  },
  'name-map': {
    icon: '📍',
    title: { en: 'Name map', uk: 'Мапа назв' },
    desc: {
      en: 'Unfold the stories inside names — the legend in “Kyiv”, the debate in “Ukraine”, and the Roman egos hiding in your calendar.',
      uk: 'Розгорніть історії всередині назв — легенду в «Києві», дискусію в «Україні» та римські его, сховані у вашому календарі.',
    },
  },
  'myth-buster': {
    icon: '🕵️',
    title: { en: 'Myth buster', uk: 'Руйнівник міфів' },
    desc: {
      en: 'Bust viral word myths — no, “posh” isn’t an acronym and Cossacks aren’t named after goats — and see how some mistakes become the language.',
      uk: 'Розвінчайте вірусні міфи про слова — ні, «posh» не акронім, а козаки не від кози — і подивіться, як деякі помилки стають мовою.',
    },
  },
};
