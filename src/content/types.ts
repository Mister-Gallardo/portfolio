import type { StaticImageData } from 'next/image';

export const sectionIds = ['about', 'experience', 'projects', 'stack', 'faq', 'contact'] as const;
export type SectionId = (typeof sectionIds)[number];

export type ProjectId = 'procurement' | 'crm' | 'eduflow' | 'tapper';
export type ExperienceId = 'igs' | 'lakileki' | 'expert' | 'bachelor' | 'master';
export type SkillGroupId = 'core' | 'data' | 'ui' | 'tooling' | 'backend';
export type ScreenshotId =
  | 'procurementSearch'
  | 'procurementTender'
  | 'crmCandidate'
  | 'crmExtension'
  | 'eduflowLesson'
  | 'eduflowMatching'
  | 'eduflowReview'
  | 'eduflowMonorepo'
  | 'eduflowSchema'
  | 'eduflowAuthFlow'
  | 'tapperMain';

/* ------------------------------------------------------------------ data */

export interface Screenshot {
  id: ScreenshotId;
  image: StaticImageData;
  /**
   * Pixels per CSS pixel the file was prepared at; 2 for an image upscaled from a small
   * original. The gallery never shows an image larger than `width / density`.
   */
  density?: number;
}

/** Screenshots on a project's card, back to front: the card holds one to three. */
export type Cover = readonly [ScreenshotId, ScreenshotId?, ScreenshotId?];

export interface Project {
  id: ProjectId;
  /** Colour taken from the product's own UI; tints the glow behind its screenshots. */
  accent: string;
  device: 'desktop' | 'phone';
  stack: readonly string[];
  /** Every screenshot, in the order the gallery shows them. */
  screenshots: readonly Screenshot[];
  /**
   * The screenshots on the card, chosen independently of the gallery order, so adding
   * an image to the gallery never changes the card. A phone shows the first one.
   */
  cover: Cover;
}

export interface ExperienceEntry {
  id: ExperienceId;
  kind: 'work' | 'education';
  /** Year shown as the large marker while the entry is active on the timeline. */
  marker: string;
}

export interface SkillGroup {
  id: SkillGroupId;
  items: readonly string[];
}

/* ------------------------------------------------------------ dictionary */

/** Plural forms keyed by `Intl.PluralRules` categories; `other` is the fallback. */
export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

export interface ProjectCopy {
  /** Company or context and years, shown above the title. */
  meta: string;
  title: string;
  summary: string;
  role?: string;
  highlights: readonly string[];
  note?: string;
}

export interface Dictionary {
  meta: {
    title: string;
    description: string;
    ogAlt: string;
  };
  nav: {
    label: string;
    skipToContent: string;
    home: string;
    menu: string;
    closeMenu: string;
    language: string;
    sections: Record<SectionId, string>;
  };
  hero: {
    firstName: string;
    lastName: string;
    role: string;
    location: string;
    stack: string;
    experience: string;
    intro: string;
    contactCta: string;
    projectsCta: string;
    portraitAlt: string;
  };
  availability: string;
  about: {
    title: string;
    statement: string;
    coda: string;
    facts: readonly { value: string; label: string }[];
    seeking: string;
  };
  experience: {
    title: string;
    intro: string;
    entries: Record<
      ExperienceId,
      {
        period: string;
        org: string;
        role: string;
        points: readonly string[];
        /** Replaces the intro under the heading while the timeline is on this stop. */
        chapter: string;
      }
    >;
    /** Shown under the heading once the timeline has passed its last stop. */
    onward: string;
  };
  projects: {
    title: string;
    intro: string;
    roleLabel: string;
    stackLabel: string;
    /** Button label, `{count}` and `{noun}` are replaced, e.g. "Смотреть 6 изображений". */
    openGallery: string;
    imageNoun: PluralForms;
    entries: Record<ProjectId, ProjectCopy>;
    captions: Record<ScreenshotId, string>;
  };
  stack: {
    title: string;
    intro: string;
    groups: Record<SkillGroupId, string>;
  };
  faq: {
    title: string;
    entries: readonly { question: string; answer: string }[];
  };
  contact: {
    title: string;
    text: string;
    channels: { telegram: string; email: string; github: string };
    copy: string;
    copied: string;
    backToTop: string;
    colophon: string;
  };
  gallery: {
    close: string;
    previous: string;
    next: string;
    /** `{current}` and `{total}` are replaced. */
    position: string;
    /** Toggle for images that had to be scaled down to fit the screen. */
    actualSize: string;
    fitToScreen: string;
    /** The one note about the data in the images, the same for every project. */
    note: string;
  };
  notFound: {
    title: string;
    text: string;
    back: string;
  };
}
