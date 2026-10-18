'use client';

import Image from 'next/image';
import { type ReactNode, useState } from 'react';
import { PointerParallax } from '@/components/motion/PointerParallax';
import { Button } from '@/components/ui/Button';
import { ExpandIcon } from '@/components/ui/icons';
import { type GalleryLabels, type GalleryShot, ProjectGallery } from './ProjectGallery';
import styles from './ProjectMedia.module.css';

type Props = {
  title: string;
  device: 'desktop' | 'phone';
  /** Every screenshot, in gallery order. */
  shots: readonly GalleryShot[];
  /** Places in `shots` of the images on the card, back to front. */
  cover: readonly number[];
  openLabel: string;
  labels: GalleryLabels;
  /** Rendered between the screenshots and the gallery button, e.g. the stack list. */
  children?: ReactNode;
};

/** Screenshots carry small text, so they get a higher quality than the default 75. */
const QUALITY = 90;

/**
 * Screenshots on the card, by how many of them there are: how far each layer drifts
 * with the pointer (its depth) and how wide it renders. Positions live in the CSS.
 */
const LAYERS: Record<number, readonly { strength: number; sizes: string }[]> = {
  1: [{ strength: 6, sizes: '(min-width: 64rem) 42vw, 90vw' }],
  2: [
    { strength: 6, sizes: '(min-width: 64rem) 42vw, 90vw' },
    { strength: 14, sizes: '(min-width: 64rem) 28vw, 60vw' },
  ],
  3: [
    { strength: 6, sizes: '(min-width: 64rem) 36vw, 76vw' },
    { strength: 14, sizes: '(min-width: 64rem) 28vw, 60vw' },
    { strength: 10, sizes: '(min-width: 64rem) 18vw, 40vw' },
  ],
};

/**
 * Up to three overlapping screenshots, or a phone, drifting with the pointer at
 * different depths. A screenshot opens the full-screen gallery on itself, the button
 * at the beginning.
 */
export function ProjectMedia({ title, device, shots, cover, openLabel, labels, children }: Props) {
  const [index, setIndex] = useState<number | null>(null);
  const covers = cover.flatMap((position) => {
    const shot = shots[position];
    return shot ? [{ shot, position }] : [];
  });
  const [first] = covers;
  if (!first) return null;

  const layers = LAYERS[covers.length] ?? [];

  return (
    <>
      {device === 'phone' ? (
        <div className={styles.phoneStage}>
          <PointerParallax strength={10} className={styles.phoneDrift}>
            <button
              type="button"
              aria-haspopup="dialog"
              className={styles.phone}
              onClick={() => setIndex(first.position)}
            >
              <span className={styles.screen}>
                <Image
                  src={first.shot.image}
                  alt={first.shot.caption}
                  quality={QUALITY}
                  sizes="(min-width: 64rem) 20rem, 60vw"
                />
              </span>
            </button>
          </PointerParallax>
        </div>
      ) : (
        <div className={styles.media}>
          <div className={styles.frame} data-count={covers.length}>
            {covers.map(({ shot, position }, layer) => (
              <PointerParallax
                key={shot.id}
                strength={layers[layer]?.strength}
                className={styles.layer}
              >
                <button
                  type="button"
                  aria-haspopup="dialog"
                  className={styles.shot}
                  onClick={() => setIndex(position)}
                >
                  <Image
                    src={shot.image}
                    alt={shot.caption}
                    quality={QUALITY}
                    sizes={layers[layer]?.sizes}
                  />
                </button>
              </PointerParallax>
            ))}
          </div>
        </div>
      )}

      {children}

      <Button
        variant="outline"
        aria-haspopup="dialog"
        onClick={() => setIndex(0)}
        className="self-start"
      >
        <ExpandIcon className="size-4" />
        {openLabel}
      </Button>

      <ProjectGallery
        title={title}
        shots={shots}
        index={index}
        onIndexChange={setIndex}
        onClose={() => setIndex(null)}
        labels={labels}
      />
    </>
  );
}
