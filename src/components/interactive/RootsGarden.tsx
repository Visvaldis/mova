import { useMemo, useState } from 'react';
import type { Lang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import { project, WORLD_PATH } from '../../lib/geo';
import {
  LAYERS,
  WORDS,
  SENTENCE,
  UKRAINE,
  type GeoPoint,
  type LayerId,
  type RootWord,
} from './rootsGarden.data';
import s from './interactive.module.css';
import c from './RootsGarden.module.css';

type Tab = 'strata' | 'sentence';
type T = (key: Parameters<ReturnType<typeof useTranslations>>[0]) => string;

const layerById = (id: LayerId) => LAYERS.find((l) => l.id === id)!;
// Depth index per layer for the strata tint (deepest = strongest). LAYERS is
// oldest→newest, so the last index is the shallowest, newest sediment.
const depthOf = (id: LayerId) => LAYERS.length - 1 - LAYERS.findIndex((l) => l.id === id);

export default function RootsGarden({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const [tab, setTab] = useState<Tab>('strata');

  return (
    <div className={c.root}>
      <div className={c.tabs} role="tablist" aria-label={t('rootsGarden.tabsAria')}>
        <button
          role="tab"
          aria-selected={tab === 'strata'}
          aria-pressed={tab === 'strata'}
          className={`${c.tab} ${tab === 'strata' ? c.tabActive : ''}`}
          onClick={() => setTab('strata')}
        >
          🌱 {t('rootsGarden.tabStrata')}
        </button>
        <button
          role="tab"
          aria-selected={tab === 'sentence'}
          aria-pressed={tab === 'sentence'}
          className={`${c.tab} ${tab === 'sentence' ? c.tabActive : ''}`}
          onClick={() => setTab('sentence')}
        >
          🏛 {t('rootsGarden.tabSentence')}
        </button>
      </div>

      {tab === 'strata' ? <StrataView lang={lang} t={t} /> : <SentenceView lang={lang} t={t} />}
    </div>
  );
}

/* ── Tab 1: the stratigraphy ───────────────────────────────────────────── */
function StrataView({ lang, t }: { lang: Lang; t: T }) {
  const [openId, setOpenId] = useState<string | null>(null);
  // Bumping this remounts the strata, replaying the CSS settle animation
  // ("re-sort"). The animation is pure CSS, so it's neutralized under
  // prefers-reduced-motion (the layers just appear in their final places).
  const [runId, setRunId] = useState(0);

  const open = WORDS.find((w) => w.id === openId) ?? null;
  // Stacked newest-on-top, like sediment: reverse the oldest→newest LAYERS.
  const stacked = useMemo(() => [...LAYERS].reverse(), []);

  return (
    <>
      <p className={c.intro}>{t('rootsGarden.strataIntro')}</p>

      <div className={c.controls}>
        <button className={s.pill} onClick={() => setRunId((n) => n + 1)}>
          ↻ {t('rootsGarden.sortAgain')}
        </button>
        <span className={c.hint}>{t('rootsGarden.tapHint')}</span>
      </div>

      <div className={c.strata} key={runId}>
        {stacked.map((layer, row) => {
          const words = WORDS.filter((w) => w.layer === layer.id);
          return (
            <section
              key={layer.id}
              className={c.layer}
              style={{ ['--d' as string]: depthOf(layer.id), ['--row' as string]: row }}
            >
              <div className={c.layerHead}>
                <span className={c.layerName}>{layer.name[lang]}</span>
                <span className={c.layerEra}>{layer.era[lang]}</span>
              </div>
              <p className={c.layerBlurb}>{layer.blurb[lang]}</p>
              {words.length > 0 ? (
                <div className={c.chips}>
                  {words.map((w, i) => (
                    <button
                      key={w.id}
                      className={`${c.chip} ${openId === w.id ? c.chipActive : ''} ${
                        w.birthCert ? c.chipStar : ''
                      }`}
                      style={{ ['--i' as string]: i }}
                      aria-pressed={openId === w.id}
                      aria-label={`${t('rootsGarden.tapHint')}: ${w.word}`}
                      onClick={() => setOpenId(openId === w.id ? null : w.id)}
                    >
                      {w.birthCert && <span aria-hidden="true">★ </span>}
                      {w.word}
                    </button>
                  ))}
                </div>
              ) : (
                <p className={c.emptyLayer}>{t('rootsGarden.englishEmpty')}</p>
              )}
            </section>
          );
        })}
      </div>

      {open &&
        (open.birthCert ? (
          <BirthCertificate key={open.id} word={open} lang={lang} t={t} onClose={() => setOpenId(null)} />
        ) : (
          <WordPanel key={open.id} word={open} lang={lang} t={t} onClose={() => setOpenId(null)} />
        ))}
    </>
  );
}

/* ── Word detail (story + route mini-map) ──────────────────────────────── */
function WordPanel({
  word,
  lang,
  t,
  onClose,
}: {
  word: RootWord;
  lang: Lang;
  t: T;
  onClose: () => void;
}) {
  const layer = layerById(word.layer);
  return (
    <div className={c.panel}>
      <RouteMap word={word} lang={lang} t={t} />
      <div className={c.panelBody}>
        <div className={c.panelHead}>
          <span className={c.headword}>{word.word}</span>
          <span className={c.gloss}>{word.gloss[lang]}</span>
        </div>
        <div className={c.tagRow}>
          <span className={c.layerTag}>{layer.name[lang]}</span>
          <span className={c.originTag}>{word.origin[lang]}</span>
        </div>
        <p className={c.story}>{word.story[lang]}</p>
        <button className={c.close} onClick={onClose}>
          {t('rootsGarden.close')}
        </button>
      </div>
    </div>
  );
}

/* ── Birth certificate (мрія) ──────────────────────────────────────────── */
function BirthCertificate({
  word,
  lang,
  t,
  onClose,
}: {
  word: RootWord;
  lang: Lang;
  t: T;
  onClose: () => void;
}) {
  const bc = word.birthCert!;
  return (
    <div className={`${c.panel} ${c.cert}`}>
      <div className={c.certInner}>
        <div className={c.certBadge}>{t('rootsGarden.bcTitle')}</div>
        <div className={c.certWord}>
          {word.word} <span className={c.certGloss}>· {word.gloss[lang]}</span>
        </div>
        <dl className={c.certRows}>
          <div className={c.certRow}>
            <dt>{t('rootsGarden.bcAuthor')}</dt>
            <dd>{bc.author[lang]}</dd>
          </div>
          <div className={c.certRow}>
            <dt>{t('rootsGarden.bcDate')}</dt>
            <dd>{bc.date[lang]}</dd>
          </div>
          <div className={c.certRow}>
            <dt>{t('rootsGarden.bcFrom')}</dt>
            <dd>
              <span className={c.certVerb}>{bc.sourceVerb}</span>{' '}
              <span className={c.certVerbGloss}>
                ({t('rootsGarden.bcMeaning')}: {bc.verbMeaning[lang]})
              </span>
            </dd>
          </div>
        </dl>
        <p className={c.story}>{word.story[lang]}</p>
        <p className={c.certNote}>✈ {bc.note[lang]}</p>
        <button className={c.close} onClick={onClose}>
          {t('rootsGarden.close')}
        </button>
      </div>
    </div>
  );
}

/* ── Route mini-map ────────────────────────────────────────────────────── */
/** Quadratic control point that bows an arc to one consistent side. */
function ctrl(p1: { x: number; y: number }, p2: { x: number; y: number }) {
  const mx = (p1.x + p2.x) / 2;
  const my = (p1.y + p2.y) / 2;
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.hypot(dx, dy) || 1;
  const off = Math.min(28, len * 0.25);
  return { cx: mx + (-dy / len) * off, cy: my + (dx / len) * off };
}
function arc(a: { x: number; y: number }, b: { x: number; y: number }) {
  const { cx, cy } = ctrl(a, b);
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
}

function RouteMap({ word, lang, t }: { word: RootWord; lang: Lang; t: T }) {
  const uk = project(UKRAINE.lat, UKRAINE.lon);
  // Eurasia window: every source region + Ukraine fall inside this crop.
  const viewBox = '498 60 200 116';

  const stops: GeoPoint[] = [];
  if (word.source) stops.push(word.source);
  if (word.via) stops.push(word.via);

  const pts = stops.map((g) => ({ ...project(g.lat, g.lon), place: g.place }));
  const all = [...pts.map((p) => ({ x: p.x, y: p.y })), uk];

  const ariaParts = word.bornHere
    ? [UKRAINE.place[lang]]
    : [...stops.map((g) => g.place[lang]), UKRAINE.place[lang]];
  const aria = `${t('rootsGarden.routeAria')}: ${ariaParts.join(' → ')}`;

  return (
    <div className={c.mapWrap}>
      <svg className={c.map} viewBox={viewBox} role="img" aria-label={aria} preserveAspectRatio="xMidYMid meet">
        <path className={c.land} d={WORLD_PATH} />

        {/* arcs origin → (via) → Ukraine */}
        {!word.bornHere &&
          all.slice(0, -1).map((p, i) => (
            <path key={i} className={c.route} pathLength={100} d={arc(p, all[i + 1])} />
          ))}

        {/* source / via dots */}
        {!word.bornHere &&
          pts.map((p, i) => <circle key={i} className={c.srcDot} cx={p.x} cy={p.y} r={2.6} />)}

        {/* Ukraine — the destination, always highlighted */}
        {word.bornHere ? (
          <g>
            <circle className={c.bornDot} cx={uk.x} cy={uk.y} r={3.4} />
            <text className={c.bornText} x={uk.x} y={uk.y - 5} textAnchor="middle">
              ★
            </text>
          </g>
        ) : (
          <circle className={c.ukDot} cx={uk.x} cy={uk.y} r={3.2} />
        )}
      </svg>
      <p className={c.mapCaption}>
        {word.bornHere
          ? `★ ${t('rootsGarden.bornHere')} · ${UKRAINE.place[lang]}`
          : `${(word.source ?? UKRAINE).place[lang]} → ${UKRAINE.place[lang]}`}
      </p>
    </div>
  );
}

/* ── Tab 2: the tappable sentence ──────────────────────────────────────── */
function SentenceView({ lang, t }: { lang: Lang; t: T }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const open = openIdx !== null ? SENTENCE[openIdx] : null;
  const openLayer = open?.layer ? layerById(open.layer) : null;

  return (
    <div className={c.sentenceWrap}>
      <p className={c.intro}>{t('rootsGarden.sentenceIntro')}</p>

      <p className={c.sentence}>
        {SENTENCE.map((tok, i) => (
          <span key={i}>
            <button
              className={`${c.token} ${openIdx === i ? c.tokenActive : ''}`}
              data-layer={tok.layer}
              aria-pressed={openIdx === i}
              aria-label={`${t('rootsGarden.layerLabel')}: ${tok.text}`}
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
            >
              {tok.text}
            </button>{' '}
          </span>
        ))}
      </p>

      <div className={s.card} role="status" aria-live="polite">
        {open && openLayer ? (
          <>
            <div className={c.tokenHead}>
              <span className={c.tokenWord}>{open.text}</span>
              <span className={c.layerTag}>{openLayer.name[lang]}</span>
            </div>
            {open.note && <p className={c.story}>{open.note[lang]}</p>}
          </>
        ) : (
          <p className={c.muted}>{t('rootsGarden.sentenceHint')}</p>
        )}
      </div>

      {/* legend: the layers that appear in this phrase */}
      <div className={c.legend}>
        {[...new Set(SENTENCE.map((tk) => tk.layer))].filter(Boolean).map((id) => (
          <span key={id} className={c.legendItem}>
            <span className={c.legendSwatch} data-layer={id} aria-hidden="true" />
            {layerById(id as LayerId).name[lang]}
          </span>
        ))}
      </div>

      <p className={s.caption}>{t('rootsGarden.schematicNote')}</p>
    </div>
  );
}
