/**
 * Media conditions shared by scripted effects. Motion-heavy layouts only kick in on
 * large screens and when the visitor has not asked for reduced motion.
 */
export const media = {
  /** The large-screen layout (the `lg` breakpoint): section links instead of the menu. */
  wide: '(min-width: 64rem)',
  motion: '(prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
  /** Mouse or trackpad: pointer-driven effects and smooth wheel scrolling. */
  pointer: '(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)',
  /** Must match the CSS of scroll-driven layouts, `scripting` included. */
  desktop:
    '(scripting: enabled) and (prefers-reduced-motion: no-preference) and (min-width: 64rem) and (min-height: 40rem)',
} as const;

type Cleanup = (() => void) | undefined;

/**
 * Runs `start` while the media query matches: again whenever it starts matching, and the
 * cleanup it returns whenever it stops. Returns a function that tears everything down.
 */
export function whileMatches(query: string, start: () => Cleanup): () => void {
  const list = window.matchMedia(query);
  let active = false;
  let stop: Cleanup;

  const update = () => {
    if (list.matches === active) return;
    active = list.matches;
    if (active) {
      stop = start();
    } else {
      stop?.();
      stop = undefined;
    }
  };

  update();
  list.addEventListener('change', update);
  return () => {
    list.removeEventListener('change', update);
    stop?.();
  };
}
