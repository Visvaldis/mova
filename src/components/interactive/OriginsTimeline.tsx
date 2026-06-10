// origins-timeline — horizontal log-scale deep-time timeline (7 Mya → today)
// with milestone nodes and a compare-hypotheses band overlay.
import { useState } from 'react';
import type { Lang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import { MILESTONES, BANDS, AXIS_MIN, AXIS_MAX } from './originsTimeline.data';
import s from './interactive.module.css';

const W = 720;
const H_BASE = 120;
const PAD = 28;

/** Map years-before-present to x on a log scale (old → left). */
function x(ybp: number): number {
  const lo = Math.log10(AXIS_MIN);
  const hi = Math.log10(AXIS_MAX);
  const f = (Math.log10(ybp) - lo) / (hi - lo);
  return PAD + (1 - f) * (W - 2 * PAD);
}

function fmtYbp(ybp: number, t: (k: any) => string): string {
  if (ybp >= 1_000_000) return `${(ybp / 1_000_000).toLocaleString(undefined, { maximumFractionDigits: 1 })} ${t('originsTimeline.mya')}`;
  if (ybp >= 10_000) return `${Math.round(ybp / 1000)} ${t('originsTimeline.kya')}`;
  return `${ybp.toLocaleString()} ${t('originsTimeline.yearsAgo')}`;
}

export default function OriginsTimeline({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const [activeIdx, setActiveIdx] = useState(3); // start on the 135 kya headline
  const [showBands, setShowBands] = useState(false);

  const active = MILESTONES[activeIdx];
  const bandsH = showBands ? BANDS.length * 16 + 8 : 0;
  const axisY = 30 + bandsH;
  const H = H_BASE + bandsH;

  return (
    <div className={s.panel} data-interactive-id="origins-timeline">
      <div className={s.row} style={{ justifyContent: 'space-between' }}>
        <div className={s.row} role="group">
          <button
            className={s.pill}
            onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
            disabled={activeIdx === 0}
            aria-label={t('originsTimeline.prev')}
          >
            ← {fmtYbp(MILESTONES[Math.max(0, activeIdx - 1)].ybp, t)}
          </button>
          <button
            className={s.pill}
            onClick={() => setActiveIdx((i) => Math.min(MILESTONES.length - 1, i + 1))}
            disabled={activeIdx === MILESTONES.length - 1}
            aria-label={t('originsTimeline.next')}
          >
            {fmtYbp(MILESTONES[Math.min(MILESTONES.length - 1, activeIdx + 1)].ybp, t)} →
          </button>
        </div>
        <button className={s.pill} aria-pressed={showBands} onClick={() => setShowBands((b) => !b)}>
          🔬 {t('originsTimeline.hypToggle')}
        </button>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={t('originsTimeline.axisLabel')}
        style={{ width: '100%', height: 'auto', marginTop: 10 }}
      >
        {/* hypothesis bands */}
        {showBands &&
          BANDS.map((b, i) => {
            const x1 = x(b.from);
            const x2 = x(b.to);
            const y = 12 + i * 16;
            return (
              <g key={b.id}>
                <rect x={x1} y={y} width={x2 - x1} height={10} rx={5} fill={b.color} opacity={0.45} />
                <text x={x1 - 6} y={y + 9} textAnchor="end" fontSize="10" fontWeight="700" fill={b.color}>
                  {b.label[lang]}
                </text>
              </g>
            );
          })}

        {/* axis */}
        <line x1={PAD} y1={axisY} x2={W - PAD} y2={axisY} stroke="var(--line)" strokeWidth="2" />
        {[7_000_000, 1_000_000, 100_000, 10_000].map((tick) => (
          <g key={tick}>
            <line x1={x(tick)} y1={axisY - 4} x2={x(tick)} y2={axisY + 4} stroke="var(--muted)" strokeWidth="1.5" />
            <text x={x(tick)} y={axisY + 18} textAnchor="middle" fontSize="10" fill="var(--muted)">
              {fmtYbp(tick, t)}
            </text>
          </g>
        ))}
        <text x={W - PAD} y={axisY + 18} textAnchor="end" fontSize="10" fill="var(--muted)">
          {t('originsTimeline.todayLabel')}
        </text>

        {/* milestone nodes */}
        {MILESTONES.map((m, i) => {
          const cx = x(m.ybp);
          const isActive = i === activeIdx;
          return (
            <g key={m.id} style={{ cursor: 'pointer' }} onClick={() => setActiveIdx(i)}>
              <circle
                cx={cx}
                cy={axisY}
                r={isActive ? 11 : 7}
                fill={isActive ? 'var(--accent)' : 'var(--accent-soft)'}
                stroke="var(--accent)"
                strokeWidth="2"
              />
              <text x={cx} y={axisY - 16} textAnchor="middle" fontSize={isActive ? 16 : 13}>
                {m.icon}
              </text>
              {/* invisible larger hit/focus target */}
              <circle cx={cx} cy={axisY} r={16} fill="transparent" tabIndex={0} role="button"
                aria-label={`${m.title[lang]} — ${fmtYbp(m.ybp, t)}`}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveIdx(i); } }}
              />
            </g>
          );
        })}
      </svg>
      <p className={s.muted} style={{ fontSize: '0.75rem', textAlign: 'center', margin: '2px 0 0' }}>
        {t('originsTimeline.logNote')}
      </p>

      {/* milestone card */}
      <div className={s.card} style={{ marginTop: 12 }} aria-live="polite" key={active.id}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline', flexWrap: 'wrap' }}>
          <strong style={{ fontSize: '1.05rem' }}>{active.icon} {active.title[lang]}</strong>
          <span className={s.accent} style={{ fontWeight: 800, fontSize: '0.9rem' }}>{fmtYbp(active.ybp, t)}</span>
        </div>
        <p className={s.muted} style={{ fontSize: '0.95rem', margin: '6px 0 0' }}>{active.text[lang]}</p>
      </div>

      {showBands && (
        <div style={{ marginTop: 10 }}>
          <p className={s.muted} style={{ fontSize: '0.82rem', margin: 0 }}>{t('originsTimeline.hypHint')}</p>
          <div style={{ display: 'grid', gap: 6, marginTop: 8 }}>
            {BANDS.map((b) => (
              <div key={b.id} className={s.card} style={{ borderLeftColor: b.color }}>
                <strong style={{ color: b.color }}>{b.label[lang]}</strong>{' '}
                <span className={s.muted} style={{ fontSize: '0.9rem' }}>{b.desc[lang]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
