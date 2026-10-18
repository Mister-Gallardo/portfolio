'use client';

import Image, { type StaticImageData } from 'next/image';
import {
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useScrollLock } from '@/components/providers/SmoothScroll';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from '@/components/ui/icons';
import { format } from '@/lib/text';
import styles from './ProjectGallery.module.css';

export type GalleryShot = {
  id: string;
  image: StaticImageData;
  /** Pixels per CSS pixel of the file; see `Screenshot.density`. */
  density: number;
  caption: string;
};

export type GalleryLabels = {
  close: string;
  previous: string;
  next: string;
  position: string;
  actualSize: string;
  fitToScreen: string;
  note: string;
};

type Props = {
  title: string;
  shots: readonly GalleryShot[];
  /** Index of the open screenshot, `null` while the gallery is closed. */
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  labels: GalleryLabels;
};

/** A point of the image as shares of its size, and where it was on screen. */
type Anchor = { x: number; y: number; clientX: number; clientY: number };

const SWIPE_THRESHOLD = 48;

/** Whether the image shows smaller than its actual size, i.e. whether zooming helps. */
const isScaledDown = (image: HTMLImageElement | null, actualWidth: number) => {
  const width = image?.clientWidth ?? 0;
  return width > 0 && width < actualWidth - 1;
};

/**
 * Full-screen screenshot viewer on the native <dialog>: focus trapping, Esc to close
 * and the inert page behind it come from the browser. Arrow keys and swipes switch
 * images.
 *
 * Screenshots are shown as sharp as their files allow: the original file rather than
 * a re-encoded copy, never enlarged beyond its own size, and, when the screen is too
 * small for an image, a toggle to view it at actual size around the clicked spot.
 */
export function ProjectGallery({ title, shots, index, onIndexChange, onClose, labels }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const picture = useRef<HTMLImageElement>(null);
  const swipeStart = useRef<number | null>(null);
  const anchor = useRef<Anchor | null>(null);
  // Tied to the image index, so every image opens fitted to the screen.
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);
  const [scaledDown, setScaledDown] = useState(false);
  const open = index !== null;
  const shot = open ? shots[index] : undefined;
  const zoomed = open && zoomedIndex === index;
  const actualWidth = shot ? shot.image.width / shot.density : 0;
  const canZoom = zoomed || scaledDown;

  useScrollLock(open);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) {
      element.showModal();
      // Start on the close button rather than "previous", the first control in the toolbar.
      closeButton.current?.focus();
    }
    if (!open && element.open) element.close();
  }, [open]);

  // The neighbours load in the background, so switching images is instant.
  useEffect(() => {
    if (index === null) return;
    const count = shots.length;
    const neighbours = new Set([shots[(index + 1) % count], shots[(index - 1 + count) % count]]);
    for (const neighbour of neighbours) {
      if (neighbour && neighbour !== shots[index]) new window.Image().src = neighbour.image.src;
    }
  }, [index, shots]);

  // Checked when the screen resizes and once each image has loaded.
  const measure = () => setScaledDown(isScaledDown(picture.current, actualWidth));

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const observer = new ResizeObserver(() =>
      setScaledDown(isScaledDown(picture.current, actualWidth)),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [actualWidth]);

  // After zooming in, scrolls so that the clicked spot stays under the pointer.
  useLayoutEffect(() => {
    const element = viewport.current;
    const target = anchor.current;
    const image = picture.current;
    anchor.current = null;
    if (!zoomed || !element || !target || !image) return;
    const box = element.getBoundingClientRect();
    element.scrollTo({
      left: target.x * image.offsetWidth - (target.clientX - box.left),
      top: target.y * image.offsetHeight - (target.clientY - box.top),
    });
  }, [zoomed]);

  const go = (delta: number) => {
    if (index === null) return;
    onIndexChange((index + delta + shots.length) % shots.length);
  };

  const toggleZoom = (event?: MouseEvent<HTMLElement>) => {
    if (!canZoom || index === null) return;
    const image = picture.current;
    if (!zoomed && event && image && event.currentTarget === image) {
      const box = image.getBoundingClientRect();
      anchor.current = {
        x: (event.clientX - box.left) / box.width,
        y: (event.clientY - box.top) / box.height,
        clientX: event.clientX,
        clientY: event.clientY,
      };
    }
    setZoomedIndex(zoomed ? null : index);
  };

  const onPointerDown = (event: PointerEvent) => {
    swipeStart.current = event.clientX;
  };

  const onPointerUp = (event: PointerEvent) => {
    if (swipeStart.current === null) return;
    const distance = event.clientX - swipeStart.current;
    swipeStart.current = null;
    // Swipes switch images on touch screens; a zoomed image pans instead.
    if (event.pointerType !== 'mouse' && !zoomed && Math.abs(distance) > SWIPE_THRESHOLD) {
      go(distance < 0 ? 1 : -1);
    }
  };

  return (
    <dialog
      ref={dialog}
      aria-label={title}
      className={styles.dialog}
      onClose={onClose}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') go(1);
        if (event.key === 'ArrowLeft') go(-1);
      }}
    >
      {shot && index !== null && (
        <div className={styles.frame}>
          <div className={styles.toolbar}>
            <p className="label" aria-live="polite">
              {format(labels.position, { current: index + 1, total: shots.length })}
            </p>
            <div className={styles.controls}>
              {canZoom && (
                <button
                  type="button"
                  className={styles.control}
                  aria-label={zoomed ? labels.fitToScreen : labels.actualSize}
                  aria-pressed={zoomed}
                  onClick={() => toggleZoom()}
                >
                  {zoomed ? <ZoomOutIcon /> : <ZoomInIcon />}
                </button>
              )}
              {shots.length > 1 && (
                <>
                  <button
                    type="button"
                    className={styles.control}
                    aria-label={labels.previous}
                    onClick={() => go(-1)}
                  >
                    <ChevronLeftIcon />
                  </button>
                  <button
                    type="button"
                    className={styles.control}
                    aria-label={labels.next}
                    onClick={() => go(1)}
                  >
                    <ChevronRightIcon />
                  </button>
                </>
              )}
              <button
                ref={closeButton}
                type="button"
                className={styles.control}
                aria-label={labels.close}
                onClick={() => dialog.current?.close()}
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* data-lenis-prevent lets a zoomed image scroll while smooth scrolling is stopped. */}
          <div
            ref={viewport}
            data-lenis-prevent
            data-zoomed={zoomed || undefined}
            className={styles.viewport}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            {/* Clicking is a pointer shortcut; the toolbar button does the same for the keyboard. */}
            <Image
              ref={picture}
              key={shot.id}
              src={shot.image}
              alt={shot.caption}
              // The original file: a second lossy encoding would soften the small text.
              unoptimized
              loading="eager"
              fetchPriority="high"
              className={styles.image}
              data-zoomable={canZoom || undefined}
              style={{ '--actual-width': `${actualWidth}px` } as CSSProperties}
              onLoad={measure}
              onClick={toggleZoom}
            />
          </div>

          <div className={styles.footer}>
            <p className="max-w-[60ch] text-small">{shot.caption}</p>
            <p className="text-caption text-muted">{labels.note}</p>
          </div>
        </div>
      )}
    </dialog>
  );
}
