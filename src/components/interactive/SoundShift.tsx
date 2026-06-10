// sound-shift — Grimm's Law explorer (port of prototype-sound-shift.html).
// Three panels: stage slider, "try a rule", chain-shift SVG diagram.
import { useState } from 'react';
import type { Lang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import { WORDS, RULES, RULE_LABEL, GLOSSES, type RuleId } from './soundShift.data';
import { useReducedMotion } from './useReducedMotion';
import s from './interactive.module.css';

function stageFromSlider(v: number): 0 | 1 | 2 {
  return v < 34 ? 0 : v < 67 ? 1 : 2;
}

export default function SoundShift({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const reduced = useReducedMotion();
  const [slider, setSlider] = useState(0);
  const [activeRule, setActiveRule] = useState<RuleId | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const stage = stageFromSlider(slider);

  const stageLabels = [t('soundShift.stage0'), t('soundShift.stage1'), t('soundShift.stage2')];
  const stageNotes = [t('soundShift.note0'), t('soundShift.note1'), t('soundShift.note2')];

  const onSlider = (v: number) => {
    const prev = stage;
    setSlider(v);
    if (stageFromSlider(v) !== prev) setAnimKey((k) => k + 1);
  };

  const pickRule = (r: RuleId) => {
    const next = activeRule === r ? null : r;
    setActiveRule(next);
    if (next && stage === 0) setSlider(50);
    setAnimKey((k) => k + 1);
  };

  return (
    <div data-interactive-id="sound-shift">
      {/* Panel 1 — stage slider over six words */}
      <div className={s.panel}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600 }}>
          {stageLabels.map((l, i) => (
            <span key={l} className={i === stage ? s.accent : s.muted}>{l}</span>
          ))}
        </div>
        <input
          className={s.range}
          type="range"
          min={0}
          max={100}
          value={slider}
          aria-label={t('soundShift.sliderLabel')}
          onChange={(e) => onSlider(+e.target.value)}
          style={{ width: '100%', marginTop: 6 }}
        />
        <p className={s.muted} style={{ textAlign: 'center', fontSize: '0.9rem', minHeight: '2.6em', marginTop: 8 }} aria-live="polite">
          {stageNotes[stage]}
        </p>

        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginTop: 14 }}>
          {WORDS.map((w) => {
            const applies = activeRule ? w.stages[0].some(([, r]) => r === activeRule) : true;
            return (
              <div
                key={w.id}
                className={s.card}
                style={{
                  textAlign: 'center',
                  opacity: applies ? 1 : 0.3,
                  outline: activeRule && applies ? '2px solid var(--accent)' : undefined,
                  transition: reduced ? undefined : 'opacity 0.3s',
                }}
              >
                <div style={{ fontSize: '1.45rem', fontWeight: 700, minHeight: '1.4em' }}>
                  {w.stages[stage].map(([text, rule], i) => (
                    <span
                      key={`${animKey}-${i}`}
                      className={rule ? s.accent : undefined}
                      style={{
                        display: 'inline-block',
                        opacity: rule && activeRule && rule !== activeRule ? 0.45 : 1,
                        animation: rule && !reduced ? 'soundshift-pop 0.45s ease' : undefined,
                      }}
                    >
                      {text}
                    </span>
                  ))}
                </div>
                <div className={s.muted} style={{ fontSize: '0.74rem', marginTop: 4 }}>
                  “{GLOSSES[w.id][lang]}”
                </div>
                {w.ua && (
                  <div className={s.accent} style={{ fontSize: '0.72rem', fontWeight: 600, marginTop: 2 }}>
                    {t('soundShift.uaKept')} {w.ua}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* Local keyframes (scoped by unusual name; gated above on reduced-motion). */}
        <style>{`@keyframes soundshift-pop { 0% { transform: scale(0.4) rotate(-8deg); opacity: 0; } 60% { transform: scale(1.25); opacity: 1; } 100% { transform: scale(1); } }`}</style>
      </div>

      {/* Panel 2 — try a rule */}
      <div className={s.panel} style={{ marginTop: 16 }}>
        <h3 style={{ fontSize: '1.05rem', margin: 0 }}>{t('soundShift.tryTitle')}</h3>
        <p className={s.muted} style={{ fontSize: '0.85rem', margin: '4px 0 12px' }}>{t('soundShift.tryHint')}</p>
        <div className={s.row} role="group" aria-label={t('soundShift.tryTitle')}>
          {RULES.map((r) => (
            <button key={r} className={s.pill} aria-pressed={r === activeRule} onClick={() => pickRule(r)}>
              {RULE_LABEL[r]}
            </button>
          ))}
        </div>
      </div>

      {/* Panel 3 — chain-shift diagram */}
      <div className={s.panel} style={{ marginTop: 16 }}>
        <h3 style={{ fontSize: '1.05rem', margin: 0 }}>{t('soundShift.chainTitle')}</h3>
        <p className={s.muted} style={{ fontSize: '0.85rem', margin: '4px 0 8px' }}>{t('soundShift.chainHint')}</p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <svg viewBox="0 0 420 330" role="img" aria-label={t('soundShift.chainTitle')} style={{ maxWidth: 420, width: '100%', height: 'auto' }}>
            <defs>
              <marker id="ss-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L7,3 L0,6 Z" fill="var(--accent)" />
              </marker>
            </defs>
            <rect x="150" y="18" width="120" height="56" rx="10" fill="var(--accent-soft)" stroke="var(--line)" strokeWidth="1.5" />
            <text x="210" y="44" textAnchor="middle" fontWeight="700" fontSize="17" fill="var(--text)">bʰ dʰ gʰ</text>
            <text x="210" y="62" textAnchor="middle" fontSize="10.5" fill="var(--muted)">{t('soundShift.diagAsp')}</text>

            <rect x="30" y="200" width="120" height="56" rx="10" fill="var(--accent-soft)" stroke="var(--line)" strokeWidth="1.5" />
            <text x="90" y="226" textAnchor="middle" fontWeight="700" fontSize="17" fill="var(--text)">b d g</text>
            <text x="90" y="244" textAnchor="middle" fontSize="10.5" fill="var(--muted)">{t('soundShift.diagVoi')}</text>

            <rect x="270" y="200" width="120" height="56" rx="10" fill="var(--accent-soft)" stroke="var(--line)" strokeWidth="1.5" />
            <text x="330" y="226" textAnchor="middle" fontWeight="700" fontSize="17" fill="var(--text)">p t k</text>
            <text x="330" y="244" textAnchor="middle" fontSize="10.5" fill="var(--muted)">{t('soundShift.diagVls')}</text>

            <rect x="150" y="262" width="120" height="56" rx="10" fill="var(--accent-soft)" stroke="var(--line)" strokeWidth="1.5" strokeDasharray="5 4" />
            <text x="210" y="288" textAnchor="middle" fontWeight="700" fontSize="17" fill="var(--text)">f θ h</text>
            <text x="210" y="306" textAnchor="middle" fontSize="10.5" fill="var(--muted)">{t('soundShift.diagFri')}</text>

            <path d="M150,60 Q70,100 85,195" fill="none" stroke="var(--accent)" strokeWidth="2.5" markerEnd="url(#ss-arrow)" />
            <path d="M155,235 L263,235" fill="none" stroke="var(--accent)" strokeWidth="2.5" markerEnd="url(#ss-arrow)" />
            <path d="M325,262 Q300,290 277,290" fill="none" stroke="var(--accent)" strokeWidth="2.5" markerEnd="url(#ss-arrow)" />
          </svg>
        </div>
      </div>
    </div>
  );
}
