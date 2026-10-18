import { Header } from '@/components/layout/Header';
import { StickyCta } from '@/components/layout/StickyCta';
import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/contact/Contact';
import { Experience } from '@/components/sections/experience/Experience';
import { Faq } from '@/components/sections/faq/Faq';
import { Hero } from '@/components/sections/hero/Hero';
import { Projects } from '@/components/sections/projects/Projects';
import { Stack } from '@/components/sections/Stack';
import { PersonJsonLd } from '@/components/seo/PersonJsonLd';
import { getDictionary } from '@/i18n/dictionary';

// The whole page is prerendered at build time; the build fails if anything here
// ever starts depending on request-time data.
export const dynamic = 'error';

export default async function HomePage() {
  const { nav } = await getDictionary();

  return (
    <>
      <a
        href="#content"
        className="sr-only z-50 bg-fg px-4 py-3 text-surface focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {nav.skipToContent}
      </a>
      <Header />
      <main id="content">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Stack />
        <Faq />
        <Contact />
      </main>
      <StickyCta />
      <PersonJsonLd />
    </>
  );
}
