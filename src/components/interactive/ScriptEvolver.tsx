// script-evolver — "Freezing Sound: How Humans Learned to Write".
//   (1) Letter time machine: pick A / B / M and scrub its glyph across four
//       millennia (Egyptian pictograph → Proto-Sinaitic → Phoenician → Greek →
//       Latin), with the Cyrillic branch drawn alongside and Ukrainian highlighted.
//   (2) Where writing began: the ~4 from-scratch inventions as a tappable tree,
//       with the alphabet branch under Egypt and Hangul kept apart (designed, not
//       evolved).
//   (3) Rebus machine: combine pictures to sound out a hidden word — the leap
//       that turned drawings into writing.
// All facts article-sourced; see scriptEvolver.data.ts for provenance + one TODO(seva).
import { useEffect, useState } from 'react';
import type { Lang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import { useReducedMotion } from './useReducedMotion';
import {
  STAGES,
  LETTERS,
  ROOTS,
  DESIGNED,
  REBUS,
  type Glyph,
  type TreeNode,
} from './scriptEvolver.data';
import { useInteractiveContext } from '../../lib/page-context';
import s from './interactive.module.css';
import c from './ScriptEvolver.module.css';

const LAST = STAGES.length - 1;
const PICTURE_EMOJI: Record<string, string> = { A: '🐂', B: '🏠', M: '💧' };

function GlyphSvg({ paths, label }: { paths: Glyph; label: string }) {
  return (
    <svg viewBox="0 0 100 100" className={c.glyphSvg} role="img" aria-label={label}>
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

export default function ScriptEvolver({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const reduced = useReducedMotion();
  const [tab, setTab] = useState<'time' | 'tree' | 'rebus'>('time');

  return (
    <div className={c.wrap} data-interactive-id="script-evolver">
      <div className={s.panel}>
        <div className={s.row} role="group" aria-label={t('scriptEvolver.tabsAria')}>
          <button className={s.pill} aria-pressed={tab === 'time'} onClick={() => setTab('time')}>
            🔡 {t('scriptEvolver.tabTime')}
          </button>
          <button className={s.pill} aria-pressed={tab === 'tree'} onClick={() => setTab('tree')}>
            🌍 {t('scriptEvolver.tabTree')}
          </button>
          <button className={s.pill} aria-pressed={tab === 'rebus'} onClick={() => setTab('rebus')}>
            🧩 {t('scriptEvolver.tabRebus')}
          </button>
        </div>

        {tab === 'time' && <TimeMachine lang={lang} t={t} reduced={reduced} />}
        {tab === 'tree' && <ScriptTree lang={lang} t={t} />}
        {tab === 'rebus' && <RebusMachine lang={lang} t={t} />}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* (1) Letter time machine                                            */
/* ------------------------------------------------------------------ */
type T = (k: any) => string;

function TimeMachine({ lang, t, reduced }: { lang: Lang; t: T; reduced: boolean }) {
  const [li, setLi] = useState(0);
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(false);

  const letter = LETTERS[li];
  const st = STAGES[stage];
  const atModern = stage === LAST;

  useInteractiveContext(
    'script-evolver',
    lang === 'uk'
      ? `Інтерактив «Еволюція письма», вкладка «машина часу»: літера ${letter.name}, етап ${st.name[lang]}.`
      : `"Script Evolver" interactive, "time machine" tab: letter ${letter.name}, stage ${st.name[lang]}.`,
  );

  // Autoplay — JS-driven motion, so gated on the reduced-motion preference.
  useEffect(() => {
    if (!playing || reduced) return;
    const id = setInterval(() => setStage((x) => Math.min(LAST, x + 1)), 1100);
    return () => clearInterval(id);
  }, [playing, reduced]);
  useEffect(() => {
    if (stage >= LAST) setPlaying(false);
  }, [stage]);

  const togglePlay = () => {
    if (stage >= LAST) setStage(0);
    setPlaying((p) => !p);
  };

  return (
    <div className={c.view}>
      <p className={c.intro}>{t('scriptEvolver.timeIntro')}</p>

      {/* letter picker */}
      <div className={s.row} role="group" aria-label={t('scriptEvolver.pickLetterAria')}>
        {LETTERS.map((L, i) => (
          <button
            key={L.id}
            className={s.pill}
            aria-pressed={i === li}
            onClick={() => setLi(i)}
          >
            {L.latin} / {L.cyrillic}
          </button>
        ))}
      </div>

      {/* pictograph origin (article fact) */}
      <div className={c.picCard}>
        <span className={c.picEmoji} aria-hidden="true">
          {PICTURE_EMOJI[letter.id]}
        </span>
        <div className={c.picText}>
          <span className={c.picLabel}>{t('scriptEvolver.pictographLabel')}</span>
          <span className={c.picMeta}>
            <strong>{letter.picture[lang]}</strong> · {t('scriptEvolver.semitic')}: {letter.semitic} ·{' '}
            {t('scriptEvolver.sound')}: {letter.sound[lang]}
          </span>
          <span className={c.picOrigin}>{letter.origin[lang]}</span>
        </div>
      </div>

      {/* main viewer */}
      <div className={c.stageHead}>
        <span className={c.stageName}>{st.name[lang]}</span>
        <span className={c.stageEra}>{st.era[lang]}</span>
      </div>

      <div className={c.viewer} key={`${letter.id}-${stage}`}>
        {atModern ? (
          <div className={c.forkView}>
            <figure className={c.glyphCard}>
              <GlyphSvg paths={letter.glyphs[LAST]} label={`${letter.latin} — ${t('scriptEvolver.latin')}`} />
              <figcaption className={c.glyphCap}>
                {t('scriptEvolver.latin')} · {letter.latin}
              </figcaption>
            </figure>
            <figure className={`${c.glyphCard} ${c.glyphCardUk}`}>
              <span className={c.ukBadge}>{t('scriptEvolver.ukrainianHere')}</span>
              <GlyphSvg
                paths={letter.cyrillicGlyph}
                label={`${letter.cyrillic} — ${t('scriptEvolver.cyrillic')}`}
              />
              <figcaption className={c.glyphCap}>
                {t('scriptEvolver.cyrillic')} · {letter.cyrillic}
              </figcaption>
            </figure>
          </div>
        ) : (
          <figure className={c.glyphCard}>
            <GlyphSvg paths={letter.glyphs[stage]} label={`${letter.latin} — ${st.name[lang]}`} />
          </figure>
        )}
      </div>

      <p className={c.stageNote} aria-live="polite">
        {st.note[lang]}
      </p>

      {/* controls */}
      <div className={c.controls}>
        <button
          className={s.pill}
          onClick={() => setStage((x) => Math.max(0, x - 1))}
          disabled={stage === 0}
        >
          ← {t('scriptEvolver.stepBack')}
        </button>
        {!reduced && (
          <button className={s.pill} aria-pressed={playing} onClick={togglePlay}>
            {playing ? `⏸ ${t('scriptEvolver.pause')}` : `▶ ${t('scriptEvolver.play')}`}
          </button>
        )}
        <button
          className={s.pill}
          onClick={() => setStage((x) => Math.min(LAST, x + 1))}
          disabled={stage === LAST}
        >
          {t('scriptEvolver.stepFwd')} →
        </button>
      </div>

      <input
        className={s.range}
        type="range"
        min={0}
        max={LAST}
        step={1}
        value={stage}
        onChange={(e) => {
          setPlaying(false);
          setStage(Number(e.target.value));
        }}
        aria-label={t('scriptEvolver.scrubAria')}
      />
      <p className={`${s.caption} ${c.count}`}>
        {t('scriptEvolver.stageWord')} {stage + 1} {t('scriptEvolver.of')} {STAGES.length}
      </p>

      {/* lineage strip — overview + jump-to */}
      <div className={c.lineage} role="group" aria-label={t('scriptEvolver.lineageAria')}>
        {STAGES.slice(0, LAST).map((stg, i) => (
          <button
            key={stg.id}
            className={`${c.thumb} ${stage === i ? c.thumbActive : ''}`}
            aria-pressed={stage === i}
            aria-label={stg.name[lang]}
            onClick={() => {
              setPlaying(false);
              setStage(i);
            }}
          >
            <GlyphSvg paths={letter.glyphs[i]} label={stg.name[lang]} />
          </button>
        ))}
        <span className={c.fork} aria-hidden="true">
          ⤙
        </span>
        <button
          className={`${c.thumb} ${atModern ? c.thumbActive : ''}`}
          aria-pressed={atModern}
          aria-label={`${t('scriptEvolver.latin')} ${letter.latin}`}
          onClick={() => {
            setPlaying(false);
            setStage(LAST);
          }}
        >
          <GlyphSvg paths={letter.glyphs[LAST]} label={`${t('scriptEvolver.latin')} ${letter.latin}`} />
          <span className={c.thumbTag}>{t('scriptEvolver.latin')}</span>
        </button>
        <button
          className={`${c.thumb} ${c.thumbUk} ${atModern ? c.thumbActive : ''}`}
          aria-pressed={atModern}
          aria-label={`${t('scriptEvolver.cyrillic')} ${letter.cyrillic} — ${t('scriptEvolver.ukrainianHere')}`}
          onClick={() => {
            setPlaying(false);
            setStage(LAST);
          }}
        >
          <GlyphSvg
            paths={letter.cyrillicGlyph}
            label={`${t('scriptEvolver.cyrillic')} ${letter.cyrillic}`}
          />
          <span className={c.thumbTag}>{t('scriptEvolver.cyrillic')}</span>
        </button>
      </div>

      <p className={`${s.caption} ${c.illus}`}>{t('scriptEvolver.illustrative')}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* (2) Where writing began                                            */
/* ------------------------------------------------------------------ */
const ALL_NODES: TreeNode[] = [
  ...ROOTS.flatMap((r) => [r, ...(r.children ?? [])]),
  DESIGNED,
];

function ScriptTree({ lang, t }: { lang: Lang; t: T }) {
  const [sel, setSel] = useState<string>(ROOTS[0].id);
  const node = ALL_NODES.find((n) => n.id === sel) ?? ROOTS[0];

  useInteractiveContext(
    'script-evolver',
    lang === 'uk'
      ? `Інтерактив «Еволюція письма», вкладка «дерево систем»: вибрано ${node.place[lang]}.`
      : `"Script Evolver" interactive, "script family tree" tab: selected ${node.place[lang]}.`,
  );

  const NodeButton = ({ n, sub }: { n: TreeNode; sub?: boolean }) => (
    <button
      className={`${c.node} ${sub ? c.nodeSub : ''} ${sel === n.id ? c.nodeActive : ''}`}
      aria-pressed={sel === n.id}
      onClick={() => setSel(n.id)}
    >
      <span className={c.nodeIcon} aria-hidden="true">
        {n.icon}
      </span>
      <span className={c.nodeText}>
        <span className={c.nodePlace}>{n.place[lang]}</span>
        <span className={c.nodeScript}>{n.script[lang]}</span>
      </span>
      <span className={c.nodeWhen}>{n.when[lang]}</span>
    </button>
  );

  return (
    <div className={c.view}>
      <p className={c.intro}>{t('scriptEvolver.treeIntro')}</p>

      <p className={c.treeHeading}>{t('scriptEvolver.fromScratch')}</p>
      <ul className={c.tree}>
        {ROOTS.map((root) => (
          <li key={root.id}>
            <NodeButton n={root} />
            {root.children && (
              <div className={c.branch}>
                <span className={c.branchLabel}>{t('scriptEvolver.alphabetBranch')}</span>
                <ul className={c.branchList}>
                  {root.children.map((ch) => (
                    <li key={ch.id}>
                      <NodeButton n={ch} sub />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>

      <p className={c.treeHeading}>{t('scriptEvolver.designedLabel')}</p>
      <ul className={c.tree}>
        <li>
          <NodeButton n={DESIGNED} />
        </li>
      </ul>

      <div className={`${s.card} ${c.detail}`} role="status" aria-live="polite">
        <div className={c.detailHead}>
          <span className={c.detailIcon} aria-hidden="true">
            {node.icon}
          </span>
          <span className={c.detailName}>{node.place[lang]}</span>
        </div>
        <div className={c.detailMeta}>
          <span>
            <span className={c.detailKey}>{t('scriptEvolver.script')}:</span> {node.script[lang]}
          </span>
          <span>
            <span className={c.detailKey}>{t('scriptEvolver.when')}:</span> {node.when[lang]}
          </span>
        </div>
        <p className={c.detailBody}>{node.body[lang]}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* (3) Rebus machine                                                  */
/* ------------------------------------------------------------------ */
function RebusMachine({ lang, t }: { lang: Lang; t: T }) {
  const puzzles = REBUS[lang];
  const [pi, setPi] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);

  const puzzle = puzzles[pi];
  const isPrefix = picked.every((k, i) => k === puzzle.solution[i]);
  const solved = picked.length === puzzle.solution.length && isPrefix;

  useInteractiveContext(
    'script-evolver',
    lang === 'uk'
      ? `Інтерактив «Еволюція письма», вкладка «ребус»: головоломка ${pi + 1}/${puzzles.length}${solved ? ' (розв\'язано)' : ''}.`
      : `"Script Evolver" interactive, "rebus" tab: puzzle ${pi + 1}/${puzzles.length}${solved ? ' (solved)' : ''}.`,
  );
  const wrong = picked.length > 0 && !isPrefix;

  const pick = (key: string) => {
    if (solved) return;
    setPicked((p) => (p.length >= puzzle.solution.length ? p : [...p, key]));
  };
  const nextPuzzle = () => {
    setPicked([]);
    setPi((p) => (p + 1) % puzzles.length);
  };

  const soundOf = (key: string) => puzzle.tiles.find((x) => x.key === key)?.sound[lang] ?? '';

  return (
    <div className={c.view}>
      <p className={c.intro}>{t('scriptEvolver.rebusIntro')}</p>

      <div className={c.rebusPrompt}>
        <span className={c.rebusPromptLabel}>{t('scriptEvolver.rebusPrompt')}</span>
        <span className={c.rebusPromptText}>{puzzle.prompt[lang]}</span>
      </div>

      <div className={c.tiles} role="group" aria-label={t('scriptEvolver.tilesAria')}>
        {puzzle.tiles.map((tile) => (
          <button
            key={tile.key}
            className={c.tile}
            onClick={() => pick(tile.key)}
            disabled={solved}
            aria-label={tile.sound[lang]}
          >
            <span className={c.tileGlyph} aria-hidden="true">
              {tile.glyph}
            </span>
            <span className={c.tileSound}>{tile.sound[lang]}</span>
          </button>
        ))}
      </div>

      <div className={`${c.reading} ${solved ? c.readingOk : ''} ${wrong ? c.readingBad : ''}`}>
        <span className={c.readingLabel}>{t('scriptEvolver.reading')}</span>
        <span className={c.readingValue}>
          {picked.length === 0 ? (
            <span className={c.readingEmpty}>{t('scriptEvolver.readingEmpty')}</span>
          ) : (
            picked.map(soundOf).join(' + ')
          )}
        </span>
      </div>

      {solved ? (
        <div className={`${s.card} ${c.solved}`} role="status" aria-live="polite">
          <p className={c.solvedTitle}>✓ {t('scriptEvolver.solved')}</p>
          <p className={c.solvedAnswer}>
            <span className={c.detailKey}>{t('scriptEvolver.answerLabel')}:</span> {puzzle.answer[lang]}
          </p>
          <p className={c.solvedExplain}>{puzzle.explain[lang]}</p>
        </div>
      ) : (
        wrong && (
          <p className={c.hint} role="status" aria-live="polite">
            {t('scriptEvolver.notQuite')}
          </p>
        )
      )}

      <div className={c.controls}>
        <button className={s.pill} onClick={() => setPicked([])} disabled={picked.length === 0}>
          {t('scriptEvolver.clear')}
        </button>
        <button className={s.pill} onClick={nextPuzzle}>
          {t('scriptEvolver.nextPuzzle')} →
        </button>
      </div>
      <p className={`${s.caption} ${c.count}`}>
        {t('scriptEvolver.puzzleWord')} {pi + 1} {t('scriptEvolver.of')} {puzzles.length}
      </p>
    </div>
  );
}
