// Data for the myth-buster interactive. Claims, verdicts, and explanations all
// come from content/{en,uk}/etymology-myths.md (plus the cross-referenced
// everyday-etymologies and ukrainian-word-origins articles).
import type { Lang } from '../../i18n/ui';

export interface MythClaim {
  id: string;
  /** true = the claim is REAL history; false = the claim is a MYTH. */
  real: boolean;
  claim: Record<Lang, string>;
  explain: Record<Lang, string>;
}

export const CLAIMS: MythClaim[] = [
  {
    id: 'posh',
    real: false,
    claim: {
      en: '“Posh” comes from “Port Out, Starboard Home” stamped on tickets of Victorian passengers to India.',
      uk: '«Posh» походить від «Port Out, Starboard Home» — штампа на квитках вікторіанських пасажирів до Індії.',
    },
    explain: {
      en: 'Myth. No such ticket has ever been found, and posh appears in slang before the acronym era. Almost no word older than the 20th century comes from an acronym.',
      uk: 'Міф. Жодного такого квитка не знайдено, а posh з’являється у сленгу до ери акронімів. Майже жодне слово, старше за XX століття, не походить від акроніма.',
    },
  },
  {
    id: 'sirloin',
    real: false,
    claim: {
      en: 'A delighted English king knighted a cut of beef “Sir Loin”.',
      uk: 'Захоплений англійський король посвятив шмат яловичини в лицарі — «сер Лойн».',
    },
    explain: {
      en: 'Myth. It’s French sur + loigne, “above the loin”. The knighting story is a backronym-style legend invented after the word.',
      uk: 'Міф. Це французьке sur + loigne — «над поперековиною». Лицарська історія — легенда, вигадана після слова.',
    },
  },
  {
    id: 'kozak',
    real: false,
    claim: {
      en: 'Козак (Cossack) comes from коза — “goat” — for their famed agility.',
      uk: 'Козак походить від «коза» — за славетну спритність.',
    },
    explain: {
      en: 'Myth (folk etymology). It’s Turkic qazaq, “free man, adventurer” — the same root as the ethnonym Kazakh. First attested for Dnipro steppe freemen in 1492.',
      uk: 'Міф (народна етимологія). Це тюркське qazaq — «вільна людина, шукач пригод», той самий корінь, що в етнонімі казах. Уперше засвідчене щодо дніпровських степовиків 1492 року.',
    },
  },
  {
    id: 'bridegroom',
    real: true,
    claim: {
      en: 'English “bridegroom” was reshaped by mistake: the old word was brydguma, and speakers patched in “groom” when guma (“man”) died out.',
      uk: 'Англійське «bridegroom» перекроїли помилково: давнє слово було brydguma, і мовці підставили «groom», коли guma («чоловік») вимерло.',
    },
    explain: {
      en: 'Real. A textbook case of folk etymology as a force of change: the misanalysis stuck and became the standard word.',
      uk: 'Правда. Підручниковий випадок народної етимології як рушія змін: хибний переаналіз прижився і став нормою.',
    },
  },
  {
    id: 'female',
    real: true,
    claim: {
      en: '“Female” is not related to “male” at all — its spelling was bent by attraction to the unrelated word.',
      uk: '«Female» взагалі не споріднене з «male» — його написання підігнали під неспоріднене слово.',
    },
    explain: {
      en: 'Real. Latin femella (diminutive of femina) was respelled in English under the influence of male. The resemblance is manufactured.',
      uk: 'Правда. Латинське femella (демінутив від femina) переписали в англійській під впливом male. Схожість — сфабрикована.',
    },
  },
  {
    id: 'salary',
    real: false,
    claim: {
      en: 'Roman soldiers were literally paid in salt — that’s why we say “salary”.',
      uk: 'Римським солдатам буквально платили сіллю — звідси «salary».',
    },
    explain: {
      en: 'Myth (mostly). Salarium is connected to sal, “salt” — but the literal payment-in-salt story is a later embroidery with no solid ancient evidence.',
      uk: 'Міф (здебільшого). Salarium пов’язане з sal — «сіль», але історія про буквальну платню сіллю — пізніша вишивка без надійних античних доказів.',
    },
  },
  {
    id: 'golf',
    real: false,
    claim: {
      en: '“Golf” began as the acronym “Gentlemen Only, Ladies Forbidden”.',
      uk: '«Golf» виник як акронім «Gentlemen Only, Ladies Forbidden».',
    },
    explain: {
      en: 'Myth. It’s a Scots word from medieval games, attested centuries before acronyms existed. A classic backronym.',
      uk: 'Міф. Це шотландське слово середньовічних ігор, засвідчене за століття до появи акронімів. Класичний бекронім.',
    },
  },
  {
    id: 'vedmid',
    real: true,
    claim: {
      en: 'Ведмідь literally means “honey-eater” — a stand-in name, because the bear’s true name was taboo.',
      uk: 'Ведмідь буквально означає «той, хто їсть мед» — ім’я-заміна, бо справжнє ім’я ведмедя було табу.',
    },
    explain: {
      en: 'Real. Slavs avoided the inherited PIE name (the root behind Latin ursus) lest they summon the beast — and it vanished from all Slavic. English “bear” (“the brown one”) is the same taboo, different replacement.',
      uk: 'Правда. Слов’яни уникали успадкованого ПІЄ-імені (корінь латинського ursus), щоб не накликати звіра, — і воно зникло з усіх слов’янських мов. Англійське bear («бурий») — те саме табу, інша заміна.',
    },
  },
];
