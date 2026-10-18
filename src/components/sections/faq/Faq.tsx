import { getDictionary } from '@/i18n/dictionary';
import styles from './Faq.module.css';

/** Native <details> accordion; `name` makes the items mutually exclusive without JavaScript. */
export async function Faq() {
  const { faq } = await getDictionary();

  return (
    <section
      id="faq"
      data-surface="light"
      aria-labelledby="faq-title"
      className="grain section-y bg-surface text-fg"
    >
      <div className="shell grid gap-y-10 lg:grid-cols-12 lg:gap-x-6">
        <h2 id="faq-title" className="font-light font-serif text-title lg:col-span-4">
          {faq.title}
        </h2>
        <div className="border-line border-t lg:col-span-8">
          {faq.entries.map(({ question, answer }) => (
            <details key={question} name="faq" className={styles.item}>
              <summary className={styles.question}>
                {question}
                <span aria-hidden="true" className={styles.icon} />
              </summary>
              <p className={styles.answer}>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
