// Master-timeline dataset (task 300). RULE: every event is stated in the named
// article (content/{en,uk}/<slug>.md) — nothing invented here. Years with a `~`
// in the blurb are the articles' own approximations; `year` is the plot anchor
// (negative = BCE).
import type { Lang } from '../i18n/ui';

export interface TimelineEvent {
  /** Calendar year; negative = BCE. Used as the plot anchor. */
  year: number;
  title: Record<Lang, string>;
  blurb: Record<Lang, string>;
  topic: string;
  slug: string;
}

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: -7000000, topic: 'origins', slug: 'origins-of-language',
    title: { en: 'Split from the chimpanzee lineage', uk: 'Відокремлення від лінії шимпанзе' },
    blurb: { en: '~7 million years ago. Somewhere after this point, something happened with no parallel in the history of life.', uk: '~7 мільйонів років тому. Десь після цього сталося щось без аналогів в історії життя.' },
  },
  {
    year: -135000, topic: 'origins', slug: 'origins-of-language',
    title: { en: 'Linguistic capacity present', uk: 'Мовна здатність уже є' },
    blurb: { en: 'Genomics dates the earliest human population split to ~135,000 years ago — language capacity must be at least that old (Miyagawa 2025).', uk: 'Геноміка датує найраніше розділення людських популяцій ~135 000 років тому — мовна здатність щонайменше така ж давня (Міяґава 2025).' },
  },
  {
    year: -100000, topic: 'origins', slug: 'origins-of-language',
    title: { en: 'Symbolic behavior', uk: 'Символічна поведінка' },
    blurb: { en: 'Ochre engraving, shell beads, burial goods cluster around 100,000 years ago.', uk: 'Гравірування вохрою, намистини з мушель, поховальні дари групуються близько 100 000 років тому.' },
  },
  {
    year: -3500, topic: 'families', slug: 'language-families',
    title: { en: 'Proto-Indo-European spoken', uk: 'Звучить праіндоєвропейська' },
    blurb: { en: '~5,000–6,000 years ago, most likely by herders of the Pontic-Caspian steppe.', uk: '~5 000–6 000 років тому, найімовірніше скотарями понтійсько-каспійського степу.' },
  },
  {
    year: -3300, topic: 'writing', slug: 'writing-systems',
    title: { en: 'Writing invented in Mesopotamia', uk: 'У Месопотамії винайдено письмо' },
    blurb: { en: 'Cuneiform grows out of clay accounting tokens; the first documents are receipts.', uk: 'Клинопис виростає з глиняних облікових жетонів; перші документи — квитанції.' },
  },
  {
    year: -3200, topic: 'writing', slug: 'writing-systems',
    title: { en: 'Egyptian writing', uk: 'Єгипетське письмо' },
    blurb: { en: 'The second independent invention.', uk: 'Другий незалежний винахід.' },
  },
  {
    year: -1800, topic: 'writing', slug: 'writing-systems',
    title: { en: 'The first alphabet (Proto-Sinaitic)', uk: 'Перший алфавіт (протосинайське письмо)' },
    blurb: { en: '~1900–1700 BCE: Semitic workers in Egypt reuse hieroglyphs for first sounds only — thirty-ish signs a child can master.', uk: '~1900–1700 до н.е.: семітські робітники в Єгипті використовують ієрогліфи лише для перших звуків — близько тридцяти знаків, які опанує дитина.' },
  },
  {
    year: -1200, topic: 'writing', slug: 'writing-systems',
    title: { en: 'Chinese writing', uk: 'Китайське письмо' },
    blurb: { en: 'The third independent invention.', uk: 'Третій незалежний винахід.' },
  },
  {
    year: -600, topic: 'writing', slug: 'writing-systems',
    title: { en: 'Mesoamerican writing', uk: 'Мезоамериканське письмо' },
    blurb: { en: 'The fourth and last independent invention.', uk: 'Четвертий і останній незалежний винахід.' },
  },
  {
    year: -500, topic: 'sound', slug: 'sound-change',
    title: { en: "Grimm's Law fires", uk: 'Спрацьовує закон Ґрімма' },
    blurb: { en: 'In the first millennium BCE, the ancestors of the Germanic languages rotate their whole stop-consonant system.', uk: 'У першому тисячолітті до н.е. предки германських мов обертають усю систему проривних приголосних.' },
  },
  {
    year: 850, topic: 'writing', slug: 'writing-systems',
    title: { en: 'Slavic scripts created', uk: 'Створено слов’янські письма' },
    blurb: { en: '9th century: Cyril and Methodius devise Glagolitic; their students in Bulgaria build Cyrillic from Greek letterforms.', uk: 'IX століття: Кирило й Мефодій створюють глаголицю; їхні учні в Болгарії будують кирилицю з грецьких літерних форм.' },
  },
  {
    year: 1066, topic: 'families', slug: 'language-families',
    title: { en: 'Norman conquest reshapes English', uk: 'Норманське завоювання переробляє англійську' },
    blurb: { en: 'English keeps Germanic grammar but absorbs a mostly French-Latin dictionary.', uk: 'Англійська зберігає германську граматику, але вбирає переважно французько-латинський словник.' },
  },
  {
    year: 1187, topic: 'names', slug: 'names-and-places',
    title: { en: '“Україна” first attested', uk: 'Перша згадка назви «Україна»' },
    blurb: { en: 'Attested in chronicles from 1187 — and its etymology (“borderland” vs “own land”) is still a live debate.', uk: 'Засвідчена в літописах від 1187 року — а її етимологія («окраїна» чи «своя земля») досі жива дискусія.' },
  },
  {
    year: 1240, topic: 'ukrainian', slug: 'ukrainian-language-history',
    title: { en: 'Mongol destruction of Kyiv', uk: 'Монгольське зруйнування Києва' },
    blurb: { en: 'The East Slavic dialect continuum breaks apart politically; Ukrainian, Belarusian and Russian gradually crystallize.', uk: 'Східнослов’янський діалектний континуум політично розпадається; поступово кристалізуються українська, білоруська та російська.' },
  },
  {
    year: 1443, topic: 'writing', slug: 'writing-systems',
    title: { en: 'Hangul designed', uk: 'Сконструйовано хангиль' },
    blurb: { en: 'King Sejong’s court shapes each letter after the tongue and lips making the sound.', uk: 'Двір короля Седжона малює кожну літеру за позицією язика і губ.' },
  },
  {
    year: 1400, topic: 'sound', slug: 'sound-change',
    title: { en: 'Great Vowel Shift begins', uk: 'Починається Великий зсув голосних' },
    blurb: { en: '1400–1700: every English long vowel rotates — why English spelling preserves medieval pronunciation.', uk: '1400–1700: кожен довгий голосний англійської обертається — тому її правопис зберігає середньовічну вимову.' },
  },
  {
    year: 1786, topic: 'families', slug: 'language-families',
    title: { en: 'William Jones spots the family', uk: 'Вільям Джонс помічає родину' },
    blurb: { en: 'In Calcutta he concludes Sanskrit, Latin and Greek “sprang from some common source”.', uk: 'У Калькутті він робить висновок, що санскрит, латина і грецька «постали зі спільного джерела».' },
  },
  {
    year: 1798, topic: 'ukrainian', slug: 'ukrainian-language-history',
    title: { en: 'Kotliarevsky’s Eneida', uk: '«Енеїда» Котляревського' },
    blurb: { en: 'The conventional start of modern literary Ukrainian — Virgil retold in the living vernacular.', uk: 'Умовний початок нової української літературної мови — Верґілій, переспіваний живою народною мовою.' },
  },
  {
    year: 1822, topic: 'sound', slug: 'sound-change',
    title: { en: 'Grimm publishes his law', uk: 'Ґрімм публікує свій закон' },
    blurb: { en: 'Systematic consonant correspondences turn linguistics into a science.', uk: 'Системні відповідності приголосних перетворюють лінгвістику на науку.' },
  },
  {
    year: 1840, topic: 'ukrainian', slug: 'ukrainian-language-history',
    title: { en: 'Shevchenko’s Kobzar', uk: '«Кобзар» Шевченка' },
    blurb: { en: 'The peasant vernacular becomes a national literary language of the first rank.', uk: 'Народна мова стає національною літературою першого рівня.' },
  },
  {
    year: 1863, topic: 'ukrainian', slug: 'ukrainian-language-history',
    title: { en: 'Valuev Circular', uk: 'Валуєвський циркуляр' },
    blurb: { en: 'Restricts Ukrainian publishing: the language “never existed, does not exist, and cannot exist”.', uk: 'Обмежує українське книгодрукування: мови «не було, немає і бути не може».' },
  },
  {
    year: 1864, topic: 'everyday', slug: 'everyday-etymologies',
    title: { en: '“Deadline” is a real line', uk: '«Дедлайн» — справжня лінія' },
    blurb: { en: 'A line around an American Civil War prison camp: cross it and be shot.', uk: 'Лінія навколо табору полонених Громадянської війни США: перетнеш — стрілятимуть.' },
  },
  {
    year: 1870, topic: 'roots', slug: 'ukrainian-word-origins',
    title: { en: 'Мрія is coined', uk: 'Укарбовано мрію' },
    blurb: { en: '1870s: Mykhailo Starytsky creates the word from мріти — a word with a birth certificate.', uk: '1870-ті: Михайло Старицький творить слово від мріти — слово зі свідоцтвом про народження.' },
  },
  {
    year: 1875, topic: 'sound', slug: 'sound-change',
    title: { en: 'Verner’s Law', uk: 'Закон Вернера' },
    blurb: { en: 'The “exceptions” to Grimm dissolve — regularity all the way down.', uk: '«Винятки» з Ґрімма розчиняються — регулярність до самого дна.' },
  },
  {
    year: 1876, topic: 'ukrainian', slug: 'ukrainian-language-history',
    title: { en: 'Ems Ukaz', uk: 'Емський указ' },
    blurb: { en: 'Bans printing and importing Ukrainian books, Ukrainian theater, even lyrics under songs.', uk: 'Забороняє друк і ввезення українських книжок, театр, навіть тексти під нотами пісень.' },
  },
  {
    year: 1879, topic: 'conlangs', slug: 'constructed-languages',
    title: { en: 'Volapük', uk: 'Волапюк' },
    blurb: { en: 'Hundreds of thousands of enthusiasts — then schisms over grammar: a natural fate for any language community.', uk: 'Сотні тисяч ентузіастів — а тоді схизми через граматику: природна доля будь-якої мовної спільноти.' },
  },
  {
    year: 1880, topic: 'revival', slug: 'language-death-and-revival',
    title: { en: 'Hebrew revival begins', uk: 'Починається відродження івриту' },
    blurb: { en: 'No native speakers for ~1,700 years; Ben-Yehuda raises the first one — today ~9 million.', uk: '~1 700 років без носіїв; Бен-Єгуда виховує першого — сьогодні ~9 мільйонів.' },
  },
  {
    year: 1887, topic: 'conlangs', slug: 'esperanto',
    title: { en: 'Esperanto', uk: 'Есперанто' },
    blurb: { en: 'Doktoro Esperanto — “the doctor who hopes” — publishes sixteen exception-free rules; the pseudonym swallows the project.', uk: 'Doktoro Esperanto — «лікар, який сподівається» — видає шістнадцять правил без винятків; псевдонім поглинає проєкт.' },
  },
  {
    year: 1905, topic: 'conlangs', slug: 'esperanto',
    title: { en: 'The Fundamento', uk: 'Fundamento' },
    blurb: { en: 'Esperanto’s grammar is frozen as its untouchable constitution; the first World Congress meets the same year.', uk: 'Граматику есперанто заморожено як недоторканну конституцію; того ж року збирається перший Всесвітній конгрес.' },
  },
  {
    year: 1931, topic: 'conlangs', slug: 'tolkien-languages',
    title: { en: 'A Secret Vice', uk: 'A Secret Vice' },
    blurb: { en: 'Tolkien confesses language invention as a private art form — the foundation his stories were built to house.', uk: 'Толкін зізнається у вигадуванні мов як приватному мистецтві — фундаменті, для якого й були збудовані його історії.' },
  },
  {
    year: 1923, topic: 'ukrainian', slug: 'ukrainian-language-history',
    title: { en: 'Korenizatsiia', uk: 'Коренізація' },
    blurb: { en: 'The 1920s briefly push Ukrainian into schools and publishing — before a brutal reversal.', uk: '1920-ті ненадовго просувають українську в школи та видавництва — перед брутальним розворотом.' },
  },
  {
    year: 1933, topic: 'ukrainian', slug: 'ukrainian-language-history',
    title: { en: 'The letter ґ abolished', uk: 'Ліквідовано літеру ґ' },
    blurb: { en: 'The 1928 orthography is scrapped as “nationalist”; the Executed Renaissance is repressed.', uk: 'Правопис 1928 року скасовано як «націоналістичний»; Розстріляне відродження репресовано.' },
  },
  {
    year: 1937, topic: 'conlangs', slug: 'esperanto',
    title: { en: 'Esperantists under terror', uk: 'Есперантисти під терором' },
    blurb: { en: '1937–38: Soviet Esperantists branded “spies of the international bourgeoisie” — arrested, deported, shot in the thousands.', uk: '1937–38: радянських есперантистів таврують «шпигунами міжнародної буржуазії» — арешти, депортації, розстріли тисячами.' },
  },
  {
    year: 1944, topic: 'revival', slug: 'language-death-and-revival',
    title: { en: 'Crimean Tatar deportation', uk: 'Депортація кримських татар' },
    blurb: { en: 'The language is severely endangered after 1944; revival work continues under the hardest conditions.', uk: 'Після 1944 року мова серйозно загрожена; відроджувальна робота триває в найважчих умовах.' },
  },
  {
    year: 1956, topic: 'machine', slug: 'machine-languages',
    title: { en: 'Chomsky hierarchy', uk: 'Ієрархія Хомського' },
    blurb: { en: '1950s: meant as a theory of human grammar, it becomes the load-bearing wall of every compiler.', uk: '1950-ті: задумана як теорія людської граматики, стає несучою стіною кожного компілятора.' },
  },
  {
    year: 1977, topic: 'birth', slug: 'new-languages',
    title: { en: 'Nicaraguan Sign Language is born', uk: 'Народжується нікарагуанська жестова' },
    blurb: { en: 'Deaf schools open in Managua; the children build a new language — and scientists watch grammar appear.', uk: 'У Манагуа відкриваються школи для глухих; діти будують нову мову — і науковці бачать появу граматики.' },
  },
  {
    year: 1984, topic: 'conlangs', slug: 'hollywood-conlangs',
    title: { en: 'Klingon', uk: 'Клінгонська' },
    blurb: { en: 'Okrand builds it deliberately alien — object–verb–subject, an impossible ensemble of real sounds — and it acquires Shakespeare anyway.', uk: 'Окранд будує її навмисно чужою — додаток–дієслово–підмет, неможливий ансамбль справжніх звуків — і вона однаково обростає Шекспіром.' },
  },
  {
    year: 1989, topic: 'ukrainian', slug: 'ukrainian-language-history',
    title: { en: 'Ukrainian becomes the state language', uk: 'Українська стає державною' },
    blurb: { en: 'Ahead of independence in 1991; the letter ґ returns in 1990.', uk: 'Ще до незалежності 1991-го; літера ґ повертається 1990-го.' },
  },
  {
    year: 2001, topic: 'conlangs', slug: 'constructed-languages',
    title: { en: 'Toki Pona', uk: 'Токіпона' },
    blurb: { en: 'Sonja Lang’s 120–140-word language of good things — linguistic relativity as a usable toy.', uk: '120–140 слів Соні Ланг — мовна відносність як іграшка, якою можна користуватись.' },
  },
  {
    year: 2009, topic: 'conlangs', slug: 'hollywood-conlangs',
    title: { en: 'The Peterson era', uk: 'Епоха Пітерсона' },
    blurb: { en: 'Frommer’s Na’vi hits screens; the Language Creation Society contest hands Peterson Dothraki — conlanging becomes a profession.', uk: 'На’ві Фроммера виходить на екрани; конкурс Language Creation Society віддає Пітерсону дотракійську — конлангінг стає професією.' },
  },
  {
    year: 2008, topic: 'revival', slug: 'language-death-and-revival',
    title: { en: 'Eyak falls silent', uk: 'Замовкає еяк' },
    blurb: { en: 'January 21, 2008: Marie Smith Jones dies in Anchorage — the last speaker.', uk: '21 січня 2008: в Анкориджі помирає Марі Сміт Джонс — остання мовець.' },
  },
  {
    year: 2014, topic: 'ukrainian', slug: 'ukrainian-language-history',
    title: { en: 'The shift accelerates', uk: 'Зсув пришвидшується' },
    blurb: { en: 'After 2014 — and overwhelmingly after 2022 — millions switch to Ukrainian by choice.', uk: 'Після 2014-го — і особливо після 2022-го — мільйони свідомо переходять на українську.' },
  },
  {
    year: 2020, topic: 'machine', slug: 'machine-languages',
    title: { en: 'Code is not language (to the brain)', uk: 'Код — не мова (для мозку)' },
    blurb: { en: 'MIT’s Fedorenko lab: reading code activates the multiple-demand network, not the language network.', uk: 'Лабораторія Федоренко в MIT: читання коду вмикає мережу множинних завдань, а не мовну мережу.' },
  },
  {
    year: 2023, topic: 'ai', slug: 'ai-and-language',
    title: { en: 'Machines join the conversation', uk: 'Машини приєднуються до розмови' },
    blurb: { en: 'Around 2023 a second kind of participant enters language change at scale; chatbot-favored words like “delve” spike in human writing.', uk: 'Близько 2023 року в мовні зміни масово входить другий тип учасника; улюблені слова чат-ботів на кшталт delve частішають у людських текстах.' },
  },
];
