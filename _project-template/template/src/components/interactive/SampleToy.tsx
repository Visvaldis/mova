// A minimal but REAL island, built to the contract in _TEMPLATE.tsx / CONVENTIONS.md.
// Type a word, transform it (reverse / uppercase). Proves the registry → island →
// i18n → topic-variable styling path end-to-end. Replace with your real components.
import { useState } from 'react';
import type { Lang } from '../../i18n/utils';
import { ui } from '../../i18n/ui';
import { EXAMPLES, pick } from './sampleToy.data';

export default function SampleToy({ lang }: { lang: Lang }) {
  const t = (k: keyof (typeof ui)['en']) => ui[lang][k] ?? ui.en[k];
  const [word, setWord] = useState(pick(lang, EXAMPLES[0]));
  const [mode, setMode] = useState<'none' | 'reverse' | 'upper'>('none');

  const out =
    mode === 'reverse' ? [...word].reverse().join('') :
    mode === 'upper' ? word.toLocaleUpperCase(lang === 'uk' ? 'uk' : 'en') :
    word;

  return (
    <div className="st-root">
      <label className="st-prompt" htmlFor="st-input">{t('sampleToy.prompt')}</label>
      <input
        id="st-input"
        className="st-input"
        value={word}
        placeholder={t('sampleToy.placeholder')}
        onChange={(e) => setWord(e.target.value)}
        aria-label={t('sampleToy.prompt')}
      />
      <div className="st-controls">
        <button onClick={() => setMode('reverse')} aria-pressed={mode === 'reverse'}>
          {t('sampleToy.reverse')}
        </button>
        <button onClick={() => setMode('upper')} aria-pressed={mode === 'upper'}>
          {t('sampleToy.upper')}
        </button>
        <button onClick={() => setMode('none')}>{t('sampleToy.reset')}</button>
      </div>
      <div className="st-out" role="status" aria-live="polite">
        <span className="st-out-label">{t('sampleToy.outLabel')}</span>
        <span className="st-out-word">{out || '—'}</span>
      </div>

      <style>{`
        .st-root { display: grid; gap: .75rem; padding: 1.25rem;
          border: 1px solid var(--line); border-radius: var(--radius);
          background: var(--bg-elev); }
        .st-prompt { font-weight: 600; color: var(--text); }
        .st-input { padding: .6rem .8rem; border-radius: var(--radius-sm);
          border: 1px solid var(--line); background: var(--bg); color: var(--text);
          font-size: 1.05rem; }
        .st-controls { display: flex; flex-wrap: wrap; gap: .5rem; }
        .st-controls button { padding: .5rem .9rem; border-radius: 999px; cursor: pointer;
          border: 1px solid var(--accent); background: transparent; color: var(--accent); }
        .st-controls button[aria-pressed="true"] { background: var(--accent); color: var(--on-accent); }
        .st-out { display: flex; align-items: baseline; gap: .6rem; flex-wrap: wrap;
          padding: .9rem 1rem; border-radius: var(--radius-sm); background: var(--accent-soft); }
        .st-out-label { font-size: .8rem; text-transform: uppercase; letter-spacing: .04em;
          color: var(--muted); }
        .st-out-word { font-size: 1.6rem; font-weight: 700; color: var(--accent);
          word-break: break-word; }
      `}</style>
    </div>
  );
}
