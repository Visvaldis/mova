// master-timeline (task 310) — every dated milestone from every article on one
// log-scaled axis, colored by topic, clicking through to the source article.
import { useMemo, useState } from 'react';
import { topicNames } from '../../i18n/ui';
import { useTranslations, localizedPath, type Lang } from '../../i18n/utils';
import { TIMELINE_EVENTS } from '../../data/timelineEvents';
import s from './interactive.module.css';

const NOW = 2026;
const W = 760;
const PAD = 30;
const AXIS_MIN_YBP = 2; // right edge ≈ today
const AXIS_MAX_YBP = 8_000_000;

/** Mid-tone topic colors readable on both themes (mirrors global accents). */
const TOPIC_COLOR: Record<string, string> = {
  origins: '#d97706', families: '#0d9488', sound: '#8b5cf6', ukrainian: '#3b82f6',
  internet: '#ec4899', ai: '#10b981', birth: '#84cc16', revival: '#f43f5e',
  writing: '#ea580c', borrowing: '#06b6d4', everyday: '#ca8a04', roots: '#22c55e',
  names: '#6366f1', myths: '#ef4444', thought: '#818cf8', dialects: '#a3e635',
  conlangs: '#d946ef', machine: '#64748b',
};

const ybpOf = (year: number) => Math.max(AXIS_MIN_YBP, NOW - year);
function x(ybp: number): number {
  const lo = Math.log10(AXIS_MIN_YBP);
  const hi = Math.log10(AXIS_MAX_YBP);
  return PAD + (1 - (Math.log10(ybp) - lo) / (hi - lo)) * (W - 2 * PAD);
}

function fmtYear(year: number, lang: Lang): string {
  if (year <= -10000) {
    const k = Math.round(-year / 1000);
    return lang === 'uk' ? `~${k.toLocaleString('uk-UA')} тис. р. до н.е.` : `~${k.toLocaleString('en-US')},000 BCE`;
  }
  if (year < 0) return lang === 'uk' ? `${-year} до н.е.` : `${-year} BCE`;
  return String(year);
}

export default function MasterTimeline({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const events = useMemo(() => [...TIMELINE_EVENTS].sort((a, b) => a.year - b.year), []);
  const [idx, setIdx] = useState(events.length - 1); // start on today’s end
  const [onlyTopic, setOnlyTopic] = useState<string | null>(null);

  const topics = useMemo(() => [...new Set(events.map((e) => e.topic))], [events]);
  const active = events[idx];
  const visible = (topic: string) => onlyTopic === null || onlyTopic === topic;

  const step = (dir: 1 | -1) => {
    let i = idx;
    do {
      i = Math.min(events.length - 1, Math.max(0, i + dir));
    } while (i > 0 && i < events.length - 1 && !visible(events[i].topic) && events[i] !== events[idx]);
    setIdx(i);
  };

  return (
    <div className={s.panel} data-interactive-id="master-timeline">
      {/* topic legend (tap to isolate) */}
      <div className={s.row} role="group" aria-label={t('timeline.legend')}>
        {topics.map((topic) => (
          <button
            key={topic}
            className={s.pill}
            aria-pressed={onlyTopic === topic}
            onClick={() => setOnlyTopic(onlyTopic === topic ? null : topic)}
            style={{ borderColor: TOPIC_COLOR[topic] ?? 'var(--line)', opacity: visible(topic) ? 1 : 0.4, fontSize: '0.8rem', padding: '0.25rem 0.65rem' }}
          >
            <span aria-hidden="true" style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 99, background: TOPIC_COLOR[topic], marginRight: 5 }} />
            {topicNames[topic]?.[lang] ?? topic}
          </button>
        ))}
      </div>

      {/* axis */}
      <svg viewBox={`0 0 ${W} 96`} role="img" aria-label={t('timeline.axisLabel')} style={{ width: '100%', height: 'auto', marginTop: 12 }}>
        <line x1={PAD} y1={56} x2={W - PAD} y2={56} stroke="var(--line)" strokeWidth="2" />
        {[7_000_000, 100_000, 5_000, 1_000, 200, 10].map((tick) => (
          <g key={tick}>
            <line x1={x(tick)} y1={52} x2={x(tick)} y2={60} stroke="var(--muted)" strokeWidth="1.2" />
            <text x={x(tick)} y={74} textAnchor="middle" fontSize="9" fill="var(--muted)">
              {tick >= 1_000_000 ? `${tick / 1_000_000}M` : tick >= 1000 ? `${tick / 1000}k` : tick}
            </text>
          </g>
        ))}
        <text x={W - PAD} y={74} textAnchor="end" fontSize="9" fill="var(--muted)">{t('timeline.today')}</text>

        {events.map((e, i) => {
          const cx = x(ybpOf(e.year));
          const isActive = i === idx;
          const dimmed = !visible(e.topic);
          // stagger node heights a little so dense modern decades stay tappable
          const cy = 56 - (isActive ? 0 : (i % 3) * 7);
          return (
            <g key={`${e.slug}-${e.year}`} opacity={dimmed ? 0.18 : 1} style={{ cursor: 'pointer', transition: 'opacity 0.2s' }} onClick={() => setIdx(i)}>
              <line x1={cx} y1={cy} x2={cx} y2={56} stroke={TOPIC_COLOR[e.topic]} strokeWidth="1" opacity="0.6" />
              <circle cx={cx} cy={cy} r={isActive ? 8 : 4.5} fill={TOPIC_COLOR[e.topic]} stroke="var(--bg-elev)" strokeWidth={isActive ? 2 : 1} />
              <circle
                cx={cx} cy={cy} r={12} fill="transparent" tabIndex={dimmed ? -1 : 0} role="button"
                aria-label={`${fmtYear(e.year, lang)} — ${e.title[lang]}`}
                onKeyDown={(ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); setIdx(i); } }}
              />
            </g>
          );
        })}
      </svg>
      <p className={s.muted} style={{ textAlign: 'center', fontSize: '0.75rem', margin: '2px 0 0' }}>{t('timeline.logNote')}</p>

      {/* step buttons (mobile-friendly scrub) */}
      <div className={s.row} style={{ justifyContent: 'center', marginTop: 8 }}>
        <button className={s.pill} onClick={() => step(-1)} disabled={idx === 0} aria-label={t('timeline.prev')}>← {t('timeline.prev')}</button>
        <button className={s.pill} onClick={() => step(1)} disabled={idx === events.length - 1} aria-label={t('timeline.next')}>{t('timeline.next')} →</button>
      </div>

      {/* event card */}
      <div className={s.card} style={{ marginTop: 12, borderLeftColor: TOPIC_COLOR[active.topic] }} aria-live="polite" key={`${active.slug}-${active.year}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline', flexWrap: 'wrap' }}>
          <strong style={{ fontSize: '1.05rem' }}>{active.title[lang]}</strong>
          <span style={{ color: TOPIC_COLOR[active.topic], fontWeight: 800, fontSize: '0.9rem' }}>{fmtYear(active.year, lang)}</span>
        </div>
        <p className={s.muted} style={{ fontSize: '0.95rem', margin: '6px 0 8px' }}>{active.blurb[lang]}</p>
        <a href={localizedPath(lang, active.slug)} style={{ fontSize: '0.9rem', fontWeight: 600 }}>
          {t('timeline.openArticle')} →
        </a>
      </div>
    </div>
  );
}
