import { useEffect, useState } from 'react';
import type { Lang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import { useReducedMotion } from './useReducedMotion';
import { project, WORLD_PATH, MAP_W, MAP_H } from '../../lib/geo';
import { WORDS, QUIZ, type Word } from './wordTraveler.data';
import s from './interactive.module.css';
import c from './WordTraveler.module.css';

type Tab = 'journey' | 'quiz';
type Focus = { kind: 'origin' } | { kind: 'stop'; b: number; i: number };

/** Quadratic control point that bows the arc to one consistent side. */
function ctrl(p1: { x: number; y: number }, p2: { x: number; y: number }) {
  const mx = (p1.x + p2.x) / 2;
  const my = (p1.y + p2.y) / 2;
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.hypot(dx, dy) || 1;
  const off = Math.min(70, len * 0.2);
  return { cx: mx + (-dy / len) * off, cy: my + (dx / len) * off };
}

function routePath(points: { x: number; y: number }[]) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const { cx, cy } = ctrl(points[i - 1], points[i]);
    d += ` Q ${cx} ${cy} ${points[i].x} ${points[i].y}`;
  }
  return d;
}

function spokePath(o: { x: number; y: number }, p: { x: number; y: number }) {
  const { cx, cy } = ctrl(o, p);
  return `M ${o.x} ${o.y} Q ${cx} ${cy} ${p.x} ${p.y}`;
}

export default function WordTraveler({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const reduced = useReducedMotion();

  const [tab, setTab] = useState<Tab>('journey');
  const [wordId, setWordId] = useState<string>(WORDS[0].id);

  const word: Word = WORDS.find((w) => w.id === wordId) ?? WORDS[0];
  const maxStops = Math.max(...word.branches.map((b) => b.stops.length));
  const leadIdx = word.branches.reduce(
    (best, b, i, arr) => (b.stops.length > arr[best].stops.length ? i : best),
    0,
  );

  const [progress, setProgress] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [focus, setFocus] = useState<Focus>({ kind: 'origin' });

  // Reset the journey whenever the word (or motion preference) changes.
  useEffect(() => {
    setProgress(reduced ? maxStops : 1);
    setFocus({ kind: 'origin' });
    setPlaying(false);
  }, [wordId, reduced, maxStops]);

  function newestAt(p: number): Focus {
    if (p < 1) return { kind: 'origin' };
    const b = word.branches[leadIdx];
    return { kind: 'stop', b: leadIdx, i: Math.min(p - 1, b.stops.length - 1) };
  }
  function goNewest(p: number) {
    const np = Math.max(1, Math.min(p, maxStops));
    setProgress(np);
    setFocus(newestAt(np));
  }
  function inspect(f: Focus, minP: number) {
    setProgress((p) => Math.max(p, minP));
    setFocus(f);
    setPlaying(false);
  }

  // Autoplay: advance one stop at a time. JS-driven, so gated on reduced-motion.
  useEffect(() => {
    if (!playing || reduced) return;
    if (progress >= maxStops) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => goNewest(progress + 1), 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, reduced, progress, maxStops]);

  const focusStop =
    focus.kind === 'stop'
      ? word.branches[focus.b]?.stops[focus.i] ?? word.origin
      : word.origin;
  const focusIsOrigin = focus.kind === 'origin' || !word.branches[focus.b]?.stops[focus.i];

  const O = project(word.origin.lat, word.origin.lon);
  const atEnd = progress >= maxStops;

  function onPlayPause() {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (atEnd) goNewest(1);
    setPlaying(true);
  }

  return (
    <div className={c.wrap} data-interactive-id="word-traveler">
      {/* view tabs */}
      <div className={s.row} role="tablist" aria-label={t('wordTraveler.tabsAria')}>
        <button
          className={s.pill}
          role="tab"
          aria-selected={tab === 'journey'}
          aria-pressed={tab === 'journey'}
          onClick={() => setTab('journey')}
        >
          🗺 {t('wordTraveler.tabJourney')}
        </button>
        <button
          className={s.pill}
          role="tab"
          aria-selected={tab === 'quiz'}
          aria-pressed={tab === 'quiz'}
          onClick={() => setTab('quiz')}
        >
          🎯 {t('wordTraveler.tabQuiz')}
        </button>
      </div>

      {tab === 'journey' ? (
        <div className={s.panel} style={{ marginTop: '0.9rem' }}>
          <p className={c.intro}>{t('wordTraveler.journeyIntro')}</p>

          {/* word picker */}
          <div className={c.picker} role="group" aria-label={t('wordTraveler.pickWordAria')}>
            {WORDS.map((w) => (
              <button
                key={w.id}
                className={c.wordBtn}
                data-active={w.id === wordId}
                data-kind={w.kind}
                onClick={() => setWordId(w.id)}
              >
                <span className={c.wordEmoji} aria-hidden="true">
                  {w.emoji}
                </span>
                <span className={c.wordName}>{w.name[lang]}</span>
              </button>
            ))}
          </div>

          <p className={c.gloss}>{word.gloss[lang]}</p>

          {/* map */}
          <div className={c.mapWrap}>
            <svg
              className={c.map}
              viewBox={`0 0 ${MAP_W} ${MAP_H}`}
              role="img"
              aria-label={t('wordTraveler.mapAria')}
              preserveAspectRatio="xMidYMid meet"
            >
              <path className={c.land} d={WORLD_PATH} />

              {/* routes */}
              {word.branches.map((branch, bi) => {
                const pts = branch.stops
                  .slice(0, progress)
                  .map((stop) => project(stop.lat, stop.lon));
                const dashed = bi % 2 === 1;
                if (word.layout === 'radial') {
                  return pts.map((p, i) => (
                    <path
                      key={`${bi}-${i}`}
                      className={dashed ? c.routeDashed : c.route}
                      pathLength={100}
                      d={spokePath(O, p)}
                    />
                  ));
                }
                return (
                  <path
                    key={bi}
                    className={dashed ? c.routeDashed : c.route}
                    pathLength={100}
                    d={routePath([O, ...pts])}
                  />
                );
              })}

              {/* origin dot */}
              <circle
                className={c.originDot}
                cx={O.x}
                cy={O.y}
                r={7}
                data-focused={focusIsOrigin}
              />

              {/* stop dots */}
              {word.branches.map((branch, bi) =>
                branch.stops.slice(0, progress).map((stop, i) => {
                  const p = project(stop.lat, stop.lon);
                  const hollow = bi % 2 === 1;
                  const isFocused =
                    focus.kind === 'stop' && focus.b === bi && focus.i === i;
                  return (
                    <circle
                      key={`d-${bi}-${i}`}
                      className={hollow ? c.dotHollow : c.dot}
                      cx={p.x}
                      cy={p.y}
                      r={6}
                      data-focused={isFocused}
                    />
                  );
                }),
              )}
            </svg>

            {/* tea sea/land legend */}
            {word.layout === 'radial' && (
              <div className={c.legend}>
                <span className={c.legendItem}>
                  <span className={c.swatchSolid} aria-hidden="true" />
                  {t('wordTraveler.seaLabel')}
                </span>
                <span className={c.legendItem}>
                  <span className={c.swatchDashed} aria-hidden="true" />
                  {t('wordTraveler.landLabel')}
                </span>
              </div>
            )}
          </div>

          {/* playback controls (only meaningful when there's more than one stop) */}
          {maxStops > 1 && (
            <div className={c.controls}>
              {!reduced && (
                <button className={s.pill} onClick={onPlayPause}>
                  {playing
                    ? `⏸ ${t('wordTraveler.pause')}`
                    : atEnd
                      ? `↻ ${t('wordTraveler.replay')}`
                      : `▶ ${t('wordTraveler.play')}`}
                </button>
              )}
              <button
                className={s.pill}
                onClick={() => {
                  goNewest(progress - 1);
                  setPlaying(false);
                }}
                disabled={progress <= 1}
              >
                ‹ {t('wordTraveler.stepBack')}
              </button>
              <button
                className={s.pill}
                onClick={() => {
                  goNewest(progress + 1);
                  setPlaying(false);
                }}
                disabled={atEnd}
              >
                {t('wordTraveler.stepFwd')} ›
              </button>
              <span className={c.count}>
                {t('wordTraveler.stopWord')} {progress} {t('wordTraveler.of')} {maxStops}
              </span>
              <input
                className={s.range}
                type="range"
                min={1}
                max={maxStops}
                value={progress}
                aria-label={t('wordTraveler.scrubAria')}
                onChange={(e) => {
                  goNewest(Number(e.target.value));
                  setPlaying(false);
                }}
              />
            </div>
          )}

          {/* form trail — the keyboard-accessible path through the stops */}
          <div className={c.trail}>
            <span className={c.trailLabel}>{t('wordTraveler.trailLabel')}</span>
            <button
              className={c.chip}
              data-origin="true"
              data-focused={focusIsOrigin}
              onClick={() => inspect({ kind: 'origin' }, 1)}
            >
              {word.origin.form ?? word.origin.place[lang]}
            </button>
            {word.branches.map((branch, bi) => {
              const revealed = branch.stops.slice(0, progress);
              if (revealed.length === 0) return null;
              const groupLabel =
                word.layout === 'radial'
                  ? branch.group === 'sea'
                    ? t('wordTraveler.seaLabel')
                    : t('wordTraveler.landLabel')
                  : null;
              return (
                <div className={c.trailRow} key={bi}>
                  {groupLabel ? (
                    <span className={c.trailGroup}>{groupLabel}</span>
                  ) : (
                    <span className={c.arrow} aria-hidden="true">
                      →
                    </span>
                  )}
                  {revealed.map((stop, i) => {
                    const isFocused =
                      focus.kind === 'stop' && focus.b === bi && focus.i === i;
                    return (
                      <span className={c.chipGroup} key={i}>
                        {word.layout === 'route' && i > 0 && (
                          <span className={c.arrow} aria-hidden="true">
                            →
                          </span>
                        )}
                        <button
                          className={c.chip}
                          data-hollow={bi % 2 === 1}
                          data-focused={isFocused}
                          onClick={() => inspect({ kind: 'stop', b: bi, i }, i + 1)}
                        >
                          {stop.form ?? stop.place[lang]}
                        </button>
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* focused stop-card */}
          <div className={s.card} role="status" aria-live="polite">
            <div className={c.cardHead}>
              <span className={c.cardForm}>
                {focusStop.form ?? <em className={c.unknown}>{t('wordTraveler.formUnknown')}</em>}
              </span>
              <span className={c.cardPlace}>{focusStop.place[lang]}</span>
            </div>
            {focusIsOrigin && (
              <span className={c.badge} data-kind={word.kind}>
                {word.kind === 'export'
                  ? t('wordTraveler.exportBadge')
                  : t('wordTraveler.importBadge')}
              </span>
            )}
            {focusStop.note && <p className={c.cardNote}>{focusStop.note[lang]}</p>}
          </div>

          {word.layout === 'radial' && <p className={c.teaLegend}>{t('wordTraveler.teaLegend')}</p>}
          <p className={s.caption}>{t('wordTraveler.schematicNote')}</p>
        </div>
      ) : (
        <QuizView lang={lang} t={t} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Quiz: "guess where this word started"                              */
/* ------------------------------------------------------------------ */

function QuizView({
  lang,
  t,
}: {
  lang: Lang;
  t: (key: Parameters<ReturnType<typeof useTranslations>>[0]) => string;
}) {
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUIZ[qi];
  const answered = picked !== null;
  const last = qi === QUIZ.length - 1;

  function pick(i: number) {
    if (answered) return;
    setPicked(i);
    if (i === q.answer) setScore((sc) => sc + 1);
  }
  function next() {
    if (last) {
      setDone(true);
      return;
    }
    setQi((n) => n + 1);
    setPicked(null);
  }
  function restart() {
    setQi(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  }

  if (done) {
    return (
      <div className={s.panel} style={{ marginTop: '0.9rem' }}>
        <div className={c.result}>
          <span className={c.resultTitle}>{t('wordTraveler.resultTitle')}</span>
          <span className={c.resultScore}>
            {score} / {QUIZ.length}
          </span>
          <p className={c.resultNote}>{t('wordTraveler.resultNote')}</p>
          <button className={s.pill} onClick={restart}>
            ↻ {t('wordTraveler.restart')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={s.panel} style={{ marginTop: '0.9rem' }}>
      <p className={c.intro}>{t('wordTraveler.quizIntro')}</p>

      <div className={c.quizMeta}>
        <span>
          {qi + 1} {t('wordTraveler.of')} {QUIZ.length}
        </span>
        <span>
          {t('wordTraveler.score')}: {score}
        </span>
      </div>

      <div className={c.quizWord}>{q.word[lang]}</div>
      <p className={c.quizPrompt}>{t('wordTraveler.quizPrompt')}</p>

      <div className={c.options}>
        {q.options.map((opt, i) => {
          const state = !answered
            ? 'idle'
            : i === q.answer
              ? 'correct'
              : i === picked
                ? 'wrong'
                : 'dim';
          return (
            <button
              key={i}
              className={c.option}
              data-state={state}
              onClick={() => pick(i)}
              disabled={answered}
            >
              {opt[lang]}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className={s.card} role="status" aria-live="polite">
          <p className={c.feedback} data-ok={picked === q.answer}>
            {picked === q.answer ? t('wordTraveler.correct') : t('wordTraveler.wrong')}{' '}
            <span className={c.feedbackText}>{q.explain[lang]}</span>
          </p>
          <button className={s.pill} onClick={next}>
            {last ? t('wordTraveler.finish') : `${t('wordTraveler.next')} ›`}
          </button>
        </div>
      )}
    </div>
  );
}
