import portrait from '@/assets/images/portrait.png';
import { site } from '@/content/site';
import { skillGroups } from '@/content/skills';
import { localePath } from '@/i18n/config';
import { getDictionary, getLocale } from '@/i18n/dictionary';

/** schema.org Person data for search engines. */
export async function PersonJsonLd() {
  const [{ hero, experience }, locale] = await Promise.all([getDictionary(), getLocale()]);
  const core = skillGroups.find((group) => group.id === 'core')?.items ?? [];

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: `${hero.firstName} ${hero.lastName}`,
    jobTitle: hero.role,
    url: new URL(localePath(locale), site.url).href,
    image: new URL(portrait.src, site.url).href,
    email: `mailto:${site.email}`,
    sameAs: [site.github.url, site.telegram.url],
    knowsAbout: core,
    alumniOf: { '@type': 'CollegeOrUniversity', name: experience.entries.bachelor.org },
    address: { '@type': 'PostalAddress', addressCountry: 'RU' },
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD has to be inlined as raw text. Escaping "<" keeps it from closing the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
