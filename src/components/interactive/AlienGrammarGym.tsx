// alien-grammar-gym — for "Speaking Klingon: How Hollywood Learned to Build
// Real Fake Languages".
//   • OVS scrambler: arrange S/V/O tiles; a WALS-cited frequency strip shows
//     how rare each human word order is — Klingon picked the mirror.
//   • Alien-o-meter: pick 3 phonemes; the Okrand ensemble (retroflex D +
//     uvular q + tlh) maxes the meter — the trick is the ensemble, not the
//     sounds.
//   • Designer match: Okrand/Frommer/Peterson ↔ their languages + method notes.
// Data: alienGym.data.ts (article-sourced; WALS percentages cited in caption).
import { useState } from 'react';
import type { Lang, UIKey } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import { WORDS, ORDERS, PHONEMES, OKRAND_SET, METER_MAX, DESIGNERS } from './alienGym.data';
import s from './interactive.module.css';

type Role = 'S' | 'V' | 'O';
const ROLES: Role[] = ['S', 'V', 'O'];

export default function AlienGrammarGym({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const k = (key: string) => t(`alienGym.${key}` as UIKey);

  // ---- (a) OVS scrambler ----
  const [built, setBuilt] = useState<Role[]>([]);
  const addRole = (r: Role) => {
    if (built.includes(r)) return;
    setBuilt([...built, r]);
  };
  const orderId = built.length === 3 ? built.join('') : null;
  const isKlingon = orderId === 'OVS';
  const maxPct = Math.max(...ORDERS.map((o) => o.pct));

  // ---- (b) alien-o-meter ----
  const [picked, setPicked] = useState<string[]>([]);
  const togglePhoneme = (id: string) => {
    if (picked.includes(id)) return setPicked(picked.filter((p) => p !== id));
    if (picked.length < 3) setPicked([...picked, id]);
  };
  const score = picked.reduce((sum, id) => sum + (PHONEMES.find((p) => p.id === id)?.rarity ?? 0), 0);
  const isOkrand = picked.length === 3 && picked.every((id) => OKRAND_SET.has(id));
  const meterNote =
    picked.length < 3 ? null : isOkrand ? k('meterOkrand') : score >= 4 ? k('meterAlien') : score >= 2 ? k('meterMixed') : k('meterHuman');

  // ---- (c) designer match ----
  const [pickedDesigner, setPickedDesigner] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, boolean>>({});
  const [missed, setMissed] = useState(false);
  const tryMatch = (langId: string) => {
    if (!pickedDesigner) return;
    const d = DESIGNERS.find((d) => d.id === pickedDesigner)!;
    if (d.langId === langId) {
      setMatched({ ...matched, [d.id]: true });
      setMissed(false);
    } else {
      setMissed(true);
    }
    setPickedDesigner(null);
  };
  const allMatched = DESIGNERS.every((d) => matched[d.id]);

  return (
    <div className={s.panel} data-interactive-id="alien-grammar-gym">
      {/* ---- (a) scrambler ---- */}
      <h3 style={{ margin: '0 0 0.2rem' }}>{k('orderTitle')}</h3>
      <p className={s.caption} style={{ margin: '0 0 0.6rem' }}>{k('orderHint')}</p>
      <div className={s.row} role="group" aria-label={k('orderTitle')}>
        {ROLES.map((r) => (
          <button key={r} className={s.pill} aria-pressed={built.includes(r)} disabled={built.includes(r)} onClick={() => addRole(r)}>
            <span className={s.accent}>{r}</span> · {WORDS[r][lang]}
          </button>
        ))}
        {built.length > 0 && (
          <button className={s.pill} onClick={() => setBuilt([])}>↺ {k('reset')}</button>
        )}
      </div>
      <div className={s.card} style={{ marginTop: '0.7rem', minHeight: '2.4rem' }} aria-live="polite">
        {built.length === 0 ? (
          <span className={s.muted}>{k('orderEmpty')}</span>
        ) : (
          <>
            <strong style={{ fontSize: '1.15rem' }}>{built.map((r) => WORDS[r][lang]).join(' ')}{built.length === 3 ? '.' : ' …'}</strong>
            {orderId && (
              <p style={{ margin: '0.35rem 0 0' }} className={isKlingon ? s.accent : s.muted}>
                {orderId} — {isKlingon ? `🖖 ${k('orderKlingon')}` : k(`order${orderId}` as 'orderSVO')}
              </p>
            )}
          </>
        )}
      </div>
      <div style={{ marginTop: '0.8rem', display: 'grid', gap: '0.3rem' }} role="img" aria-label={k('stripAria')}>
        {ORDERS.map((o) => (
          <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ minWidth: '2.8rem', fontSize: '0.78rem', fontWeight: 700, color: o.id === orderId ? 'var(--accent)' : 'var(--muted)' }}>
              {o.id}
            </span>
            <div style={{ flex: 1, height: 10, background: 'color-mix(in srgb, var(--line) 50%, transparent)', borderRadius: 99 }}>
              <div
                style={{
                  width: `${Math.max(2, (o.pct / maxPct) * 100)}%`, height: '100%', borderRadius: 99,
                  background: o.id === orderId ? 'var(--accent)' : 'var(--muted)',
                  opacity: o.id === orderId ? 1 : 0.45, transition: 'background 0.2s',
                }}
              />
            </div>
            <span className={s.muted} style={{ fontSize: '0.75rem', minWidth: '2.6rem', textAlign: 'right' }}>
              {o.pct < 1 ? '<1%' : `~${o.pct}%`}
            </span>
          </div>
        ))}
      </div>
      <p className={s.caption} style={{ margin: '0.3rem 0 0' }}>{k('stripNote')}</p>

      {/* ---- (b) alien-o-meter ---- */}
      <h3 style={{ margin: '1.4rem 0 0.2rem' }}>{k('meterTitle')}</h3>
      <p className={s.caption} style={{ margin: '0 0 0.6rem' }}>{k('meterHint')}</p>
      <div className={s.row} role="group" aria-label={k('meterTitle')}>
        {PHONEMES.map((p) => (
          <button
            key={p.id}
            className={s.pill}
            aria-pressed={picked.includes(p.id)}
            disabled={!picked.includes(p.id) && picked.length >= 3}
            title={p.desc[lang]}
            onClick={() => togglePhoneme(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>
      {picked.length > 0 && (
        <div className={s.card} style={{ marginTop: '0.7rem' }} aria-live="polite">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700 }}>
            <span className={s.muted}>{k('meterLow')}</span>
            <span className={s.muted}>{k('meterHigh')}</span>
          </div>
          <div style={{ height: 12, background: 'color-mix(in srgb, var(--line) 50%, transparent)', borderRadius: 99, margin: '0.3rem 0' }}>
            <div style={{ width: `${(score / METER_MAX) * 100}%`, height: '100%', borderRadius: 99, background: 'var(--accent)', transition: 'width 0.3s' }} />
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0.4rem 0 0', display: 'grid', gap: 2 }}>
            {picked.map((id) => {
              const p = PHONEMES.find((ph) => ph.id === id)!;
              return (
                <li key={id} style={{ fontSize: '0.85rem' }}>
                  <strong className={s.accent}>{p.label}</strong> <span className={s.muted}>— {p.desc[lang]}</span>
                </li>
              );
            })}
          </ul>
          {meterNote && <p style={{ margin: '0.5rem 0 0', fontWeight: 600, fontSize: '0.9rem' }}>{meterNote}</p>}
        </div>
      )}

      {/* ---- (c) designer match ---- */}
      <h3 style={{ margin: '1.4rem 0 0.2rem' }}>{k('matchTitle')}</h3>
      <p className={s.caption} style={{ margin: '0 0 0.6rem' }}>{k('matchHint')}</p>
      <div className={s.row} role="group" aria-label={k('matchDesigners')}>
        {DESIGNERS.map((d) => (
          <button
            key={d.id}
            className={s.pill}
            aria-pressed={pickedDesigner === d.id}
            disabled={!!matched[d.id]}
            onClick={() => setPickedDesigner(pickedDesigner === d.id ? null : d.id)}
          >
            {matched[d.id] ? '✓ ' : '👤 '}{d.name}
          </button>
        ))}
      </div>
      <div className={s.row} role="group" aria-label={k('matchLanguages')} style={{ marginTop: '0.4rem' }}>
        {DESIGNERS.map((d) => (
          <button
            key={d.langId}
            className={s.pill}
            disabled={!!matched[d.id] || !pickedDesigner}
            onClick={() => tryMatch(d.langId)}
          >
            {matched[d.id] ? '✓ ' : '🛸 '}{d.language[lang]}
          </button>
        ))}
      </div>
      <div aria-live="polite">
        {missed && <p className={s.muted} style={{ margin: '0.5rem 0 0', fontSize: '0.88rem' }}>{k('matchMiss')}</p>}
        {DESIGNERS.filter((d) => matched[d.id]).map((d) => (
          <p key={d.id} className={s.card} style={{ margin: '0.5rem 0 0', fontSize: '0.88rem' }}>
            <strong>{d.name} → {d.language[lang]}.</strong> <span className={s.muted}>{d.method[lang]}</span>
          </p>
        ))}
        {allMatched && <p style={{ margin: '0.5rem 0 0', fontWeight: 700 }} className={s.accent}>🏆 {k('matchDone')}</p>}
      </div>
    </div>
  );
}
