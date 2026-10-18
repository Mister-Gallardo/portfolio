import { type DependencyList, useEffect } from 'react';
import { deferUntilIdle } from './idle';
import { whileMatches } from './media';

/** GSAP and its plugins, fetched on first use so that they stay out of the initial bundle. */
export const loadMotion = () => import('./gsap');
export type Motion = Awaited<ReturnType<typeof loadMotion>>;

type Cleanup = (() => void) | undefined;

let refreshPending = false;

/** One ScrollTrigger measurement once the queued setups are in place, not one per setup. */
function refreshAfterQueue({ ScrollTrigger }: Motion) {
  if (refreshPending) return;
  refreshPending = true;
  deferUntilIdle(() => {
    refreshPending = false;
    ScrollTrigger.refresh();
  });
}

/**
 * Runs a GSAP setup while `query` matches. GSAP is fetched only then, so devices where
 * no effect applies (phones, reduced motion) never download it, and the setup waits
 * for an idle moment after load (see `deferUntilIdle`): scroll effects never compete
 * with the first render, and since the content is complete without them, nothing
 * waits for them either. Everything the setup creates is reverted when the query stops
 * matching, on unmount and when a dependency changes.
 */
export function useMotion(
  query: string,
  setup: (motion: Motion) => Cleanup,
  dependencies: DependencyList = [],
) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: `setup` is a new closure on every render; the caller's dependencies, checked by Biome at each call site, decide when it runs again.
  useEffect(
    () =>
      whileMatches(query, () => {
        let stopped = false;
        let revert: (() => void) | undefined;

        const cancel = deferUntilIdle(async () => {
          const motion = await loadMotion();
          if (stopped) return;

          let cleanup: Cleanup;
          const context = motion.gsap.context(() => {
            cleanup = setup(motion);
          });
          revert = () => {
            cleanup?.();
            context.revert();
          };
          refreshAfterQueue(motion);
        });

        return () => {
          stopped = true;
          cancel();
          revert?.();
        };
      }),
    [query, ...dependencies],
  );
}
