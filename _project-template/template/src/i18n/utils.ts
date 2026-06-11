import { LANGS, DEFAULT_LANG, ui, type Lang, type UIKey } from './ui';

export { LANGS, DEFAULT_LANG };
export type { Lang, UIKey };

// import.meta.env.BASE_URL is the configured `base` (e.g. "/storybook/"). Normalize once.
const BASE = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');

/** Prefix an absolute app path with the deploy base. Use for EVERY internal link. */
export function withBase(path = '/'): string {
  const rel = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}${rel}` || '/';
}

/** Localized, base-prefixed, trailing-slash path: localizedPath('uk','about') -> /storybook/uk/about/ */
export function localizedPath(lang: Lang, ...parts: Array<string | undefined>): string {
  const tail = parts.filter(Boolean).join('/');
  return withBase(tail ? `/${lang}/${tail}/` : `/${lang}/`);
}

/** The opposite UI language (bilingual site). Generalize if you add a third locale. */
export function otherLang(lang: Lang): Lang {
  return lang === 'en' ? 'uk' : 'en';
}

/** Detect the active language from a request URL (handles the deploy base prefix). */
export function getLangFromUrl(url: URL): Lang {
  let p = url.pathname;
  if (BASE && p.startsWith(BASE)) p = p.slice(BASE.length);
  const seg = p.split('/').filter(Boolean)[0];
  return (LANGS as readonly string[]).includes(seg) ? (seg as Lang) : DEFAULT_LANG;
}

/** Translator bound to a language, with graceful fallback to English then the key itself. */
export function useTranslations(lang: Lang) {
  return (key: UIKey): string => ui[lang]?.[key] ?? ui[DEFAULT_LANG][key] ?? key;
}

/** Content collection ids are "<lang>/<slug>" (from the glob loader). Bridge id <-> slug. */
export const idFor = (lang: Lang, slug: string): string => `${lang}/${slug}`;
export const slugFromId = (id: string): string => id.split('/').slice(1).join('/');
export const langFromId = (id: string): Lang => id.split('/')[0] as Lang;
