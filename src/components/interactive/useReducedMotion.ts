import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Returns `true` when the user has asked the OS to minimize motion.
 *
 * Every interactive island that drives motion from JS (requestAnimationFrame,
 * autoplay, JS-toggled transitions) should gate on this and render a sensible
 * static end-state when it returns `true`. Global CSS already neutralizes pure
 * CSS animations/transitions under the same media query — this hook is only for
 * the motion JS controls directly.
 *
 * SSR-safe: there is no `window` during static build, so the server render
 * defaults to `false` (motion allowed). The real preference is read on mount,
 * matching the no-JS / pre-hydration markup and then correcting if needed.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mql = window.matchMedia(QUERY);
    const update = () => setReduced(mql.matches);
    update();

    // addEventListener is the modern API; older Safari only has addListener.
    if (mql.addEventListener) {
      mql.addEventListener('change', update);
      return () => mql.removeEventListener('change', update);
    }
    mql.addListener(update);
    return () => mql.removeListener(update);
  }, []);

  return reduced;
}

export default useReducedMotion;
