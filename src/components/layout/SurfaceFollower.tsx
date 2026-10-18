'use client';

import { type ComponentProps, useEffect, useRef } from 'react';

type Props = Omit<ComponentProps<'div'>, 'ref'> & {
  /** Where to sample the page: distance in px from the top or the bottom of the viewport. */
  probe: { edge: 'top' | 'bottom'; offset: number };
};

/**
 * Copies `data-surface` from whatever is under a fixed element, so the header and the
 * floating button stay legible on dark and light sections, and on the dark project cards
 * inside a light one. Uses an IntersectionObserver with a one-pixel band, so scrolling
 * never triggers layout reads.
 */
export function SurfaceFollower({ probe, ...props }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { edge, offset } = probe;

  useEffect(() => {
    const element = ref.current;
    const surfaces = [...document.querySelectorAll<HTMLElement>('main [data-surface]')];
    if (!element || surfaces.length === 0) return;

    const under = new Set<HTMLElement>();
    let observer: IntersectionObserver | undefined;

    const observe = () => {
      observer?.disconnect();
      under.clear();
      const height = window.innerHeight;
      const line = edge === 'top' ? offset : height - offset;
      const next = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const target = entry.target as HTMLElement;
            if (entry.isIntersecting) under.add(target);
            else under.delete(target);
          }
          // Descendants follow their ancestors in document order, and so do surfaces
          // painted over earlier ones, so the last surface under the probe is the visible one.
          const surface = surfaces.findLast((candidate) => under.has(candidate));
          if (surface?.dataset.surface) element.dataset.surface = surface.dataset.surface;
        },
        { rootMargin: `${-line}px 0px ${-(height - line - 1)}px 0px` },
      );
      for (const surface of surfaces) next.observe(surface);
      observer = next;
    };

    observe();
    window.addEventListener('resize', observe);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', observe);
    };
  }, [edge, offset]);

  return <div ref={ref} data-surface="dark" {...props} />;
}
