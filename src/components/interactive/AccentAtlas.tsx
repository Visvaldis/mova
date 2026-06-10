// accent-atlas (article: dialects-and-accents) — three tabs:
//   1. a schematic map of Ukraine's three dialect groups (+ surzhyk),
//   2. a "dialect or language?" continuum that shows the border is political,
//   3. the паляниця shibboleth, with the two letters that betray non-natives.
// Bilingual via `lang` (no internal toggle). Every claim traces to the article.
import { useMemo, useState } from 'react';
import type { Lang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import {
  DIALECT_ZONES,
  SURZHYK,
  CONTINUUM,
  CONTINUUM_CASES,
  SHIBBOLETH,
  FRAMING,
  UKRAINE_OUTLINE,
  UA_VIEW,
  uaProject,
  type DialectZone,
} from './accentAtlas.data';
import s from './interactive.module.css';
import c from './AccentAtlas.module.css';

type Tab = 'map' | 'continuum' | 'shibboleth';
type T = (key: Parameters<ReturnType<typeof useTranslations>>[0]) => string;

const ZONE_CLASS: Record<DialectZone['id'], string> = {
  north: c.zoneNorth,
  southwest: c.zoneSouthwest,
  southeast: c.zoneSoutheast,
};

function polyPath(poly: [number, number][]): string {
  const pts = poly.map(([la, lo]) => uaProject(la, lo));
  return 'M ' + pts.map((p) => `${p.x} ${p.y}`).join(' L ') + ' Z';
}

export default function AccentAtlas({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const [tab, setTab] = useState<Tab>('map');

  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: 'map', icon: '🗺', label: t('accentAtlas.tabMap') },
    { id: 'continuum', icon: '↔', label: t('accentAtlas.tabContinuum') },
    { id: 'shibboleth', icon: '🔑', label: t('accentAtlas.tabShibboleth') },
  ];

  return (
    <div className={c.root}>
      <p className={c.pullQuote}>{FRAMING.everyoneAccent[lang]}</p>

      <div className={c.tabs} role="tablist" aria-label={t('accentAtlas.tabsAria')}>
        {tabs.map((tb) => (
          <button
            key={tb.id}
            role="tab"
            aria-selected={tab === tb.id}
            aria-pressed={tab === tb.id}
            className={`${c.tab} ${tab === tb.id ? c.tabActive : ''}`}
            onClick={() => setTab(tb.id)}
          >
            <span aria-hidden="true">{tb.icon}</span> {tb.label}
          </button>
        ))}
      </div>

      {tab === 'map' && <MapView lang={lang} t={t} />}
      {tab === 'continuum' && <ContinuumView lang={lang} t={t} />}
      {tab === 'shibboleth' && <ShibbolethView lang={lang} t={t} />}
    </div>
  );
}

/* ── Tab 1: dialect map ──────────────────────────────────────────────────── */
type Sel = { kind: 'zone'; id: string } | { kind: 'surzhyk' } | null;

function MapView({ lang, t }: { lang: Lang; t: T }) {
  const [sel, setSel] = useState<Sel>(null);

  const outlinePath = useMemo(() => {
    const pts = UKRAINE_OUTLINE.map(([la, lo]) => uaProject(la, lo));
    return 'M ' + pts.map((p) => `${p.x} ${p.y}`).join(' L ') + ' Z';
  }, []);

  const activeZone = sel?.kind === 'zone' ? sel.id : null;
  const zone = activeZone ? DIALECT_ZONES.find((z) => z.id === activeZone) : null;

  const selectZone = (id: string) =>
    setSel(activeZone === id ? null : { kind: 'zone', id });

  return (
    <div className={c.mapWrap}>
      <p className={c.intro}>{t('accentAtlas.mapIntro')}</p>

      <svg
        className={c.map}
        viewBox={`0 0 ${UA_VIEW.w} ${UA_VIEW.h}`}
        role="img"
        aria-label={t('accentAtlas.mapAria')}
        preserveAspectRatio="xMidYMid meet"
      >
        <path className={c.land} d={outlinePath} />
        {DIALECT_ZONES.map((z) => {
          const on = activeZone === z.id;
          const p = uaProject(z.labelAt[0], z.labelAt[1]);
          return (
            <g key={z.id}>
              <path
                className={`${c.zone} ${ZONE_CLASS[z.id]} ${on ? c.zoneOn : ''}`}
                d={polyPath(z.poly)}
                role="button"
                tabIndex={0}
                aria-pressed={on}
                aria-label={`${z.name[lang]} — ${z.features[lang]}`}
                onClick={() => selectZone(z.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectZone(z.id);
                  }
                }}
              />
              <text className={c.zoneLabel} x={p.x} y={p.y}>
                {z.short[lang]}
              </text>
            </g>
          );
        })}
      </svg>
      <p className={c.caption}>{t('accentAtlas.mapSchematic')}</p>

      <div className={c.chips}>
        <button
          className={`${c.chip} ${sel?.kind === 'surzhyk' ? c.chipOn : ''}`}
          aria-pressed={sel?.kind === 'surzhyk'}
          onClick={() => setSel(sel?.kind === 'surzhyk' ? null : { kind: 'surzhyk' })}
        >
          🧬 {SURZHYK.name[lang]}
        </button>
      </div>

      <div className={s.card} role="status" aria-live="polite">
        {sel === null && <p className={c.muted}>{t('accentAtlas.mapHint')}</p>}
        {zone && (
          <div>
            <div className={c.cardHead}>
              <span className={c.cardWord}>{zone.name[lang]}</span>
            </div>
            <p className={c.story}>{zone.features[lang]}</p>
            {zone.varieties && <p className={c.varieties}>{zone.varieties[lang]}</p>}
          </div>
        )}
        {sel?.kind === 'surzhyk' && (
          <div>
            <div className={c.cardHead}>
              <span className={c.cardWord}>{SURZHYK.name[lang]}</span>
              <span className={c.tag}>{SURZHYK.tag[lang]}</span>
            </div>
            <p className={c.story}>{SURZHYK.features[lang]}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Tab 2: dialect-or-language continuum ────────────────────────────────── */
function ContinuumView({ lang, t }: { lang: Lang; t: T }) {
  const n = CONTINUUM.villages;
  const [border, setBorder] = useState(Math.floor(n / 2)); // 1..n-1

  return (
    <div className={c.contWrap}>
      <p className={c.intro}>{t('accentAtlas.contIntro')}</p>

      <div className={c.endpoints}>
        <span>{CONTINUUM.cityA[lang]}</span>
        <span>{CONTINUUM.cityB[lang]}</span>
      </div>

      <div className={c.rail}>
        <div className={c.villages} aria-hidden="true">
          {Array.from({ length: n }, (_, i) => (
            <span key={i} className={c.village} />
          ))}
        </div>
        <div className={c.border} style={{ left: `${(border / n) * 100}%` }}>
          <span className={c.borderFlag} aria-hidden="true">
            🚩
          </span>
        </div>
      </div>

      <div className={c.sides}>
        <span>← {CONTINUUM.langA[lang]}</span>
        <span>{CONTINUUM.langB[lang]} →</span>
      </div>

      <input
        className={s.range}
        type="range"
        min={1}
        max={n - 1}
        step={1}
        value={border}
        onChange={(e) => setBorder(Number(e.target.value))}
        aria-label={t('accentAtlas.contBorderAria')}
      />

      <div className={c.verdict} role="status" aria-live="polite">
        <p className={c.story}>{t('accentAtlas.contVerdict')}</p>
      </div>

      <p className={c.caption}>{t('accentAtlas.contMetaphor')}</p>

      <p className={c.casesHead}>{t('accentAtlas.contCasesHead')}</p>
      <div className={c.cases}>
        {CONTINUUM_CASES.map((cs) => (
          <div key={cs.id} className={c.case}>
            <div className={c.casePair}>{cs.pair[lang]}</div>
            <span className={c.caseVerdict}>“{cs.verdict[lang]}”</span>
            <p className={c.caseReality}>{cs.reality[lang]}</p>
          </div>
        ))}
      </div>

      <p className={c.pullQuote}>{FRAMING.pullQuote[lang]}</p>
    </div>
  );
}

/* ── Tab 3: the shibboleth ───────────────────────────────────────────────── */
function ShibbolethView({ lang, t }: { lang: Lang; t: T }) {
  const tellChars = SHIBBOLETH.tells.map((x) => x.ch);
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className={c.shibWrap}>
      <p className={c.intro}>{t('accentAtlas.shibIntro')}</p>

      <div className={c.word} aria-label={SHIBBOLETH.word}>
        {Array.from(SHIBBOLETH.word).map((ch, i) =>
          tellChars.includes(ch) ? (
            <button
              key={i}
              className={`${c.tellLetter} ${active === ch ? c.tellOn : ''}`}
              aria-pressed={active === ch}
              aria-label={SHIBBOLETH.tells.find((x) => x.ch === ch)!.label[lang]}
              onClick={() => setActive(active === ch ? null : ch)}
            >
              {ch}
            </button>
          ) : (
            <span key={i} className={c.letter} aria-hidden="true">
              {ch}
            </span>
          ),
        )}
      </div>

      <p className={c.betrays}>
        {t('accentAtlas.shibBetraysLabel')}{' '}
        <span className={c.betraysWord}>{SHIBBOLETH.betrays[lang]}</span>
      </p>

      <div className={c.tellCards}>
        {SHIBBOLETH.tells.map((tl) => (
          <div
            key={tl.ch}
            className={`${c.tellCard} ${active === tl.ch ? c.tellCardOn : ''}`}
          >
            <div className={c.tellCardHead}>
              <span className={c.tellGlyph}>{tl.ch}</span>
              {tl.label[lang]}
            </div>
            <p className={c.story}>{tl.note[lang]}</p>
          </div>
        ))}
      </div>

      <p className={c.payoff}>{SHIBBOLETH.payoff[lang]}</p>

      <div className={c.biblical}>
        <strong>{t('accentAtlas.shibBiblicalHead')}.</strong> {SHIBBOLETH.biblical[lang]}
      </div>
    </div>
  );
}
