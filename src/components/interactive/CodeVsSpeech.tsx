// code-vs-speech (article: machine-languages) — two parts:
//   1. Hockett scorecard — a Ukrainian sentence vs a Python snippet, scored on
//      six design features (pass/fail lights + a one-liner each).
//   2. Brain panel — switch columns and watch which brain network lights up;
//      the MIT (Fedorenko) result is shown verbatim.
// Bilingual via `lang` (no internal toggle). Every verdict + the MIT quote
// trace to the article (see the data file).
import { useState } from 'react';
import type { Lang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import {
  COLUMNS,
  FEATURES,
  BRAIN_REGIONS,
  COLUMN_NETWORK,
  MIT_RESULT,
  MODALITY_NOTE,
  VERDICT_QUOTE,
} from './codeVsSpeech.data';
import s from './interactive.module.css';
import c from './CodeVsSpeech.module.css';

type Col = 'natural' | 'code';

export default function CodeVsSpeech({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const [open, setOpen] = useState(0); // which feature row is expanded
  const [brainCol, setBrainCol] = useState<Col>('natural');

  const naturalScore = FEATURES.filter((f) => f.natural.pass).length;
  const codeScore = FEATURES.filter((f) => f.code.pass).length;
  const litNetwork = COLUMN_NETWORK[brainCol];

  return (
    <div className={s.panel}>
      <p className={c.intro}>{t('codeVsSpeech.intro')}</p>

      {/* the two columns being compared */}
      <div className={c.cols}>
        <div className={c.col}>
          <span className={c.colTag}>{t('codeVsSpeech.colNatural')}</span>
          <span className={c.sampleText} lang="uk">
            {COLUMNS.natural.sample}
          </span>
          <span className={c.sampleGloss}>{COLUMNS.natural.sampleGloss[lang]}</span>
        </div>
        <div className={c.col}>
          <span className={c.colTag}>{t('codeVsSpeech.colCode')}</span>
          <code className={c.sampleCode}>{COLUMNS.code.sample}</code>
        </div>
      </div>

      {/* ── Hockett scorecard ─────────────────────────────────────────── */}
      <h3 className={c.head}>{t('codeVsSpeech.scorecardHead')}</h3>
      <p className={s.caption}>{t('codeVsSpeech.scorecardHint')}</p>

      <ul className={c.scorecard}>
        {FEATURES.map((f, i) => {
          const isOpen = open === i;
          return (
            <li key={f.key} className={c.feature}>
              <button
                className={c.featureBtn}
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span className={c.featureName}>{f.name[lang]}</span>
                <span className={c.lights}>
                  <Light pass={f.natural.pass} label={t('codeVsSpeech.colNatural')} t={t} />
                  <Light pass={f.code.pass} label={t('codeVsSpeech.colCode')} t={t} />
                </span>
              </button>
              {isOpen && (
                <div className={c.detail}>
                  <p className={c.gloss}>{f.gloss[lang]}</p>
                  <div className={c.verdictRow} data-pass={f.natural.pass}>
                    <span className={c.verdictTag}>{t('codeVsSpeech.colNatural')}</span>
                    <span className={c.verdictNote}>{f.natural.note[lang]}</span>
                  </div>
                  <div className={c.verdictRow} data-pass={f.code.pass}>
                    <span className={c.verdictTag}>{t('codeVsSpeech.colCode')}</span>
                    <span className={c.verdictNote}>{f.code.note[lang]}</span>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className={c.tally}>
        <span>
          {t('codeVsSpeech.colNatural')}: <strong>{naturalScore}/{FEATURES.length}</strong>
        </span>
        <span>
          {t('codeVsSpeech.colCode')}: <strong>{codeScore}/{FEATURES.length}</strong>
        </span>
      </div>

      {/* ── brain panel ───────────────────────────────────────────────── */}
      <h3 className={c.head}>{t('codeVsSpeech.brainHead')}</h3>
      <p className={s.caption}>{t('codeVsSpeech.brainHint')}</p>

      <div className={s.row} style={{ marginTop: '0.6rem' }}>
        <button
          className={s.pill}
          aria-pressed={brainCol === 'natural'}
          data-active={brainCol === 'natural'}
          onClick={() => setBrainCol('natural')}
        >
          {t('codeVsSpeech.brainReadNatural')}
        </button>
        <button
          className={s.pill}
          aria-pressed={brainCol === 'code'}
          data-active={brainCol === 'code'}
          onClick={() => setBrainCol('code')}
        >
          {t('codeVsSpeech.brainReadCode')}
        </button>
      </div>

      <div className={c.brainWrap}>
        <BrainSVG litNetwork={litNetwork} label={t('codeVsSpeech.brainAria')} />
        <div className={c.regions}>
          {BRAIN_REGIONS.map((r) => {
            const lit = r.key === litNetwork;
            return (
              <div key={r.key} className={c.region} data-lit={lit}>
                <span className={c.regionDot} data-net={r.key} aria-hidden="true" />
                <div>
                  <div className={c.regionName}>
                    {r.name[lang]}
                    {lit && <span className={c.litTag}>{t('codeVsSpeech.lit')}</span>}
                  </div>
                  <div className={c.regionDesc}>{r.desc[lang]}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={s.card} style={{ marginTop: '0.9rem' }}>
        <p className={c.mitLabel}>{t('codeVsSpeech.mitLabel')}</p>
        <p className={c.mitQuote}>{MIT_RESULT[lang]}</p>
        <p className={s.caption} style={{ marginTop: '0.5rem' }}>
          {MODALITY_NOTE[lang]}
        </p>
      </div>

      <p className={c.verdict}>{VERDICT_QUOTE[lang]}</p>
    </div>
  );
}

function Light({
  pass,
  label,
  t,
}: {
  pass: boolean;
  label: string;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <span
      className={c.light}
      data-pass={pass}
      role="img"
      aria-label={`${label}: ${pass ? t('codeVsSpeech.pass') : t('codeVsSpeech.fail')}`}
    >
      {pass ? '✓' : '✗'}
    </span>
  );
}

/* Side-view brain with two highlightable regions. The lit one gets the accent;
   the pulse is pure CSS, so it's neutralized under prefers-reduced-motion. */
function BrainSVG({ litNetwork, label }: { litNetwork: 'language' | 'md'; label: string }) {
  return (
    <svg
      className={c.brain}
      viewBox="0 0 200 150"
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* brain silhouette */}
      <path
        className={c.brainOutline}
        d="M58 28 C40 28 26 42 28 60 C16 66 16 86 30 92 C30 110 48 122 70 118
           C82 130 108 130 120 118 C146 124 168 108 164 86 C180 78 178 54 160 48
           C160 30 138 20 120 28 C104 18 74 18 58 28 Z"
      />
      {/* a couple of inert sulci lines for brain-ness */}
      <path className={c.brainLine} d="M70 40 C84 52 84 68 72 80" />
      <path className={c.brainLine} d="M110 36 C120 50 118 70 104 82" />

      {/* language network — left frontal + temporal (lower-front) */}
      <ellipse
        className={c.netLanguage}
        data-lit={litNetwork === 'language'}
        cx="64"
        cy="88"
        rx="22"
        ry="16"
      />
      {/* multiple-demand network — frontal + parietal (upper, distributed) */}
      <ellipse
        className={c.netMd}
        data-lit={litNetwork === 'md'}
        cx="124"
        cy="62"
        rx="24"
        ry="17"
      />
    </svg>
  );
}
