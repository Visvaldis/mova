// sound-shift — Grimm's Law explorer.
// Three tabbed views: Word Evolution, Try a Rule, Chain Shift.
import { useState, useEffect, useRef, useCallback } from 'react';
import type { Lang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import { WORDS, RULE_LABEL, RULE_GROUPS, GLOSSES, type RuleId } from './soundShift.data';
import { useReducedMotion } from './useReducedMotion';
import { useInteractiveContext } from '../../lib/page-context';
import s from './interactive.module.css';
import c from './SoundShift.module.css';

type Tab = 'evolution' | 'tryRule' | 'chain';
type Stage = 0 | 1 | 2;

const TABS: Tab[] = ['evolution', 'tryRule', 'chain'];
const TAB_KEYS: Record<Tab, string> = {
  evolution: 'soundShift.tabEvolution',
  tryRule: 'soundShift.tabTryRule',
  chain: 'soundShift.tabChain',
};

/* ------------------------------------------------------------------ */
/*  Tab 1 — Word Evolution                                            */
/* ------------------------------------------------------------------ */
function EvolutionView({ lang, stage, setStage, animKey, setAnimKey, activeRule }: {
  lang: Lang; stage: Stage; setStage: (s: Stage) => void;
  animKey: number; setAnimKey: React.Dispatch<React.SetStateAction<number>>;
  activeRule: RuleId | null;
}) {
  const t = useTranslations(lang);
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stageLabels = [t('soundShift.stage0'), t('soundShift.stage1'), t('soundShift.stage2')];
  const stageNotes = [t('soundShift.note0'), t('soundShift.note1'), t('soundShift.note2')];

  const step = useCallback((dir: 1 | -1) => {
    setStage(Math.max(0, Math.min(2, stage + dir)) as Stage);
    setAnimKey((k) => k + 1);
  }, [stage, setStage, setAnimKey]);

  // autoplay
  useEffect(() => {
    if (!playing || reduced) return;
    timer.current = setInterval(() => {
      setStage((prev: Stage) => {
        const next = prev + 1;
        if (next > 2) { setPlaying(false); return prev; }
        setAnimKey((k: number) => k + 1);
        return next as Stage;
      });
    }, 1100);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [playing, reduced, setStage, setAnimKey]);

  return (
    <div className={c.view}>
      <p className={c.intro}>{t('soundShift.evolutionIntro')}</p>

      {/* stage labels */}
      <div className={c.stageHead}>
        {stageLabels.map((l, i) => (
          <span key={l} className={`${c.stageName} ${i === stage ? s.accent : s.muted}`}>{l}</span>
        ))}
      </div>

      {/* discrete slider */}
      <input
        className={s.range}
        type="range" min={0} max={2} step={1} value={stage}
        aria-label={t('soundShift.sliderLabel')}
        onChange={(e) => { setStage(+e.target.value as Stage); setAnimKey((k) => k + 1); }}
      />

      {/* controls */}
      <div className={c.controls}>
        <button className={s.pill} onClick={() => step(-1)} disabled={stage === 0} aria-label={t('soundShift.stepBack')}>
          ← {t('soundShift.stepBack')}
        </button>
        <button className={s.pill} onClick={() => { if (playing) setPlaying(false); else { if (stage === 2) setStage(0); setPlaying(true); } }}
          aria-label={playing ? t('soundShift.pause') : t('soundShift.play')}>
          {playing ? '⏸ ' + t('soundShift.pause') : '▶ ' + t('soundShift.play')}
        </button>
        <button className={s.pill} onClick={() => step(1)} disabled={stage === 2} aria-label={t('soundShift.stepFwd')}>
          {t('soundShift.stepFwd')} →
        </button>
        <p className={`${s.muted} ${c.count}`}>
          {t('soundShift.stageWord')} {stage + 1} {t('soundShift.of')} 3
        </p>
      </div>

      {/* stage note */}
      <p className={c.stageNote} aria-live="polite">{stageNotes[stage]}</p>

      {/* word cards */}
      <div className={c.wordGrid}>
        {WORDS.map((w) => {
          const applies = activeRule ? w.stages[0].some(([, r]) => r === activeRule) : true;
          return (
            <div key={w.id} className={`${s.card} ${c.wordCard} ${!applies ? c.wordCardDimmed : ''} ${activeRule && applies ? c.wordCardHit : ''}`}>
              <div className={c.wordDisplay}>
                {w.stages[stage].map(([text, rule], i) => {
                  const isAccent = !!rule;
                  const isFaded = isAccent && activeRule != null && rule !== activeRule;
                  return (
                    <span
                      key={`${animKey}-${i}`}
                      className={[c.seg, isAccent ? c.segAccent : '', isFaded ? c.segFaded : '', isAccent && !reduced ? c.segPop : ''].filter(Boolean).join(' ')}
                    >
                      {text}
                    </span>
                  );
                })}
              </div>
              <div className={c.gloss}>&ldquo;{GLOSSES[w.id][lang]}&rdquo;</div>
              {w.ua && <div className={c.uaNote}>{t('soundShift.uaKept')} {w.ua}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 2 — Try a Rule                                                */
/* ------------------------------------------------------------------ */
function TryRuleView({ lang, activeRule, setActiveRule, animKey, setAnimKey }: {
  lang: Lang; activeRule: RuleId | null;
  setActiveRule: (r: RuleId | null) => void;
  animKey: number; setAnimKey: React.Dispatch<React.SetStateAction<number>>;
}) {
  const t = useTranslations(lang);
  const reduced = useReducedMotion();

  const groupNames: Record<string, string> = {
    breathy: t('soundShift.groupBreathy'),
    voiced: t('soundShift.groupVoiced'),
    voiceless: t('soundShift.groupVoiceless'),
  };

  const pick = (r: RuleId) => {
    setActiveRule(activeRule === r ? null : r);
    setAnimKey((k) => k + 1);
  };

  // words that match the active rule, shown at stage 1
  const matchedWords = activeRule
    ? WORDS.filter((w) => w.stages[0].some(([, r]) => r === activeRule))
    : [];

  return (
    <div className={c.view}>
      <p className={c.intro}>{t('soundShift.tryIntro')}</p>

      <div className={c.ruleSection}>
        {RULE_GROUPS.map((g) => {
          const hasExamples = g.rules.some((r) => WORDS.some((w) => w.stages[0].some(([, wr]) => wr === r)));
          return (
            <div key={g.id} className={c.ruleGroup}>
              <p className={c.groupLabel}>{groupNames[g.id]}</p>
              <div className={s.row} role="group" aria-label={groupNames[g.id]}>
                {g.rules.map((r) => (
                  <button key={r} className={s.pill} aria-pressed={r === activeRule} onClick={() => pick(r)}>
                    {RULE_LABEL[r]}
                  </button>
                ))}
              </div>
              {!hasExamples && <p className={c.noExamples}>{t('soundShift.noExamples')}</p>}
            </div>
          );
        })}
      </div>

      {/* show matching words at stage 1 (the shift fires) */}
      {activeRule && (
        <div className={c.wordGrid}>
          {matchedWords.length === 0 && <p className={c.noExamples}>{t('soundShift.noExamples')}</p>}
          {matchedWords.map((w) => (
            <div key={w.id} className={`${s.card} ${c.wordCard} ${c.wordCardHit}`}>
              <div className={c.wordDisplay}>
                {w.stages[1].map(([text, rule], i) => (
                  <span
                    key={`${animKey}-${i}`}
                    className={[c.seg, rule === activeRule ? c.segAccent : '', rule === activeRule && !reduced ? c.segPop : ''].filter(Boolean).join(' ')}
                  >
                    {text}
                  </span>
                ))}
              </div>
              <div className={c.gloss}>&ldquo;{GLOSSES[w.id][lang]}&rdquo;</div>
              {w.ua && <div className={c.uaNote}>{t('soundShift.uaKept')} {w.ua}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 3 — Chain Shift diagram                                       */
/* ------------------------------------------------------------------ */
type ChainNode = 'breathy' | 'voiced' | 'voiceless' | 'fricatives';

const NODE_META: Record<ChainNode, { label: string; phonemes: string; x: number; y: number; dashed?: boolean; tKey: string }> = {
  breathy:    { label: 'bʰ dʰ gʰ', phonemes: 'bʰ dʰ gʰ', x: 150, y: 18, tKey: 'soundShift.diagAsp' },
  voiced:     { label: 'b d g',     phonemes: 'b d g',     x: 30,  y: 200, tKey: 'soundShift.diagVoi' },
  voiceless:  { label: 'p t k',     phonemes: 'p t k',     x: 270, y: 200, tKey: 'soundShift.diagVls' },
  fricatives: { label: 'f θ h',     phonemes: 'f θ h',     x: 150, y: 262, dashed: true, tKey: 'soundShift.diagFri' },
};

const CHAIN_ARROWS: { from: ChainNode; to: ChainNode; d: string }[] = [
  { from: 'breathy',   to: 'voiced',     d: 'M150,60 Q70,100 85,195' },
  { from: 'voiced',    to: 'voiceless',  d: 'M155,235 L263,235' },
  { from: 'voiceless', to: 'fricatives', d: 'M325,262 Q300,290 277,290' },
];

const NODE_RULES: Record<ChainNode, RuleId[]> = {
  breathy: ['bh>b', 'dh>d', 'gh>g'],
  voiced: ['b>p', 'd>t', 'g>k'],
  voiceless: ['p>f', 't>θ', 'k>h'],
  fricatives: [],
};

function ChainView({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const [selected, setSelected] = useState<ChainNode | null>(null);

  const linkedRules = selected ? NODE_RULES[selected] : [];
  const linkedWords = WORDS.filter((w) =>
    linkedRules.some((r) => w.stages[0].some(([, wr]) => wr === r)),
  );

  const nodeClick = (n: ChainNode) => setSelected(selected === n ? null : n);

  return (
    <div className={c.view}>
      <p className={c.intro}>{t('soundShift.chainIntro')}</p>

      <div className={c.diagramWrap}>
        <svg viewBox="0 0 420 330" role="img" aria-label={t('soundShift.chainTitle')} className={c.diagramSvg}>
          <defs>
            <marker id="ss-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L7,3 L0,6 Z" fill="var(--accent)" />
            </marker>
          </defs>

          {/* arrows */}
          {CHAIN_ARROWS.map((a) => {
            const hi = selected === a.from;
            const dim = selected != null && !hi;
            return (
              <path
                key={a.d}
                d={a.d}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={2.5}
                markerEnd="url(#ss-arrow)"
                className={[c.chainArrow, dim ? c.chainArrowDim : '', hi ? c.chainArrowHi : ''].filter(Boolean).join(' ')}
              />
            );
          })}

          {/* nodes */}
          {(Object.entries(NODE_META) as [ChainNode, typeof NODE_META[ChainNode]][]).map(([id, m]) => {
            const isSel = selected === id;
            return (
              <g
                key={id}
                className={`${c.chainNode} ${isSel ? c.chainNodeSel : ''}`}
                onClick={() => nodeClick(id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); nodeClick(id); } }}
                tabIndex={0}
                role="button"
                aria-pressed={isSel}
                aria-label={`${m.phonemes} — ${(t as any)(m.tKey)}`}
              >
                <rect x={m.x} y={m.y} width={120} height={56} rx={10}
                  fill="var(--accent-soft)" stroke="var(--line)" strokeWidth={1.5}
                  strokeDasharray={m.dashed ? '5 4' : undefined} />
                <text x={m.x + 60} y={m.y + 26} textAnchor="middle" fontWeight={700} fontSize={17} fill="var(--text)">
                  {m.phonemes}
                </text>
                <text x={m.x + 60} y={m.y + 44} textAnchor="middle" fontSize={10.5} fill="var(--muted)">
                  {(t as any)(m.tKey)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {!selected && (
        <p className={`${s.muted} ${c.count}`} style={{ textAlign: 'center' }}>
          {t('soundShift.clickNode')}
        </p>
      )}

      {selected && linkedWords.length > 0 && (
        <div style={{ textAlign: 'center' }}>
          <p className={`${s.muted} ${c.count}`}>{t('soundShift.linkedWords')}</p>
          <div className={c.linkedWords}>
            {linkedWords.map((w) => (
              <span key={w.id} className={c.linkedChip}>{GLOSSES[w.id][lang]}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */
export default function SoundShift({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const [tab, setTab] = useState<Tab>('evolution');
  const [stage, setStage] = useState<Stage>(0);
  const [activeRule, setActiveRule] = useState<RuleId | null>(null);
  const [animKey, setAnimKey] = useState(0);

  const stageLabels = [t('soundShift.stage0'), t('soundShift.stage1'), t('soundShift.stage2')];

  useInteractiveContext(
    'sound-shift',
    lang === 'uk'
      ? `Інтерактив «Закон Ґрімма», вкладка: ${(t as any)(TAB_KEYS[tab])}, етап: ${stageLabels[stage]}.${activeRule ? ` Вибране правило: ${RULE_LABEL[activeRule]}.` : ''}`
      : `"Grimm's Law" interactive, tab: ${(t as any)(TAB_KEYS[tab])}, stage: ${stageLabels[stage]}.${activeRule ? ` Active rule: ${RULE_LABEL[activeRule]}.` : ''}`,
  );

  return (
    <div data-interactive-id="sound-shift" className={c.wrap}>
      {/* tab bar */}
      <div className={s.row} role="tablist" aria-label={t('soundShift.tabsAria')}>
        {TABS.map((id) => (
          <button
            key={id}
            role="tab"
            className={s.pill}
            aria-selected={id === tab}
            aria-controls={`ss-panel-${id}`}
            onClick={() => setTab(id)}
          >
            {(t as any)(TAB_KEYS[id])}
          </button>
        ))}
      </div>

      {/* tab panels */}
      <div id="ss-panel-evolution" role="tabpanel" hidden={tab !== 'evolution'}>
        {tab === 'evolution' && (
          <EvolutionView
            lang={lang} stage={stage} setStage={setStage as any}
            animKey={animKey} setAnimKey={setAnimKey}
            activeRule={activeRule}
          />
        )}
      </div>

      <div id="ss-panel-tryRule" role="tabpanel" hidden={tab !== 'tryRule'}>
        {tab === 'tryRule' && (
          <TryRuleView
            lang={lang} activeRule={activeRule} setActiveRule={setActiveRule}
            animKey={animKey} setAnimKey={setAnimKey}
          />
        )}
      </div>

      <div id="ss-panel-chain" role="tabpanel" hidden={tab !== 'chain'}>
        {tab === 'chain' && <ChainView lang={lang} />}
      </div>
    </div>
  );
}
