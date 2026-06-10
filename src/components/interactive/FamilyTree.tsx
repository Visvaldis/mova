// family-tree — collapsible Indo-European tree with cognate cards and a
// schematic map toggle. Hand-built (no charting lib), keyboard-friendly.
import { useState } from 'react';
import type { Lang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import { BRANCHES, ROOT_NAME, PIE_FORMS, type Leaf } from './familyTree.data';
import s from './interactive.module.css';

export default function FamilyTree({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const [view, setView] = useState<'tree' | 'map'>('tree');
  const [open, setOpen] = useState<Set<string>>(
    () => new Set(['germanic', 'baltoslavic']), // both "you are here" branches start open
  );
  const [activeLeaf, setActiveLeaf] = useState<Leaf | null>(null);

  const toggleBranch = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const leafLabel = (leaf: Leaf) => {
    const star = leaf.star === 'en' ? ' 🇬🇧★' : leaf.star === 'uk' ? ' 🇺🇦★' : '';
    return `${leaf.name[lang]}${star}`;
  };

  return (
    <div className={s.panel} data-interactive-id="family-tree">
      <div className={s.row} style={{ justifyContent: 'space-between' }}>
        <div className={s.row} role="group">
          <button className={s.pill} aria-pressed={view === 'tree'} onClick={() => setView('tree')}>
            🌳 {t('familyTree.viewTree')}
          </button>
          <button className={s.pill} aria-pressed={view === 'map'} onClick={() => setView('map')}>
            🗺️ {t('familyTree.viewMap')}
          </button>
        </div>
        <span className={s.muted} style={{ fontSize: '0.78rem' }}>
          🇬🇧★ {t('familyTree.youAreHereEn')} · 🇺🇦★ {t('familyTree.youAreHereUk')}
        </span>
      </div>

      {view === 'tree' ? (
        <>
          <div className={s.card} style={{ marginTop: 12, textAlign: 'center', fontWeight: 700 }}>
            {t('familyTree.pie')}: {ROOT_NAME[lang]}
          </div>
          <p className={s.muted} style={{ fontSize: '0.8rem', margin: '8px 0' }}>{t('familyTree.collapseHint')}</p>

          <div style={{ display: 'grid', gap: 8 }}>
            {BRANCHES.map((b) => {
              const isOpen = open.has(b.id);
              return (
                <div key={b.id} style={{ borderLeft: `4px solid ${b.color}`, paddingLeft: 12 }}>
                  <button
                    className={s.pill}
                    aria-expanded={isOpen}
                    onClick={() => toggleBranch(b.id)}
                    style={{
                      borderColor: b.color,
                      color: b.extinct ? 'var(--muted)' : undefined,
                      borderStyle: b.extinct ? 'dashed' : 'solid',
                      fontWeight: 700,
                    }}
                  >
                    {isOpen ? '▾' : '▸'} {b.name[lang]}
                    {b.extinct && <span className={s.muted}> †</span>}
                    <span className={s.muted} style={{ fontWeight: 500 }}>({b.leaves.length})</span>
                  </button>

                  {isOpen && (
                    <div className={s.row} style={{ marginTop: 8, paddingBottom: 4 }}>
                      {b.leaves.map((leaf) => {
                        const isActive = activeLeaf?.id === leaf.id;
                        return (
                          <button
                            key={leaf.id}
                            className={s.pill}
                            aria-pressed={isActive}
                            onClick={() => setActiveLeaf(isActive ? null : leaf)}
                            title={
                              leaf.extinct
                                ? `${t('familyTree.extinct')} · ${leaf.attested?.[lang] ?? ''}`
                                : `${leaf.speakers ?? '?'} ${t('familyTree.speakers')} · ${t('familyTree.attested')}: ${leaf.attested?.[lang] ?? '?'}`
                            }
                            style={{
                              borderStyle: leaf.extinct ? 'dashed' : 'solid',
                              color: leaf.extinct && !isActive ? 'var(--muted)' : undefined,
                              outline: leaf.star ? `2px solid ${b.color}` : undefined,
                              outlineOffset: 1,
                            }}
                          >
                            {leafLabel(leaf)}{leaf.extinct ? ' †' : ''}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div style={{ marginTop: 12 }}>
          <svg viewBox="0 0 100 70" role="img" aria-label={t('familyTree.viewMap')} style={{ width: '100%', height: 'auto', background: 'var(--accent-soft)', borderRadius: 12 }}>
            {/* schematic Eurasia silhouette */}
            <path
              d="M8,30 Q14,18 26,16 Q36,10 50,12 Q68,8 84,16 Q94,22 92,34 Q88,44 78,48 Q70,56 58,54 Q48,60 38,54 Q26,52 18,44 Q8,40 8,30 Z"
              fill="var(--bg-elev)"
              stroke="var(--line)"
              strokeWidth="0.6"
            />
            {BRANCHES.map((b) => (
              <g key={b.id} style={{ cursor: 'pointer' }} onClick={() => { setView('tree'); setOpen((p) => new Set(p).add(b.id)); }}>
                <circle cx={b.map.x} cy={b.map.y} r={b.extinct ? 3 : 4.2} fill={b.color} opacity={b.extinct ? 0.5 : 0.85} stroke={b.extinct ? 'var(--muted)' : 'none'} strokeDasharray={b.extinct ? '1.5 1' : undefined} strokeWidth="0.5" />
                <text x={b.map.x} y={b.map.y - 5.5} textAnchor="middle" fontSize="3.4" fontWeight="700" fill="var(--text)">
                  {b.name[lang]}{b.extinct ? ' †' : ''}
                </text>
              </g>
            ))}
          </svg>
          <p className={s.muted} style={{ fontSize: '0.78rem', marginTop: 6 }}>{t('familyTree.mapNote')}</p>
        </div>
      )}

      {activeLeaf && view === 'tree' && (
        <div className={s.card} style={{ marginTop: 12 }} aria-live="polite">
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, alignItems: 'baseline' }}>
            <strong style={{ fontSize: '1.05rem' }}>{leafLabel(activeLeaf)}{activeLeaf.extinct ? ' †' : ''}</strong>
            <span className={s.muted} style={{ fontSize: '0.82rem' }}>
              {activeLeaf.extinct
                ? t('familyTree.extinct')
                : `${activeLeaf.speakers ?? '?'} ${t('familyTree.speakers')}`}
              {activeLeaf.attested ? ` · ${t('familyTree.attested')}: ${activeLeaf.attested[lang]}` : ''}
            </span>
          </div>

          <div style={{ marginTop: 10 }}>
            <strong style={{ fontSize: '0.9rem' }}>{t('familyTree.cognatesTitle')}</strong>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 6, textAlign: 'center' }}>
              {[t('familyTree.mother'), t('familyTree.three'), t('familyTree.night')].map((label, i) => (
                <div key={label} style={{ background: 'var(--accent-soft)', borderRadius: 8, padding: '0.5rem 0.3rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{activeLeaf.cognates[i]}</div>
                  <div className={s.muted} style={{ fontSize: '0.72rem' }}>{label}</div>
                  <div className={s.accent} style={{ fontSize: '0.72rem', fontWeight: 600 }}>{PIE_FORMS[i]}</div>
                </div>
              ))}
            </div>
            <p className={s.muted} style={{ fontSize: '0.78rem', margin: '8px 0 0' }}>
              {t('familyTree.cognatesHint')}
              {activeLeaf.cognates.includes('—') ? ` · ${t('familyTree.unknownForm')}` : ''}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
