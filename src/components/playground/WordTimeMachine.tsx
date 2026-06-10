import { useMemo, useState } from 'react';
import type { Lang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import data from '../../data/playground/etymologies.json';

interface Stage {
  form: string;
  lang: Record<Lang, string>;
  period: Record<Lang, string>;
  reconstructed: boolean;
  note: Record<Lang, string>;
}
interface Word {
  id: string;
  lemma: Record<Lang, string>;
  icon: string;
  chain: Stage[];
  cognates: { form: string; lang: Record<Lang, string> }[];
  source: string;
}

const WORDS = (data as { words: Word[] }).words;

export default function WordTimeMachine({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const [activeId, setActiveId] = useState<string>(WORDS[0].id);
  const [query, setQuery] = useState('');

  const word = WORDS.find((w) => w.id === activeId)!;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return WORDS;
    return WORDS.filter(
      (w) =>
        w.lemma.en.toLowerCase().includes(q) ||
        w.lemma.uk.toLowerCase().includes(q) ||
        w.chain.some((s) => s.form.toLowerCase().includes(q)),
    );
  }, [query]);

  const surprise = () => {
    const others = WORDS.filter((w) => w.id !== activeId);
    setActiveId(others[Math.floor(Math.random() * others.length)].id);
  };

  return (
    <div className="toy" data-toy="word-time-machine">
      <div className="row">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('pg.wtm.search')}
          aria-label={t('pg.wtm.search')}
          style={{ flex: '1 1 12rem' }}
        />
        <button className="pill" onClick={surprise}>🎲 {t('pg.wtm.surprise')}</button>
      </div>

      {filtered.length === 0 ? (
        <p className="muted" style={{ marginTop: '1rem' }}>{t('pg.wtm.empty')}</p>
      ) : (
        <div className="row" role="group" aria-label={t('pg.wtm.pick')} style={{ marginTop: '0.8rem' }}>
          {filtered.map((w) => (
            <button
              key={w.id}
              className="pill"
              aria-pressed={w.id === activeId}
              onClick={() => setActiveId(w.id)}
            >
              {w.icon} {w.lemma[lang]}
            </button>
          ))}
        </div>
      )}

      <div style={{ marginTop: '1.4rem' }} aria-live="polite">
        <div className="chain" key={word.id}>
          {word.chain.map((stage, i) => (
            <div className="chain-link" key={i}>
              <div className="chain-rail" aria-hidden="true">
                <span className="chain-dot" />
              </div>
              <div className="chain-body">
                <div className="word-form">
                  {stage.reconstructed && <span className="accent" title={t('pg.wtm.reconstructed')}>*</span>}
                  {stage.form}
                </div>
                <div className="word-meta">
                  {stage.lang[lang]} · {stage.period[lang]}
                </div>
                <div className="word-note">{stage.note[lang]}</div>
              </div>
            </div>
          ))}
        </div>

        {word.cognates.length > 0 && (
          <div style={{ marginTop: '1.1rem' }}>
            <h2>{t('pg.wtm.cognates')}</h2>
            <div className="row">
              {word.cognates.map((c, i) => (
                <span key={i} className="hint-card">
                  <strong>{c.form}</strong> <span className="muted">— {c.lang[lang]}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="toy-note">
          {t('pg.wtm.reconstructed')}
          <br />
          {t('pg.wtm.source')}: {word.source} · {WORDS.length} {t('pg.growing')}
        </p>
      </div>
    </div>
  );
}
