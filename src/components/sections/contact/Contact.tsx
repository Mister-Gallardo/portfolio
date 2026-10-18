import type { ReactNode } from 'react';
import { ArrowUpIcon, ArrowUpRightIcon } from '@/components/ui/icons';
import { site } from '@/content/site';
import { getDictionary } from '@/i18n/dictionary';
import { CopyButton } from './CopyButton';

export async function Contact() {
  const { contact, hero } = await getDictionary();

  const channels: { label: string; value: string; href: string; action: ReactNode }[] = [
    {
      label: contact.channels.telegram,
      value: site.telegram.handle,
      href: site.telegram.url,
      action: <ArrowUpRightIcon className="size-6" />,
    },
    {
      label: contact.channels.email,
      value: site.email,
      href: `mailto:${site.email}`,
      action: (
        <CopyButton value={site.email} labels={{ copy: contact.copy, copied: contact.copied }} />
      ),
    },
    {
      label: contact.channels.github,
      value: site.github.handle,
      href: site.github.url,
      action: <ArrowUpRightIcon className="size-6" />,
    },
  ];

  return (
    <section
      id="contact"
      data-surface="dark"
      aria-labelledby="contact-title"
      className="grain bg-surface pt-[clamp(6rem,12vw,11rem)] text-fg"
    >
      <div className="shell">
        <h2 id="contact-title" className="max-w-[12ch] font-light font-serif text-title">
          {contact.title}
        </h2>
        <p className="mt-6 max-w-[40ch] font-light text-lead text-muted">{contact.text}</p>

        <ul className="mt-16 border-line border-t">
          {channels.map(({ label, value, href, action }) => {
            const external = href.startsWith('http');
            return (
              <li
                key={label}
                className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 border-line border-b py-6 md:grid-cols-12"
              >
                <span className="label col-span-2 md:col-span-3">{label}</span>
                <a
                  href={href}
                  {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                  className="wrap-break-word min-w-0 font-light font-serif text-[clamp(1.5rem,3.6vw,3rem)] lining-nums leading-tight underline decoration-1 decoration-transparent underline-offset-[0.2em] transition-[text-decoration-color] duration-300 hover:decoration-current md:col-span-8"
                >
                  {value}
                </a>
                <span className="justify-self-end text-muted md:col-span-1">{action}</span>
              </li>
            );
          })}
        </ul>

        <footer className="flex flex-col gap-4 py-10 text-muted text-small md:flex-row md:items-center md:justify-between">
          <p>
            © {site.publishedYear} {hero.firstName} {hero.lastName}
          </p>
          <p>{contact.colophon}</p>
          <a href="#top" className="inline-flex items-center gap-2 transition-colors hover:text-fg">
            {contact.backToTop}
            <ArrowUpIcon className="size-4" />
          </a>
        </footer>
      </div>
    </section>
  );
}
