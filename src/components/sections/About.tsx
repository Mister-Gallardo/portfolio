import { PointerParallax } from '@/components/motion/PointerParallax';
import { RevealText } from '@/components/motion/RevealText';
import { getDictionary } from '@/i18n/dictionary';

export async function About() {
  const { about } = await getDictionary();

  return (
    <section
      id="about"
      data-surface="light"
      aria-labelledby="about-title"
      className="grain section-y bg-surface text-fg"
    >
      <div className="shell grid gap-y-12 lg:grid-cols-12 lg:gap-x-6">
        <h2 id="about-title" className="label lg:col-span-3 lg:pt-4">
          {about.title}
        </h2>

        <PointerParallax className="lg:col-span-9" strength={6}>
          <RevealText effect="focus" className="max-w-[34ch] font-light font-serif text-statement">
            {about.statement}
          </RevealText>
          <RevealText
            effect="rise"
            className="mt-8 max-w-[34ch] font-serif text-muted text-statement italic"
          >
            {about.coda}
          </RevealText>
        </PointerParallax>

        <dl className="grid gap-x-6 border-line border-t sm:grid-cols-3 lg:col-span-9 lg:col-start-4 lg:mt-16">
          {about.facts.map(({ value, label }) => (
            <div
              key={value}
              className="flex flex-col-reverse justify-end gap-3 border-line border-b py-6 sm:border-b-0 sm:pt-8"
            >
              <dt className="max-w-[24ch] text-muted text-small">{label}</dt>
              <dd className="font-light font-serif text-[clamp(3.5rem,6vw,5.5rem)] lining-nums leading-none">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <p className="max-w-[48ch] font-light text-lead lg:col-span-6 lg:col-start-4">
          {about.seeking}
        </p>
      </div>
    </section>
  );
}
