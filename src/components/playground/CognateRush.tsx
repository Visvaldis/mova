import { useEffect, useMemo, useRef, useState } from 'react';
import type { Lang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import data from '../../data/playground/cognates.json';

interface Pair {
  id: string;
  a: string; // English
  b: string; // Ukrainian
  false: boolean;
  root: string;
  note: Record<Lang, string>;
}
const PAIRS = (data as unknown as { pairs: Pair[] }).pairs;

const ROUND_SECONDS = 60;
const STORE_KEY = 'mova:playground:cognate-rush';

interface Card {
  key: string;
  pairId: string;
  text: string;
  side: 'a' | 'b';
}

function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function dealRound(): Card[] {
  const trues = shuffle(PAIRS.filter((p) => !p.false)).slice(0, 4);
  const falses = shuffle(PAIRS.filter((p) => p.false)).slice(0, 2);
  const chosen = [...trues, ...falses];
  return shuffle(
    chosen.flatMap((p): Card[] => [
      { key: `${p.id}-a`, pairId: p.id, text: p.a, side: 'a' },
      { key: `${p.id}-b`, pairId: p.id, text: p.b, side: 'b' },
    ]),
  );
}

function loadBest(): number {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw).best ?? 0) : 0;
  } catch {
    return 0;
  }
}

export default function CognateRush({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const [phase, setPhase] = useState<'idle' | 'play' | 'done'>('idle');
  const [cards, setCards] = useState<Card[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Card | null>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [flash, setFlash] = useState<{ kind: 'hit' | 'trap' | 'miss'; pair?: Pair } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => setBest(loadBest()), []);
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const start = () => {
    setCards(dealRound());
    setMatched(new Set());
    setSelected(null);
    setScore(0);
    setTimeLeft(ROUND_SECONDS);
    setFlash(null);
    setPhase('play');
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase('done');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  // Persist best on finish.
  useEffect(() => {
    if (phase !== 'done') return;
    setBest((prev) => {
      const next = Math.max(prev, score);
      try { localStorage.setItem(STORE_KEY, JSON.stringify({ v: 1, best: next })); } catch {}
      return next;
    });
  }, [phase, score]);

  const allMatched = useMemo(
    () => cards.length > 0 && cards.every((c) => matched.has(c.pairId)),
    [cards, matched],
  );
  useEffect(() => {
    if (phase === 'play' && allMatched) {
      // Deal a fresh board, keep clock running — the "rush".
      setCards(dealRound());
      setMatched(new Set());
      setSelected(null);
    }
  }, [phase, allMatched]);

  const pick = (card: Card) => {
    if (phase !== 'play' || matched.has(card.pairId)) return;
    if (!selected) {
      setSelected(card);
      setFlash(null);
      return;
    }
    if (selected.key === card.key) {
      setSelected(null);
      return;
    }
    const pair = PAIRS.find((p) => p.id === card.pairId)!;
    if (selected.pairId === card.pairId) {
      setMatched((m) => new Set(m).add(card.pairId));
      if (pair.false) {
        setScore((s) => s - 5);
        setFlash({ kind: 'trap', pair });
      } else {
        setScore((s) => s + 10);
        setFlash({ kind: 'hit', pair });
      }
    } else {
      setFlash({ kind: 'miss' });
    }
    setSelected(null);
  };

  return (
    <div className="toy" data-toy="cognate-rush">
      <p className="muted" style={{ fontSize: '0.9rem' }}>{t('pg.cgr.how')}</p>

      <div className="statline" style={{ marginTop: '0.8rem' }}>
        <span>⏱ {t('pg.cgr.time')}: {phase === 'play' ? timeLeft : ROUND_SECONDS}s</span>
        <span>🎯 {t('pg.cgr.score')}: {score}</span>
        <span>🏆 {t('pg.cgr.best')}: {best}</span>
      </div>

      {phase !== 'play' ? (
        <div style={{ marginTop: '1rem' }} aria-live="polite">
          {phase === 'done' && (
            <p className="feedback" style={{ fontSize: '1.05rem', marginBottom: '0.7rem' }}>
              {t('pg.cgr.timeUp')} {t('pg.cgr.score')}: <strong className="accent">{score}</strong>
            </p>
          )}
          <button className="pill active" onClick={start}>
            ▶ {phase === 'done' ? t('pg.cgr.again') : t('pg.cgr.start')}
          </button>
        </div>
      ) : (
        <>
          <div
            style={{
              marginTop: '1rem', display: 'grid', gap: '0.5rem',
              gridTemplateColumns: 'repeat(auto-fill, minmax(8.5rem, 1fr))',
            }}
            role="group"
          >
            {cards.map((card) => {
              const done = matched.has(card.pairId);
              const pair = PAIRS.find((p) => p.id === card.pairId)!;
              const isSel = selected?.key === card.key;
              return (
                <button
                  key={card.key}
                  className="pill"
                  aria-pressed={isSel}
                  disabled={done}
                  onClick={() => pick(card)}
                  style={{
                    padding: '0.8rem 0.5rem', fontSize: '1.02rem', justifyContent: 'center', display: 'flex',
                    opacity: done ? 0.45 : 1,
                    background: done ? (pair.false ? 'color-mix(in srgb, #dc2626 25%, transparent)' : 'var(--accent-soft)') : isSel ? 'var(--accent)' : undefined,
                    color: isSel ? 'var(--on-accent)' : undefined,
                    borderColor: isSel ? 'var(--accent)' : undefined,
                  }}
                >
                  {card.text}
                </button>
              );
            })}
          </div>

          {flash && (
            <div className="stage-card" style={{ marginTop: '0.8rem' }} aria-live="assertive">
              {flash.kind === 'miss' && <span className="muted">{t('pg.cgr.miss')}</span>}
              {flash.kind === 'hit' && flash.pair && (
                <>
                  <strong className="accent">+10 · {t('pg.cgr.hit')}</strong>{' '}
                  {flash.pair.root && <span className="muted">{t('pg.cgr.root')}: {flash.pair.root} — </span>}
                  <span className="muted">{flash.pair.note[lang]}</span>
                </>
              )}
              {flash.kind === 'trap' && flash.pair && (
                <>
                  <strong style={{ color: '#dc2626' }}>−5 · {t('pg.cgr.trap')}</strong>{' '}
                  <span className="muted">{flash.pair.note[lang]}</span>
                </>
              )}
            </div>
          )}
        </>
      )}

      <p className="toy-note">{t('pg.cgr.note')}</p>
    </div>
  );
}
