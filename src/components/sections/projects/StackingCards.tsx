'use client';

import { type ReactNode, useRef } from 'react';
import { useMotion } from '@/lib/motion';

/** Same size condition as the sticky stacking layout in Projects.module.css. */
const STACKING =
  '(prefers-reduced-motion: no-preference) and (min-width: 64rem) and (min-height: 45rem)';

/**
 * While the next card slides over the current one, the current card shrinks a little
 * and dims, which reads as depth. The stacking itself is CSS `position: sticky`.
 */
export function StackingCards({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const list = useRef<HTMLOListElement>(null);

  useMotion(STACKING, ({ gsap }) => {
    const items = gsap.utils.toArray<HTMLElement>('[data-stack-item]', list.current);

    items.forEach((item, index) => {
      const next = items[index + 1];
      const card = item.querySelector('[data-stack-card]');
      const shade = item.querySelector('[data-stack-shade]');
      if (!next || !card || !shade) return;

      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: next,
            start: 'top bottom',
            // Ends when the next card reaches its own sticky position.
            end: () => `top top+=${parseFloat(getComputedStyle(next).top) || 0}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
        .fromTo(card, { scale: 1 }, { scale: 0.94 }, 0)
        .fromTo(shade, { opacity: 0 }, { opacity: 0.55 }, 0);
    });
  });

  return (
    <ol ref={list} className={className}>
      {children}
    </ol>
  );
}
