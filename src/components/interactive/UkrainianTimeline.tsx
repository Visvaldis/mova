// ukrainian-timeline — vertical, scroll-driven timeline of Ukrainian (~9th c. → today).
// Eras stack down a spine; scrolling tracks the active era (highlighting the spine
// dot + a schematic status chart). Prev/Next step the timeline for keyboard/tap use.
// Ban eras carry a red strikethrough motif. All facts come from
// content/{en,uk}/ukrainian-language-history.md (see ukrainianTimeline.data.ts).
import { useEffect, useRef, useState } from 'react';
import type { Lang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import { useReducedMotion } from './useReducedMotion';
import { ERAS, STATUS_MAX } from './ukrainianTimeline.data';
import s from './interactive.module.css';
import u from './ukrainianTimeline.module.css';

const CW = 640; // chart viewBox width
const CH = 120; // chart viewBox height
const CPAD_X = 24;
const CPAD_TOP = 14;
const CPAD_BOT = 30;

function chartX(i: number): number {
  if (ERAS.length === 1) return CW / 2;
  return CPAD_X + (i / (ERAS.length - 1)) * (CW - 2 * CPAD_X);
}
function chartY(level: number): number {
  const f = level / STATUS_MAX; // 0..1
  return CPAD_TOP + (1 - f) * (CH - CPAD_TOP - CPAD_BOT);
}

export default function UkrainianTimeline({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const reduced = useReducedMotion();

  const [activeIdx, setActiveIdx] = useState(0);
  // Progressive enhancement: only hide-then-reveal cards once JS is up AND motion
  // is allowed. SSR/no-JS markup stays fully visible.
  const [enhanced, setEnhanced] = useState(false);
  // Which cards have been scrolled into view (drives the entrance). Tracked in React
  // state — not via imperative classList — so re-renders never wipe the reveal.
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  const reveal = (idx: number) =>
    setRevealed((prev) => (prev.has(idx) ? prev : new Set(prev).add(idx)));

  useEffect(() => {
    setEnhanced(!reduced);
  }, [reduced]);

  // Track the era nearest the viewport center → active; reveal cards as they enter.
  useEffect(() => {
    const nodes = itemRefs.current.filter(Boolean) as HTMLLIElement[];
    if (!nodes.length) return;

    // Reveal anything already on screen at mount so enabling .enhanced can't flash
    // visible cards to hidden.
    if (typeof window !== 'undefined') {
      const vh = window.innerHeight || 0;
      nodes.forEach((n) => {
        const r = n.getBoundingClientRect();
        if (r.top < vh && r.bottom > 0) reveal(Number(n.dataset.idx));
      });
    }

    if (typeof IntersectionObserver === 'undefined') {
      nodes.forEach((n) => reveal(Number(n.dataset.idx))); // no IO → just show all
      return;
    }

    const ratios = new Map<number, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const idx = Number((e.target as HTMLElement).dataset.idx);
          if (e.isIntersecting) {
            ratios.set(idx, e.intersectionRatio);
            reveal(idx);
          } else {
            ratios.delete(idx);
          }
        }
        let best = -1;
        let bestRatio = -1;
        for (const [idx, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = idx;
          }
        }
        if (best >= 0) setActiveIdx(best);
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  function goTo(idx: number) {
    const clamped = Math.max(0, Math.min(ERAS.length - 1, idx));
    setActiveIdx(clamped);
    reveal(clamped);
    itemRefs.current[clamped]?.scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
      block: 'center',
    });
  }

  return (
    <div
      className={`${s.panel} ${u.wrap} ${enhanced ? u.enhanced : ''}`}
      data-interactive-id="ukrainian-timeline"
    >
      <p className={s.caption} style={{ marginTop: 0 }}>
        {t('ukrainianTimeline.intro')}
      </p>

      {/* ---- schematic status chart ---- */}
      <svg
        className={u.chart}
        viewBox={`0 0 ${CW} ${CH}`}
        role="img"
        aria-label={t('ukrainianTimeline.chartAria')}
        style={{ marginTop: 8 }}
      >
        {/* y end-labels */}
        <text x={CPAD_X} y={chartY(STATUS_MAX) - 3} fontSize="10" fill="var(--muted)">
          ↑ {t('ukrainianTimeline.chartHigh')}
        </text>
        <text x={CPAD_X} y={chartY(0) + 12} fontSize="10" fill="var(--muted)">
          ↓ {t('ukrainianTimeline.chartLow')}
        </text>

        {/* status step line */}
        <polyline
          points={ERAS.map((e, i) => `${chartX(i)},${chartY(e.statusLevel)}`).join(' ')}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinejoin="round"
          opacity={0.55}
        />

        {/* era points (clickable jump targets) */}
        {ERAS.map((e, i) => {
          const cx = chartX(i);
          const cy = chartY(e.statusLevel);
          const isActive = i === activeIdx;
          const color = e.tone === 'ban' ? 'var(--ut-ban)' : 'var(--accent)';
          return (
            <g key={e.id}>
              <circle
                className={u.chartDot}
                cx={cx}
                cy={cy}
                r={isActive ? 7 : 4.5}
                fill={isActive ? color : 'var(--bg-elev)'}
                stroke={color}
                strokeWidth="2"
                tabIndex={0}
                role="button"
                aria-label={`${e.title[lang]} — ${e.dateLabel[lang]}`}
                onClick={() => goTo(i)}
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault();
                    goTo(i);
                  }
                }}
              />
              {isActive && (
                <text x={cx} y={CH - 8} textAnchor="middle" fontSize="10" fontWeight="700" fill={color}>
                  {e.dateLabel[lang]}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <p className={s.muted} style={{ fontSize: '0.75rem', textAlign: 'center', margin: '2px 0 0' }}>
        {t('ukrainianTimeline.chartCaption')}
      </p>

      {/* ---- step controls ---- */}
      <div className={s.row} style={{ justifyContent: 'space-between', marginTop: 12 }}>
        <button
          className={s.pill}
          onClick={() => goTo(activeIdx - 1)}
          disabled={activeIdx === 0}
          aria-label={t('ukrainianTimeline.prev')}
        >
          ← {t('ukrainianTimeline.prev')}
        </button>
        <span
          className={s.muted}
          style={{ fontSize: '0.85rem', fontWeight: 700 }}
          aria-live="polite"
        >
          {t('ukrainianTimeline.era')} {activeIdx + 1} / {ERAS.length}
        </span>
        <button
          className={s.pill}
          onClick={() => goTo(activeIdx + 1)}
          disabled={activeIdx === ERAS.length - 1}
          aria-label={t('ukrainianTimeline.next')}
        >
          {t('ukrainianTimeline.next')} →
        </button>
      </div>

      {/* ---- the timeline itself ---- */}
      <ol className={u.list}>
        {ERAS.map((e, i) => {
          const isBan = e.tone === 'ban';
          const isRevival = e.tone === 'revival';
          const isActive = i === activeIdx;
          const isIn = revealed.has(i);
          return (
            <li
              key={e.id}
              data-idx={i}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className={u.item}
            >
              <span
                className={`${u.dot} ${isBan ? u.dotBan : ''} ${isActive ? u.dotActive : ''}`}
                aria-hidden="true"
              />
              <div
                className={[
                  u.card,
                  isBan ? u.cardBan : '',
                  isRevival ? u.cardRevival : '',
                  isActive ? u.cardActive : '',
                  isIn ? u.inview : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className={u.head}>
                  <span className={`${u.date} ${isBan ? u.dateBan : ''}`}>{e.dateLabel[lang]}</span>
                  {isBan && (
                    <span className={`${u.badge} ${u.badgeBan}`}>⊘ {t('ukrainianTimeline.banBadge')}</span>
                  )}
                  {isRevival && (
                    <span className={`${u.badge} ${u.badgeRevival}`}>
                      ↑ {t('ukrainianTimeline.revivalBadge')}
                    </span>
                  )}
                </div>
                <h3 className={`${u.title} ${isBan ? u.titleBan : ''}`}>{e.title[lang]}</h3>
                <p className={u.body}>{e.body[lang]}</p>
                <div className={`${u.sample} ${isBan ? u.sampleBan : ''}`}>
                  <span className={u.sampleLabel}>{e.sample.label[lang]}</span>
                  <span className={`${u.sampleText} ${e.sample.strike ? u.sampleStrike : ''}`}>
                    {e.sample.text[lang]}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
