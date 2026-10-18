import type { Metadata, Viewport } from 'next';
import { SmoothScroll } from '@/components/providers/SmoothScroll';
import { site } from '@/content/site';
import { defaultLocale, localePath, locales, localeTags } from '@/i18n/config';
import { getDictionary, getLocale } from '@/i18n/dictionary';
import { sans, serif } from '../fonts';
import '../globals.css';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Only the locales above exist; anything else is a 404 without rendering.
export const dynamicParams = false;

export async function generateMetadata(): Promise<Metadata> {
  const [locale, dictionary] = await Promise.all([getLocale(), getDictionary()]);
  const { title, description } = dictionary.meta;
  const author = `${dictionary.hero.firstName} ${dictionary.hero.lastName}`;

  return {
    metadataBase: new URL(site.url),
    title,
    description,
    applicationName: author,
    authors: [{ name: author, url: site.url }],
    creator: author,
    alternates: {
      canonical: localePath(locale),
      languages: {
        ...Object.fromEntries(locales.map((l) => [localeTags[l].lang, localePath(l)])),
        'x-default': localePath(defaultLocale),
      },
    },
    openGraph: {
      type: 'profile',
      url: localePath(locale),
      siteName: author,
      title,
      description,
      locale: localeTags[locale].og,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeTags[l].og),
      firstName: dictionary.hero.firstName,
      lastName: dictionary.hero.lastName,
    },
    twitter: { card: 'summary_large_image', title, description },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: '#15130f',
  colorScheme: 'dark light',
};

export default async function LocaleLayout({ children }: LayoutProps<'/[locale]'>) {
  const locale = await getLocale();

  return (
    <html lang={localeTags[locale].lang} className={`${serif.variable} ${sans.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
