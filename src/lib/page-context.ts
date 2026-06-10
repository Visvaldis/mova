// page-context — a tiny cross-island channel so the Ask-AI chat can see what the
// reader is *doing* in an interactive, not just what text they selected.
//
// Why a window registry (and not React context/props): the Ask-AI drawer is its
// own hydration root (mounted once in BaseLayout) and each interactive is another
// separate root. They share no React tree, so there is no prop/context path
// between them. A module-level singleton hung off `window` is the one channel both
// roots can reach. Everything here is SSR-guarded (`typeof window`), so importing
// it during the static build is a no-op.
//
// Contract: an interactive publishes a short, ALREADY-LOCALIZED one-liner summary
// of its current state (keyed by its interactive id); Ask-AI reads the combined
// summary at send time and folds it into the prompt. State changes mid-conversation
// are picked up automatically because the read happens per message, not once.
import { useEffect } from 'react';

type Registry = Record<string, string>;

const KEY = '__movaInteractiveContext__';

function registry(): Registry | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as Record<string, Registry | undefined>;
  return (w[KEY] ??= {});
}

/**
 * Publish (or, with `null`/empty, clear) a one-line summary of an interactive's
 * current state, in the page language. Keyed by interactive id so two interactives
 * on one page never clobber each other.
 */
export function publishInteractiveContext(id: string, summary: string | null): void {
  const reg = registry();
  if (!reg) return;
  if (summary && summary.trim()) reg[id] = summary.trim();
  else delete reg[id];
}

/** Read the combined live state of every interactive currently on the page. */
export function readInteractiveContext(): string | null {
  const reg = registry();
  if (!reg) return null;
  const parts = Object.values(reg).filter(Boolean);
  return parts.length ? parts.join('\n') : null;
}

/**
 * Hook form: publish `summary` whenever it changes, and clear it on unmount.
 * Call unconditionally at the top of a component (one component "owns" one id).
 */
export function useInteractiveContext(id: string, summary: string | null): void {
  useEffect(() => {
    publishInteractiveContext(id, summary);
    return () => publishInteractiveContext(id, null);
  }, [id, summary]);
}
