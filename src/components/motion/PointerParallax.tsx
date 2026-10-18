'use client';

import { type ReactNode, useRef } from 'react';
import { media } from '@/lib/media';
import { useMotion } from '@/lib/motion';

type Props = {
  children: ReactNode;
  className?: string;
  /** Maximum shift in px when the pointer is at the edge of the viewport. */
  strength?: number;
};

/**
 * Lets content drift slightly after the mouse pointer. Only on devices with a precise
 * pointer, only while the element is on screen, and never with reduced motion.
 */
export function PointerParallax({ children, className, strength = 8 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(
    media.pointer,
    ({ gsap, ScrollTrigger }) => {
      const element = ref.current;
      if (!element) return;

      const x = gsap.quickTo(element, 'x', { duration: 1.2, ease: 'power3' });
      const y = gsap.quickTo(element, 'y', { duration: 1.2, ease: 'power3' });
      const visible = ScrollTrigger.create({
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
      });

      const onPointerMove = (event: PointerEvent) => {
        if (!visible.isActive) return;
        x((event.clientX / window.innerWidth - 0.5) * 2 * strength);
        y((event.clientY / window.innerHeight - 0.5) * 2 * strength);
      };

      window.addEventListener('pointermove', onPointerMove, { passive: true });
      return () => window.removeEventListener('pointermove', onPointerMove);
    },
    [strength],
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
