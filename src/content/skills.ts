import type { SkillGroup } from './types';

export const skillGroups: readonly SkillGroup[] = [
  { id: 'core', items: ['TypeScript', 'JavaScript', 'React', 'Next.js', 'HTML', 'CSS'] },
  {
    id: 'data',
    items: [
      'Redux Toolkit',
      'Zustand',
      'MobX',
      'TanStack Query',
      'React Hook Form',
      'Zod',
      'WebSocket',
      'REST',
      'GraphQL',
    ],
  },
  {
    id: 'ui',
    items: ['Tailwind CSS', 'shadcn/ui', 'MUI', 'Ant Design', 'SCSS', 'Figma'],
  },
  {
    id: 'tooling',
    items: [
      'Vite',
      'pnpm',
      'Vitest',
      'Jest',
      'Testing Library',
      'Oxlint',
      'ESLint',
      'Prettier',
      'Husky',
      'lint-staged',
      'commitlint',
      'Git',
    ],
  },
  {
    id: 'backend',
    items: [
      'Node.js',
      'NestJS',
      'Express',
      'tRPC',
      'gRPC',
      'PostgreSQL',
      'Prisma',
      'Redis',
      'Docker',
      'CI/CD',
      'Linux',
    ],
  },
];
