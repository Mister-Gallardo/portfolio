'use client';

import clsx from 'clsx';
import { type ElementType, useRef } from 'react';
import { media } from '@/lib/media';
import { useMotion } from '@/lib/motion';
import styles from './RevealText.module.css';

type Effect = 'focus' | 'rise';

type Props = {
  children: string;
  className?: string;
  as?: ElementType;
  id?: string;
  /**
   * `focus`: the text sharpens from a blur while its words light up one by one.
   * `rise`: lines float up one after another, fading in as they come.
   */
  effect: Effect;
  /**
   * The element the scroll range refers to: the text itself by default, or its closest
   * ancestor matching this selector. Text inside a sticky element needs an ancestor
   * that scrolls normally, because ScrollTrigger measures positions once.
   */
  trigger?: string;
  /** ScrollTrigger start and end; the defaults suit text that scrolls normally. */
  start?: string;
  end?: string;
};

/** Large screens with motion allowed: the split-text effects. */
const WIDE = `${media.wide} and ${media.motion}`;

const RANGE: Record<Effect, { start: string; end: string }> = {
  focus: { start: 'top 85%', end: 'bottom 50%' },
  rise: { start: 'top 90%', end: 'bottom 62%' },
};

/** `focus`: how long one word takes to light up, and the delay to the next one. */
const WORD = 0.5;
const STAGGER = 0.04;

/**
 * Scroll-scrubbed text reveal. The text is fully visible in the server HTML and stays so
 * with reduced motion. Large screens split it into words or lines with GSAP; smaller ones
 * get a light fade-up in CSS (see RevealText.module.css), with no script at all.
 */
export function RevealText({
  children,
  className,
  as: Tag = 'p',
  id,
  effect,
  trigger,
  start = RANGE[effect].start,
  end = RANGE[effect].end,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useMotion(
    WIDE,
    ({ gsap, SplitText }) => {
      const element = ref.current;
      if (!element) return;
      const scrollTrigger = {
        trigger: (trigger && element.closest(trigger)) || element,
        start,
        end,
        scrub: true,
      };

      const split = SplitText.create(element, {
        type: effect === 'focus' ? 'lines,words' : 'lines',
        autoSplit: true,
        // Keeps the non-breaking spaces set by typeset(): by default SplitText collapses
        // all whitespace into plain spaces, and short words would hang at line ends again.
        reduceWhiteSpace: false,
        // Words and lines stay in reading order, so screen readers read them as plain text;
        // the default aria-label is not allowed on paragraphs.
        aria: 'none',
        onSplit: (self) => {
          if (effect === 'focus') {
            // Words light up one after another, and each line stays blurred until its
            // words do, so the lines further down look just as faint until their turn.
            const timeline = gsap
              .timeline({ defaults: { ease: 'none' }, scrollTrigger })
              .fromTo(
                self.words,
                { opacity: 0.12 },
                { opacity: 1, duration: WORD, stagger: STAGGER },
                0,
              );
            let passed = 0;
            for (const line of self.lines) {
              const count = self.words.filter((word) => line.contains(word)).length;
              timeline.fromTo(
                line,
                { filter: 'blur(6px)' },
                { filter: 'blur(0px)', duration: count * STAGGER + WORD },
                passed * STAGGER,
              );
              passed += count;
            }
            return timeline;
          }
          return gsap.fromTo(
            self.lines,
            { opacity: 0, yPercent: 80 },
            {
              // Opacity rather than autoAlpha: hidden lines stay readable by screen readers.
              opacity: 1,
              yPercent: 0,
              ease: 'power2.out',
              stagger: 0.16,
              scrollTrigger,
            },
          );
        },
      });

      return () => split.revert();
    },
    [effect, trigger, start, end],
  );

  return (
    <Tag ref={ref} id={id} className={clsx(styles.text, className)}>
      {children}
    </Tag>
  );
}
