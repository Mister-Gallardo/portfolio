import type { PluralForms } from '@/content/types';
import type { Locale } from '@/i18n/config';

const NBSP = ' ';

/** One- and two-letter Russian words (prepositions, conjunctions) that must not end a line. */
const RU_SHORT_WORD = /(^|[\s(«„"])([а-яё]{1,2})\s+/giu;
const NUMBER_BEFORE_WORD = /(\d)\s+(?=[^\s\d—–-])/gu;
const SPACE_BEFORE_DASH = /\s+(—|–)/gu;

/**
 * Applies the typographic rules a typesetter would: no dash at the start of a line,
 * no number separated from its unit, and, for Russian, no hanging short words.
 */
export function typeset(text: string, locale: Locale): string {
  let result = text
    .replace(SPACE_BEFORE_DASH, `${NBSP}$1`)
    .replace(NUMBER_BEFORE_WORD, `$1${NBSP}`);
  if (locale === 'ru') {
    // Twice, so that runs like "и в" are glued together as well.
    result = result.replace(RU_SHORT_WORD, `$1$2${NBSP}`).replace(RU_SHORT_WORD, `$1$2${NBSP}`);
  }
  return result;
}

/** Recursively typesets every string in a plain data structure. */
export function typesetDeep<T>(value: T, locale: Locale): T {
  if (typeof value === 'string') return typeset(value, locale) as T;
  if (Array.isArray(value)) return value.map((item: unknown) => typesetDeep(item, locale)) as T;
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, typesetDeep(item, locale)]),
    ) as T;
  }
  return value;
}

/** Replaces `{name}` placeholders with values. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/** Picks the plural form for a count using the locale's CLDR rules. */
export function plural(locale: Locale, count: number, forms: PluralForms): string {
  const category = new Intl.PluralRules(locale).select(count);
  return forms[category] ?? forms.other;
}
