import clsx from 'clsx';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import portrait from '@/assets/images/portrait.png';
import { ButtonLink } from '@/components/ui/Button';
import { ArrowDownIcon, ArrowUpRightIcon } from '@/components/ui/icons';
import { site } from '@/content/site';
import { getDictionary } from '@/i18n/dictionary';
import styles from './Hero.module.css';
import { HeroMotion } from './HeroMotion';
import { HeroShader } from './HeroShader';

const delay = (seconds: number) => ({ '--delay': `${seconds}s` }) as CSSProperties;

export async function Hero() {
  const { hero } = await getDictionary();

  return (
    <section id="top" data-surface="dark" aria-labelledby="hero-title" className={styles.hero}>
      <div className={styles.backdrop} aria-hidden="true">
        <HeroShader />
      </div>

      <HeroMotion className={styles.stage}>
        <p className={clsx(styles.meta, styles.fadeIn, 'label')} style={delay(0.45)}>
          <span>{hero.role}</span>
          <span>{hero.location}</span>
        </p>

        <h1 id="hero-title" data-hero="name" className={styles.name}>
          <span data-hero="first" className={styles.line}>
            <span className={styles.word}>{hero.firstName}</span>
          </span>{' '}
          <span data-hero="last" className={styles.line}>
            <span className={styles.word} style={delay(0.08)}>
              {hero.lastName}
            </span>
          </span>
        </h1>

        <div className={styles.portrait}>
          <div className={styles.portraitLayer}>
            <Image
              data-hero="portrait"
              src={portrait}
              alt={hero.portraitAlt}
              sizes="(min-width: 64rem) 50vw, 90vw"
              loading="eager"
              fetchPriority="high"
              placeholder="blur"
              className={styles.portraitImage}
            />
          </div>
        </div>

        <div data-hero="copy" className={styles.intro}>
          <div className={styles.fadeIn} style={delay(0.55)}>
            <p className={styles.lead}>{hero.intro}</p>
            <div data-hero-cta className={styles.actions}>
              <ButtonLink href={site.telegram.url} target="_blank" rel="noopener noreferrer">
                {hero.contactCta}
                <ArrowUpRightIcon className="size-4" />
              </ButtonLink>
              <ButtonLink href="#projects" variant="outline">
                {hero.projectsCta}
                <ArrowDownIcon className="size-4" />
              </ButtonLink>
            </div>
          </div>
        </div>

        <div data-hero="copy" className={styles.facts}>
          <div className={clsx(styles.fadeIn, 'label grid gap-1')} style={delay(0.65)}>
            <span className="text-fg">{hero.stack}</span>
            <span>{hero.experience}</span>
          </div>
        </div>
      </HeroMotion>
    </section>
  );
}
