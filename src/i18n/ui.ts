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
    'nav.playground': 'Playground',
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

    'pg.title': 'Playground',
    'pg.intro':
      'Free-play language toys. Bring your own words — the linguistics responds. Everything runs in your browser; nothing is sent anywhere.',
    'pg.related': 'Related articles',
    'pg.daily': 'Daily',
    'pg.minutes': 'min',
    'pg.backToHub': 'All toys',
    'pg.growing': 'curated entries — and growing',

    'pg.babel.title': 'Babel Daily',
    'pg.babel.blurb': 'One mystery language a day. Guess it in 4 tries — every miss unlocks a hint.',
    'pg.babel.prompt': 'This sentence is the same in every puzzle — Article 1 of the Universal Declaration of Human Rights. Which language is it?',
    'pg.babel.placeholder': 'Type a language…',
    'pg.babel.guess': 'Guess',
    'pg.babel.giveUp': 'Reveal',
    'pg.babel.win': 'Solved!',
    'pg.babel.lose': 'The answer was',
    'pg.babel.hint.family': 'Family',
    'pg.babel.hint.region': 'Region',
    'pg.babel.hint.speakers': 'Speakers',
    'pg.babel.wrongFamily': 'wrong family',
    'pg.babel.rightFamily': 'right family!',
    'pg.babel.rightBranch': 'right branch!',
    'pg.babel.streak': 'Streak',
    'pg.babel.played': 'Played',
    'pg.babel.share': 'Copy result',
    'pg.babel.copied': 'Copied!',
    'pg.babel.next': 'Next puzzle at midnight UTC',
    'pg.babel.practice': 'Practice round (random)',
    'pg.babel.unknown': 'Not in our language list — try another spelling',

    'pg.wtm.title': 'Word Time Machine',
    'pg.wtm.blurb': 'Pick a word and ride it back through the centuries — some routes go 6,000 years deep.',
    'pg.wtm.pick': 'Pick a word',
    'pg.wtm.surprise': 'Surprise me',
    'pg.wtm.reconstructed': '* = reconstructed form (never written down — inferred by the comparative method)',
    'pg.wtm.cognates': 'Same root, other routes',
    'pg.wtm.source': 'Source',
    'pg.wtm.search': 'Search the curated set…',
    'pg.wtm.empty': 'Not in our hand-checked set yet. We only show etymologies we can source — see the myths article for why that matters.',

    'pg.sss.title': 'Sound Shift Sandbox',
    'pg.sss.blurb': 'Type your name and run it through real historical sound laws. What would Grimm’s Law do to you?',
    'pg.sss.input': 'Type a word or name…',
    'pg.sss.pack': 'Sound law',
    'pg.sss.apply': 'What fired',
    'pg.sss.noChange': 'Shift-proof! No rule in this pack applies to your word. 🛡️',
    'pg.sss.note': 'A toy, honestly labeled: real laws applied outside their real language and era. The rules themselves are genuine — see the article.',
    'pg.sss.before': 'Before',
    'pg.sss.after': 'After',
  },
  uk: {
    'brand': 'Мова',
    'brand.tagline': 'життя мови',
    'skip': 'Перейти до вмісту',

    'nav.home': 'Головна',
    'nav.timeline': 'Хронологія',
    'nav.playground': 'Майданчик',
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

    'pg.title': 'Майданчик',
    'pg.intro':
      'Мовні іграшки для вільної гри. Приносьте власні слова — лінгвістика відповість. Усе працює у вашому браузері; нічого нікуди не надсилається.',
    'pg.related': 'Повʼязані статті',
    'pg.daily': 'Щоденна',
    'pg.minutes': 'хв',
    'pg.backToHub': 'Усі іграшки',
    'pg.growing': 'перевірених записів — і колекція росте',

    'pg.babel.title': 'Вавилон щодня',
    'pg.babel.blurb': 'Одна загадкова мова на день. Вгадайте за 4 спроби — кожен промах відкриває підказку.',
    'pg.babel.prompt': 'Це речення однакове в кожній загадці — стаття 1 Загальної декларації прав людини. Якою це мовою?',
    'pg.babel.placeholder': 'Введіть мову…',
    'pg.babel.guess': 'Вгадати',
    'pg.babel.giveUp': 'Показати',
    'pg.babel.win': 'Розгадано!',
    'pg.babel.lose': 'Відповідь:',
    'pg.babel.hint.family': 'Родина',
    'pg.babel.hint.region': 'Регіон',
    'pg.babel.hint.speakers': 'Мовці',
    'pg.babel.wrongFamily': 'не та родина',
    'pg.babel.rightFamily': 'родина правильна!',
    'pg.babel.rightBranch': 'гілка правильна!',
    'pg.babel.streak': 'Серія',
    'pg.babel.played': 'Зіграно',
    'pg.babel.share': 'Скопіювати результат',
    'pg.babel.copied': 'Скопійовано!',
    'pg.babel.next': 'Наступна загадка опівночі за UTC',
    'pg.babel.practice': 'Тренувальний раунд (випадковий)',
    'pg.babel.unknown': 'Немає в нашому списку мов — спробуйте інше написання',

    'pg.wtm.title': 'Машина часу для слів',
    'pg.wtm.blurb': 'Оберіть слово і проїдьте з ним крізь століття — деякі маршрути сягають 6 000 років.',
    'pg.wtm.pick': 'Оберіть слово',
    'pg.wtm.surprise': 'Здивуйте мене',
    'pg.wtm.reconstructed': '* = реконструйована форма (ніколи не записана — виведена порівняльним методом)',
    'pg.wtm.cognates': 'Той самий корінь, інші маршрути',
    'pg.wtm.source': 'Джерело',
    'pg.wtm.search': 'Пошук у перевіреному наборі…',
    'pg.wtm.empty': 'Цього слова ще немає в нашому перевіреному наборі. Ми показуємо лише етимології з джерелами — стаття про міфи пояснює, чому це важливо.',

    'pg.sss.title': 'Пісочниця звукових зсувів',
    'pg.sss.blurb': 'Введіть своє імʼя і прокрутіть його крізь справжні історичні звукові закони. Що зробив би з вами закон Ґрімма?',
    'pg.sss.input': 'Введіть слово або імʼя…',
    'pg.sss.pack': 'Звуковий закон',
    'pg.sss.apply': 'Що спрацювало',
    'pg.sss.noChange': 'Стійке до зсувів! Жодне правило цього набору не застосовне. 🛡️',
    'pg.sss.note': 'Іграшка з чесною етикеткою: справжні закони поза їхньою мовою та епохою. Самі правила автентичні — див. статтю.',
    'pg.sss.before': 'До',
    'pg.sss.after': 'Після',
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
  thought: { en: 'Language & thought', uk: 'Мова і мислення' },
  dialects: { en: 'Dialects', uk: 'Діалекти' },
  conlangs: { en: 'Constructed languages', uk: 'Штучні мови' },
  machine: { en: 'Machine languages', uk: 'Машинні мови' },
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
  'thought-lens': {
    icon: '🔵',
    title: { en: 'Thought lens', uk: 'Лінза мислення' },
    desc: {
      en: 'Place your own boundary on a blue gradient, then see where English (one blue) and Ukrainian (синій/блакитний) conventionally cut it — and compare what each grammar forces you to encode.',
      uk: 'Поставте власну межу на синьому градієнті, а тоді побачте, де її проводять англійська (один синій) та українська (синій/блакитний) — і порівняйте, що кожна граматика змушує вас кодувати.',
    },
  },
  'accent-atlas': {
    icon: '🗣️',
    title: { en: 'Accent atlas', uk: 'Атлас акцентів' },
    desc: {
      en: 'Explore Ukraine’s three dialect groups on a map, slide along a village-to-village continuum, and see phonetically why паляниця works as a shibboleth.',
      uk: 'Дослідіть три наріччя України на мапі, проїдьтеся континуумом від села до села і побачте фонетично, чому паляниця працює як шиболет.',
    },
  },
  'conlang-workbench': {
    icon: '🧪',
    title: { en: 'Conlang workbench', uk: 'Майстерня штучних мов' },
    desc: {
      en: 'Combine Toki Pona’s tiny vocabulary into new meanings, walk the timeline from Lingua Ignota to Valyrian, and test how much Esperanto you can read on sight.',
      uk: 'Складайте крихітний словник токіпони в нові значення, пройдіть хронологію від Lingua Ignota до валірійської і перевірте, скільки есперанто ви прочитаєте з ходу.',
    },
  },
  'code-vs-speech': {
    icon: '🧠',
    title: { en: 'Code vs speech', uk: 'Код проти мовлення' },
    desc: {
      en: 'Score a Ukrainian sentence against a Python snippet on Hockett’s design features — then see which brain network each one lights up.',
      uk: 'Оцініть українське речення проти фрагмента Python за ознаками мови Гокетта — і побачте, яку мережу мозку вмикає кожне.',
    },
  },
};
