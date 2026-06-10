import { Fragment, useState } from 'react';
import type { Lang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import {
  COLOR,
  SPACE,
  GENDER,
  GENDER_CAVEAT,
  GRAMMAR,
  type GenderKey,
} from './thoughtLens.data';
import s from './interactive.module.css';
import c from './ThoughtLens.module.css';

type Tab = 'color' | 'space' | 'gender' | 'grammar';
type T = (key: Parameters<ReturnType<typeof useTranslations>>[0]) => string;

export default function ThoughtLens({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const [tab, setTab] = useState<Tab>('color');

  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: 'color', icon: '🔵', label: t('thoughtLens.tabColor') },
    { id: 'space', icon: '🧭', label: t('thoughtLens.tabSpace') },
    { id: 'gender', icon: '🌉', label: t('thoughtLens.tabGender') },
    { id: 'grammar', icon: '🔤', label: t('thoughtLens.tabGrammar') },
  ];

  return (
    <div className={c.root}>
      <div className={c.tabs} role="tablist" aria-label={t('thoughtLens.tabsAria')}>
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

      {tab === 'color' && <ColorView lang={lang} t={t} />}
      {tab === 'space' && <SpaceView lang={lang} t={t} />}
      {tab === 'gender' && <GenderView lang={lang} t={t} />}
      {tab === 'grammar' && <GrammarView lang={lang} t={t} />}
    </div>
  );
}

/* ── Tab 1: colour boundary lab ────────────────────────────────────────────── */
function ColorView({ lang, t }: { lang: Lang; t: T }) {
  const [split, setSplit] = useState(50); // your boundary, 0..100
  const [revealed, setRevealed] = useState(false);
  const ukPct = Math.round(COLOR.ukSplit * 100);

  return (
    <div className={s.panel}>
      <p className={s.caption}>{t('thoughtLens.colorIntro')}</p>

      <div className={c.gradientStack}>
        <div className={c.gradient} aria-hidden="true">
          <div className={c.youMarker} style={{ left: `${split}%` }}>
            <span className={c.youFlag}>{t('thoughtLens.colorYou')}</span>
          </div>
        </div>

        {revealed && (
          <>
            <div className={c.band}>
              <span className={c.bandName}>{t('thoughtLens.colorEnHead')}</span>
              <div className={c.bandTrack}>
                <span className={c.segEn}>
                  {COLOR.enWord.term}
                  <em className={c.segGloss}>{COLOR.enWord.gloss[lang]}</em>
                </span>
              </div>
            </div>
            <div className={c.band}>
              <span className={c.bandName}>{t('thoughtLens.colorUkHead')}</span>
              <div className={c.bandTrack}>
                <span className={c.segUk} style={{ flexGrow: ukPct }}>
                  {COLOR.ukLight.term}
                  <em className={c.segGloss}>{COLOR.ukLight.gloss[lang]}</em>
                </span>
                <span className={c.segUk} style={{ flexGrow: 100 - ukPct }}>
                  {COLOR.ukDark.term}
                  <em className={c.segGloss}>{COLOR.ukDark.gloss[lang]}</em>
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <input
        type="range"
        className={s.range}
        min={0}
        max={100}
        value={split}
        onChange={(e) => setSplit(Number(e.target.value))}
        aria-label={t('thoughtLens.colorSliderAria')}
      />

      <div className={s.row}>
        <button
          className={s.pill}
          aria-pressed={revealed}
          onClick={() => setRevealed((v) => !v)}
        >
          {revealed ? t('thoughtLens.colorHide') : t('thoughtLens.colorReveal')}
        </button>
      </div>

      {revealed && (
        <div className={s.card}>
          <p>{COLOR.explainer[lang]}</p>
          <p className={s.caption}>{t('thoughtLens.colorIllustrative')}</p>
        </div>
      )}
    </div>
  );
}

/* ── Tab 2: ego- vs geo-centric direction ──────────────────────────────────── */
function SpaceView({ lang, t }: { lang: Lang; t: T }) {
  const [seat, setSeat] = useState<'w' | 'e'>('w');
  const [mode, setMode] = useState<'ego' | 'geo'>('ego');

  // Cup is north of the plate. Facing east (west seat) → north is on your left;
  // facing west (east seat) → north is on your right. Geo never changes.
  const caption =
    mode === 'geo'
      ? SPACE.geoCaption[lang]
      : seat === 'w'
        ? SPACE.egoLeft[lang]
        : SPACE.egoRight[lang];

  return (
    <div className={s.panel}>
      <p className={s.caption}>{t('thoughtLens.spaceIntro')}</p>

      <div className={s.row}>
        <button
          className={s.pill}
          aria-pressed={mode === 'ego'}
          onClick={() => setMode('ego')}
        >
          {t('thoughtLens.spaceModeEgo')}
        </button>
        <button
          className={s.pill}
          aria-pressed={mode === 'geo'}
          onClick={() => setMode('geo')}
        >
          {t('thoughtLens.spaceModeGeo')}
        </button>
      </div>

      <svg
        className={c.scene}
        viewBox="0 0 320 250"
        role="img"
        aria-label={t('thoughtLens.spaceSceneAria')}
      >
        {/* compass */}
        <g className={c.compass} aria-hidden="true">
          <line x1="28" y1="44" x2="28" y2="16" />
          <path d="M28 12 l5 9 -10 0 z" className={c.compassN} />
          <text x="28" y="58" textAnchor="middle">{t('thoughtLens.spaceN')}</text>
        </g>

        {/* table */}
        <circle cx="170" cy="125" r="92" className={c.table} />
        {/* plate */}
        <circle cx="170" cy="138" r="30" className={c.plate} />
        <text x="170" y="142" textAnchor="middle" className={c.objLabel}>
          {t('thoughtLens.spacePlate')}
        </text>
        {/* cup — north of the plate */}
        <circle cx="170" cy="86" r="15" className={c.cup} />
        <path d="M185 82 a8 8 0 0 1 0 10" className={c.cupHandle} />
        <text x="170" y="90" textAnchor="middle" className={c.objLabelSm}>
          {t('thoughtLens.spaceCup')}
        </text>

        {/* viewer head + facing nose */}
        {seat === 'w' ? (
          <g className={c.viewer}>
            <circle cx="58" cy="125" r="16" />
            <path d="M74 125 l12 -7 0 14 z" className={c.nose} />
          </g>
        ) : (
          <g className={c.viewer}>
            <circle cx="282" cy="125" r="16" />
            <path d="M266 125 l-12 -7 0 14 z" className={c.nose} />
          </g>
        )}
      </svg>

      <div className={s.row}>
        <button
          className={s.pill}
          onClick={() => setSeat((p) => (p === 'w' ? 'e' : 'w'))}
          aria-label={t('thoughtLens.spaceTurnAria')}
        >
          ↻ {t('thoughtLens.spaceTurn')}
        </button>
      </div>

      <div className={s.card}>
        <p className={c.bigCaption} data-mode={mode}>{caption}</p>
        <p className={s.caption}>{SPACE.explainer[lang]}</p>
      </div>
    </div>
  );
}

/* ── Tab 3: grammatical gender (contested) ─────────────────────────────────── */
function GenderView({ lang, t }: { lang: Lang; t: T }) {
  const [which, setWhich] = useState<GenderKey>('de');
  const g = GENDER[which];

  return (
    <div className={s.panel}>
      <p className={s.caption}>{t('thoughtLens.genderIntro')}</p>

      <div className={s.row}>
        <button
          className={s.pill}
          aria-pressed={which === 'de'}
          onClick={() => setWhich('de')}
        >
          {t('thoughtLens.genderDe')}
        </button>
        <button
          className={s.pill}
          aria-pressed={which === 'es'}
          onClick={() => setWhich('es')}
        >
          {t('thoughtLens.genderEs')}
        </button>
      </div>

      <div className={c.bridgeWrap}>
        <svg
          className={c.bridge}
          viewBox="0 0 240 120"
          role="img"
          aria-label={t('thoughtLens.genderBridgeAria')}
        >
          <path d="M8 78 h224" />
          <path d="M20 78 a40 40 0 0 1 80 0" fill="none" />
          <path d="M140 78 a40 40 0 0 1 80 0" fill="none" />
          <path d="M8 78 v22 M120 78 v22 M232 78 v22" />
          <path d="M8 100 h224" />
        </svg>

        <p className={c.bridgeWord}>
          <strong>{g.word}</strong> · {g.gender[lang]}
        </p>
        <div className={c.adjRow}>
          {g.adjectives.map((a) => (
            <span key={a.en} className={c.adjTag}>
              {a[lang]}
            </span>
          ))}
        </div>
      </div>

      <div className={c.caveat}>
        <span className={c.caveatBadge}>⚠ {t('thoughtLens.genderCaveatTitle')}</span>
        <p>{GENDER_CAVEAT[lang]}</p>
      </div>
    </div>
  );
}

/* ── Tab 4: what your grammar obliges you to encode ────────────────────────── */
function GrammarView({ lang, t }: { lang: Lang; t: T }) {
  return (
    <div className={s.panel}>
      <p className={s.caption}>{t('thoughtLens.grammarIntro')}</p>

      <div className={c.grammarGrid}>
        <GrammarCard
          title={t('thoughtLens.grammarEnTitle')}
          lang={lang}
          side={GRAMMAR.en}
        />
        <GrammarCard
          title={t('thoughtLens.grammarUkTitle')}
          lang={lang}
          side={GRAMMAR.uk}
        />
      </div>

      <p className={c.closing}>{GRAMMAR.closing[lang]}</p>
    </div>
  );
}

function GrammarCard({
  title,
  lang,
  side,
}: {
  title: string;
  lang: Lang;
  side: typeof GRAMMAR.en;
}) {
  return (
    <div className={c.gCard}>
      <h4 className={c.gTitle}>{title}</h4>
      <p className={c.gSentence}>
        {side.sentence.map((tok, i) => (
          <Fragment key={i}>
            <span className={tok.gloss ? c.gForced : undefined}>{tok.text}</span>{' '}
          </Fragment>
        ))}
      </p>
      <ul className={c.gGloss}>
        {side.sentence
          .filter((tok) => tok.gloss)
          .map((tok, i) => (
            <li key={i}>
              <strong>{tok.text.replace(/[.,]/g, '')}</strong> — {tok.gloss![lang]}
            </li>
          ))}
      </ul>
      <p className={s.caption}>{side.notForced[lang]}</p>
    </div>
  );
}
