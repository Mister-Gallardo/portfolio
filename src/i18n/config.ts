export const locales = ['ru', 'en'] as const;

export type Locale = (typeof locales)[number];

/**
 * The language served at "/". Every other locale lives under its own prefix ("/en").
 * Change it here and routing, metadata and the language switcher follow.
 */
export const defaultLocale: Locale = 'ru';

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** Public URL path of the home page in a given locale. */
export const localePath = (locale: Locale): string =>
  locale === defaultLocale ? '/' : `/${locale}`;

/** Each language's name in itself, as language switchers conventionally show it. */
export const localeNames: Record<Locale, string> = {
  ru: 'Русский',
  en: 'English',
};

/**
 * Language tags: `lang` for the `lang` attribute and hreflang (the language alone, so
 * the page targets its speakers in any country), `og` in the form Open Graph requires.
 */
export const localeTags: Record<Locale, { lang: string; og: string }> = {
  ru: { lang: 'ru', og: 'ru_RU' },
  en: { lang: 'en', og: 'en_US' },
};
