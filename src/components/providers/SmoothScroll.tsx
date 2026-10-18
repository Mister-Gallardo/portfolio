'use client';

import type Lenis from 'lenis';
import { createContext, type ReactNode, type RefObject, use, useEffect, useRef } from 'react';
import { deferUntilIdle } from '@/lib/idle';
import { media } from '@/lib/media';
import { loadMotion } from '@/lib/motion';

const LenisContext = createContext<RefObject<Lenis | null> | null>(null);

/**
 * Smooth wheel scrolling driven by GSAP's ticker, so Lenis and ScrollTrigger share one
 * frame loop. Only for mouse and trackpad users: touch devices already have momentum
 * scrolling, and visitors who prefer reduced motion keep the native behaviour. Both
 * libraries load once the page is idle; until then the native scroll works as usual.
 * In-page anchor links are smoothed by Lenis and still work without JavaScript.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!window.matchMedia(media.pointer).matches) return;
    let disposed = false;
    let stop: (() => void) | undefined;

    const cancel = deferUntilIdle(async () => {
      const [lenisModule, { gsap, ScrollTrigger }] = await Promise.all([
        import('lenis'),
        loadMotion(),
      ]);
      if (disposed) return;

      const lenis = new lenisModule.default({ autoRaf: false, anchors: true, lerp: 0.1 });
      const tick = (time: number) => lenis.raf(time * 1000);

      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      lenisRef.current = lenis;

      stop = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        lenisRef.current = null;
      };
    });

    return () => {
      disposed = true;
      cancel();
      stop?.();
    };
  }, []);

  return <LenisContext value={lenisRef}>{children}</LenisContext>;
}

/** Stops smooth scrolling while `locked` is true, e.g. when a modal dialog is open. */
export function useScrollLock(locked: boolean) {
  const lenisRef = use(LenisContext);

  useEffect(() => {
    if (!locked) return;
    const lenis = lenisRef?.current;
    lenis?.stop();
    return () => lenis?.start();
  }, [locked, lenisRef]);
}
