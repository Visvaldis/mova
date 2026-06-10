import { useMemo, useState } from 'react';
import type { Lang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import {
  PRESETS, CONCEPTS, CONCEPT_GLOSS, forge, fastForward, sentence,
  type WordOrder, type PluralStyle,
} from '../../lib/conlang';

const ORDERS: WordOrder[] = ['SVO', 'SOV', 'VSO'];
const MORPHS: PluralStyle[] = ['suffix', 'redup', 'prefix'];

export default function ConlangForge({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const [presetId, setPresetId] = useState<'harsh' | 'flowing' | 'weird'>('flowing');
  const [order, setOrder] = useState<WordOrder>('SVO');
  const [morph, setMorph] = useState<PluralStyle>('suffix');
  const [seed, setSeed] = useState<number>(() => Math.floor(Math.random() * 99999));
  const [forged, setForged] = useState(false);
  const [drifted, setDrifted] = useState(false);
  const [copied, setCopied] = useState(false);

  const preset = PRESETS.find((p) => p.id === presetId)!;
  const conlang = useMemo(() => forge(seed, preset, morph), [seed, preset, morph]);
  const drift = useMemo(() => fastForward(conlang, seed), [conlang, seed]);
  const presetLabel = (id: string) => t(`pg.clf.preset.${id === 'weird' ? 'weird' : id}` as Parameters<typeof t>[0]);
  const morphLabel = (m: PluralStyle) =>
    m === 'suffix' ? t('pg.clf.morph.suffix') : m === 'redup' ? t('pg.clf.morph.redup') : t('pg.clf.morph.prefix');

  const reforge = () => {
    setSeed(Math.floor(Math.random() * 99999));
    setDrifted(false);
    setForged(true);
  };

  const copyPassport = async () => {
    const lines = [
      `${t('pg.clf.passport')}: ${conlang.name}`,
      `${t('pg.clf.seed')}: ${seed} · ${presetLabel(presetId)} · ${order} · ${morphLabel(morph)}`,
      ...CONCEPTS.map((c) => `${CONCEPT_GLOSS[c][lang]}: ${drifted ? drift.lexicon[c] : conlang.lexicon[c]}`),
      'mova playground',
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const lex = drifted ? drift.lexicon : conlang.lexicon;
  const words = sentence({ ...conlang, lexicon: lex }, order);
  const glossWords =
    order === 'SOV'
      ? [CONCEPT_GLOSS.friend[lang], CONCEPT_GLOSS.bird[lang], CONCEPT_GLOSS.see[lang]]
      : order === 'VSO'
        ? [CONCEPT_GLOSS.see[lang], CONCEPT_GLOSS.friend[lang], CONCEPT_GLOSS.bird[lang]]
        : [CONCEPT_GLOSS.friend[lang], CONCEPT_GLOSS.see[lang], CONCEPT_GLOSS.bird[lang]];
  const pluralFn = drifted ? drift.newPlural : conlang.plural;

  return (
    <div className="toy" data-toy="conlang-forge">
      <h2>{t('pg.clf.step1')}</h2>
      <div className="row" role="group" aria-label={t('pg.clf.step1')}>
        {PRESETS.map((p) => (
          <button key={p.id} className="pill" aria-pressed={p.id === presetId}
            onClick={() => { setPresetId(p.id); setDrifted(false); }}>
            {presetLabel(p.id)}
          </button>
        ))}
      </div>

      <h2 style={{ marginTop: '1rem' }}>{t('pg.clf.step2')}</h2>
      <div className="row" role="group" aria-label={t('pg.clf.step2')}>
        {ORDERS.map((o) => (
          <button key={o} className="pill" aria-pressed={o === order} onClick={() => setOrder(o)}>
            {o}
          </button>
        ))}
      </div>

      <h2 style={{ marginTop: '1rem' }}>{t('pg.clf.step3')}</h2>
      <div className="row" role="group" aria-label={t('pg.clf.step3')}>
        {MORPHS.map((m) => (
          <button key={m} className="pill" aria-pressed={m === morph}
            onClick={() => { setMorph(m); setDrifted(false); }}>
            {morphLabel(m)}
          </button>
        ))}
      </div>

      <div className="row" style={{ marginTop: '1.2rem' }}>
        <button className="pill active" onClick={reforge}>
          🔨 {forged ? t('pg.clf.reforge') : t('pg.clf.forge')}
        </button>
        {forged && !drifted && (
          <button className="pill" onClick={() => setDrifted(true)}>⏩ {t('pg.clf.ff')}</button>
        )}
      </div>

      {forged && (
        <div style={{ marginTop: '1.3rem' }} aria-live="polite">
          <div className="stage-card">
            <div className="word-meta">{t('pg.clf.passport')} · {t('pg.clf.seed')}: {seed}</div>
            <div className="big-word accent">{conlang.name}</div>
            <div className="word-meta">{presetLabel(presetId)} · {order} · {morphLabel(morph)}</div>
          </div>

          {drifted && (
            <div style={{ marginTop: '0.8rem' }}>
              <h2>{t('pg.clf.changes')}</h2>
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

          <h2 style={{ marginTop: '1rem' }}>{drifted ? t('pg.clf.ffDone') : t('pg.clf.lexicon')}</h2>
          <div className="row">
            {CONCEPTS.map((c) => (
              <span key={c} className="hint-card">
                <strong className={drifted && drift.lexicon[c] !== conlang.lexicon[c] ? 'accent' : undefined}>
                  {lex[c]}
                </strong>{' '}
                <span className="muted">— {CONCEPT_GLOSS[c][lang]}</span>
              </span>
            ))}
          </div>

          <h2 style={{ marginTop: '1rem' }}>{t('pg.clf.sample')}</h2>
          <div className="big-word" style={{ fontSize: '1.4rem' }}>{words.join(' ')}.</div>
          <div className="muted" style={{ fontSize: '0.9rem' }}>
            {glossWords.join(' · ')} — “{t('pg.clf.sampleGloss')}”
          </div>
          <div style={{ marginTop: '0.4rem' }}>
            <strong>{pluralFn(lex.bird)}</strong>{' '}
            <span className="muted">— {t('pg.clf.samplePluralGloss')}</span>
          </div>

          <div className="row" style={{ marginTop: '1rem' }}>
            <button className="pill" onClick={copyPassport}>
              {copied ? t('pg.clf.copied') : `📋 ${t('pg.clf.copy')}`}
            </button>
          </div>
        </div>
      )}

      <p className="toy-note">{t('pg.clf.note')}</p>
    </div>
  );
}
