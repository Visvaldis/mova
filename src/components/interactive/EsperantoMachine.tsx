// esperanto-machine (article: esperanto) — three tabs:
//   1. Word machine — snap morpheme tiles together with a live gloss; a challenge
//      mode asks you to build the article's san- word family.
//   2. Verb dial — one root, every tense regular (the "no irregulars, ever" point).
//   3. Guessability — tap the article's own Esperanto terms to see their European
//      roots; a meter shows how many you can read on sight.
// Bilingual via `lang` (no internal toggle). Every word traces to the article or
// the Fundamento (see the data file).
import { useState } from 'react';
import type { Lang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import {
  PREFIXES,
  ROOTS,
  SUFFIXES,
  ENDINGS,
  ALL_MORPHEMES,
  FEATURED_WORDS,
  CHALLENGES,
  BUILDER_QUOTE,
  TENSES,
  VERB_ROOTS,
  GUESS_WORDS,
  type Morpheme,
} from './esperantoMachine.data';
import s from './interactive.module.css';
import c from './EsperantoMachine.module.css';

type Tab = 'machine' | 'dial' | 'guess';
type T = (key: Parameters<ReturnType<typeof useTranslations>>[0]) => string;

const eq = (a: string[], b: string[]) => a.length === b.length && a.every((x, i) => x === b[i]);

export default function EsperantoMachine({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const [tab, setTab] = useState<Tab>('machine');

  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: 'machine', icon: '🧱', label: t('esperantoMachine.tabMachine') },
    { id: 'dial', icon: '🕹', label: t('esperantoMachine.tabDial') },
    { id: 'guess', icon: '🔍', label: t('esperantoMachine.tabGuess') },
  ];

  return (
    <div className={s.panel}>
      <div className={c.tabs} role="tablist" aria-label={t('esperantoMachine.tabsAria')}>
        {tabs.map((tb) => (
          <button
            key={tb.id}
            role="tab"
            aria-selected={tab === tb.id}
            className={s.pill}
            data-active={tab === tb.id}
            onClick={() => setTab(tb.id)}
          >
            <span aria-hidden="true">{tb.icon}</span> {tb.label}
          </button>
        ))}
      </div>

      {tab === 'machine' && <MachineView lang={lang} t={t} />}
      {tab === 'dial' && <DialView lang={lang} t={t} />}
      {tab === 'guess' && <GuessView lang={lang} t={t} />}
    </div>
  );
}

/* ── (a) word machine ─────────────────────────────────────────────────────── */
function MachineView({ lang, t }: { lang: Lang; t: T }) {
  const [parts, setParts] = useState<string[]>([]);
  const [challenge, setChallenge] = useState<number | null>(null);

  const mof = (id: string) => ALL_MORPHEMES.find((m) => m.id === id)!;
  const word = parts.map((id) => mof(id).form).join('');
  const featured = FEATURED_WORDS.find((f) => eq(f.parts, parts));
  const target = challenge !== null ? CHALLENGES[challenge] : null;
  const solved = target ? eq(target.answer, parts) : false;
  // A word "looks finished" once it carries an ending — only then is a
  // non-matching build judged wrong (no nagging mid-assembly).
  const finished = parts.some((id) => mof(id).kind === 'ending');

  // Canonical slot order: prefix < root < suffixes (click order) < o/a < j.
  const rank = (id: string) => {
    const m = mof(id);
    if (m.kind === 'prefix') return 0;
    if (m.kind === 'root') return 1;
    if (m.kind === 'suffix') return 2;
    return m.id === 'j' ? 4 : 3; // plural -j stacks after -o/-a
  };

  /** Toggle a morpheme with real Esperanto slot rules: one prefix, one root,
   *  one of -o/-a (replace), stackable distinct suffixes, -j after the ending.
   *  Tapping a selected tile removes it. */
  const pick = (m: Morpheme) => {
    setParts((p) => {
      if (p.includes(m.id)) return p.filter((id) => id !== m.id);
      let next = p;
      if (m.kind === 'prefix' || m.kind === 'root') {
        next = p.filter((id) => mof(id).kind !== m.kind);
      } else if (m.kind === 'ending' && m.id !== 'j') {
        next = p.filter((id) => !(mof(id).kind === 'ending' && id !== 'j'));
      }
      const out = [...next];
      let at = out.length;
      for (let i = 0; i < out.length; i++) {
        if (rank(out[i]) > rank(m.id)) { at = i; break; }
      }
      out.splice(at, 0, m.id);
      return out;
    });
  };

  const group = (title: string, items: Morpheme[]) => (
    <div className={c.group}>
      <span className={c.groupLabel}>{title}</span>
      <div className={c.tiles}>
        {items.map((m) => (
          <button
            key={m.id}
            className={c.tile}
            data-src={m.source}
            aria-pressed={parts.includes(m.id)}
            aria-label={`${t('esperantoMachine.add')} ${m.form}- — ${m.gloss[lang]}`}
            onClick={() => pick(m)}
          >
            <span className={c.tileForm}>{m.kind === 'prefix' ? `${m.form}-` : m.kind === 'root' ? m.form : `-${m.form}`}</span>
            <span className={c.tileGloss}>{m.gloss[lang]}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <p className={c.intro}>{t('esperantoMachine.machineIntro')}</p>

      {group(t('esperantoMachine.grpPrefix'), PREFIXES)}
      {group(t('esperantoMachine.grpRoot'), ROOTS)}
      {group(t('esperantoMachine.grpSuffix'), SUFFIXES)}
      {group(t('esperantoMachine.grpEnding'), ENDINGS)}

      <div className={s.card} role="status" aria-live="polite" style={{ marginTop: '0.9rem' }}>
        {parts.length === 0 ? (
          <p className={s.muted}>{t('esperantoMachine.machineEmpty')}</p>
        ) : (
          <div>
            <p className={c.word} lang="eo">
              {word}
            </p>
            <p className={c.morphGloss}>{parts.map((id) => mof(id).gloss[lang]).join(' · ')}</p>
            {featured && (
              <p className={c.meaning}>
                <span className={c.badge}>{t('esperantoMachine.fromArticle')}</span>{' '}
                {t('esperantoMachine.means')}: <strong>{featured.meaning[lang]}</strong>
              </p>
            )}
            {target && solved && <p className={c.win}>✓ {t('esperantoMachine.solved')}</p>}
            {target && !solved && finished && (
              <p className={s.muted} role="status" style={{ margin: '0.3rem 0 0', fontWeight: 600 }}>
                ✗ {t('esperantoMachine.notYet')} <strong>{target.target[lang]}</strong>
              </p>
            )}
          </div>
        )}
      </div>

      <div className={s.row} style={{ marginTop: '0.7rem' }}>
        <button className={s.pill} onClick={() => setParts((p) => p.slice(0, -1))} disabled={!parts.length}>
          ⌫ {t('esperantoMachine.undo')}
        </button>
        <button className={s.pill} onClick={() => setParts([])} disabled={!parts.length}>
          {t('esperantoMachine.clear')}
        </button>
      </div>

      <div className={c.challengeBox}>
        <span className={c.groupLabel}>{t('esperantoMachine.challengeLabel')}</span>
        <div className={c.tiles}>
          {CHALLENGES.map((ch, i) => (
            <button
              key={i}
              className={s.pill}
              data-active={challenge === i}
              aria-pressed={challenge === i}
              onClick={() => {
                setChallenge(challenge === i ? null : i);
                setParts([]);
              }}
            >
              {ch.target[lang]}
            </button>
          ))}
        </div>
        {target && !solved && (
          <p className={s.caption} style={{ marginTop: '0.5rem' }}>
            {t('esperantoMachine.challengeHint')} <strong>{target.target[lang]}</strong>
            {' · '}
            <button
              className={c.linkBtn}
              onClick={() => setParts(target.answer)}
            >
              {t('esperantoMachine.showAnswer')}
            </button>
          </p>
        )}
      </div>

      <p className={c.quote}>{BUILDER_QUOTE[lang]}</p>
    </div>
  );
}

/* ── (b) verb-tense dial ──────────────────────────────────────────────────── */
function DialView({ lang, t }: { lang: Lang; t: T }) {
  const [rootIdx, setRootIdx] = useState(0);
  const [tenseIdx, setTenseIdx] = useState(0);
  const root = VERB_ROOTS[rootIdx];
  const tense = TENSES[tenseIdx];
  const form = `${root.form}${tense.ending}${tense.ending === 'u' ? '!' : ''}`;

  return (
    <div>
      <p className={c.intro}>{t('esperantoMachine.dialIntro')}</p>

      <div className={s.row}>
        <span className={c.groupLabel}>{t('esperantoMachine.dialRoot')}</span>
        {VERB_ROOTS.map((r, i) => (
          <button
            key={r.form}
            className={s.pill}
            data-active={rootIdx === i}
            aria-pressed={rootIdx === i}
            onClick={() => setRootIdx(i)}
          >
            {r.form}- · {r.base[lang]}
          </button>
        ))}
      </div>

      <div className={c.dial} role="group" aria-label={t('esperantoMachine.dialTenseAria')}>
        {TENSES.map((tn, i) => (
          <button
            key={tn.ending}
            className={c.dialBtn}
            data-active={tenseIdx === i}
            aria-pressed={tenseIdx === i}
            onClick={() => setTenseIdx(i)}
          >
            <span className={c.dialEnding}>-{tn.ending}</span>
            <span className={c.dialWhen}>{tn.when[lang]}</span>
          </button>
        ))}
      </div>

      <div className={s.card} role="status" aria-live="polite" style={{ marginTop: '0.9rem' }}>
        <p className={c.word} lang="eo">
          {form}
        </p>
        <p className={c.morphGloss}>
          <strong>{root.forms[tense.ending][lang]}</strong>
        </p>
      </div>

      <p className={s.caption} style={{ marginTop: '0.7rem' }}>
        {t('esperantoMachine.dialNote')}
      </p>
    </div>
  );
}

/* ── (c) guessability meter ───────────────────────────────────────────────── */
function GuessView({ lang, t }: { lang: Lang; t: T }) {
  const words = GUESS_WORDS;
  const [open, setOpen] = useState<number | null>(null);
  const [revealAll, setRevealAll] = useState(false);
  const familiar = words.filter((w) => w.familiar).length;

  return (
    <div>
      <p className={c.intro}>{t('esperantoMachine.guessIntro')}</p>

      <div className={c.eoSentence}>
        {words.map((w, i) => {
          const shown = revealAll || open === i;
          return (
            <button
              key={i}
              className={`${c.eoWord} ${w.familiar ? c.eoFamiliar : ''} ${shown ? c.eoShown : ''}`}
              aria-expanded={shown}
              aria-label={`${w.w} — ${w.gloss[lang]}`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              {w.w}
            </button>
          );
        })}
      </div>

      {!revealAll && open !== null && (
        <div className={s.card} role="status" aria-live="polite" style={{ marginTop: '0.7rem' }}>
          <p className={c.eoGloss}>
            <strong>{words[open].w}</strong> — {words[open].gloss[lang]}
          </p>
          <p className={s.caption}>{words[open].root[lang]}</p>
        </div>
      )}

      <div className={c.meter} aria-hidden="true">
        <div className={c.meterFill} style={{ width: `${(familiar / words.length) * 100}%` }} />
      </div>
      <p className={c.meterLabel}>
        {t('esperantoMachine.guessMeter')} <strong>{familiar}</strong> {t('esperantoMachine.of')}{' '}
        {words.length} {t('esperantoMachine.words')}
      </p>

      <div className={s.row} style={{ marginTop: '0.5rem' }}>
        <button
          className={s.pill}
          aria-pressed={revealAll}
          data-active={revealAll}
          onClick={() => {
            setRevealAll((r) => !r);
            setOpen(null);
          }}
        >
          {revealAll ? t('esperantoMachine.hide') : t('esperantoMachine.revealAll')}
        </button>
      </div>

      <p className={s.caption} style={{ marginTop: '0.7rem' }}>
        {t('esperantoMachine.guessNote')}
      </p>
    </div>
  );
}
