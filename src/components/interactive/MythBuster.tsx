// myth-buster — "real or myth?" etymology quiz with a final ranking.
// Tabloid-vs-dictionary feel: claim card → verdict reveal → score.
import { useState } from 'react';
import type { Lang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import { CLAIMS } from './mythBuster.data';
import { useReducedMotion } from './useReducedMotion';
import { useInteractiveContext } from '../../lib/page-context';
import s from './interactive.module.css';

export default function MythBuster({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null); // user's call: true = "real"
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const claim = CLAIMS[index];
  const isLast = index === CLAIMS.length - 1;
  const wasCorrect = answered !== null && answered === claim.real;

  useInteractiveContext(
    'myth-buster',
    lang === 'uk'
      ? `Інтерактив «Руйнівник міфів»: ${finished ? `завершено, ${score}/${CLAIMS.length}` : `картка ${index + 1}/${CLAIMS.length}, бал ${score}`}.`
      : `"Myth Buster" interactive: ${finished ? `finished, ${score}/${CLAIMS.length}` : `card ${index + 1}/${CLAIMS.length}, score ${score}`}.`,
  );

  const answer = (call: boolean) => {
    if (answered !== null) return;
    setAnswered(call);
    if (call === claim.real) setScore((sc) => sc + 1);
  };

  const next = () => {
    if (isLast) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setAnswered(null);
  };

  const restart = () => {
    setIndex(0);
    setAnswered(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const rank = score <= 4 ? t('mythBuster.rank0') : score <= 6 ? t('mythBuster.rank1') : t('mythBuster.rank2');
    return (
      <div className={s.panel} data-interactive-id="myth-buster" aria-live="polite">
        <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
          <div style={{ fontSize: '2.4rem', fontWeight: 800 }}>
            <span className={s.accent}>{score}</span> / {CLAIMS.length}
          </div>
          <div className={s.muted} style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {t('mythBuster.score')}
          </div>
          <p style={{ fontSize: '1.1rem', marginTop: '0.8rem' }}>{rank}</p>
          <p className={s.muted} style={{ fontSize: '0.9rem', marginTop: '0.6rem' }}>{t('mythBuster.tip')}</p>
          <button className={s.pill} onClick={restart} style={{ marginTop: '1rem' }}>
            ↺ {t('mythBuster.again')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={s.panel} data-interactive-id="myth-buster">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span className={s.muted} style={{ fontSize: '0.8rem', fontWeight: 700 }}>
          {t('mythBuster.cardCount')} {index + 1} {t('mythBuster.of')} {CLAIMS.length}
        </span>
        <span className={s.muted} style={{ fontSize: '0.8rem', fontWeight: 700 }}>
          {t('mythBuster.score')}: {score}
        </span>
      </div>
      <p className={s.muted} style={{ fontSize: '0.85rem', margin: '6px 0 0' }}>{t('mythBuster.intro')}</p>

      <div
        key={claim.id}
        className={s.card}
        style={{
          marginTop: 14,
          animation: reduced ? undefined : 'mythbuster-in 0.35s ease',
          borderLeftColor: answered === null ? 'var(--accent)' : wasCorrect ? '#15803d' : '#dc2626',
        }}
      >
        <p style={{ fontSize: '1.12rem', fontWeight: 600, lineHeight: 1.55, margin: 0 }}>{claim.claim[lang]}</p>

        {answered === null ? (
          <div className={s.row} style={{ marginTop: 14 }} role="group" aria-label={`${t('mythBuster.real')} / ${t('mythBuster.myth')}`}>
            <button className={s.pill} onClick={() => answer(true)}>📖 {t('mythBuster.real')}</button>
            <button className={s.pill} onClick={() => answer(false)}>🗞️ {t('mythBuster.myth')}</button>
          </div>
        ) : (
          <div style={{ marginTop: 12 }} aria-live="polite">
            <p style={{ fontWeight: 800, margin: 0, color: wasCorrect ? '#15803d' : '#dc2626' }}>
              {wasCorrect ? `✓ ${t('mythBuster.correct')}` : `✗ ${t('mythBuster.wrong')}`}{' '}
              <span className={s.accent}>{claim.real ? t('mythBuster.real') : t('mythBuster.myth')}</span>
            </p>
            <p className={s.muted} style={{ fontSize: '0.95rem', marginTop: 6 }}>{claim.explain[lang]}</p>
            <button className={s.pill} onClick={next} style={{ marginTop: 10 }}>
              {isLast ? `🏁 ${t('mythBuster.results')}` : `→ ${t('mythBuster.next')}`}
            </button>
          </div>
        )}
      </div>
      <style>{`@keyframes mythbuster-in { 0% { transform: translateX(24px) rotate(0.6deg); opacity: 0; } 100% { transform: none; opacity: 1; } }`}</style>
    </div>
  );
}
