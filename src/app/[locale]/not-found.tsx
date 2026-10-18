import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/Button';
import { localePath } from '@/i18n/config';
import { getDictionary, getLocale } from '@/i18n/dictionary';

export async function generateMetadata(): Promise<Metadata> {
  const { notFound, hero } = await getDictionary();
  return { title: `${notFound.title} — ${hero.firstName} ${hero.lastName}` };
}

export default async function NotFound() {
  const [{ notFound }, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <main
      data-surface="dark"
      className="grain grid min-h-svh place-content-center bg-surface px-(--gutter) text-center text-fg"
    >
      <p className="font-light font-serif text-[clamp(6rem,20vw,14rem)] text-accent lining-nums leading-none">
        404
      </p>
      <h1 className="mt-6 font-light font-serif text-heading">{notFound.title}</h1>
      <p className="mx-auto mt-4 max-w-[40ch] text-muted">{notFound.text}</p>
      <ButtonLink href={localePath(locale)} className="mx-auto mt-10">
        {notFound.back}
      </ButtonLink>
    </main>
  );
}
