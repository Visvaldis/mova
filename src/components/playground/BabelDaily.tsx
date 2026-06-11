import { useEffect, useMemo, useState } from 'react';
import type { Lang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import { useInteractiveContext } from '../../lib/page-context';
import data from '../../data/playground/babel.json';

interface BabelLang {
  id: string;
  snippet: string;
  name: Record<Lang, string>;
  aliases: string[];
  family: string;
  branch: string;
  region: Record<Lang, string>;
  speakers: string;
  script: string;
}

const LANGUAGES = (data as unknown as { languages: BabelLang[] }).languages;
const FAMILIES = (data as unknown as { families: Record<string, Record<Lang, string>> }).families;

const MAX_GUESSES = 4;
const EPOCH = Date.UTC(2026, 0, 1); // Jan 1 2026
const STORE_KEY = 'mova:playground:babel';

function dayIndex(): number {
  return Math.max(0, Math.floor((Date.now() - EPOCH) / 86_400_000));
}
function puzzleFor(day: number): BabelLang {
  // Deterministic shuffle-free pick: co-prime stride so consecutive days differ.
  const stride = 17; // gcd(17, LANGUAGES.length) === 1 for 41 languages
  return LANGUAGES[(day * stride) % LANGUAGES.length];
}

interface Stored {
  v: 1;
  day: number;
  guesses: string[]; // language ids (or "?" for not-found text guesses)
  done: boolean;
  won: boolean;
  streak: number;
  played: number;
  lastWinDay: number;
}
function load(): Stored | null {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Stored;
    return s.v === 1 ? s : null;
  } catch {
    return null;
  }
}
function save(s: Stored) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(s));
  } catch {}
}

type Verdict = 'right' | 'branch' | 'family' | 'wrong';
function judge(guess: BabelLang, answer: BabelLang): Verdict {
  if (guess.id === answer.id) return 'right';
  if (guess.family === answer.family && guess.branch === answer.branch) return 'branch';
  if (guess.family === answer.family) return 'family';
  return 'wrong';
}
const TILE: Record<Verdict, string> = { right: '🟩', branch: '🟨', family: '🟨', wrong: '🟥' };

export default function BabelDaily({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const today = dayIndex();
  const [practiceSeed, setPracticeSeed] = useState<number | null>(null);
  const isPractice = practiceSeed !== null;
  const answer = useMemo(
    () => (isPractice ? puzzleFor(practiceSeed!) : puzzleFor(today)),
    [isPractice, practiceSeed, today],
  );
  const sortedLanguageOptions = useMemo(
    () =>
      [...LANGUAGES].sort((a, b) =>
        a.name[lang].localeCompare(b.name[lang], lang === 'uk' ? 'uk' : 'en'),
      ),
    [lang],
  );

  const [guesses, setGuesses] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [won, setWon] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ streak: 0, played: 0 });

  // Hydrate from localStorage (client only).
  useEffect(() => {
    const s = load();
    if (!s) return;
    setStats({ streak: s.streak, played: s.played });
    if (s.day === today) {
      setGuesses(s.guesses);
      setDone(s.done);
      setWon(s.won);
    }
  }, [today]);

  const persist = (g: string[], isDone: boolean, isWon: boolean) => {
    const prev = load();
    const winBroken = isDone && !isWon;
    const next: Stored = {
      v: 1,
      day: today,
      guesses: g,
      done: isDone,
      won: isWon,
      played: (prev?.played ?? 0) + (isDone && !(prev?.day === today && prev.done) ? 1 : 0),
      streak: isDone
        ? isWon
          ? (prev?.lastWinDay === today - 1 || prev?.lastWinDay === today ? (prev?.streak ?? 0) : 0) + (prev?.lastWinDay === today ? 0 : 1)
          : 0
        : prev?.streak ?? 0,
      lastWinDay: isWon ? today : prev?.lastWinDay ?? -99,
    };
    if (winBroken) next.streak = 0;
    save(next);
    setStats({ streak: next.streak, played: next.played });
  };

  const findLang = (text: string): BabelLang | undefined => {
    const q = text.trim().toLowerCase();
    return LANGUAGES.find(
      (l) => l.aliases.includes(q) || l.name.en.toLowerCase() === q || l.name.uk.toLowerCase() === q,
    );
  };

  const submit = () => {
    if (done || !input.trim()) return;
    const g = findLang(input);
    if (!g) {
      setError(t('pg.babel.unknown'));
      return;
    }
    setError('');
    setInput('');
    if (guesses.includes(g.id)) return;
    const next = [...guesses, g.id];
    const verdict = judge(g, answer);
    const isWon = verdict === 'right';
    const isDone = isWon || next.length >= MAX_GUESSES;
    setGuesses(next);
    setDone(isDone);
    setWon(isWon);
    if (!isPractice) persist(next, isDone, isWon);
  };

  const reveal = () => {
    if (done) return;
    setDone(true);
    setWon(false);
    if (!isPractice) persist(guesses, true, false);
  };

  const startPractice = () => {
    setPracticeSeed(Math.floor(Math.random() * 100000));
    setGuesses([]);
    setDone(false);
    setWon(false);
    setInput('');
    setError('');
  };

  const share = async () => {
    const tiles = guesses.map((id) => TILE[judge(LANGUAGES.find((l) => l.id === id)!, answer)]).join('');
    const text = `Babel Daily #${today} ${won ? guesses.length : 'X'}/${MAX_GUESSES}\n${tiles}\nmova`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const hints = [
    { label: t('pg.babel.hint.family'), value: FAMILIES[answer.family]?.[lang] ?? answer.family },
    { label: t('pg.babel.hint.region'), value: answer.region[lang] },
    { label: t('pg.babel.hint.speakers'), value: `${answer.speakers} · ${answer.script}` },
  ];
  const unlockedHints = Math.min(guesses.filter((id) => id !== answer.id).length, hints.length);

  const verdictText = (v: Verdict) =>
    v === 'branch' ? t('pg.babel.rightBranch') : v === 'family' ? t('pg.babel.rightFamily') : t('pg.babel.wrongFamily');

  useInteractiveContext(
    'babel-daily',
    lang === 'uk'
      ? `Гра «Babel Daily»${isPractice ? ' (практика)' : ''}: ${done ? (won ? `вгадано за ${guesses.length}/${MAX_GUESSES} — ${answer.name[lang]}` : `програно — це була ${answer.name[lang]}`) : `${guesses.length}/${MAX_GUESSES} спроб`}. Серія: ${stats.streak}.`
      : `"Babel Daily" game${isPractice ? ' (practice)' : ''}: ${done ? (won ? `guessed in ${guesses.length}/${MAX_GUESSES} — ${answer.name[lang]}` : `lost — it was ${answer.name[lang]}`) : `${guesses.length}/${MAX_GUESSES} guesses`}. Streak: ${stats.streak}.`,
  );

  return (
    <div className="toy" data-toy="babel-daily">
      <p className="muted" style={{ fontSize: '0.9rem' }}>{t('pg.babel.prompt')}</p>
      <blockquote className="big-word" style={{ marginTop: '0.8rem', fontWeight: 600, fontSize: 'clamp(1.15rem, 3vw, 1.5rem)' }} lang="und">
        “{answer.snippet}”
      </blockquote>

      {!done && (
        <form
          className="row"
          style={{ marginTop: '1rem' }}
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <input
            type="text"
            list="babel-langs"
            value={input}
            placeholder={t('pg.babel.placeholder')}
            aria-label={t('pg.babel.placeholder')}
            onChange={(e) => {
              setInput(e.target.value);
              setError('');
            }}
            style={{ flex: '1 1 12rem' }}
          />
          <datalist id="babel-langs">
            {sortedLanguageOptions.map((l) => (
              <option key={l.id} value={l.name[lang]} />
            ))}
          </datalist>
          <button className="pill active" type="submit">{t('pg.babel.guess')}</button>
          <button className="pill" type="button" onClick={reveal}>{t('pg.babel.giveUp')}</button>
        </form>
      )}
      {error && <p className="feedback" role="alert" style={{ marginTop: '0.4rem' }}>{error}</p>}

      <div style={{ marginTop: '1rem', display: 'grid', gap: '0.45rem' }} aria-live="polite">
        {guesses.map((id) => {
          const g = LANGUAGES.find((l) => l.id === id)!;
          const v = judge(g, answer);
          return (
            <div key={id} className="stage-card" style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <span aria-hidden="true">{TILE[v]}</span>
              <strong>{g.name[lang]}</strong>
              {v !== 'right' && <span className="muted feedback">{verdictText(v)}</span>}
            </div>
          );
        })}
      </div>

      {!done && unlockedHints > 0 && (
        <div className="row" style={{ marginTop: '0.9rem' }}>
          {hints.slice(0, unlockedHints).map((h) => (
            <span key={h.label} className="hint-card">
              <strong>{h.label}:</strong> {h.value}
            </span>
          ))}
        </div>
      )}

      {done && (
        <div style={{ marginTop: '1.1rem' }} aria-live="polite">
          <p className="feedback" style={{ fontSize: '1.05rem' }}>
            {won ? `${t('pg.babel.win')} 🎉 ` : `${t('pg.babel.lose')} `}
            <strong className="accent">{answer.name[lang]}</strong>
            {' — '}
            <span className="muted">
              {FAMILIES[answer.family]?.[lang] ?? answer.family} · {answer.region[lang]} · {answer.speakers}
            </span>
          </p>
          <div className="row" style={{ marginTop: '0.7rem' }}>
            {!isPractice && guesses.length > 0 && (
              <button className="pill" onClick={share}>
                {copied ? t('pg.babel.copied') : `📋 ${t('pg.babel.share')}`}
              </button>
            )}
            <button className="pill" onClick={startPractice}>🎲 {t('pg.babel.practice')}</button>
          </div>
          {!isPractice && <p className="toy-note">{t('pg.babel.next')}</p>}
        </div>
      )}

      <div className="statline" style={{ marginTop: '1rem' }}>
        <span>🔥 {t('pg.babel.streak')}: {stats.streak}</span>
        <span>🎯 {t('pg.babel.played')}: {stats.played}</span>
        <span>🌍 {LANGUAGES.length} {t('pg.growing')}</span>
      </div>
    </div>
  );
}
