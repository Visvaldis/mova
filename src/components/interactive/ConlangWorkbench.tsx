// conlang-workbench (article: constructed-languages) — three tabs:
//   1. Toki Pona builder — compose tiles into a phrase with a live gloss,
//   2. Conlang timeline — Lingua Ignota → … → Toki Pona, each with its fate,
//   3. Esperanto decoder — tap words to see how much you can read on sight.
// Bilingual via `lang` (no internal toggle). Timeline facts trace to the article;
// Toki Pona / Esperanto vocab trace to the cited sources (see the data file).
import { useState } from 'react';
import type { Lang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import {
  TOKIPONA_WORDS,
  TOKIPONA_COMBOS,
  CONLANG_TIMELINE,
  TIMELINE_QUOTE,
  ESPERANTO,
} from './conlangWorkbench.data';
import s from './interactive.module.css';
import c from './ConlangWorkbench.module.css';

type Tab = 'build' | 'timeline' | 'esperanto';
type T = (key: Parameters<ReturnType<typeof useTranslations>>[0]) => string;

export default function ConlangWorkbench({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const [tab, setTab] = useState<Tab>('build');

  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: 'build', icon: '🧩', label: t('conlangWorkbench.tabBuild') },
    { id: 'timeline', icon: '🕰', label: t('conlangWorkbench.tabTimeline') },
    { id: 'esperanto', icon: '🔍', label: t('conlangWorkbench.tabEsperanto') },
  ];

  return (
    <div className={s.panel}>
      <div className={c.tabs} role="tablist" aria-label={t('conlangWorkbench.tabsAria')}>
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

      {tab === 'build' && <BuildView lang={lang} t={t} />}
      {tab === 'timeline' && <TimelineView lang={lang} t={t} />}
      {tab === 'esperanto' && <EsperantoView lang={lang} t={t} />}
    </div>
  );
}

/* ── (a) Toki Pona builder ────────────────────────────────────────────────── */
function BuildView({ lang, t }: { lang: Lang; t: T }) {
  const [phrase, setPhrase] = useState<string[]>([]);

  const glossOf = (w: string) => TOKIPONA_WORDS.find((x) => x.word === w)!.gloss[lang];
  const literal = phrase.map(glossOf).join(' ');
  const combo = TOKIPONA_COMBOS.find(
    (cm) => cm.parts.length === phrase.length && cm.parts.every((p, i) => p === phrase[i]),
  );

  return (
    <div>
      <p className={c.intro}>{t('conlangWorkbench.buildIntro')}</p>

      <div className={c.tiles}>
        {TOKIPONA_WORDS.map((w) => (
          <button
            key={w.word}
            className={c.tile}
            aria-label={`${t('conlangWorkbench.add')} ${w.word} — ${w.gloss[lang]}`}
            onClick={() => setPhrase((p) => [...p, w.word])}
          >
            <span className={c.tileWord}>{w.word}</span>
            <span className={c.tileGloss}>{w.gloss[lang]}</span>
          </button>
        ))}
      </div>

      <div className={s.card} role="status" aria-live="polite" style={{ marginTop: '0.9rem' }}>
        {phrase.length === 0 ? (
          <p className={s.muted}>{t('conlangWorkbench.buildEmpty')}</p>
        ) : (
          <div>
            <p className={c.phrase}>{phrase.join(' ')}</p>
            <p className={c.literal}>
              <span className={s.muted}>{t('conlangWorkbench.buildLiteral')}: </span>
              {literal}
            </p>
            {combo && (
              <p className={c.meaning}>
                {combo.featured && <span className={c.badge}>{t('conlangWorkbench.recognized')}</span>}{' '}
                {t('conlangWorkbench.buildMeaning')}: <strong>{combo.meaning[lang]}</strong>
              </p>
            )}
          </div>
        )}
      </div>

      <div className={s.row} style={{ marginTop: '0.7rem' }}>
        <button
          className={s.pill}
          onClick={() => setPhrase((p) => p.slice(0, -1))}
          disabled={phrase.length === 0}
        >
          ⌫ {t('conlangWorkbench.undo')}
        </button>
        <button className={s.pill} onClick={() => setPhrase([])} disabled={phrase.length === 0}>
          {t('conlangWorkbench.clear')}
        </button>
      </div>

      <p className={s.caption} style={{ marginTop: '0.7rem' }}>
        {t('conlangWorkbench.vocabNote')}
      </p>
    </div>
  );
}

/* ── (b) Conlang timeline ─────────────────────────────────────────────────── */
function TimelineView({ lang, t }: { lang: Lang; t: T }) {
  return (
    <div>
      <p className={c.intro}>{t('conlangWorkbench.timelineIntro')}</p>
      <ol className={c.timeline}>
        {CONLANG_TIMELINE.map((e) => (
          <li key={e.id} className={c.tlItem} data-kind={e.kind}>
            <div className={c.tlDot} aria-hidden="true" />
            <div className={c.tlBody}>
              <div className={c.tlHead}>
                <span className={c.tlName}>{e.name}</span>
                <span className={c.tlWhen}>{e.when[lang]}</span>
              </div>
              <div className={c.tlBy}>{e.by[lang]}</div>
              <p className={c.tlFate}>{e.fate[lang]}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className={c.quote}>{TIMELINE_QUOTE[lang]}</p>
    </div>
  );
}

/* ── (c) Esperanto decoder ────────────────────────────────────────────────── */
function EsperantoView({ lang, t }: { lang: Lang; t: T }) {
  const words = ESPERANTO.sentence;
  const [open, setOpen] = useState<number | null>(null);
  const [revealAll, setRevealAll] = useState(false);

  const familiar = words.filter((w) => w.familiar).length;

  return (
    <div>
      <p className={c.intro}>{t('conlangWorkbench.esperantoIntro')}</p>

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
        {t('conlangWorkbench.esperantoMeter')} <strong>{familiar}</strong> {t('conlangWorkbench.of')}{' '}
        {words.length} {t('conlangWorkbench.words')}
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
          {revealAll ? t('conlangWorkbench.hide') : t('conlangWorkbench.revealAll')}
        </button>
      </div>

      {revealAll && (
        <p className={c.eoTranslation}>
          <span className={s.muted}>{t('conlangWorkbench.translation')}: </span>
          {ESPERANTO.translation[lang]}
        </p>
      )}

      <p className={s.caption} style={{ marginTop: '0.7rem' }}>
        {t('conlangWorkbench.esperantoNote')}
      </p>
    </div>
  );
}
