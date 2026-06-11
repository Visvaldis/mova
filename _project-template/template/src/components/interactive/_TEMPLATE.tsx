// =============================================================================
// ISLAND TEMPLATE — copy to <PascalName>.tsx and fill in. See tasks/CONVENTIONS.md.
//
// CONTRACT (every interactive island obeys this):
//   • Single prop: { lang: 'en' | 'uk' }. No internal language toggle — the site
//     nav toggle drives it (each language is its own static page).
//   • All chrome strings come from ui.ts via `t(...)`, namespaced by id.
//   • Bulky bilingual content data lives in <name>.data.ts (typed, per-item {en,uk}).
//   • Colors come ONLY from the inherited topic CSS variables (--accent, etc.).
//     Never hardcode hex. Scope CSS so it can't leak into .prose.
//   • JS-driven motion gates on useReducedMotion(); render a static end-state.
//   • Keyboard-navigable; every control has a bilingual aria-label. Works at 375px.
//   • Every fact traces to the article, or is marked TODO(owner).
//   • Register in ../Interactive.astro (import + BUILT set + conditional render).
// =============================================================================
import { useState } from 'react';
import type { Lang } from '../../i18n/utils';
import { ui } from '../../i18n/ui';
// import { useReducedMotion } from './useReducedMotion';
// import { DATA } from './myComponent.data';

export default function MyComponent({ lang }: { lang: Lang }) {
  const t = (k: keyof (typeof ui)['en']) => ui[lang][k] ?? ui.en[k];
  const [state, setState] = useState(0);

  return (
    <div className="mc-root">
      {/* Build your interactive here. Delete this template once real. */}
      <p>{t('interactive.note')}</p>
      <button onClick={() => setState((s) => s + 1)} aria-label={t('interactive.badge')}>
        {state}
      </button>
    </div>
  );
}
