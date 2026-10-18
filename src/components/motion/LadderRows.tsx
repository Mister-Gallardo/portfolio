import clsx from 'clsx';
import type { ReactNode } from 'react';
import styles from './LadderRows.module.css';

/**
 * The content of rows marked with `data-ladder-row` slides in from alternating sides as
 * the rows scroll into view, scrubbed to the scroll position by a CSS scroll timeline.
 * Row borders stay put. Skipped on narrow screens, where rows already span the full width.
 */
export function LadderRows({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx(styles.ladder, className)}>{children}</div>;
}
