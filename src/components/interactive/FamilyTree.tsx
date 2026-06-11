// family-tree — a real indented Indo-European tree (connector lines, collapsible)
// with cognate cards, plus a clean schematic map (numbered pins + legend).
// Hand-built (no charting lib), keyboard-friendly, topic-variable colors only.
import { useState } from 'react';
import type { Lang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import { BRANCHES, ROOT_NAME, PIE_FORMS, type Leaf } from './familyTree.data';
import { useInteractiveContext } from '../../lib/page-context';
import s from './interactive.module.css';
import f from './FamilyTree.module.css';

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

  const flagFor = (mark?: 'en' | 'uk') => (mark === 'en' ? '🇬🇧' : mark === 'uk' ? '🇺🇦' : '');
  const leafName = (leaf: Leaf) => `${leaf.name[lang]}${leaf.star ? ` ${flagFor(leaf.star)}` : ''}`;

  useInteractiveContext(
    'family-tree',
    lang === 'uk'
      ? `Інтерактив «Мовне дерево», вигляд: ${view === 'tree' ? 'дерево' : 'карта'}.${activeLeaf ? ` Вибрано мову: ${activeLeaf.name[lang]}.` : ' Мову ще не вибрано.'}`
      : `"Language Family Tree" interactive, view: ${view}.${activeLeaf ? ` Selected language: ${activeLeaf.name[lang]}.` : ' No language selected yet.'}`,
  );

  const showLeaf = (leaf: Leaf) => {
    setView('tree');
    setActiveLeaf((cur) => (cur?.id === leaf.id ? null : leaf));
  };

  const goToBranch = (id: string) => {
    setView('tree');
    setOpen((prev) => new Set(prev).add(id));
  };

  return (
    <div className={s.panel} data-interactive-id="family-tree">
      <div className={f.head}>
        <div className={s.row} role="group" aria-label={t('familyTree.viewTree') + ' / ' + t('familyTree.viewMap')}>
          <button className={s.pill} aria-pressed={view === 'tree'} onClick={() => setView('tree')}>
            🌳 {t('familyTree.viewTree')}
          </button>
          <button className={s.pill} aria-pressed={view === 'map'} onClick={() => setView('map')}>
            🗺️ {t('familyTree.viewMap')}
          </button>
        </div>
        <span className={f.hereKey}>
          🇬🇧 {t('familyTree.youAreHereEn')} · 🇺🇦 {t('familyTree.youAreHereUk')}
        </span>
      </div>

      {view === 'tree' ? (
        <>
          <p className={f.hint}>{t('familyTree.collapseHint')}</p>

          <div className={f.tree}>
            <div className={f.root}>
              <span className={f.rootLabel}>{t('familyTree.pie')}</span>
              <span className={f.rootName}>{ROOT_NAME[lang]}</span>
            </div>
            <div className={f.stub} aria-hidden="true" />

            <ul className={f.children}>
              {BRANCHES.map((b) => {
                const isOpen = open.has(b.id);
                const branchCls = [f.branchBtn, b.extinct ? f.branchExtinct : '', b.here ? f.here : '']
                  .filter(Boolean)
                  .join(' ');
                return (
                  <li key={b.id} className={f.node}>
                    <button
                      className={branchCls}
                      aria-expanded={isOpen}
                      onClick={() => toggleBranch(b.id)}
                    >
                      <span className={f.caret} aria-hidden="true">{isOpen ? '▾' : '▸'}</span>
                      {b.name[lang]}
                      {b.here && <span className={f.flag} aria-hidden="true">{flagFor(b.here)}</span>}
                      {b.extinct && <span className={f.count}> †</span>}
                      <span className={f.count}>({b.leaves.length})</span>
                    </button>

                    {isOpen && (
                      <ul className={f.subChildren}>
                        {b.leaves.map((leaf) => {
                          const isActive = activeLeaf?.id === leaf.id;
                          const chipCls = [
                            f.leafChip,
                            leaf.extinct ? f.leafExtinct : '',
                            leaf.star ? f.leafStar : '',
                          ]
                            .filter(Boolean)
                            .join(' ');
                          return (
                            <li key={leaf.id} className={f.leafNode}>
                              <button
                                className={chipCls}
                                aria-pressed={isActive}
                                onClick={() => showLeaf(leaf)}
                                title={
                                  leaf.extinct
                                    ? `${t('familyTree.extinct')} · ${leaf.attested?.[lang] ?? ''}`
                                    : `${leaf.speakers ?? '?'} ${t('familyTree.speakers')} · ${t('familyTree.attested')}: ${leaf.attested?.[lang] ?? '?'}`
                                }
                              >
                                {leafName(leaf)}
                                {leaf.extinct ? ' †' : ''}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      ) : (
        <div className={f.mapWrap}>
          <svg className={f.mapSvg} viewBox="0 0 300 190" role="img" aria-label={t('familyTree.viewMap')}>
            {/* schematic Eurasia silhouette */}
            <path
              className={f.land}
              d="M26,98 C22,70 48,58 74,58 C104,46 152,48 200,50 C242,46 282,58 288,84 C292,106 278,122 250,134 C214,152 176,144 150,142 C120,152 96,152 78,140 C58,146 40,130 32,114 C26,106 28,102 26,98 Z"
            />
            {BRANCHES.map((b, i) => (
              <g
                key={b.id}
                className={f.pin}
                onClick={() => goToBranch(b.id)}
                role="presentation"
              >
                <circle
                  className={b.extinct ? f.pinDotExtinct : f.pinDot}
                  cx={b.map.x}
                  cy={b.map.y}
                  r={9}
                />
                <text className={`${f.pinNum} ${b.extinct ? f.pinNumExtinct : ''}`} x={b.map.x} y={b.map.y}>
                  {i + 1}
                </text>
              </g>
            ))}
          </svg>

          <div className={f.legend}>
            {BRANCHES.map((b, i) => (
              <button key={b.id} className={f.legendItem} onClick={() => goToBranch(b.id)}>
                <span className={`${f.legendNum} ${b.extinct ? f.legendNumExtinct : ''}`}>{i + 1}</span>
                <span className={f.legendName}>
                  {b.name[lang]}
                  {b.extinct ? ' †' : ''}
                </span>
                {b.here && <span className={f.legendFlag} aria-hidden="true">{flagFor(b.here)}</span>}
              </button>
            ))}
          </div>

          <p className={f.note}>{t('familyTree.mapNote')}</p>
        </div>
      )}

      {activeLeaf && view === 'tree' && (
        <div className={`${s.card} ${f.cog}`} aria-live="polite">
          <div className={f.cogHead}>
            <strong className={f.cogTitle}>
              {leafName(activeLeaf)}
              {activeLeaf.extinct ? ' †' : ''}
            </strong>
            <span className={f.cogMeta}>
              {activeLeaf.extinct
                ? t('familyTree.extinct')
                : `${activeLeaf.speakers ?? '?'} ${t('familyTree.speakers')}`}
              {activeLeaf.attested ? ` · ${t('familyTree.attested')}: ${activeLeaf.attested[lang]}` : ''}
            </span>
          </div>

          <strong className={f.cogGridHead}>{t('familyTree.cognatesTitle')}</strong>
          <div className={f.cogGrid}>
            {[t('familyTree.mother'), t('familyTree.three'), t('familyTree.night')].map((label, i) => (
              <div key={label} className={f.cogCell}>
                <div className={f.cogWord}>{activeLeaf.cognates[i]}</div>
                <div className={f.cogGloss}>{label}</div>
                <div className={f.cogPie}>{PIE_FORMS[i]}</div>
              </div>
            ))}
          </div>
          <p className={f.cogHint}>
            {t('familyTree.cognatesHint')}
            {activeLeaf.cognates.includes('—') ? ` · ${t('familyTree.unknownForm')}` : ''}
          </p>
        </div>
      )}
    </div>
  );
}
