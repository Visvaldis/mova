import { useEffect, useMemo, useState } from 'react';
import type { Lang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import { useInteractiveContext } from '../../lib/page-context';
import lexData from '../../data/playground/uk-lexicon.json';
import { buildLexicon, lookup, tokenize, type LexEntry } from '../../lib/uk-stem';

interface LayerInfo {
  en: string;
  uk: string;
  color: string;
  colorDark: string;
}
const LAYERS = (lexData as unknown as { layers: Record<string, LayerInfo> }).layers;
const WORDS = (lexData as unknown as { words: LexEntry[] }).words;
const LEX = buildLexicon(WORDS);

const EXAMPLE = 'Козак на майдані пʼє каву під дахом і мріє про море.';

export default function Stratigraph({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const [text, setText] = useState('');
  const [active, setActive] = useState<LexEntry | null>(null);
  // The dataset ships light AND dark variants per layer; pick by theme so layer
  // colors stay readable in dark mode (SSR defaults to light, corrected on mount).
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mql) return;
    const update = () => setDark(mql.matches);
    update();
    mql.addEventListener?.('change', update);
    return () => mql.removeEventListener?.('change', update);
  }, []);
  const layerColor = (id: string): string =>
    (dark ? LAYERS[id]?.colorDark : LAYERS[id]?.color) ?? '#8b8696';

  const tokens = useMemo(() => tokenize(text), [text]);
  const analyzed = useMemo(
    () => tokens.map((tok) => ({ ...tok, entry: tok.isWord ? lookup(LEX, tok.text) : null })),
    [tokens],
  );

  useInteractiveContext(
    'stratigraph',
    lang === 'uk'
      ? `Гра «Stratigraph»: ${text.trim() ? `аналіз тексту (${tokens.filter((t) => t.isWord).length} слів)${active ? `, вибрано «${active.l}» — ${LAYERS[active.y]?.uk ?? active.y}` : ''}` : 'текст ще не введено'}.`
      : `"Stratigraph" playground: ${text.trim() ? `analyzing text (${tokens.filter((t) => t.isWord).length} words)${active ? `, selected "${active.l}" — ${LAYERS[active.y]?.en ?? active.y}` : ''}` : 'no text entered yet'}.`,
  );

  const counts = useMemo(() => {
    const c = new Map<string, number>();
    let known = 0;
    let total = 0;
    for (const a of analyzed) {
      if (!a.isWord) continue;
      total++;
      if (a.entry) {
        known++;
        c.set(a.entry.y, (c.get(a.entry.y) ?? 0) + 1);
      }
    }
    return { byLayer: c, known, total };
  }, [analyzed]);

  return (
    <div className="toy" data-toy="stratigraph">
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setActive(null);
        }}
        placeholder={t('pg.str.placeholder')}
        aria-label={t('pg.str.placeholder')}
        rows={3}
        maxLength={600}
        style={{
          width: '100%', padding: '0.7rem 1rem', borderRadius: 10,
          border: '1.5px solid var(--line)', background: 'var(--bg)', color: 'var(--text)',
          font: 'inherit', resize: 'vertical',
        }}
      />
      <div className="row" style={{ marginTop: '0.6rem' }}>
        <button className="pill" onClick={() => { setText(EXAMPLE); setActive(null); }}>
          ✨ {t('pg.str.example')}
        </button>
      </div>

      {text.trim().length > 0 && (
        <>
          <p className="muted" style={{ fontSize: '0.85rem', marginTop: '1rem' }}>{t('pg.str.tapWord')}</p>
          <p style={{ fontSize: '1.25rem', lineHeight: 2, marginTop: '0.4rem' }} aria-live="polite">
            {analyzed.map((a, i) =>
              a.isWord && a.entry ? (
                <button
                  key={i}
                  onClick={() => setActive(active === a.entry ? null : a.entry)}
                  style={{
                    background: `color-mix(in srgb, ${layerColor(a.entry.y)} 18%, transparent)`,
                    borderBottom: `3px solid ${layerColor(a.entry.y)}`,
                    border: 'none', borderRadius: 4, padding: '0 0.15rem',
                    font: 'inherit', cursor: 'pointer', color: 'inherit',
                  }}
                  aria-label={`${a.text}: ${LAYERS[a.entry.y][lang]}`}
                >
                  {a.text}
                </button>
              ) : (
                <span key={i} className={a.isWord ? 'muted' : undefined}>{a.text}</span>
              ),
            )}
          </p>

          {active && (
            <div className="stage-card" style={{ borderLeftColor: layerColor(active.y), marginTop: '0.6rem' }} aria-live="polite">
              <strong>{active.l}</strong> — {LAYERS[active.y][lang]}
              {active.n && <div className="muted" style={{ fontSize: '0.9rem' }}>{active.n[lang]}</div>}
            </div>
          )}

          {counts.total > 0 && (
            <div style={{ marginTop: '1.2rem' }}>
              <h2>{t('pg.str.summary')}</h2>
              <div style={{ display: 'grid', gap: '0.35rem' }}>
                {Object.entries(LAYERS)
                  .filter(([id]) => (counts.byLayer.get(id) ?? 0) > 0)
                  .map(([id, info]) => {
                    const n = counts.byLayer.get(id)!;
                    return (
                      <div key={id} style={{ display: 'grid', gridTemplateColumns: '1fr 3fr auto', gap: '0.6rem', alignItems: 'center', fontSize: '0.85rem' }}>
                        <span>{info[lang]}</span>
                        <span aria-hidden="true" style={{ background: 'var(--accent-soft)', borderRadius: 99, overflow: 'hidden', height: 10 }}>
                          <span style={{ display: 'block', height: '100%', width: `${(n / counts.total) * 100}%`, background: layerColor(id) }} />
                        </span>
                        <strong>{n}</strong>
                      </div>
                    );
                  })}
                {counts.known < counts.total && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr auto', gap: '0.6rem', alignItems: 'center', fontSize: '0.85rem' }} className="muted">
                    <span>{t('pg.str.unknown')}</span>
                    <span aria-hidden="true" style={{ background: 'var(--accent-soft)', borderRadius: 99, overflow: 'hidden', height: 10 }}>
                      <span style={{ display: 'block', height: '100%', width: `${((counts.total - counts.known) / counts.total) * 100}%`, background: 'var(--muted)' }} />
                    </span>
                    <strong>{counts.total - counts.known}</strong>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      <div style={{ marginTop: '1.2rem' }}>
        <h2>{t('pg.str.legend')}</h2>
        <div className="row">
          {Object.entries(LAYERS).map(([id, info]) => (
            <span key={id} className="hint-card" style={{ borderColor: layerColor(id) }}>
              {info[lang]}
            </span>
          ))}
        </div>
      </div>

      <p className="toy-note">{t('pg.str.note')} · {WORDS.length} {t('pg.growing')}</p>
    </div>
  );
}
