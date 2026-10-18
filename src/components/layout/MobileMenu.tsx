'use client';

import { type ReactNode, useEffect, useRef } from 'react';
import { CloseIcon, MenuIcon } from '@/components/ui/icons';
import type { SectionId } from '@/content/types';
import { media, whileMatches } from '@/lib/media';
import styles from './MobileMenu.module.css';

type Props = {
  title: string;
  labels: { open: string; close: string; nav: string };
  sections: readonly { id: SectionId; label: string }[];
  /** Rendered at the bottom of the menu, e.g. the language switch. */
  footer: ReactNode;
};

const MENU_ID = 'mobile-menu';

/** Full-screen menu for small screens, built on the Popover API: no state, Esc and focus handled natively. */
export function MobileMenu({ title, labels, sections, footer }: Props) {
  const menu = useRef<HTMLDivElement>(null);

  // The menu belongs to the small-screen layout. Leaving it (a rotated tablet, a
  // resized window) closes the menu rather than leaving it open but hidden.
  useEffect(
    () =>
      whileMatches(media.wide, () => {
        if (menu.current?.matches(':popover-open')) menu.current.hidePopover();
        return undefined;
      }),
    [],
  );

  return (
    <>
      <button
        type="button"
        popoverTarget={MENU_ID}
        className="-mr-2 flex items-center gap-2 p-2 text-small"
      >
        {labels.open}
        <MenuIcon className="size-5" />
      </button>

      {/* data-lenis-prevent: smooth scrolling (a narrow window with a mouse) leaves the
          wheel to the menu, so the locked page behind it stays still. */}
      <div
        id={MENU_ID}
        ref={menu}
        popover="auto"
        data-surface="dark"
        data-lenis-prevent
        className={styles.menu}
      >
        <div className="shell flex min-h-full flex-col pb-8">
          <div className="flex h-(--header-h) items-center justify-between">
            <span className="font-serif text-2xl italic">{title}</span>
            <button
              type="button"
              popoverTarget={MENU_ID}
              popoverTargetAction="hide"
              aria-label={labels.close}
              className="-mr-2 p-2"
            >
              <CloseIcon className="size-6" />
            </button>
          </div>

          <nav aria-label={labels.nav} className="mt-10 flex-1">
            <ol className="grid gap-1">
              {sections.map(({ id, label }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={() => menu.current?.hidePopover()}
                    className="block border-line border-b py-3 font-light font-serif text-[2.5rem] leading-tight"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-10">{footer}</div>
        </div>
      </div>
    </>
  );
}
