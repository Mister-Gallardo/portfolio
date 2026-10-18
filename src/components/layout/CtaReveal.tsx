'use client';

import { type ReactNode, useEffect, useRef } from 'react';

/**
 * Shows its content once the buttons of the hero (marked with `data-hero-cta`) have
 * scrolled away, and hides it again over the contact section, where the same links are
 * already on screen. While hidden it is inert, so it can't be focused.
 *
 * Both checks compare with the edges of the observed area (`rootBounds`), not of the
 * screen: the hero buttons leave that area while their top may still be on screen.
 */
export function CtaReveal({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    const heroCta = document.querySelector('[data-hero-cta]');
    const contact = document.getElementById('contact');
    if (!element || !heroCta || !contact) return;

    let pastHero = false;
    let atContact = false;
    const update = () => {
      const visible = pastHero && !atContact;
      element.toggleAttribute('data-visible', visible);
      element.inert = !visible;
    };

    /** Whether a target that does not intersect lies above the observed area. */
    const isAbove = (entry: IntersectionObserverEntry) =>
      entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0);

    // The hero's buttons count as gone once they rise into the top tenth of the viewport,
    // under the header.
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        pastHero = !!entry && !entry.isIntersecting && isAbove(entry);
        update();
      },
      { rootMargin: '-10% 0px 0px 0px' },
    );

    // The contact section counts once its top edge passes 80% of the viewport.
    const contactObserver = new IntersectionObserver(
      ([entry]) => {
        atContact = !!entry && (entry.isIntersecting || isAbove(entry));
        update();
      },
      { rootMargin: '0px 0px -20% 0px' },
    );

    heroObserver.observe(heroCta);
    contactObserver.observe(contact);
    return () => {
      heroObserver.disconnect();
      contactObserver.disconnect();
    };
  }, []);

  return (
    <div ref={ref} inert className={className}>
      {children}
    </div>
  );
}
