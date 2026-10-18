import type { CSSProperties } from 'react';
import { experience } from '@/content/experience';
import { getDictionary } from '@/i18n/dictionary';
import { createWave } from '@/lib/wave';
import styles from './Experience.module.css';
import { TimelineMotion } from './TimelineMotion';

// Keep in sync with --lead-in and --lead-out in Experience.module.css.
const wave = createWave(experience.length, { leadIn: 2, leadOut: 3.4 });

export async function Experience() {
  const { experience: copy } = await getDictionary();
  // One line per stop, then the closing one. They repeat the cards for sighted users
  // only, so assistive technology reads the intro and the list.
  const chapters = [...experience.map(({ id }) => copy.entries[id].chapter), copy.onward];

  const thread = (lit?: boolean) => (
    <svg
      className={styles.wave}
      viewBox={`0 0 ${wave.width} ${wave.height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      data-lit={lit || undefined}
      data-timeline={lit ? 'lit' : undefined}
    >
      <path d={wave.path} />
    </svg>
  );

  return (
    <section
      id="experience"
      data-surface="dark"
      aria-labelledby="experience-title"
      className={`grain bg-surface text-fg ${styles.section}`}
      style={{ '--count': experience.length } as CSSProperties}
    >
      <TimelineMotion className={styles.stage}>
        <header className={styles.intro}>
          <h2 id="experience-title" className={`font-light font-serif text-title ${styles.title}`}>
            {copy.title}
          </h2>
          <div className={styles.lines}>
            <p data-timeline="line" data-state="current" className={styles.line}>
              {copy.intro}
            </p>
            {chapters.map((chapter) => (
              <p
                key={chapter}
                aria-hidden="true"
                data-timeline="line"
                data-state="future"
                className={styles.line}
              >
                {chapter}
              </p>
            ))}
          </div>
        </header>

        <div className={styles.viewport}>
          <div data-timeline="track" className={styles.track}>
            <div className={styles.band}>
              {thread()}
              {thread(true)}

              <ol className={styles.list}>
                {experience.map((entry, index) => {
                  const stop = wave.stops[index];
                  const text = copy.entries[entry.id];
                  const position = stop && { '--x': stop.x.toFixed(5), '--y': stop.y.toFixed(5) };

                  return (
                    <li
                      key={entry.id}
                      data-timeline="item"
                      className={styles.item}
                      style={position as CSSProperties}
                    >
                      <span aria-hidden="true" className={styles.dot} />
                      <span aria-hidden="true" className={styles.year}>
                        {entry.marker}
                      </span>
                      <div className={styles.body}>
                        <span aria-hidden="true" data-timeline="stem" className={styles.stem} />
                        <article data-timeline="card">
                          <p className="label">{text.period}</p>
                          <h3 className={styles.org}>{text.org}</h3>
                          <p className="mt-1 text-small">{text.role}</p>
                          <ul className={styles.points}>
                            {text.points.map((point) => (
                              <li key={point}>{point}</li>
                            ))}
                          </ul>
                        </article>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </TimelineMotion>
    </section>
  );
}
