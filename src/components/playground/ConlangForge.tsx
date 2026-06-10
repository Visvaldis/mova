import { useMemo, useState } from 'react';
import type { Lang, UIKey } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import {
  PRESETS, CONCEPTS, CONCEPT_GLOSS, MAX_DRIFT_ROUNDS,
  forge, fastForward, statement, question, pastSentence,
  type WordOrder, type PluralStyle, type PastStyle, type WordLength, type AdjOrder, type QStyle,
} from '../../lib/conlang';

const ORDERS: WordOrder[] = ['SVO', 'SOV', 'VSO'];
const PLURALS: PluralStyle[] = ['suffix', 'redup', 'prefix'];
const PASTS: PastStyle[] = ['suffix', 'prefix', 'ablaut'];
const LENGTHS: WordLength[] = ['short', 'medium', 'long'];
const ADJS: AdjOrder[] = ['AN', 'NA'];
const QS: QStyle[] = ['end', 'start', 'intonation'];

/** Small labeled pill group, reused for every option row. */
function PillRow<T extends string>({ label, options, value, onPick, render }: {
  label: string;
  options: T[];
  value: T;
  onPick: (v: T) => void;
  render: (v: T) => string;
}) {
  return (
    <div className="row" role="group" aria-label={label} style={{ alignItems: 'center' }}>
      <span className="muted" style={{ fontSize: '0.82rem', fontWeight: 700, minWidth: '7.5rem' }}>
        {label}
      </span>
      {options.map((o) => (
        <button key={o} className="pill" aria-pressed={o === value} onClick={() => onPick(o)}>
          {render(o)}
        </button>
      ))}
    </div>
  );
}

export default function ConlangForge({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  // sound
  const [presetId, setPresetId] = useState<'harsh' | 'flowing' | 'weird'>('flowing');
  const [wordLength, setWordLength] = useState<WordLength>('medium');
  const [tones, setTones] = useState(false);
  const [harmony, setHarmony] = useState(false);
  // grammar
  const [order, setOrder] = useState<WordOrder>('SVO');
  const [adj, setAdj] = useState<AdjOrder>('AN');
  const [q, setQ] = useState<QStyle>('end');
  // morphology
  const [plural, setPlural] = useState<PluralStyle>('suffix');
  const [past, setPast] = useState<PastStyle>('suffix');
  // forge & drift
  const [seed, setSeed] = useState<number>(() => Math.floor(Math.random() * 99999));
  const [forged, setForged] = useState(false);
  const [rounds, setRounds] = useState(0);
  const [copied, setCopied] = useState(false);

  const preset = PRESETS.find((p) => p.id === presetId)!;
  const conlang = useMemo(
    () => forge(seed, preset, { plural, past, wordLength, tones, harmony }),
    [seed, preset, plural, past, wordLength, tones, harmony],
  );
  const drift = useMemo(() => fastForward(conlang, seed, Math.max(1, rounds)), [conlang, seed, rounds]);
  const drifted = rounds > 0;

  const presetLabel = (id: string) => t(`pg.clf.preset.${id}` as UIKey);
  const k = (s: string) => t(`pg.clf.${s}` as UIKey);

  // Display pipeline: raw stem → (drift) → morphology already applied where
  // needed → decoration (harmony/tones). Decoration is per-word.
  const show = (w: string) => conlang.decorate(drifted ? drift.transform(w) : w);
  const lexShown = (c: (typeof CONCEPTS)[number]) => show(conlang.lexicon[c]);

  const sentOpts = { order, adj, q };
  const stmt = statement(conlang.lexicon, sentOpts).map(show).join(' ');
  const qStr = question(
    Object.fromEntries(CONCEPTS.map((c) => [c, lexShown(c)])) as Record<(typeof CONCEPTS)[number], string>,
    show(conlang.qParticle),
    sentOpts,
  );
  const pastStr = pastSentence(conlang.lexicon, conlang.past, sentOpts).map(show).join(' ');
  const pluralShown = drifted
    ? conlang.decorate(drift.newPlural(drift.transform(conlang.lexicon.bird)))
    : show(conlang.plural(conlang.lexicon.bird));

  const reforge = () => {
    setSeed(Math.floor(Math.random() * 99999));
    setRounds(0);
    setForged(true);
  };
  const pick = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setRounds(0);
  };

  const copyPassport = async () => {
    const lines = [
      `${k('passport')}: ${conlang.name}`,
      `${k('seed')}: ${seed} · ${presetLabel(presetId)} · ${order} · ${k(`len.${wordLength}`)}${tones ? ' · ♪' : ''}${harmony ? ` · ${k('harmony')}` : ''}${drifted ? ` · +${rounds * 500}y` : ''}`,
      ...CONCEPTS.map((c) => `${CONCEPT_GLOSS[c][lang]}: ${lexShown(c)}`),
      `"${stmt}." — ${k('glossStmt')}`,
      `"${qStr}" — ${k('glossQ')}`,
      'mova playground',
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="toy" data-toy="conlang-forge">
      <h2>{k('step1')}</h2>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <div className="row" role="group" aria-label={k('step1')}>
          {PRESETS.map((p) => (
            <button key={p.id} className="pill" aria-pressed={p.id === presetId}
              onClick={() => { setPresetId(p.id); setRounds(0); }}>
              {presetLabel(p.id)}
            </button>
          ))}
        </div>
        <PillRow label={k('len')} options={LENGTHS} value={wordLength}
          onPick={pick(setWordLength)} render={(v) => k(`len.${v}`)} />
        <div className="row" style={{ alignItems: 'center' }}>
          <span className="muted" style={{ fontSize: '0.82rem', fontWeight: 700, minWidth: '7.5rem' }} aria-hidden="true" />
          <button className="pill" aria-pressed={tones} onClick={() => setTones(!tones)}>{k('tones')}</button>
          <button className="pill" aria-pressed={harmony} onClick={() => setHarmony(!harmony)}>{k('harmony')}</button>
        </div>
        {tones && <p className="hint-card muted" style={{ fontSize: '0.85rem' }}>{k('tonesNote')}</p>}
        {harmony && <p className="hint-card muted" style={{ fontSize: '0.85rem' }}>{k('harmonyNote')}</p>}
      </div>

      <h2 style={{ marginTop: '1rem' }}>{k('step2')}</h2>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <PillRow label={k('order')} options={ORDERS} value={order} onPick={setOrder} render={(v) => v} />
        <PillRow label={k('adj')} options={ADJS} value={adj} onPick={setAdj}
          render={(v) => (v === 'AN' ? k('adj.an') : k('adj.na'))} />
        <PillRow label={k('q')} options={QS} value={q} onPick={setQ} render={(v) => k(`q.${v}`)} />
      </div>

      <h2 style={{ marginTop: '1rem' }}>{k('step3')}</h2>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <PillRow label={k('plural')} options={PLURALS} value={plural}
          onPick={pick(setPlural)} render={(v) => k(`morph.${v}`)} />
        <PillRow label={k('past')} options={PASTS} value={past}
          onPick={pick(setPast)} render={(v) => k(`past.${v}`)} />
      </div>

      <div className="row" style={{ marginTop: '1.2rem' }}>
        <button className="pill active" onClick={reforge}>
          🔨 {forged ? k('reforge') : k('forge')}
        </button>
        {forged && rounds < MAX_DRIFT_ROUNDS && (
          <button className="pill" onClick={() => setRounds(rounds + 1)}>
            ⏩ {rounds === 0 ? k('ff') : k('ffMore')}
          </button>
        )}
        {forged && drifted && (
          <button className="pill" onClick={() => setRounds(0)}>↺ {k('ffReset')}</button>
        )}
      </div>

      {forged && (
        <div style={{ marginTop: '1.3rem' }} aria-live="polite">
          <div className="stage-card">
            <div className="word-meta">{k('passport')} · {k('seed')}: {seed}{drifted ? ` · +${rounds * 500} ${lang === 'uk' ? 'р.' : 'y'}` : ''}</div>
            <div className="big-word accent">{conlang.name}</div>
            <div className="word-meta">
              {presetLabel(presetId)} · {order} · {k(`len.${wordLength}`)}
              {tones ? ' · ♪' : ''}{harmony ? ` · ${k('harmony')}` : ''}
            </div>
          </div>

          {drifted && (
            <div style={{ marginTop: '0.8rem' }}>
              <h2>{k('changes')} · {k('ffAfterPrefix')} {rounds * 500} {k('ffAfterSuffix')}</h2>
              <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.4rem' }}>
                {drift.rules.map((r) => (
                  <li key={r.id} className="hint-card">
                    <strong className="accent">{r.label}</strong> — <span className="muted">{r.note[lang]}</span>
                  </li>
                ))}
                <li className="hint-card"><span className="muted">{drift.analogy[lang]}</span></li>
              </ul>
            </div>
          )}

          <h2 style={{ marginTop: '1rem' }}>{k('lexicon')}</h2>
          <div className="row">
            {CONCEPTS.map((c) => (
              <span key={c} className="hint-card">
                <strong className={drifted && drift.lexicon[c] !== conlang.lexicon[c] ? 'accent' : undefined}>
                  {lexShown(c)}
                </strong>{' '}
                <span className="muted">— {CONCEPT_GLOSS[c][lang]}</span>
              </span>
            ))}
          </div>

          <h2 style={{ marginTop: '1rem' }}>{k('sample')}</h2>
          <div style={{ display: 'grid', gap: '0.45rem' }}>
            <div>
              <div className="big-word" style={{ fontSize: '1.3rem' }}>{stmt}.</div>
              <div className="muted" style={{ fontSize: '0.88rem' }}>“{k('glossStmt')}”</div>
            </div>
            <div>
              <strong style={{ fontSize: '1.05rem' }}>{qStr}</strong>{' '}
              <span className="muted" style={{ fontSize: '0.88rem' }}>— “{k('glossQ')}”</span>
            </div>
            <div>
              <strong style={{ fontSize: '1.05rem' }}>{pastStr}.</strong>{' '}
              <span className="muted" style={{ fontSize: '0.88rem' }}>— “{k('glossPast')}”</span>
            </div>
            <div>
              <strong style={{ fontSize: '1.05rem' }}>{pluralShown}</strong>{' '}
              <span className="muted" style={{ fontSize: '0.88rem' }}>— {k('samplePluralGloss')}</span>
            </div>
          </div>

          <div className="row" style={{ marginTop: '1rem' }}>
            <button className="pill" onClick={copyPassport}>
              {copied ? k('copied') : `📋 ${k('copy')}`}
            </button>
          </div>
        </div>
      )}

      <p className="toy-note">{k('note')}</p>
    </div>
  );
}
