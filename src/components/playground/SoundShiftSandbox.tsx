import { useMemo, useState } from 'react';
import type { Lang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import { RULE_PACKS, applyPack } from '../../lib/soundlaws';

export default function SoundShiftSandbox({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const [input, setInput] = useState(lang === 'uk' ? 'конь' : 'pater');
  const [packId, setPackId] = useState(lang === 'uk' ? 'ikavism' : 'grimm');

  const pack = RULE_PACKS.find((p) => p.id === packId)!;
  const result = useMemo(() => applyPack(pack, input), [pack, input]);
  const changedAnything = result.fired.length > 0 && input.trim().length > 0;

  return (
    <div className="toy" data-toy="sound-shift-sandbox">
      <div className="row" role="group" aria-label={t('pg.sss.pack')}>
        {RULE_PACKS.map((p) => (
          <button
            key={p.id}
            className="pill"
            aria-pressed={p.id === packId}
            onClick={() => setPackId(p.id)}
          >
            {p.name[lang]}
          </button>
        ))}
      </div>
      <p className="muted" style={{ fontSize: '0.9rem', marginTop: '0.6rem' }}>{pack.desc[lang]}</p>

      <div style={{ marginTop: '1rem' }}>
        <label>
          <span className="muted" style={{ fontSize: '0.85rem', fontWeight: 700 }}>{t('pg.sss.before')}</span>
          <input
            type="text"
            value={input}
            maxLength={40}
            placeholder={t('pg.sss.input')}
            onChange={(e) => setInput(e.target.value)}
            style={{ marginTop: '0.3rem' }}
          />
        </label>
      </div>

      <div style={{ marginTop: '1.2rem' }} aria-live="polite">
        <span className="muted" style={{ fontSize: '0.85rem', fontWeight: 700 }}>{t('pg.sss.after')}</span>
        <div className="big-word" key={result.output}>
          {input.trim().length === 0 ? (
            <span className="muted">…</span>
          ) : (
            Array.from(result.output).map((ch, i) => (
              <span key={i} className={result.changed[i] ? 'accent pop' : undefined}>
                {ch}
              </span>
            ))
          )}
        </div>
      </div>

      {input.trim().length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          {changedAnything ? (
            <>
              <h2>{t('pg.sss.apply')}</h2>
              <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.45rem' }}>
                {result.fired.map(({ rule, count }) => (
                  <li key={rule.id} className="stage-card">
                    <strong className="accent">{rule.label}</strong>
                    {count > 1 ? ` ×${count}` : ''} — <span className="muted">{rule.note[lang]}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="feedback">{t('pg.sss.noChange')}</p>
          )}
        </div>
      )}

      <p className="toy-note">{t('pg.sss.note')}</p>
    </div>
  );
}
