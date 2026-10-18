import type { MetadataRoute } from 'next';
import { site } from '@/content/site';
import { defaultLocale, localePath, locales, localeTags } from '@/i18n/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, site.url).href;
  // The same alternates as the pages declare in their metadata.
  const languages = {
    ...Object.fromEntries(
      locales.map((locale) => [localeTags[locale].lang, url(localePath(locale))]),
    ),
    'x-default': url(localePath(defaultLocale)),
  };

  return locales.map((locale) => ({
    url: url(localePath(locale)),
    changeFrequency: 'monthly',
    priority: locale === defaultLocale ? 1 : 0.8,
    alternates: { languages },
  }));
}
