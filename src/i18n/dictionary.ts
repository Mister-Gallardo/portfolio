import { notFound } from 'next/navigation';
import { locale as localeParam } from 'next/root-params';
import { cache } from 'react';
import type { Dictionary } from '@/content/types';
import { typesetDeep } from '@/lib/text';
import { isLocale, type Locale } from './config';

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  ru: () => import('@/content/ru').then((module) => module.ru),
  en: () => import('@/content/en').then((module) => module.en),
};

/** All user-facing text for a locale, typeset for print-like line breaks. */
export const loadDictionary = cache(
  async (locale: Locale): Promise<Dictionary> => typesetDeep(await dictionaries[locale](), locale),
);

/** Locale of the current route, read from the `[locale]` root segment. */
export async function getLocale(): Promise<Locale> {
  const value = await localeParam();
  if (!isLocale(value)) notFound();
  return value;
}

/** Dictionary for the current route; usable from any Server Component without props. */
export async function getDictionary(): Promise<Dictionary> {
  return loadDictionary(await getLocale());
}
