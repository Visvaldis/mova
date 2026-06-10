// name-smith — for "A World Built for Its Words: Tolkien's Secret Vice".
//   • Name forge: combine attested Elvish elements; canonical combos show the
//     article's gloss (Mordor, Moria, Mithrandir), everything else gets an
//     "unattested" badge and only the literal element glosses.
//   • Sound-palette comparator: Quenya (Finnish-flavored) vs Sindarin
//     (Welsh-flavored) with the article's sample lines and a flavor highlighter.
//   • Derivation mini-tree: Primitive Elvish → sound laws → two daughters.
// All data in nameSmith.data.ts traces to the article — no invented Elvish.
import { Fragment, useState } from 'react';
import type { Lang, UIKey } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import { ELEMENTS, CANON, PALETTES } from './nameSmith.data';
import s from './interactive.module.css';

const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1);

/** Render `text` with regex matches wrapped in an accent span. */
function Flavored({ text, pattern, on }: { text: string; pattern: string; on: boolean }) {
  if (!on) return <>{text}</>;
  const parts = text.split(new RegExp(`(${pattern})`, 'g'));
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <strong key={i} className={s.accent}>{p}</strong>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

export default function NameSmith({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const k = (key: string) => t(`nameSmith.${key}` as UIKey);

  // ---- forge ----
  const [first, setFirst] = useState<string | null>(null);
  const [second, setSecond] = useState<string | null>(null);
  const pickElement = (id: string) => {
    if (first === id) return setFirst(null);
    if (second === id) return setSecond(null);
    if (first === null) return setFirst(id);
    setSecond(id);
  };
  const clear = () => { setFirst(null); setSecond(null); };

  const elFirst = ELEMENTS.find((e) => e.id === first);
  const elSecond = ELEMENTS.find((e) => e.id === second);
  const canon = first && second ? CANON.find((c) => c.first === first && c.second === second) : undefined;
  const forgedName = canon
    ? canon.name
    : elFirst && elSecond
      ? cap(elFirst.form + elSecond.form)
      : null;

  // ---- palettes ----
  const [flavorOn, setFlavorOn] = useState(false);

  return (
    <div className={s.panel} data-interactive-id="name-smith">
      {/* ---- 1 · name forge ---- */}
      <h3 style={{ margin: '0 0 0.2rem' }}>{k('forgeTitle')}</h3>
      <p className={s.caption} style={{ margin: '0 0 0.6rem' }}>{k('forgeHint')}</p>
      <div className={s.row} role="group" aria-label={k('forgeTitle')}>
        {ELEMENTS.map((e) => {
          const slot = e.id === first ? 1 : e.id === second ? 2 : 0;
          return (
            <button
              key={e.id}
              className={s.pill}
              aria-pressed={slot > 0}
              onClick={() => pickElement(e.id)}
            >
              {slot > 0 && <span className={s.accent} aria-hidden="true">{slot} · </span>}
              <strong>{e.form}</strong>&nbsp;<span className={s.muted}>‘{e.gloss[lang]}’</span>
            </button>
          );
        })}
        {(first || second) && (
          <button className={s.pill} onClick={clear}>↺ {k('clear')}</button>
        )}
      </div>

      {forgedName && elFirst && elSecond && (
        <div className={s.card} style={{ marginTop: '0.8rem' }} aria-live="polite">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
            <strong style={{ fontSize: '1.5rem', letterSpacing: '0.01em' }}>{forgedName}</strong>
            {canon ? (
              <span className={s.pill} data-active="true" style={{ fontSize: '0.74rem', padding: '0.1rem 0.55rem', cursor: 'default' }}>
                ✓ {k('attested')}
              </span>
            ) : (
              <span className={s.pill} style={{ fontSize: '0.74rem', padding: '0.1rem 0.55rem', cursor: 'default', opacity: 0.85 }}>
                ⚠️ {k('unattested')}
              </span>
            )}
          </div>
          <p style={{ margin: '0.4rem 0 0' }}>
            <span className={s.muted}>{k('literally')}</span>{' '}
            <strong>{elFirst.form}</strong> ‘{elFirst.gloss[lang]}’ + <strong>{elSecond.form}</strong> ‘{elSecond.gloss[lang]}’
            {canon && (
              <>
                {' '}→ <strong className={s.accent}>“{canon.gloss[lang]}”</strong>
              </>
            )}
          </p>
          {canon && <p className={s.muted} style={{ fontSize: '0.88rem', margin: '0.35rem 0 0' }}>{canon.note[lang]}</p>}
        </div>
      )}

      {/* ---- 2 · sound palettes ---- */}
      <h3 style={{ margin: '1.4rem 0 0.2rem' }}>{k('paletteTitle')}</h3>
      <div className={s.row} style={{ margin: '0.2rem 0 0.6rem' }}>
        <button className={s.pill} aria-pressed={flavorOn} onClick={() => setFlavorOn(!flavorOn)}>
          🎨 {k('highlight')}
        </button>
      </div>
      <div style={{ display: 'grid', gap: '0.7rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        {PALETTES.map((p) => (
          <div key={p.id} className={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
              <strong style={{ fontSize: '1.05rem' }}>{p.name[lang]}</strong>
              <span className={s.muted} style={{ fontSize: '0.8rem' }}>{k('model')}: {p.model[lang]}</span>
            </div>
            <p className={s.muted} style={{ fontSize: '0.88rem', margin: '0.3rem 0 0.5rem' }}>{p.mood[lang]}</p>
            <p lang="x-elvish" style={{ fontSize: '1.12rem', fontStyle: 'italic', margin: 0 }}>
              <Flavored text={p.sample} pattern={p.flavorPattern} on={flavorOn} />
            </p>
            {p.sampleGloss && (
              <p className={s.muted} style={{ fontSize: '0.85rem', margin: '0.25rem 0 0' }}>“{p.sampleGloss[lang]}”</p>
            )}
            {flavorOn && (
              <p className={s.caption} style={{ margin: '0.45rem 0 0' }}>{p.flavorNote[lang]}</p>
            )}
          </div>
        ))}
      </div>

      {/* ---- 3 · derivation mini-tree ---- */}
      <h3 style={{ margin: '1.4rem 0 0.4rem' }}>{k('treeTitle')}</h3>
      <svg viewBox="0 0 360 150" role="img" aria-label={`${k('proto')} → ${k('soundLaws')} → Quenya, Sindarin`} style={{ width: '100%', maxWidth: 420, height: 'auto', display: 'block' }}>
        <rect x="105" y="8" width="150" height="32" rx="8" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
        <text x="180" y="28" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--text)">{k('proto')}</text>
        <path d="M 160 40 C 120 64, 100 76, 86 96" fill="none" stroke="var(--muted)" strokeWidth="1.3" />
        <path d="M 200 40 C 240 64, 260 76, 274 96" fill="none" stroke="var(--muted)" strokeWidth="1.3" />
        <text x="115" y="72" textAnchor="middle" fontSize="9.5" fill="var(--muted)" transform="rotate(-28 115 72)">{k('soundLaws')}</text>
        <text x="246" y="72" textAnchor="middle" fontSize="9.5" fill="var(--muted)" transform="rotate(28 246 72)">{k('soundLaws')}</text>
        <rect x="22" y="98" width="124" height="32" rx="8" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1.2" />
        <text x="84" y="118" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--accent)">Quenya</text>
        <rect x="214" y="98" width="124" height="32" rx="8" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1.2" />
        <text x="276" y="118" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--accent)">Sindarin</text>
      </svg>
      <p className={s.caption} style={{ marginTop: '0.3rem' }}>{k('treeCaption')}</p>
    </div>
  );
}
