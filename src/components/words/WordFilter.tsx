// Tiny filter island for /words/: filters the statically-rendered entries by
// hiding non-matching DOM nodes. No data payload in JS — the page IS the data.
import { useEffect, useRef, useState } from 'react';
import type { Lang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';

export default function WordFilter({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);
  const [q, setQ] = useState('');
  const [shown, setShown] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const needle = q.toLowerCase().replace(/[’ʼ`]/g, "'").trim();
      const items = document.querySelectorAll<HTMLElement>('[data-wkey]');
      let visible = 0;
      items.forEach((el) => {
        const hit = !needle || el.dataset.wkey!.includes(needle);
        el.hidden = !hit;
        if (hit) visible++;
      });
      document.querySelectorAll<HTMLElement>('[data-wletter]').forEach((sec) => {
        sec.hidden = !sec.querySelector('[data-wkey]:not([hidden])');
      });
      setShown(needle ? visible : null);
    }, 120);
    return () => clearTimeout(timer.current);
  }, [q]);

  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', margin: '1rem 0' }}>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t('words.filter')}
        aria-label={t('words.filter')}
        style={{
          flex: '1 1 16rem', maxWidth: '24rem', padding: '0.6rem 1rem', borderRadius: 999,
          border: '1.5px solid var(--line)', background: 'var(--bg-elev)', color: 'var(--text)', font: 'inherit',
        }}
      />
      {shown !== null && (
        <span aria-live="polite" style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
          {shown} ✓
        </span>
      )}
    </div>
  );
}
