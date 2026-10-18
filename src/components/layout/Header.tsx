import { sectionIds } from '@/content/types';
import { getDictionary, getLocale } from '@/i18n/dictionary';
import styles from './Header.module.css';
import { LanguageSwitch } from './LanguageSwitch';
import { MobileMenu } from './MobileMenu';
import { SectionNav } from './SectionNav';
import { SurfaceFollower } from './SurfaceFollower';

export async function Header() {
  const [{ nav, hero }, locale] = await Promise.all([getDictionary(), getLocale()]);
  const sections = sectionIds.map((id) => ({ id, label: nav.sections[id] }));
  const name = `${hero.firstName} ${hero.lastName}`;

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <SurfaceFollower
        probe={{ edge: 'top', offset: 36 }}
        className="text-fg transition-colors duration-300"
      >
        <span aria-hidden="true" className={styles.scrim} />
        <span aria-hidden="true" className={styles.progress} />
        <div className="shell flex h-(--header-h) items-center justify-between gap-6 lg:grid lg:grid-cols-12 lg:items-stretch">
          <a
            href="#top"
            aria-label={nav.home}
            className="relative flex items-center font-serif text-2xl italic leading-none lg:col-span-3"
          >
            {name}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 hidden h-px bg-line lg:block"
            />
          </a>

          <div className="hidden lg:col-span-8 lg:block">
            <SectionNav label={nav.label} sections={sections} />
          </div>

          <LanguageSwitch
            current={locale}
            label={nav.language}
            className="hidden lg:col-span-1 lg:flex lg:justify-end"
          />

          <div className="lg:hidden">
            <MobileMenu
              title={name}
              labels={{ open: nav.menu, close: nav.closeMenu, nav: nav.label }}
              sections={sections}
              footer={<LanguageSwitch current={locale} label={nav.language} />}
            />
          </div>
        </div>
      </SurfaceFollower>
    </header>
  );
}
