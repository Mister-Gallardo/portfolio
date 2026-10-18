'use client';

import { useRef } from 'react';
import type { SectionId } from '@/content/types';
import { media } from '@/lib/media';
import { useMotion } from '@/lib/motion';

type Props = {
  label: string;
  sections: readonly { id: SectionId; label: string }[];
};

/**
 * Section links with a progress line under each: a line fills from the moment its
 * section reaches the middle of the viewport until the next one does, and the last
 * one until the end of the page, which it may never scroll to the middle. The link of
 * the section being read is marked as the current location. The navigation is only
 * shown on large screens, so that is the only place it tracks.
 */
export function SectionNav({ label, sections }: Props) {
  const list = useRef<HTMLOListElement>(null);

  useMotion(media.wide, ({ ScrollTrigger }) => {
    const entries = [...(list.current?.querySelectorAll<HTMLElement>('[data-section]') ?? [])]
      .map((item) => ({
        item,
        link: item.querySelector('a'),
        section: document.getElementById(item.dataset.section ?? ''),
      }))
      .filter((entry) => entry.link && entry.section);
    const progress = entries.map(() => 0);

    // The current section is the last one that has started, the end of the page included.
    const markCurrent = () => {
      const current = progress.findLastIndex((value) => value > 0);
      entries.forEach(({ link }, index) => {
        if (index === current) link?.setAttribute('aria-current', 'location');
        else link?.removeAttribute('aria-current');
      });
    };

    entries.forEach(({ item, section }, index) => {
      const next = entries[index + 1]?.section;
      ScrollTrigger.create({
        trigger: section,
        start: 'clamp(top center)',
        ...(next ? { endTrigger: next, end: 'clamp(top center)' } : { end: 'max' }),
        onUpdate: (self) => {
          progress[index] = self.progress;
          item.style.setProperty('--progress', self.progress.toFixed(4));
          markCurrent();
        },
      });
    });

    // The progress lives in inline styles and attributes, which reverting the GSAP
    // context does not touch. Without this, switching to the mobile layout and back
    // would show the old progress until each section is scrolled through again.
    return () => {
      for (const { item, link } of entries) {
        item.style.removeProperty('--progress');
        link?.removeAttribute('aria-current');
      }
    };
  });

  return (
    <nav aria-label={label}>
      <ol ref={list} className="grid grid-cols-6 gap-x-2">
        {sections.map(({ id, label: name }) => (
          <li key={id} data-section={id} className="relative">
            <a
              href={`#${id}`}
              className="group flex items-center gap-2 py-6 text-muted text-small transition-colors duration-300 hover:text-fg aria-[current]:text-fg"
            >
              <span
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-full border border-current transition-colors duration-300 group-aria-[current]:border-accent group-aria-[current]:bg-accent"
              />
              {name}
            </a>
            <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-line">
              <span className="block h-full origin-left scale-x-[var(--progress,0)] bg-fg" />
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
