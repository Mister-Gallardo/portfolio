import { ButtonLink } from '@/components/ui/Button';
import { ArrowUpRightIcon } from '@/components/ui/icons';
import { site } from '@/content/site';
import { getDictionary } from '@/i18n/dictionary';
import { CtaReveal } from './CtaReveal';
import { SurfaceFollower } from './SurfaceFollower';

/**
 * Floating "message me" button that inverts its colours to stay visible on any section.
 * Centred on phones; in the corner on large screens, clear of the cards and their buttons.
 */
export async function StickyCta() {
  const { hero, availability } = await getDictionary();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-(--gutter) pb-[max(1rem,env(safe-area-inset-bottom))] lg:justify-end lg:pb-6">
      <SurfaceFollower probe={{ edge: 'bottom', offset: 40 }}>
        <CtaReveal className="pointer-events-auto flex translate-y-3 flex-col items-center gap-2 opacity-0 transition-[opacity,translate] duration-500 ease-(--ease-out-quart) data-visible:translate-y-0 data-visible:opacity-100 lg:items-end">
          {site.openToWork && (
            <p className="hidden items-center gap-2 text-caption text-muted transition-colors duration-300 lg:flex">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
              {availability}
            </p>
          )}
          <ButtonLink
            href={site.telegram.url}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            className="shadow-[0_0.75rem_2rem_-0.75rem_rgb(0_0_0/0.45)]"
          >
            {hero.contactCta}
            <ArrowUpRightIcon className="size-4" />
          </ButtonLink>
        </CtaReveal>
      </SurfaceFollower>
    </div>
  );
}
