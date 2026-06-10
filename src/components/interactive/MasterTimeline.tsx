// master-timeline (task 310) — every dated milestone from every article on one
// timeline, colored by topic, clicking through to the source article.
// Vertical layout: oldest at the top, today at the bottom. The log scale is kept
// as *proportional spacing between rows* — huge gaps across deep time, tight in the
// modern era — so every title stays horizontally readable (the horizontal axis
// crammed them onto one line). Selecting a row expands its blurb + article link.
import { useEffect, useMemo, useRef, useState } from 'react';
import { topicNames } from '../../i18n/ui';
import { useTranslations, localizedPath, type Lang } from '../../i18n/utils';
import { useReducedMotion } from './useReducedMotion';
import { TIMELINE_EVENTS } from '../../data/timelineEvents';
import s from './interactive.module.css';
import m from './MasterTimeline.module.css';

const NOW = 2026;
const AXIS_MIN_YBP = 2; // floor so "today" stays on the log scale

/** Mid-tone topic colors readable on both themes (mirrors global accents). */
const TOPIC_COLOR: Record<string, string> = {
  origins: '#d97706', families: '#0d9488', sound: '#8b5cf6', ukrainian: '#3b82f6',
  internet: '#ec4899', ai: '#10b981', birth: '#84cc16', revival: '#f43f5e',
  writing: '#ea580c', borrowing: '#06b6d4', everyday: '#ca8a04', roots: '#22c55e',
  names: '#6366f1', myths: '#ef4444', thought: '#818cf8', dialects: '#a3e635',
  conlangs: '#d946ef', machine: '#64748b',
};

const ybpOf = (year: number) => Math.max(AXIS_MIN_YBP, NOW - year);

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
  const reduced = useReducedMotion();
  // Oldest first → reads top (deep past) to bottom (today).
  const events = useMemo(() => [...TIMELINE_EVENTS].sort((a, b) => a.year - b.year), []);
  const [idx, setIdx] = useState(0);
  const [onlyTopic, setOnlyTopic] = useState<string | null>(null);

  const topics = useMemo(() => [...new Set(events.map((e) => e.topic))], [events]);
  const active = events[idx];
  const visible = (topic: string) => onlyTopic === null || onlyTopic === topic;

  const rowRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const mounted = useRef(false);

  // Keep the chosen row in view when stepping; never scroll on first paint.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    rowRefs.current[idx]?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' });
  }, [idx, reduced]);

  // Step to the next/previous non-filtered event (Earlier = up, Later = down).
  const step = (dir: 1 | -1) => {
    let i = idx;
    do {
      i = Math.min(events.length - 1, Math.max(0, i + dir));
    } while (i > 0 && i < events.length - 1 && !visible(events[i].topic));
    setIdx(i);
  };

  // Vertical gap before row i, proportional to the log-time jump from the row above.
  const gapBefore = (i: number): number => {
    if (i === 0) return 0;
    const d = Math.log10(ybpOf(events[i - 1].year)) - Math.log10(ybpOf(events[i].year));
    return Math.min(64, Math.max(0, d * 40));
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

      <p className={s.caption} style={{ margin: '8px 0 0' }}>{t('timeline.logNote')}</p>

      {/* step buttons (keyboard / mobile scrub) */}
      <div className={s.row} style={{ justifyContent: 'center', marginTop: 8 }}>
        <button className={s.pill} onClick={() => step(-1)} disabled={idx === 0} aria-label={t('timeline.prev')}>↑ {t('timeline.prev')}</button>
        <button className={s.pill} onClick={() => step(1)} disabled={idx === events.length - 1} aria-label={t('timeline.next')}>{t('timeline.next')} ↓</button>
      </div>

      {/* vertical timeline */}
      <div className={m.rail}>
      <ol className={m.list} aria-label={t('timeline.axisLabel')}>
        {events.map((e, i) => {
          const isActive = i === idx;
          const dimmed = !visible(e.topic);
          const color = TOPIC_COLOR[e.topic] ?? 'var(--muted)';
          return (
            <li
              key={`${e.slug}-${e.year}`}
              className={m.item}
              data-active={isActive}
              data-dimmed={dimmed}
              style={{ marginTop: i === 0 ? 0 : gapBefore(i) }}
            >
              <button
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                className={m.row}
                aria-expanded={isActive}
                aria-label={`${fmtYear(e.year, lang)} — ${e.title[lang]}`}
                onClick={() => setIdx(i)}
              >
                <span className={m.dot} style={{ background: color }} aria-hidden="true" />
                <span className={m.year} style={{ color }}>{fmtYear(e.year, lang)}</span>
                <span className={m.title}>{e.title[lang]}</span>
              </button>
              {isActive && (
                <div className={m.detail} style={{ borderLeftColor: color }} aria-live="polite">
                  <p className={m.blurb}>{e.blurb[lang]}</p>
                  <a className={m.link} href={localizedPath(lang, e.slug)}>{t('timeline.openArticle')} →</a>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {/* terminal marker — the bottom of the spine is now */}
      <p className={m.endcap}>
        <span className={m.endcapDot} aria-hidden="true" />
        {t('timeline.today')}
      </p>
      </div>
    </div>
  );
}
