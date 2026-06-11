// vitality-map — for "The Last Speaker: how languages die — and come back".
//   • Left (death): a vitality counter (~7,000 living, ~40% endangered), a
//     "falling silent" candle ticker, a clickable last-speaker story (Eyak /
//     Marie Smith Jones), and the three-generation shift that actually kills a
//     language.
//   • Right (revival): the Hebrew curve (≈0 native speakers in 1880 → ~9M today,
//     log scale) and clickable mini-cases (Welsh, Māori, Hawaiian, Crimean
//     Tatar, Cornish & Manx).
//   • Revival recipe: toggle prestige / schools / media / state status / home
//     use to move a vitality gauge — home use is weighted heaviest.
// Every figure is article-sourced; see vitalityMap.data.ts for provenance.
import { useEffect, useRef, useState } from 'react';
import type { Lang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import { useReducedMotion } from './useReducedMotion';
import {
  STATS,
  LAST_SPEAKERS,
  SHIFT,
  SHIFT_KEPT,
  HEBREW,
  HEBREW_RECIPE,
  MINI_CASES,
  RECIPE,
  bandFor,
} from './vitalityMap.data';
import { useInteractiveContext } from '../../lib/page-context';
import s from './interactive.module.css';
import v from './VitalityMap.module.css';

const N_CANDLES = 16;

// ---- Hebrew chart geometry (SVG user units; scales via viewBox) ----
const CW = 300;
const CH = 170;
const CPAD = { l: 30, r: 40, t: 16, b: 22 };
const CIW = CW - CPAD.l - CPAD.r;
const CIH = CH - CPAD.t - CPAD.b;
const LV_MAX = 7; // log10 ceiling: 10^7
const xAt = (year: number) =>
  CPAD.l + ((year - HEBREW.startYear) / (HEBREW.endYear - HEBREW.startYear)) * CIW;
const lvOf = (val: number) => (val <= 1 ? 0 : Math.log10(val));
const yAt = (lv: number) => CPAD.t + (1 - lv / LV_MAX) * CIH;

// ---- gauge geometry ----
const GR = 76; // arc radius
const ARC_LEN = Math.PI * GR;

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

function formatNum(n: number, lang: Lang): string {
  const sep = lang === 'uk' ? ' ' : ',';
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}

export default function VitalityMap({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const reduced = useReducedMotion();

  // ---- count-up for the living-languages figure ----
  const [living, setLiving] = useState(0);
  useEffect(() => {
    if (reduced) {
      setLiving(STATS.living);
      return;
    }
    let raf = 0;
    let start: number | null = null;
    const dur = 900;
    const tick = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min(1, (ts - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setLiving(Math.round(STATS.living * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  // endangered bar — animate width in after mount (CSS transition)
  const [barOn, setBarOn] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setBarOn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // ---- falling-silent candle ticker ----
  const [out, setOut] = useState(0);
  useEffect(() => {
    if (reduced) {
      setOut(6);
      return;
    }
    setOut(0);
    const id = setInterval(() => setOut((o) => (o >= N_CANDLES ? 0 : o + 1)), 1300);
    return () => clearInterval(id);
  }, [reduced]);

  // ---- last-speaker memory wall ----
  const [openStory, setOpenStory] = useState<string | null>(null);
  const story = LAST_SPEAKERS.find((ls) => ls.id === openStory);
  const miniRef = useRef<HTMLDivElement | null>(null);

  // ---- three-generation shift simulator ----
  const [gen, setGen] = useState(1); // generations revealed: 1..3
  const [keepHome, setKeepHome] = useState(false);
  const shiftData = keepHome ? SHIFT_KEPT : SHIFT;

  // ---- Hebrew curve progressive draw ----
  const [prog, setProg] = useState(1);
  const rafRef = useRef<number | null>(null);
  const runDraw = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setProg(0);
    let start: number | null = null;
    const dur = 950;
    const tick = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min(1, (ts - start) / dur);
      setProg(p);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };
  useEffect(() => {
    if (reduced) setProg(1);
    else runDraw();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  const startPt = { x: xAt(HEBREW.startYear), y: yAt(0) };
  const endPt = { x: xAt(HEBREW.endYear), y: yAt(lvOf(HEBREW.endSpeakers)) };
  const curX = lerp(startPt.x, endPt.x, prog);
  const curY = lerp(startPt.y, endPt.y, prog);

  // ---- mini-cases ----
  const [miniId, setMiniId] = useState<string | null>(null);
  const mini = MINI_CASES.find((m) => m.id === miniId);

  // ---- revival recipe ----
  const [active, setActive] = useState<Record<string, boolean>>(
    () => Object.fromEntries(RECIPE.map((r) => [r.id, false])),
  );
  const [recipeSource, setRecipeSource] = useState<string | null>(null);
  const recipeRef = useRef<HTMLElement | null>(null);
  const toggle = (id: string) => {
    setRecipeSource(null);
    setActive((a) => ({ ...a, [id]: !a[id] }));
  };
  const reset = () => {
    setRecipeSource(null);
    setActive(Object.fromEntries(RECIPE.map((r) => [r.id, false])));
  };
  /** Flip the gauge toggles to a named language's article-credited playbook. */
  const applyRecipe = (ids: string[], sourceName: string) => {
    setActive(Object.fromEntries(RECIPE.map((r) => [r.id, ids.includes(r.id)])));
    setRecipeSource(sourceName);
    if (!reduced) recipeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
  const showRevival = (caseId: string) => {
    setMiniId(caseId);
    if (!reduced) miniRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const vitality = Math.round(
    RECIPE.reduce((sum, r) => sum + (active[r.id] ? r.weight : 0), 0) * 100,
  );
  const band = bandFor(vitality);
  const needleAngle = (vitality / 100) * 180 - 90;
  const homeOn = active.home;

  const miniName = mini?.name[lang];
  const storyName = story?.name[lang];
  useInteractiveContext(
    'vitality-map',
    lang === 'uk'
      ? `Інтерактив «Карта живучості мов». Рецепт відродження: ${vitality}% — ${band.label[lang]}.${storyName ? ` Історія останнього мовця: ${storyName}.` : ''}${miniName ? ` Міні-кейс: ${miniName}.` : ''}${recipeSource ? ` Рецепт: ${recipeSource}.` : ''}`
      : `"Language Vitality Map" interactive. Revival recipe: ${vitality}% — ${band.label[lang]}.${storyName ? ` Last speaker story: ${storyName}.` : ''}${miniName ? ` Mini-case: ${miniName}.` : ''}${recipeSource ? ` Recipe of: ${recipeSource}.` : ''}`,
  );

  return (
    <div className={v.wrap} data-interactive-id="vitality-map">
      <p className={v.intro}>{t('vitalityMap.intro')}</p>

      <div className={v.split}>
        {/* ============ DEATH ============ */}
        <section className={`${s.panel} ${v.col}`} aria-label={t('vitalityMap.deathTitle')}>
          <h3 className={v.colTitle}>
            <span className={v.dot} aria-hidden="true">🕯️</span>
            {t('vitalityMap.deathTitle')}
          </h3>

          <div className={v.counter}>
            <div className={v.statBig}>
              <span className={v.statNum} aria-live="off">~{formatNum(living, lang)}</span>
              <span className={v.statUnit}>{t('vitalityMap.livingUnit')}</span>
            </div>
            <div className={v.endangered}>
              <div className={v.endHead}>
                <span>{t('vitalityMap.endangeredLabel')}</span>
                <span className={v.endPct}>~{STATS.endangeredPct}%</span>
              </div>
              <div
                className={v.bar}
                role="img"
                aria-label={`~${STATS.endangeredPct}% ${t('vitalityMap.endangeredLabel')}`}
              >
                <div
                  className={v.barFill}
                  style={{ width: barOn ? `${STATS.endangeredPct}%` : '0%' }}
                />
              </div>
            </div>
          </div>

          {/* falling-silent ticker */}
          <div className={v.ticker}>
            <span className={v.tickerLabel}>{t('vitalityMap.tickerLabel')}</span>
            <div className={v.candles} aria-hidden="true">
              {Array.from({ length: N_CANDLES }, (_, i) => (
                <span key={i} className={`${v.candle} ${i < out ? v.candleOut : ''}`}>
                  🕯️
                </span>
              ))}
            </div>
            <p className={v.tickerNote}>{t('vitalityMap.tickerNote')}</p>
          </div>

          {/* last-speaker memory wall */}
          <div>
            <p className={v.sectionHead}>{t('vitalityMap.lastSpeakerTitle')}</p>
            <p className={s.caption} style={{ margin: '0.2rem 0 0.5rem' }}>
              {t('vitalityMap.lastSpeakerHint')}
            </p>
            <div className={v.wall} role="group" aria-label={t('vitalityMap.lastSpeakerTitle')}>
              {LAST_SPEAKERS.map((ls) => {
                const open = openStory === ls.id;
                return (
                  <button
                    key={ls.id}
                    className={`${v.wallNode} ${open ? v.wallNodeOn : ''}`}
                    aria-pressed={open}
                    aria-label={`${ls.language[lang]}, ${ls.year} — ${ls.name[lang]}`}
                    onClick={() => setOpenStory(open ? null : ls.id)}
                  >
                    <span className={`${v.wallCandle} ${open ? v.wallCandleOut : ''}`} aria-hidden="true">
                      🕯️
                    </span>
                    <span className={v.wallYear}>{ls.year}</span>
                    <span className={v.wallLang}>{ls.language[lang]}</span>
                  </button>
                );
              })}
            </div>
            {story && (
              <div className={v.storyCard} role="region" aria-live="polite">
                <div className={v.storyMeta}>
                  <span className={v.metaItem}>
                    <span className={v.metaLabel}>{t('vitalityMap.lastSpeakerTitle')}</span>
                    {story.name[lang]}
                  </span>
                  <span className={v.metaItem}>
                    <span className={v.metaLabel}>{t('vitalityMap.died')}</span>
                    {story.died[lang]}
                  </span>
                  <span className={v.metaItem}>
                    <span className={v.metaLabel}>{t('vitalityMap.place')}</span>
                    {story.place[lang]}
                  </span>
                </div>
                <p className={v.storyText}>{story.story[lang]}</p>
                {story.revivedAs && (
                  <p className={v.revivedRow}>
                    <span aria-hidden="true">🌱</span> {t('vitalityMap.revivedNote')}{' '}
                    <button className={v.revivedBtn} onClick={() => showRevival(story.revivedAs!)}>
                      {t('vitalityMap.seeRevival')} →
                    </button>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* death by shift — generation stepper */}
          <div className={v.shift}>
            <p className={v.sectionHead}>{t('vitalityMap.shiftTitle')}</p>
            <p className={s.caption} style={{ margin: '0.2rem 0 0.5rem' }}>
              {t('vitalityMap.shiftHint')}
            </p>
            <div className={v.shiftRow}>
              {shiftData.map((st, i) => {
                const revealed = i < gen;
                return (
                  <div key={st.id} className={`${v.shiftStep} ${revealed ? '' : v.shiftStepOff}`}>
                    <span className={v.shiftWho}>{st.who[lang]}</span>
                    <span className={v.shiftState}>{revealed ? st.state[lang] : '…'}</span>
                    <div
                      className={v.shiftMeter}
                      role="img"
                      aria-label={revealed ? `${st.who[lang]}: ${st.state[lang]}` : st.who[lang]}
                    >
                      <div
                        className={v.shiftMeterFill}
                        style={{ width: revealed ? `${st.fluency * 100}%` : '0%' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={v.shiftControls}>
              {gen < 3 ? (
                <button className={s.pill} onClick={() => setGen((g) => Math.min(3, g + 1))}>
                  {t('vitalityMap.shiftNext')} →
                </button>
              ) : (
                <button className={s.pill} onClick={() => setGen(1)}>
                  ↺ {t('vitalityMap.shiftRestart')}
                </button>
              )}
              <label className={v.keepToggle}>
                <input
                  type="checkbox"
                  checked={keepHome}
                  onChange={(e) => setKeepHome(e.target.checked)}
                />
                <span aria-hidden="true">🏡</span> {t('vitalityMap.shiftKeepHome')}
              </label>
            </div>

            {gen === 3 && (
              <p
                className={`${v.shiftOutcome} ${keepHome ? v.shiftAlive : v.shiftDead}`}
                role="status"
                aria-live="polite"
              >
                {keepHome ? <>🌱 {t('vitalityMap.shiftAlive')}</> : <>🕯️ {t('vitalityMap.shiftDead')}</>}
              </p>
            )}
            <p className={s.caption}>{t('vitalityMap.shiftNote')}</p>
          </div>
        </section>

        {/* ============ REVIVAL ============ */}
        <section className={`${s.panel} ${v.col}`} aria-label={t('vitalityMap.revivalTitle')}>
          <h3 className={v.colTitle}>
            <span className={v.dot} aria-hidden="true">🌱</span>
            {t('vitalityMap.revivalTitle')}
          </h3>

          <div>
            <p className={v.sectionHead}>{t('vitalityMap.hebrewTitle')}</p>
            <div className={v.hebrewCard}>
              <svg
                className={v.chart}
                viewBox={`0 0 ${CW} ${CH}`}
                role="img"
                aria-label={t('vitalityMap.chartAria')}
              >
                {/* horizontal log gridlines + labels (1, 1K, 1M) */}
                {[
                  { lv: 0, label: '0' },
                  { lv: 3, label: t('vitalityMap.grid1k') },
                  { lv: 6, label: t('vitalityMap.grid1m') },
                ].map((g) => (
                  <g key={g.lv}>
                    <line
                      className={v.grid}
                      x1={CPAD.l}
                      y1={yAt(g.lv)}
                      x2={CW - CPAD.r}
                      y2={yAt(g.lv)}
                    />
                    <text className={v.gridLabel} x={CPAD.l - 4} y={yAt(g.lv) + 2.5} textAnchor="end">
                      {g.label}
                    </text>
                  </g>
                ))}

                {/* the curve (straight line on log axis = constant growth) */}
                <path className={v.curve} d={`M ${startPt.x} ${startPt.y} L ${curX} ${curY}`} />

                {/* anchors */}
                <circle className={v.anchor} cx={startPt.x} cy={startPt.y} r={3.4} />
                {prog > 0.98 && <circle className={v.anchor} cx={endPt.x} cy={endPt.y} r={4} />}
                {prog <= 0.98 && <circle className={v.anchor} cx={curX} cy={curY} r={3.4} />}

                {/* anchor labels */}
                <text
                  className={v.anchorLabel}
                  x={startPt.x + 3}
                  y={startPt.y - 4}
                  textAnchor="start"
                >
                  {t('vitalityMap.chartStart')}
                </text>
                <text className={v.anchorLabel} x={endPt.x} y={endPt.y - 6} textAnchor="end">
                  {t('vitalityMap.chartEnd')}
                </text>

                {/* x labels */}
                <text className={v.axisLabel} x={startPt.x} y={CH - 6} textAnchor="middle">
                  {HEBREW.startYear}
                </text>
                <text className={v.axisLabel} x={endPt.x} y={CH - 6} textAnchor="end">
                  {t('vitalityMap.today')}
                </text>
              </svg>

              {!reduced && (
                <div className={v.replayRow}>
                  <button className={s.pill} onClick={runDraw}>
                    ↻ {t('vitalityMap.replay')}
                  </button>
                </div>
              )}
              <p className={v.hebrewNote}>{t('vitalityMap.hebrewNote')}</p>
            </div>
            <p className={v.hebrewBody}>{t('vitalityMap.hebrewBody')}</p>
            <button
              className={s.pill}
              style={{ marginTop: '0.4rem' }}
              onClick={() => applyRecipe(HEBREW_RECIPE, lang === 'uk' ? 'Іврит' : 'Hebrew')}
            >
              ⚖️ {t('vitalityMap.tryRecipe')}
            </button>
          </div>

          {/* mini-cases */}
          <div ref={miniRef}>
            <p className={v.sectionHead}>{t('vitalityMap.miniTitle')}</p>
            <p className={s.caption} style={{ margin: '0.2rem 0 0.5rem' }}>
              {t('vitalityMap.miniHint')}
            </p>
            <div className={v.miniGrid} role="group" aria-label={t('vitalityMap.miniTitle')}>
              {MINI_CASES.map((m) => (
                <button
                  key={m.id}
                  className={v.miniBtn}
                  aria-pressed={m.id === miniId}
                  onClick={() => setMiniId(m.id === miniId ? null : m.id)}
                >
                  <span className={v.miniName}>{m.name[lang]}</span>
                  <span className={v.miniTag}>{m.tag[lang]}</span>
                </button>
              ))}
            </div>
            {mini && (
              <div className={v.miniDetail} role="status" aria-live="polite" style={{ marginTop: '0.5rem' }}>
                <p>{mini.detail[lang]}</p>
                <p className={v.miniIngredients} aria-hidden="true">
                  {RECIPE.filter((r) => mini.recipe.includes(r.id)).map((r) => (
                    <span key={r.id} className={v.ingredientChip}>
                      {r.emoji} {r.label[lang]}
                    </span>
                  ))}
                </p>
                <button
                  className={s.pill}
                  onClick={() => applyRecipe(mini.recipe, mini.name[lang])}
                >
                  ⚖️ {t('vitalityMap.tryRecipe')}
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ============ REVIVAL RECIPE ============ */}
      <section ref={recipeRef} className={s.panel} aria-label={t('vitalityMap.recipeTitle')}>
        <h3 className={v.colTitle} style={{ marginBottom: '0.3rem' }}>
          <span className={v.dot} aria-hidden="true">⚖️</span>
          {t('vitalityMap.recipeTitle')}
        </h3>
        <p className={v.intro} style={{ marginBottom: '0.9rem' }}>
          {t('vitalityMap.recipeIntro')}
        </p>
        {recipeSource && (
          <p className={v.recipeChip} role="status">
            {t('vitalityMap.recipeOf')} <strong>{recipeSource}</strong>
          </p>
        )}

        <div className={v.recipe}>
          {/* gauge */}
          <div className={v.gaugeBox}>
            <svg
              className={v.gaugeSvg}
              viewBox="0 0 200 120"
              role="img"
              aria-label={`${t('vitalityMap.gaugeAria')}: ${vitality}% — ${band.label[lang]}`}
            >
              <path
                className={v.gaugeTrack}
                d={`M ${100 - GR} 100 A ${GR} ${GR} 0 0 1 ${100 + GR} 100`}
              />
              <path
                className={v.gaugeFill}
                d={`M ${100 - GR} 100 A ${GR} ${GR} 0 0 1 ${100 + GR} 100`}
                style={{ strokeDasharray: ARC_LEN, strokeDashoffset: ARC_LEN * (1 - vitality / 100) }}
              />
              <g className={v.needle} style={{ transform: `rotate(${needleAngle}deg)` }}>
                <line className={v.needleLine} x1="100" y1="100" x2="100" y2="36" />
              </g>
              <circle className={v.needleHub} cx="100" cy="100" r="5" />
            </svg>
            <span className={v.gaugePct} aria-hidden="true">{vitality}%</span>
            <span className={v.gaugeBand}>{band.label[lang]}</span>
          </div>

          {/* toggles */}
          <div>
            <div className={v.toggles} role="group" aria-label={t('vitalityMap.togglesAria')}>
              {RECIPE.map((r) => {
                const on = active[r.id];
                const heaviest = r.id === 'home';
                return (
                  <button
                    key={r.id}
                    className={v.toggle}
                    aria-pressed={on}
                    onClick={() => toggle(r.id)}
                  >
                    <span className={v.toggleBox} aria-hidden="true">{on ? '✓' : ''}</span>
                    <span className={v.toggleMain}>
                      <span className={v.toggleTop}>
                        <span aria-hidden="true">{r.emoji}</span>
                        <span className={v.toggleLabel}>{r.label[lang]}</span>
                        {heaviest && (
                          <span className={`${v.weightTag} ${v.heaviest}`}>
                            {t('vitalityMap.heaviest')}
                          </span>
                        )}
                      </span>
                      <span className={v.toggleNote}>{r.note[lang]}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <p className={s.caption} role="status" aria-live="polite" style={{ marginTop: '0.7rem' }}>
              {homeOn ? t('vitalityMap.homeOnNote') : t('vitalityMap.homeOffNote')}
            </p>

            <div className={v.recipeFoot}>
              <span className={v.illus}>{t('vitalityMap.illustrative')}</span>
              <button className={s.pill} onClick={reset}>
                ↺ {t('vitalityMap.reset')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
