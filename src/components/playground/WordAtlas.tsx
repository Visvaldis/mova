// word-atlas — pick a word, see how the world says it; region color = origin group
// (same color = same etymological source). Spec: docs/WORD-ATLAS.md.
// Zoom/pan: viewBox-based, no libs — buttons, double-click, ctrl+wheel, pinch, drag.
// Deep link: ?word=<id> opens a specific word (used by /words/ and shareable URLs).
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Lang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import { project, WORLD_PATH, MAP_W, MAP_H } from '../../lib/geo';
import data from '../../data/playground/word-atlas.json';
import regionsData from '../../data/playground/word-atlas-regions.json';

interface AtlasLanguage {
  name: Record<Lang, string>;
  lat: number;
  lon: number;
  family: Record<Lang, string>;
}
interface Origin {
  id: string;
  label: string;
  story: Record<Lang, string>;
}
interface Form {
  lang: string;
  form: string;
  native?: string;
  origin: string;
  note?: Record<Lang, string>;
  dy?: number;
}
interface AtlasWord {
  id: string;
  icon: string;
  gloss: Record<Lang, string>;
  origins: Origin[];
  originPoint: { lat: number; lon: number; label: Record<Lang, string> };
  forms: Form[];
  source: string;
}

const LANGS_REG = (data as unknown as { languages: Record<string, AtlasLanguage> }).languages;
const WORDS = (data as unknown as { words: AtlasWord[] }).words;
/** Per-language country region paths (Natural Earth countries-110m, pre-simplified). */
const REGIONS = (regionsData as unknown as { regions: Record<string, string> }).regions;

// Fixed per-word palette by origin order; 'unclear'/'other' renders hollow grey.
const PALETTE = ['#0d9488', '#d97706', '#7c3aed', '#db2777', '#2563eb', '#65a30d'];
const GREY = '#8b8696';

export default function WordAtlas({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const [wordId, setWordId] = useState(WORDS[0].id);
  const [activeForm, setActiveForm] = useState<Form | null>(null);
  const [dimmed, setDimmed] = useState<string | null>(null); // origin id to KEEP (others dim)
  useEffect(() => {
    const q = new URLSearchParams(location.search).get('word');
    if (q && WORDS.some((w) => w.id === q)) setWordId(q);
  }, []);
  const [reduced] = useState(
    () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  );

  // ---- zoom & pan (viewBox) ------------------------------------------------
  const [view, setView] = useState({ x: 0, y: 0, w: MAP_W, h: MAP_H });
  const svgRef = useRef<SVGSVGElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchStart = useRef<{ dist: number; view: typeof view } | null>(null);
  const panMoved = useRef(false);
  const MIN_W = MAP_W / 8;
  const zoom = MAP_W / view.w;

  /** Screen px → current viewBox coordinates. */
  const toSvg = (clientX: number, clientY: number) => {
    const r = svgRef.current!.getBoundingClientRect();
    return {
      x: view.x + ((clientX - r.left) / r.width) * view.w,
      y: view.y + ((clientY - r.top) / r.height) * view.h,
    };
  };

  const clamp = (v: { x: number; y: number; w: number; h: number }) => {
    const w = Math.min(MAP_W, Math.max(MIN_W, v.w));
    const h = (w / MAP_W) * MAP_H;
    return {
      w, h,
      x: Math.min(Math.max(v.x, 0), MAP_W - w),
      y: Math.min(Math.max(v.y, 0), MAP_H - h),
    };
  };

  /** Zoom by factor keeping the svg point (cx, cy) stationary on screen. */
  const zoomAt = (factor: number, cx: number, cy: number) => {
    setView((v) => {
      const w = v.w / factor;
      const h = v.h / factor;
      return clamp({ w, h, x: cx - ((cx - v.x) / v.w) * w, y: cy - ((cy - v.y) / v.h) * h });
    });
  };
  const zoomCenter = (factor: number) => zoomAt(factor, view.x + view.w / 2, view.y + view.h / 2);
  const resetView = () => setView({ x: 0, y: 0, w: MAP_W, h: MAP_H });

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    panMoved.current = false;
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinchStart.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), view };
    }
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    const prev = pointers.current.get(e.pointerId)!;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && pinchStart.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const factor = dist / pinchStart.current.dist;
      const s = pinchStart.current.view;
      const mid = toSvg((a.x + b.x) / 2, (a.y + b.y) / 2);
      const w = s.w / factor;
      setView(clamp({ w, h: (w / MAP_W) * MAP_H, x: mid.x - (mid.x - s.x) / factor, y: mid.y - (mid.y - s.y) / factor }));
    } else if (pointers.current.size === 1 && zoom > 1.01) {
      const r = svgRef.current!.getBoundingClientRect();
      const dx = ((e.clientX - prev.x) / r.width) * view.w;
      const dy = ((e.clientY - prev.y) / r.height) * view.h;
      if (Math.abs(e.clientX - prev.x) + Math.abs(e.clientY - prev.y) > 2) panMoved.current = true;
      setView((v) => clamp({ ...v, x: v.x - dx, y: v.y - dy }));
    }
  };
  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
  };
  const onWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    if (!e.ctrlKey && !e.metaKey) return; // don't hijack page scroll
    e.preventDefault();
    const p = toSvg(e.clientX, e.clientY);
    zoomAt(e.deltaY < 0 ? 1.25 : 0.8, p.x, p.y);
  };
  const onDoubleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const p = toSvg(e.clientX, e.clientY);
    zoomAt(2, p.x, p.y);
  };

  /** Keep on-screen sizes constant while zooming (viewBox units shrink). */
  const sc = view.w / MAP_W;

  const word = WORDS.find((w) => w.id === wordId)!;

  const colorOf = useMemo(() => {
    const map = new Map<string, string>();
    let i = 0;
    for (const o of word.origins) {
      map.set(o.id, o.id === 'other' || o.id === 'unclear' ? GREY : PALETTE[i++ % PALETTE.length]);
    }
    return (originId: string) => map.get(originId) ?? GREY;
  }, [word]);

  const originPt = project(word.originPoint.lat, word.originPoint.lon);

  const pick = (w: AtlasWord) => {
    setWordId(w.id);
    setActiveForm(null);
    setDimmed(null);
  };

  return (
    <div className="toy" data-toy="word-atlas">
      <div className="row" role="group" aria-label={t('pg.atlas.pick')}>
        {WORDS.map((w) => (
          <button key={w.id} className="pill" aria-pressed={w.id === wordId} onClick={() => pick(w)}>
            {w.icon} {w.gloss[lang]}
          </button>
        ))}
      </div>

      {/* legend */}
      <div className="row" style={{ marginTop: '0.9rem' }} role="group" aria-label={t('pg.atlas.legend')}>
        {word.origins.map((o) => {
          const c = colorOf(o.id);
          const isKept = dimmed === null || dimmed === o.id;
          return (
            <button
              key={o.id}
              className="hint-card"
              aria-pressed={dimmed === o.id}
              onClick={() => setDimmed(dimmed === o.id ? null : o.id)}
              style={{
                borderColor: c, borderStyle: o.id === 'other' || o.id === 'unclear' ? 'dashed' : 'solid',
                opacity: isKept ? 1 : 0.35, cursor: 'pointer', background: 'transparent', font: 'inherit', color: 'var(--text)',
              }}
            >
              <span aria-hidden="true" style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 99, background: c, marginRight: 6 }} />
              <strong>{o.label}</strong>
            </button>
          );
        })}
      </div>

      {/* map */}
      <div style={{ position: 'relative', marginTop: '0.8rem' }}>
        <div role="group" aria-label={t('pg.atlas.zoom')} style={{ position: 'absolute', top: 8, right: 8, zIndex: 2, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {([['+', () => zoomCenter(1.5), t('pg.atlas.zoomIn')], ['−', () => zoomCenter(1 / 1.5), t('pg.atlas.zoomOut')], ['⊙', resetView, t('pg.atlas.zoomReset')]] as const).map(([label, fn, aria]) => (
            <button key={label} onClick={fn} aria-label={aria} title={aria}
              style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid var(--line)', background: 'var(--bg-elev)', color: 'var(--text)', cursor: 'pointer', font: 'inherit', fontSize: '1rem', lineHeight: 1, boxShadow: 'var(--shadow)' }}>
              {label}
            </button>
          ))}
        </div>
        <svg
          ref={svgRef}
          viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
          role="img"
          aria-label={`${t('pg.atlas.mapAria')}: ${word.gloss[lang]}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onWheel={onWheel}
          onDoubleClick={onDoubleClick}
          style={{
            width: '100%', height: 'auto', background: 'var(--accent-soft)', borderRadius: 12,
            touchAction: zoom > 1.01 ? 'none' : 'pan-y pinch-zoom',
            cursor: zoom > 1.01 ? 'grab' : 'default',
          }}
        >
          <path d={WORLD_PATH} fill="var(--bg-elev)" stroke="var(--line)" strokeWidth={1 * sc} />

          {/* colored language regions (Amazing-Maps style) */}
          {word.forms.map((f) => {
            const path = REGIONS[f.lang];
            if (!path) return null;
            const c = colorOf(f.origin);
            const hollow = f.origin === 'other' || f.origin === 'unclear';
            const isDim = dimmed !== null && dimmed !== f.origin;
            const isActive = activeForm?.lang === f.lang;
            return (
              <path
                key={`r-${f.lang}`}
                d={path}
                fill={c}
                fillOpacity={isDim ? 0.08 : hollow ? 0.25 : isActive ? 0.85 : 0.6}
                stroke={isActive ? 'var(--text)' : 'var(--bg)'}
                strokeWidth={(isActive ? 1.4 : 0.7) * sc}
                strokeDasharray={hollow ? `${3 * sc} ${2 * sc}` : undefined}
                style={{ cursor: 'pointer', transition: 'fill-opacity 0.2s' }}
                onClick={() => !panMoved.current && setActiveForm(isActive ? null : f)}
              />
            );
          })}

          {/* origin point */}
          <g>
            <circle cx={originPt.x} cy={originPt.y} r={14 * sc} fill="none" stroke="var(--accent)" strokeWidth={2 * sc} opacity="0.9">
              {!reduced && <animate attributeName="r" values={`${10 * sc};${18 * sc};${10 * sc}`} dur="2.4s" repeatCount="3" />}
              {!reduced && <animate attributeName="opacity" values="0.9;0.2;0.9" dur="2.4s" repeatCount="3" />}
            </circle>
            <text x={originPt.x} y={originPt.y - 20 * sc} textAnchor="middle" fontSize={13 * sc} fill="var(--accent)" fontWeight="700">
              📍
            </text>
          </g>

          {word.forms.map((f) => {
            const reg = LANGS_REG[f.lang];
            if (!reg) return null;
            const p = project(reg.lat, reg.lon);
            const isDim = dimmed !== null && dimmed !== f.origin;
            const isActive = activeForm?.lang === f.lang;
            const dy = f.dy ?? 0;
            return (
              <g
                key={f.lang}
                style={{ cursor: 'pointer', opacity: isDim ? 0.15 : 1, transition: 'opacity 0.2s' }}
                onClick={() => !panMoved.current && setActiveForm(isActive ? null : f)}
              >
                <text
                  x={p.x} y={p.y + dy + 4 * sc} textAnchor="middle"
                  fontSize={(isActive ? 13 : 11.5) * sc} fontWeight={isActive ? 800 : 700}
                  fill="var(--text)" stroke="var(--bg-elev)" strokeWidth={3.5 * sc} paintOrder="stroke"
                  style={{ textTransform: 'uppercase', letterSpacing: '0.02em' }}
                >
                  {f.form}
                </text>
                {/* invisible hit/focus target */}
                <circle
                  cx={p.x} cy={p.y + dy} r={16 * sc} fill="transparent" tabIndex={0} role="button"
                  aria-label={`${reg.name[lang]}: ${f.form}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveForm(isActive ? null : f);
                    }
                  }}
                />
              </g>
            );
          })}
        </svg>
      </div>
      <p className="muted" style={{ fontSize: '0.74rem', margin: '4px 0 0' }}>{t('pg.atlas.mapNote')}</p>

      {/* origin stories */}
      <div style={{ display: 'grid', gap: '0.4rem', marginTop: '0.8rem' }}>
        <div className="stage-card" style={{ borderLeftColor: 'var(--accent)' }}>
          <strong className="accent">📍 {t('pg.atlas.started')}</strong>{' '}
          <span className="muted">{word.originPoint.label[lang]}</span>
        </div>
        {(dimmed ? word.origins.filter((o) => o.id === dimmed) : word.origins).map((o) => (
          <div key={o.id} className="stage-card" style={{ borderLeftColor: colorOf(o.id) }}>
            <strong style={{ color: colorOf(o.id) }}>{o.label}</strong>{' '}
            <span className="muted">{o.story[lang]}</span>
          </div>
        ))}
      </div>

      {/* detail card */}
      {activeForm && (
        <div className="stage-card" style={{ marginTop: '0.6rem', borderLeftColor: colorOf(activeForm.origin) }} aria-live="polite">
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, alignItems: 'baseline' }}>
            <span>
              <strong style={{ fontSize: '1.15rem' }}>{activeForm.form}</strong>
              {activeForm.native && <span style={{ fontSize: '1.05rem', marginLeft: 8 }}>{activeForm.native}</span>}
            </span>
            <span className="muted" style={{ fontSize: '0.8rem' }}>
              {LANGS_REG[activeForm.lang].name[lang]} · {LANGS_REG[activeForm.lang].family[lang]}
            </span>
          </div>
          {activeForm.note && <div className="muted" style={{ fontSize: '0.88rem', marginTop: 4 }}>{activeForm.note[lang]}</div>}
        </div>
      )}

      <p className="toy-note">
        {t('pg.atlas.note')} · {WORDS.length} {t('pg.growing')} · {t('pg.wtm.source')}: {word.source}
      </p>
    </div>
  );
}
