// creole-lab — how a brand-new language is born, for "Born Yesterday".
//   (a) Generation simulator: the SAME message at three stages — scattered home
//       signs → telegraphic pidgin → grammaticalized creole/NSL. Stepping forward
//       regularizes the message; each cohort's additions are highlighted.
//   (b) Map: the newborn / contact languages named in the article, with their
//       origin and parent languages on selection.
// All facts article-sourced; see creoleLab.data.ts for provenance + one TODO(seva).
import { useState } from 'react';
import type { Lang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import { SCENE, STAGES, CONTACT, type Chip, type ContactLang } from './creoleLab.data';
import { useInteractiveContext } from '../../lib/page-context';
import s from './interactive.module.css';
import c from './CreoleLab.module.css';

// Equirectangular projection into the 360×180 map viewBox.
const MAP_W = 360;
const MAP_H = 180;
const projX = (lon: number) => lon + 180;
const projY = (lat: number) => 90 - lat;

// Rough continent silhouettes (equirectangular) — a schematic backdrop so the
// dots read as "around the world"; not a precise basemap.
const CONTINENTS = [
  '40,35 96,30 110,46 96,70 74,68 60,76 48,60 40,46',
  '120,22 136,20 133,38 121,35',
  '95,96 112,92 119,112 105,150 95,134 92,112',
  '170,40 206,38 209,55 185,63 172,55',
  '172,68 211,66 215,96 198,128 185,120 178,96',
  '208,32 300,30 323,56 300,82 255,84 226,70 210,52',
  '288,112 323,110 327,132 300,138 288,126',
];

export default function CreoleLab({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const [tab, setTab] = useState<'gen' | 'map'>('gen');

  // ---- (a) generations ----
  const [gi, setGi] = useState(0);
  const stage = STAGES[gi];

  const roleLabel = (role: Chip['role']): string => {
    switch (role) {
      case 'agent':
        return t('creoleLab.roleAgent');
      case 'object':
        return t('creoleLab.roleObject');
      case 'verb':
        return t('creoleLab.roleVerb');
      case 'dir':
        return t('creoleLab.roleDir');
      case 'recipient':
        return t('creoleLab.roleRecipient');
      default:
        return '';
    }
  };

  const renderChip = (chip: Chip, showRole: boolean) => (
    <div key={chip.key} className={`${c.chip} ${chip.isNew ? c.chipNew : ''}`}>
      <span className={c.chipGlyph} aria-hidden="true">
        {chip.glyph}
      </span>
      <span className={c.chipLabel}>{chip.label[lang]}</span>
      {showRole && roleLabel(chip.role) && <span className={c.chipRole}>{roleLabel(chip.role)}</span>}
      {chip.isNew && <span className={c.newBadge}>{t('creoleLab.newBadge')}</span>}
    </div>
  );

  const agreeFrom = stage.agreement && stage.chips.find((x) => x.key === stage.agreement!.from);
  const agreeTo = stage.agreement && stage.chips.find((x) => x.key === stage.agreement!.to);

  // ---- (b) map ----
  const [active, setActive] = useState<string | null>(null);
  const sel: ContactLang | undefined = CONTACT.find((x) => x.id === active);

  useInteractiveContext(
    'creole-lab',
    lang === 'uk'
      ? tab === 'gen'
        ? `Інтерактив «Народження мови», вкладка «покоління»: етап ${gi + 1}/3 — ${stage.name[lang]}.`
        : `Інтерактив «Народження мови», вкладка «карта».${sel ? ` Вибрано: ${sel.name[lang]}.` : ''}`
      : tab === 'gen'
        ? `"Language Birth" interactive, "generations" tab: stage ${gi + 1}/3 — ${stage.name[lang]}.`
        : `"Language Birth" interactive, "map" tab.${sel ? ` Selected: ${sel.name[lang]}.` : ''}`,
  );

  return (
    <div className={c.wrap} data-interactive-id="creole-lab">
      <div className={s.panel}>
        {/* tab switch */}
        <div className={s.row} role="group" aria-label={t('creoleLab.tabsAria')}>
          <button className={s.pill} aria-pressed={tab === 'gen'} onClick={() => setTab('gen')}>
            👶 {t('creoleLab.tabGen')}
          </button>
          <button className={s.pill} aria-pressed={tab === 'map'} onClick={() => setTab('map')}>
            🌍 {t('creoleLab.tabMap')}
          </button>
        </div>

        {tab === 'gen' ? (
          <div style={{ marginTop: '1rem' }}>
            <div className={c.scene}>
              <span className={c.sceneLabel}>{t('creoleLab.sceneLabel')}</span>
              <span className={c.sceneText}>{SCENE[lang]}</span>
              <span className={c.illus}>{t('creoleLab.illustrative')}</span>
            </div>

            {/* stage selector */}
            <div className={c.stageBar} role="group" aria-label={t('creoleLab.stageBarAria')}>
              {STAGES.map((st, i) => (
                <button
                  key={st.id}
                  className={c.stageBtn}
                  aria-pressed={i === gi}
                  onClick={() => setGi(i)}
                >
                  <span className={c.stageStep}>
                    {t('creoleLab.genWord')} {i + 1}
                  </span>
                  <span className={c.stageName}>{st.name[lang]}</span>
                  <span className={c.stageCohort}>{st.cohort[lang]}</span>
                </button>
              ))}
            </div>

            {/* stage view — re-keyed so it re-animates on change */}
            <div className={c.stageView} key={stage.id} aria-live="polite">
              {stage.layout === 'scatter' && (
                <div className={c.scatter}>{stage.chips.map((ch) => renderChip(ch, false))}</div>
              )}
              {stage.layout === 'string' && (
                <div className={c.stringRow}>{stage.chips.map((ch) => renderChip(ch, false))}</div>
              )}
              {stage.layout === 'grammar' && (
                <div className={c.grammarRow}>
                  {stage.agreement && (
                    <div className={c.arcWrap}>
                      <svg className={c.arc} viewBox="0 0 360 34" aria-hidden="true">
                        <path className={c.arcPath} d="M 30 30 C 110 -6, 250 -6, 330 30" />
                        <polygon points="330,30 322,24 326,32" fill="var(--accent)" />
                        <text className={c.arcLabel} x="180" y="6" textAnchor="middle">
                          {agreeFrom?.label[lang]} → {agreeTo?.label[lang]}
                        </text>
                      </svg>
                    </div>
                  )}
                  <div className={c.tokens}>{stage.chips.map((ch) => renderChip(ch, true))}</div>
                </div>
              )}
            </div>

            <p className={c.note}>{stage.note[lang]}</p>

            <div>
              <span
                className={`${c.ambiguity} ${stage.ambiguous ? c.ambBad : c.ambGood}`}
                role="status"
              >
                {stage.ambiguous ? '❔' : '✓'}{' '}
                {stage.ambiguous ? t('creoleLab.ambiguousYes') : t('creoleLab.ambiguousNo')}
              </span>
            </div>

            {stage.added.length > 0 && (
              <div className={c.added}>
                <p className={c.addedTitle}>
                  {t('creoleLab.added')} · {stage.cohort[lang]}
                </p>
                <ul className={c.addedList}>
                  {stage.added.map((a, i) => (
                    <li key={i}>{a[lang]}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className={c.nav}>
              <button
                className={s.pill}
                onClick={() => setGi((x) => Math.max(0, x - 1))}
                disabled={gi === 0}
              >
                ← {t('creoleLab.prev')}
              </button>
              <span className={c.navCount}>
                {t('creoleLab.genWord')} {gi + 1} {t('creoleLab.of')} {STAGES.length}
              </span>
              <button
                className={s.pill}
                onClick={() => setGi((x) => Math.min(STAGES.length - 1, x + 1))}
                disabled={gi === STAGES.length - 1}
              >
                {t('creoleLab.next')} →
              </button>
            </div>

            <p className={`${s.caption} ${c.caption}`}>{t('creoleLab.bioprogram')}</p>
          </div>
        ) : (
          <div style={{ marginTop: '1rem' }}>
            <p className={c.mapIntro}>{t('creoleLab.mapIntro')}</p>

            <div className={c.mapCard}>
              <svg
                className={c.mapSvg}
                viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                role="img"
                aria-label={t('creoleLab.mapAria')}
              >
                <rect className={c.ocean} x="0" y="0" width={MAP_W} height={MAP_H} rx="4" />
                {/* graticule */}
                {[45, 90, 135, 180, 225, 270, 315].map((x) => (
                  <line key={`v${x}`} className={c.graticule} x1={x} y1="0" x2={x} y2={MAP_H} />
                ))}
                {[45, 90, 135].map((y) => (
                  <line key={`h${y}`} className={c.graticule} x1="0" y1={y} x2={MAP_W} y2={y} />
                ))}
                {CONTINENTS.map((pts, i) => (
                  <polygon key={i} className={c.continent} points={pts} />
                ))}

                {CONTACT.map((cl) => {
                  const cx = projX(cl.lon);
                  const cy = projY(cl.lat);
                  const on = cl.id === active;
                  return (
                    <g key={cl.id} className={on ? c.dotActive : ''} onClick={() => setActive(cl.id)}>
                      <circle className={c.dotRing} cx={cx} cy={cy} r={on ? 7 : 5} />
                      <circle className={c.dot} cx={cx} cy={cy} r={on ? 4 : 3} />
                      {/* generous transparent hit target for touch */}
                      <circle className={c.dotHit} cx={cx} cy={cy} r={9} />
                      {on && (
                        <text className={c.dotLabel} x={cx} y={cy - 9} textAnchor="middle">
                          {cl.place[lang]}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* native, keyboard-accessible selector + legend */}
            <div className={s.row} style={{ marginTop: '0.8rem' }} role="group" aria-label={t('creoleLab.mapLegendAria')}>
              {CONTACT.map((cl) => (
                <button
                  key={cl.id}
                  className={s.pill}
                  aria-pressed={cl.id === active}
                  aria-label={`${t('creoleLab.selectAria')} ${cl.name[lang]}`}
                  onClick={() => setActive(cl.id)}
                >
                  {cl.type === 'sign' ? '👐' : '🗣️'} {cl.name[lang]}
                </button>
              ))}
            </div>

            {sel ? (
              <div className={c.detail} role="status" aria-live="polite">
                <div className={c.detailHead}>
                  <span className={c.detailName}>{sel.name[lang]}</span>
                  <span className={c.detailType}>
                    {sel.type === 'sign' ? t('creoleLab.typeSign') : t('creoleLab.typeCreole')}
                  </span>
                </div>
                <div className={c.detailRow}>
                  <span className={c.detailLabel}>{t('creoleLab.place')}</span>
                  <span className={c.detailVal}>{sel.place[lang]}</span>
                </div>
                <div className={c.detailRow}>
                  <span className={c.detailLabel}>{t('creoleLab.born')}</span>
                  <span className={c.detailVal}>{sel.origin[lang]}</span>
                </div>
                <div className={c.detailRow}>
                  <span className={c.detailLabel}>{t('creoleLab.parents')}</span>
                  <span className={c.detailVal}>{sel.parents[lang]}</span>
                </div>
              </div>
            ) : (
              <p className={`${s.caption} ${c.caption}`}>{t('creoleLab.mapHint')}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
