'use client';

import { type ReactNode, useRef } from 'react';
import { media } from '@/lib/media';
import { useMotion } from '@/lib/motion';

/** Largest shift in px when the pointer is at an edge of the window: [x, y]. */
const NAME_SHIFT = [16, 9] as const;
const PORTRAIT_SHIFT = [-6, -4] as const;

/**
 * With a mouse, the name drifts a little towards the pointer while the portrait in
 * front of it gives way in the other direction, which gives the hero some depth. The
 * scroll part of the effect is plain CSS (see Hero.module.css). Targets are marked with
 * data-hero attributes.
 */
export function HeroMotion({ className, children }: { className?: string; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useMotion(media.pointer, ({ gsap, ScrollTrigger }) => {
    const q = gsap.utils.selector(root);
    const [name] = q('[data-hero="name"]');
    const [portrait] = q('[data-hero="portrait"]');
    if (!name || !portrait) return;

    const tween = { duration: 1.4, ease: 'power3' };
    const layers = [
      { x: gsap.quickTo(name, 'x', tween), y: gsap.quickTo(name, 'y', tween), shift: NAME_SHIFT },
      {
        x: gsap.quickTo(portrait, 'x', tween),
        y: gsap.quickTo(portrait, 'y', tween),
        shift: PORTRAIT_SHIFT,
      },
    ];
    // Active whenever any part of the hero is on screen, the top of the page included.
    const inView = ScrollTrigger.create({
      trigger: root.current,
      start: 'top bottom',
      end: 'bottom top',
    });

    /** Pointer position from -1 to 1 on each axis; 0, 0 is the centre of the window. */
    const moveTo = (x: number, y: number) => {
      for (const layer of layers) {
        layer.x(x * layer.shift[0]);
        layer.y(y * layer.shift[1]);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!inView.isActive) return;
      moveTo(
        (event.clientX / window.innerWidth) * 2 - 1,
        (event.clientY / window.innerHeight) * 2 - 1,
      );
    };
    // Settles back when the pointer leaves the window.
    const onPointerLeave = () => moveTo(0, 0);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
    };
  });

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
