import type { CSSProperties } from 'react';
import { RevealText } from '@/components/motion/RevealText';
import { projects } from '@/content/projects';
import type { Project } from '@/content/types';
import { getDictionary, getLocale } from '@/i18n/dictionary';
import { format, plural } from '@/lib/text';
import { ProjectMedia } from './ProjectMedia';
import styles from './Projects.module.css';
import { StackingCards } from './StackingCards';

/** Places of the card's images in the gallery, which a click on one of them opens. */
function coverPositions({ id, screenshots, cover }: Project) {
  return cover.flatMap((shotId) => {
    if (!shotId) return [];
    const position = screenshots.findIndex((shot) => shot.id === shotId);
    // The page is prerendered, so a wrong id fails the build rather than a visitor's page.
    if (position < 0) throw new Error(`Cover image "${shotId}" is not a screenshot of "${id}".`);
    return [position];
  });
}

export async function Projects() {
  const [{ projects: copy, gallery }, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <section
      id="projects"
      data-surface="light"
      aria-labelledby="projects-title"
      className={`grain bg-surface text-fg ${styles.section}`}
      style={{ '--count': projects.length } as CSSProperties}
    >
      {/* The heading is sticky, so its reveal follows the section, which scrolls normally. */}
      <header className={styles.heading}>
        <RevealText
          as="h2"
          id="projects-title"
          effect="rise"
          trigger="section"
          start="top 80%"
          end="top 30%"
          className="font-light font-serif text-title"
        >
          {copy.title}
        </RevealText>
        <RevealText
          effect="focus"
          trigger="section"
          start="top 65%"
          end="top 10%"
          className={`mt-6 max-w-[44ch] font-light text-lead text-muted ${styles.intro}`}
        >
          {copy.intro}
        </RevealText>
      </header>

      <StackingCards className={styles.cards}>
        {projects.map((project, index) => {
          const text = copy.entries[project.id];
          // The client gets only what next/image needs. Blur placeholders would travel in
          // the page payload for every screenshot, including those only the gallery shows.
          const shots = project.screenshots.map(
            ({ id, image: { src, width, height }, density = 1 }) => ({
              id,
              image: { src, width, height },
              density,
              caption: copy.captions[id],
            }),
          );
          const count = shots.length;
          const openLabel = format(copy.openGallery, {
            count,
            noun: plural(locale, count, copy.imageNoun),
          });

          return (
            <li
              key={project.id}
              data-stack-item
              className={styles.cardItem}
              style={{ '--index': index } as CSSProperties}
            >
              <article
                data-stack-card
                data-surface="dark"
                aria-labelledby={`project-${project.id}`}
                className={`grain ${styles.card}`}
                style={{ '--project-accent': project.accent } as CSSProperties}
              >
                <div className={styles.body}>
                  <div className={styles.text}>
                    <p className="label">{text.meta}</p>
                    <h3 id={`project-${project.id}`} className={styles.title}>
                      {text.title}
                    </h3>
                    <p className={styles.summary}>{text.summary}</p>
                    {text.role && (
                      <p className="max-w-[52ch] text-muted text-small">
                        <span className="text-fg">{copy.roleLabel}.</span> {text.role}
                      </p>
                    )}
                    <ul className={styles.highlights}>
                      {text.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                    {text.note && <p className="text-caption text-muted">{text.note}</p>}
                  </div>

                  <div className={styles.side}>
                    <ProjectMedia
                      title={text.title}
                      device={project.device}
                      shots={shots}
                      cover={coverPositions(project)}
                      openLabel={openLabel}
                      labels={gallery}
                    >
                      <ul className={styles.stack} aria-label={copy.stackLabel}>
                        {project.stack.map((tech) => (
                          <li key={tech}>{tech}</li>
                        ))}
                      </ul>
                    </ProjectMedia>
                  </div>
                </div>
                <span aria-hidden="true" data-stack-shade className={styles.shade} />
              </article>
            </li>
          );
        })}
      </StackingCards>
    </section>
  );
}
