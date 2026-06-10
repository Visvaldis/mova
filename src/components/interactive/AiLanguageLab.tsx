// ai-language-lab — two toys for "AI and the future of language":
//   (a) drift simulator: two sliders (AI share, human innovation) drive a toy
//       model of vocabulary diversity over generations; the end state is mapped
//       onto the article's three named futures. Labeled illustrative, not research.
//   (b) "human or AI?" quiz: 6 sentence pairs, pick the AI one, score at the end.
// All content article-sourced; see aiLanguageLab.data.ts for provenance + the model.
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import type { Lang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import { SIM, simulate, classify, QUIZ, OUTCOMES, type OutcomeId } from './aiLanguageLab.data';
import { useReducedMotion } from './useReducedMotion';
import s from './interactive.module.css';
import al from './AiLanguageLab.module.css';

// Chart geometry (SVG user units; scales responsively via viewBox).
const W = 320;
const H = 168;
const PAD = { l: 10, r: 10, t: 12, b: 20 };
const IW = W - PAD.l - PAD.r;
const IH = H - PAD.t - PAD.b;
const xAt = (g: number) => PAD.l + (g / SIM.GENERATIONS) * IW;
const yAt = (d: number) => PAD.t + (1 - d / SIM.CAP) * IH;

export default function AiLanguageLab({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const reduced = useReducedMotion();

  const [tab, setTab] = useState<'sim' | 'quiz'>('sim');

  // ---- (a) drift simulator ----
  const [ai, setAi] = useState(0.6);
  const [innovation, setInnovation] = useState(0.3);
  const series = useMemo(() => simulate(ai, innovation), [ai, innovation]);
  const outcome: OutcomeId = useMemo(() => classify(series, ai), [series, ai]);

  // progressive line-draw: how many of the series points are revealed (1..N+1).
  const [shown, setShown] = useState(SIM.GENERATIONS + 1);
  const rafRef = useRef<number | null>(null);

  const runDraw = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setShown(1);
    let start: number | null = null;
    const dur = 850;
    const tick = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min(1, (ts - start) / dur);
      setShown(1 + Math.round(p * SIM.GENERATIONS));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  // Initial draw (and whenever motion pref resolves): animate if allowed,
  // otherwise jump to the full static line.
  useEffect(() => {
    if (reduced) {
      setShown(SIM.GENERATIONS + 1);
    } else {
      runDraw();
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  // Sliders update the chart live — show the full curve instantly while dragging.
  const onSlide = (setter: (n: number) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    setter(Number(e.target.value) / 100);
    setShown(SIM.GENERATIONS + 1);
  };

  const pts = series.slice(0, shown);
  const linePath = pts.map((d, g) => `${g === 0 ? 'M' : 'L'} ${xAt(g)} ${yAt(d)}`).join(' ');
  const yBottom = yAt(0);
  const areaPath =
    pts.length > 1
      ? `M ${xAt(0)} ${yBottom} ` +
        pts.map((d, g) => `L ${xAt(g)} ${yAt(d)}`).join(' ') +
        ` L ${xAt(pts.length - 1)} ${yBottom} Z`
      : '';
  const headG = pts.length - 1;
  const headD = pts[pts.length - 1];

  // ---- (b) quiz ----
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<null | 'ai' | 'human'>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = QUIZ[qi];
  // Deterministic order (no Math.random → no hydration mismatch): alternate.
  const aiFirst = qi % 2 === 1;
  const options: Array<'ai' | 'human'> = aiFirst ? ['ai', 'human'] : ['human', 'ai'];

  const answer = (role: 'ai' | 'human') => {
    if (picked) return;
    setPicked(role);
    if (role === 'ai') setScore((x) => x + 1);
  };
  const next = () => {
    if (qi < QUIZ.length - 1) {
      setQi(qi + 1);
      setPicked(null);
    } else {
      setFinished(true);
    }
  };
  const restart = () => {
    setQi(0);
    setPicked(null);
    setScore(0);
    setFinished(false);
  };

  const scoreMsg =
    score >= 5
      ? t('aiLanguageLab.scoreMsgHigh')
      : score >= 3
        ? t('aiLanguageLab.scoreMsgMid')
        : t('aiLanguageLab.scoreMsgLow');

  return (
    <div className={al.wrap} data-interactive-id="ai-language-lab">
      <div className={s.panel}>
        {/* view switch */}
        <div className={s.row} role="group" aria-label={`${t('aiLanguageLab.tabSim')} / ${t('aiLanguageLab.tabQuiz')}`}>
          <button className={s.pill} aria-pressed={tab === 'sim'} onClick={() => setTab('sim')}>
            📈 {t('aiLanguageLab.tabSim')}
          </button>
          <button className={s.pill} aria-pressed={tab === 'quiz'} onClick={() => setTab('quiz')}>
            🕵️ {t('aiLanguageLab.tabQuiz')}
          </button>
        </div>

        {tab === 'sim' ? (
          <div>
            <p className={al.disclaimer}>
              <span>⚠️</span>
              <span>
                <b>{t('aiLanguageLab.disclaimerTag')}</b> {t('aiLanguageLab.disclaimerBody')}
              </span>
            </p>

            <p className={s.muted} style={{ fontSize: '0.9rem', margin: '0.9rem 0 0' }}>
              {t('aiLanguageLab.simIntro')}
            </p>

            <div className={al.controls}>
              <label className={al.control}>
                <span className={al.controlHead}>
                  <span className={al.controlLabel}>{t('aiLanguageLab.aiShare')}</span>
                  <span className={al.controlVal}>{Math.round(ai * 100)}%</span>
                </span>
                <input
                  className={s.range}
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(ai * 100)}
                  onChange={onSlide(setAi)}
                  aria-label={t('aiLanguageLab.aiShare')}
                />
              </label>

              <label className={al.control}>
                <span className={al.controlHead}>
                  <span className={al.controlLabel}>{t('aiLanguageLab.innovation')}</span>
                  <span className={al.controlVal}>{Math.round(innovation * 100)}%</span>
                </span>
                <input
                  className={s.range}
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(innovation * 100)}
                  onChange={onSlide(setInnovation)}
                  aria-label={t('aiLanguageLab.innovation')}
                />
              </label>
            </div>

            <div className={al.chartCard}>
              <svg
                className={al.chart}
                viewBox={`0 0 ${W} ${H}`}
                role="img"
                aria-label={t('aiLanguageLab.chartAria')}
              >
                {/* frame + baseline ("today" = 100) */}
                <line className={al.grid} x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={yBottom} />
                <line className={al.grid} x1={PAD.l} y1={yBottom} x2={W - PAD.r} y2={yBottom} />
                <line
                  className={al.baseline}
                  x1={PAD.l}
                  y1={yAt(SIM.BASELINE)}
                  x2={W - PAD.r}
                  y2={yAt(SIM.BASELINE)}
                />
                <text className={al.axisLabel} x={W - PAD.r} y={yAt(SIM.BASELINE) - 4} textAnchor="end">
                  {t('aiLanguageLab.baselineLabel')}
                </text>

                {areaPath && <path className={al.area} d={areaPath} />}
                {linePath && <path className={al.line} d={linePath} />}
                {headD !== undefined && <circle className={al.head} cx={xAt(headG)} cy={yAt(headD)} r={3.5} />}

                {/* axis hints */}
                <text className={al.axisLabel} x={PAD.l} y={PAD.t - 3}>
                  ↑ {t('aiLanguageLab.yHigh')}
                </text>
                <text className={al.axisLabel} x={PAD.l} y={H - 5}>
                  {t('aiLanguageLab.xAxis')}
                </text>
              </svg>

              {!reduced && (
                <div className={al.replayRow}>
                  <button className={s.pill} onClick={runDraw}>
                    ↻ {t('aiLanguageLab.replay')}
                  </button>
                </div>
              )}
            </div>

            <div className={al.outcome} role="status" aria-live="polite">
              <span className={al.outcomeName}>{OUTCOMES[outcome].name[lang]}</span>
              <p className={al.outcomeBlurb}>{OUTCOMES[outcome].blurb[lang]}</p>
            </div>

            <p className={s.caption} style={{ marginTop: '0.85rem' }}>
              {t('aiLanguageLab.favored')}
            </p>
          </div>
        ) : finished ? (
          <div className={al.score} role="status">
            <div>
              <span className={al.scoreNum}>{score}</span>
              <span className={al.scoreOf}> / {QUIZ.length}</span>
            </div>
            <p className={al.scoreMsg}>{scoreMsg}</p>
            <button className={s.pill} onClick={restart}>
              ↺ {t('aiLanguageLab.restart')}
            </button>
          </div>
        ) : (
          <div>
            <p className={al.quizIntro}>{t('aiLanguageLab.quizIntro')}</p>

            <p className={al.progress}>
              {t('aiLanguageLab.question')} {qi + 1} {t('aiLanguageLab.of')} {QUIZ.length} · {t('aiLanguageLab.scoreLead')}{' '}
              {score}
            </p>
            <p className={al.qTopic}>{q.topic[lang]}</p>
            <p className={s.muted} style={{ fontSize: '0.88rem', margin: '0 0 0.7rem' }}>
              {t('aiLanguageLab.pickPrompt')}
            </p>

            <div className={al.options}>
              {options.map((role) => {
                const text = q[role][lang];
                const revealed = picked !== null;
                const isAi = role === 'ai';
                const isWrongPick = revealed && picked === role && role === 'human';
                const cls = [
                  al.option,
                  revealed && isAi ? al.optionAi : '',
                  isWrongPick ? al.optionWrong : '',
                ]
                  .filter(Boolean)
                  .join(' ');
                return (
                  <button
                    key={role}
                    className={cls}
                    disabled={revealed}
                    aria-label={t('aiLanguageLab.pickAria')}
                    onClick={() => answer(role)}
                  >
                    {text}
                    {revealed && (
                      <span className={`${al.optTag} ${isAi ? al.optTagAi : al.optTagHuman}`}>
                        {isAi ? `✓ ${t('aiLanguageLab.tagAi')}` : t('aiLanguageLab.tagHuman')}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {picked !== null && (
              <div className={al.tell} aria-live="polite">
                <span className={`${al.verdict} ${picked === 'ai' ? al.verdictOk : al.verdictNo}`}>
                  {picked === 'ai' ? t('aiLanguageLab.correct') : t('aiLanguageLab.incorrect')}
                </span>{' '}
                {q.tell[lang]}
              </div>
            )}

            <div className={al.quizFoot}>
              <button className={s.pill} onClick={next} disabled={picked === null}>
                {qi < QUIZ.length - 1 ? `${t('aiLanguageLab.next')} →` : t('aiLanguageLab.seeScore')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
