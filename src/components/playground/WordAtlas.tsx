// word-atlas — pick a word, see how the world says it; dot color = origin group
// (same color = same etymological source). Spec: docs/WORD-ATLAS.md.
import { useMemo, useState } from 'react';
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
  const [reduced] = useState(
    () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  );

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
      <div style={{ overflowX: 'auto', marginTop: '0.8rem' }}>
        <svg
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          role="img"
          aria-label={`${t('pg.atlas.mapAria')}: ${word.gloss[lang]}`}
          style={{ minWidth: 640, width: '100%', height: 'auto', background: 'var(--accent-soft)', borderRadius: 12 }}
        >
          <path d={WORLD_PATH} fill="var(--bg-elev)" stroke="var(--line)" strokeWidth="1" />

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
                strokeWidth={isActive ? 1.4 : 0.7}
                strokeDasharray={hollow ? '3 2' : undefined}
                style={{ cursor: 'pointer', transition: 'fill-opacity 0.2s' }}
                onClick={() => setActiveForm(isActive ? null : f)}
              />
            );
          })}

          {/* origin point */}
          <g>
            <circle cx={originPt.x} cy={originPt.y} r={14} fill="none" stroke="var(--accent)" strokeWidth="2" opacity="0.9">
              {!reduced && <animate attributeName="r" values="10;18;10" dur="2.4s" repeatCount="3" />}
              {!reduced && <animate attributeName="opacity" values="0.9;0.2;0.9" dur="2.4s" repeatCount="3" />}
            </circle>
            <text x={originPt.x} y={originPt.y - 20} textAnchor="middle" fontSize="13" fill="var(--accent)" fontWeight="700">
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
                onClick={() => setActiveForm(isActive ? null : f)}
              >
                <text
                  x={p.x} y={p.y + dy + 4} textAnchor="middle"
                  fontSize={isActive ? 13 : 11.5} fontWeight={isActive ? 800 : 700}
                  fill="var(--text)" stroke="var(--bg-elev)" strokeWidth="3.5" paintOrder="stroke"
                  style={{ textTransform: 'uppercase', letterSpacing: '0.02em' }}
                >
                  {f.form}
                </text>
                {/* invisible hit/focus target */}
                <circle
                  cx={p.x} cy={p.y + dy} r={16} fill="transparent" tabIndex={0} role="button"
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
