'use client';

import { type ReactNode, useEffect, useRef } from 'react';
import { media, whileMatches } from '@/lib/media';
import { useMotion } from '@/lib/motion';

/**
 * Where the head of the thread sits, as a share of the stage width. Keep in sync with
 * --head in Experience.module.css.
 */
const HEAD = 0.5;
/** The vertical layout, the counterpart of `media.desktop`, with motion allowed. */
const VERTICAL = `${media.motion} and ((width < 64rem) or (height < 40rem))`;

const findAll = (root: Element, name: string) => [
  ...root.querySelectorAll<HTMLElement>(`[data-timeline="${name}"]`),
];

const light = (stop: Element, on: boolean) => {
  stop.toggleAttribute('data-lit', on);
};

const lightAll = (stops: readonly Element[], on: boolean) => {
  for (const stop of stops) light(stop, on);
};

/** Shows line `current` under the heading; the others wait above or below it. */
const showLine = (lines: readonly HTMLElement[], current: number) => {
  lines.forEach((line, index) => {
    line.dataset.state = index < current ? 'past' : index === current ? 'current' : 'future';
  });
};

/**
 * Drives the career timeline. On large screens vertical scroll moves the track
 * sideways and the brass thread follows it. When its head reaches a stop, the dot
 * lights up, the stem grows down the card, the card fades in and the line under the
 * heading switches to that chapter; past the last stop it shows the closing line. In
 * the vertical layout stops light up as they pass, which needs no GSAP; with reduced
 * motion they are all lit.
 */
export function TimelineMotion({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = stage.current;
    if (!root) return;
    const stops = findAll(root, 'item');

    const stopReduced = whileMatches(media.reduced, () => {
      lightAll(stops, true);
      return () => lightAll(stops, false);
    });

    // A stop lights up once it passes 70% of the viewport height.
    const stopVertical = whileMatches(VERTICAL, () => {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            light(entry.target, entry.isIntersecting || entry.boundingClientRect.top < 0);
          }
        },
        { rootMargin: '0px 0px -30% 0px' },
      );
      for (const stop of stops) observer.observe(stop);
      return () => {
        observer.disconnect();
        lightAll(stops, false);
      };
    });

    return () => {
      stopReduced();
      stopVertical();
    };
  }, []);

  useMotion(media.desktop, ({ gsap }) => {
    const root = stage.current;
    const section = root?.parentElement;
    const track = root?.querySelector<HTMLElement>('[data-timeline="track"]');
    const thread = root?.querySelector<SVGElement>('[data-timeline="lit"]');
    if (!root || !section || !track || !thread) return;

    const stops = findAll(root, 'item');
    const lines = findAll(root, 'line');
    const reveals = stops.map((stop) =>
      gsap
        .timeline({ paused: true })
        .fromTo(
          stop.querySelector('[data-timeline="stem"]'),
          { scaleY: 0 },
          { scaleY: 1, duration: 0.9, ease: 'power2.inOut' },
          0,
        )
        .fromTo(
          stop.querySelector('[data-timeline="card"]'),
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          0.2,
        ),
    );

    // Layout is read on refresh only, never while scrolling.
    let travel = 0;
    let width = 1;
    let headStart = 0;
    /** Head positions at which each stop is reached, then the closing line. */
    let marks: number[] = [];

    const measure = () => {
      // The section is taller than the stage by exactly the sideways travel (--travel).
      travel = Math.max(0, section.offsetHeight - root.offsetHeight);
      width = track.offsetWidth || 1;
      // The head in track coordinates; the track starts shifted (see .track).
      headStart = root.clientWidth * HEAD - track.offsetLeft;
      const reached = stops.map((stop) => stop.offsetLeft);
      const last = reached.at(-1) ?? 0;
      // The closing line appears halfway between the last stop and the end.
      marks = [...reached, (last + headStart + travel) / 2];
    };

    let chapter = -1;
    const show = (next: number) => {
      if (next === chapter) return;
      chapter = next;
      stops.forEach((stop, index) => {
        const on = index < next;
        if (stop.hasAttribute('data-lit') === on) return;
        light(stop, on);
        if (on) reveals[index]?.play();
        else reveals[index]?.reverse();
      });
      // Line 0 is the intro, line n is the n-th stop, the last one closes the path.
      showLine(lines, next);
    };

    const update = (progress: number) => {
      const head = headStart + progress * travel;
      thread.style.setProperty('--lit', (head / width).toFixed(4));
      show(marks.filter((mark) => mark <= head).length);
    };

    measure();
    gsap.fromTo(
      track,
      { x: 0 },
      {
        x: () => -travel,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
          onRefreshInit: measure,
          onRefresh: ({ progress }) => update(progress),
          onUpdate: ({ progress }) => update(progress),
        },
      },
    );

    return () => {
      thread.style.removeProperty('--lit');
      lightAll(stops, false);
      showLine(lines, 0);
    };
  });

  return (
    <div ref={stage} className={className}>
      {children}
    </div>
  );
}
