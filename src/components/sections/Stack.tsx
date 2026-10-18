import { LadderRows } from '@/components/motion/LadderRows';
import { skillGroups } from '@/content/skills';
import { getDictionary } from '@/i18n/dictionary';

export async function Stack() {
  const { stack } = await getDictionary();

  return (
    <section
      id="stack"
      data-surface="dark"
      aria-labelledby="stack-title"
      className="grain section-y overflow-x-clip bg-surface text-fg"
    >
      <div className="shell grid gap-y-10 lg:grid-cols-12 lg:gap-x-6">
        <h2 id="stack-title" className="font-light font-serif text-title lg:col-span-4">
          {stack.title}
        </h2>
        <p className="max-w-[56ch] font-light text-lead text-muted lg:col-span-7 lg:col-start-6 lg:pt-3">
          {stack.intro}
        </p>

        <LadderRows className="mt-6 border-line border-t lg:col-span-12 lg:mt-16">
          {skillGroups.map((group) => (
            <div
              key={group.id}
              data-ladder-row
              className="grid gap-x-6 gap-y-3 border-line border-b py-6 lg:grid-cols-12 lg:py-8"
            >
              <h3 className="font-serif text-subheading italic lg:col-span-4">
                {stack.groups[group.id]}
              </h3>
              <ul className="flex flex-wrap gap-x-5 gap-y-1.5 font-light text-lead lg:col-span-8">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </LadderRows>
      </div>
    </section>
  );
}
