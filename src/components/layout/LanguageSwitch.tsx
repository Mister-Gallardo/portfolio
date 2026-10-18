import clsx from 'clsx';
import { type Locale, localeNames, localePath, locales, localeTags } from '@/i18n/config';

type Props = {
  current: Locale;
  label: string;
  className?: string;
};

/** Plain links: switching language is rare, a full page load keeps every script in a clean state. */
export function LanguageSwitch({ current, label, className }: Props) {
  return (
    <nav aria-label={label} className={className}>
      <ul className="flex items-center gap-3">
        {locales.map((locale) => (
          <li key={locale}>
            <a
              href={localePath(locale)}
              hrefLang={localeTags[locale].lang}
              lang={localeTags[locale].lang}
              aria-current={locale === current ? 'page' : undefined}
              className={clsx(
                'block py-2 text-caption uppercase tracking-wide transition-colors duration-300',
                locale === current ? 'text-fg' : 'text-muted hover:text-fg',
              )}
            >
              {locale}
              {/* Read as "en — English"; the visible code stays in the name for voice control. */}
              <span className="sr-only"> — {localeNames[locale]}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
