import crmCandidate from '@/assets/projects/crm-candidate.jpg';
import crmExtension from '@/assets/projects/crm-extension.jpg';
import eduflowAuthFlow from '@/assets/projects/eduflow-auth-flow.jpg';
import eduflowLesson from '@/assets/projects/eduflow-lesson.jpg';
import eduflowMatching from '@/assets/projects/eduflow-matching.jpg';
import eduflowMonorepo from '@/assets/projects/eduflow-monorepo.jpg';
import eduflowReview from '@/assets/projects/eduflow-review.jpg';
import eduflowSchema from '@/assets/projects/eduflow-schema.jpg';
import procurementSearch from '@/assets/projects/procurement-search.jpg';
import procurementTender from '@/assets/projects/procurement-tender.jpg';
import tapperMain from '@/assets/projects/tapper.jpg';
import type { Project } from './types';

export const projects: readonly Project[] = [
  {
    id: 'procurement',
    accent: '#4a74e8',
    device: 'desktop',
    stack: [
      'Next.js',
      'React',
      'React Compiler',
      'Vite',
      'TypeScript',
      'FSD',
      'Tailwind CSS',
      'shadcn/ui',
      'TanStack Query',
      'nuqs',
      'Zustand',
      'React Hook Form',
      'Zod',
      'MUI',
    ],
    screenshots: [
      { id: 'procurementSearch', image: procurementSearch },
      { id: 'procurementTender', image: procurementTender },
    ],
    cover: ['procurementSearch', 'procurementTender'],
  },
  {
    id: 'crm',
    accent: '#3a9fd8',
    device: 'desktop',
    stack: [
      'React',
      'TypeScript',
      'Vite',
      'Redux Toolkit',
      'TanStack Query',
      'MUI',
      'Ant Design',
      'dnd-kit',
      'Chrome Extensions API',
    ],
    screenshots: [
      { id: 'crmCandidate', image: crmCandidate },
      { id: 'crmExtension', image: crmExtension },
    ],
    cover: ['crmCandidate', 'crmExtension'],
  },
  {
    id: 'eduflow',
    accent: '#2aa58e',
    device: 'desktop',
    stack: [
      'pnpm monorepo',
      'React',
      'TypeScript',
      'Vite',
      'TanStack Query',
      'React Hook Form',
      'Vitest',
      'MUI',
      'dnd-kit',
      'FSD',
      'Express',
      'tRPC',
      'Zod',
      'PostgreSQL',
      'Prisma',
      'Docker',
    ],
    // Interfaces first, then diagrams.
    screenshots: [
      { id: 'eduflowLesson', image: eduflowLesson },
      { id: 'eduflowMatching', image: eduflowMatching },
      { id: 'eduflowReview', image: eduflowReview },
      { id: 'eduflowMonorepo', image: eduflowMonorepo },
      { id: 'eduflowSchema', image: eduflowSchema },
      { id: 'eduflowAuthFlow', image: eduflowAuthFlow },
    ],
    // Two screens and the monorepo diagram peeking out between them.
    cover: ['eduflowLesson', 'eduflowReview', 'eduflowMonorepo'],
  },
  {
    id: 'tapper',
    accent: '#c23ab8',
    device: 'phone',
    stack: ['React', 'TypeScript', 'Vite', 'WebSocket', 'Axios', 'Sass', 'MUI'],
    // The original is 306 × 600; the file is a sharpened 2× upscale of it.
    screenshots: [{ id: 'tapperMain', image: tapperMain, density: 2 }],
    cover: ['tapperMain'],
  },
];
