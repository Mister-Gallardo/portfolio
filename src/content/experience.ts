import type { ExperienceEntry } from './types';

/** Chronological order; the timeline renders entries left to right. */
export const experience: readonly ExperienceEntry[] = [
  { id: 'igs', kind: 'work', marker: '2022' },
  { id: 'lakileki', kind: 'work', marker: '2023' },
  { id: 'expert', kind: 'work', marker: '2025' },
  { id: 'bachelor', kind: 'education', marker: '2026' },
  { id: 'master', kind: 'education', marker: '2028' },
];
