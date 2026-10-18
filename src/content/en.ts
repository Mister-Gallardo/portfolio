import type { Dictionary } from './types';

export const en: Dictionary = {
  meta: {
    title: 'Amir Azizov — Frontend Developer (React, Next.js)',
    description:
      'Frontend developer working with React, Next.js and TypeScript. Interfaces for data-heavy products, from architecture to release. Based in Moscow, open to remote or hybrid.',
    ogAlt: 'Amir Azizov, frontend developer',
  },
  nav: {
    label: 'Sections',
    skipToContent: 'Skip to content',
    home: 'Amir Azizov, back to top',
    menu: 'Menu',
    closeMenu: 'Close menu',
    language: 'Language',
    sections: {
      about: 'About',
      experience: 'Experience',
      projects: 'Work',
      stack: 'Stack',
      faq: 'FAQ',
      contact: 'Contact',
    },
  },
  hero: {
    firstName: 'Amir',
    lastName: 'Azizov',
    role: 'Frontend developer',
    location: 'Based in Moscow · remote or hybrid',
    stack: 'React, Next.js, TypeScript',
    experience: 'Over 4 years in commercial development',
    intro: 'I build interfaces for data-heavy products — from architecture to release.',
    contactCta: 'Message me on Telegram',
    projectsCta: 'See my work',
    portraitAlt: 'Amir Azizov',
  },
  availability: 'Open to new roles',
  about: {
    title: 'About',
    statement:
      'I started out in layout and design, which is why I notice a margin that is two pixels off. Then I took ownership of frontend architecture for a team. Today I am the only frontend developer on my team and run the client side of several products — from choosing the stack to shipping releases.',
    coda: 'My focus: dense screens full of filters, tables and forms that still feel fast and obvious.',
    facts: [
      { value: '4+', label: 'years in commercial development' },
      { value: '5', label: 'apps where I am the only frontend developer' },
      { value: '3.5×', label: 'faster deploys after moving to Vite and pnpm' },
    ],
    seeking:
      'I am looking for a product team where I can grow in frontend architecture and, over time, into full-stack work and technical leadership. I am ready to take on backend tasks now: in my own projects I write NestJS, Express and tRPC and work with PostgreSQL, Redis and Docker.',
  },
  experience: {
    title: 'Experience',
    intro: 'From building layouts out of mockups to owning the frontend of several products.',
    entries: {
      igs: {
        period: 'August 2022 — September 2023',
        org: 'IGS',
        role: 'Layout developer and designer',
        points: [
          'Responsive, cross-browser layouts from Figma mockups',
          'Animation and interactivity with CSS and JavaScript',
          'Worked with designers on the details of every mockup',
        ],
        chapter: 'The start: layouts from mockups, animation and attention to detail.',
      },
      lakileki: {
        period: 'October 2023 — December 2024',
        org: 'LakiLeki studio',
        role: 'Lead frontend developer',
        points: [
          'Adapted Feature-Sliced Design to the team and the product',
          'State management with Redux Toolkit, MobX and React Query across studio projects',
          'SBP payments, a one-screen sign-in, tests with Jest',
        ],
        chapter: 'First lead role: project architecture and complex state.',
      },
      expert: {
        period: 'February 2025 — present',
        org: 'Expert Centre',
        role: 'Frontend developer',
        points: [
          'The only frontend developer on several products',
          'Migrated from React to Next.js for SSR and Core Web Vitals',
          '3.5× faster deploys after switching to Vite and pnpm',
        ],
        chapter: 'Now: the whole frontend of several products, from choosing the stack to deploys.',
      },
      bachelor: {
        period: '2022 — 2026',
        org: 'RTU MIREA',
        role: 'Bachelor’s degree',
        points: [
          'Information Systems and Technologies',
          'Major in artificial intelligence and data analysis',
          'Thesis graded excellent',
        ],
        chapter: 'A bachelor’s degree in information systems and artificial intelligence.',
      },
      master: {
        period: '2026 — 2028',
        org: 'RTU MIREA',
        role: 'Master’s degree',
        points: ['Design and operation of high-load information systems'],
        chapter: 'A master’s programme: learning to design high-load systems.',
      },
    },
    onward: 'The path goes on: next come full-stack development, DevOps and architecture.',
  },
  projects: {
    title: 'Projects & Architecture',
    intro:
      'Developing complex web applications, automating internal processes, and designing full-stack solutions — from client interfaces to database architecture.',
    roleLabel: 'My role',
    stackLabel: 'Stack',
    openGallery: 'View {count}\u00a0{noun}',
    imageNoun: { one: 'image', other: 'images' },
    entries: {
      procurement: {
        meta: 'Expert Centre, 2025 — present',
        title: 'Public procurement analytics',
        summary:
          'Search and analytics for public tenders: flexible filters saved as templates, tender pages with a full profile of the winner — financials, court cases, past wins — and paid subscriptions via YooKassa.',
        role: 'The only frontend developer. Built all three apps of the ecosystem from scratch and chose their stack.',
        highlights: [
          'Admin panel with roles, subscription management and impersonation for the support team',
          'Dense, data-heavy screens that stay fast and readable',
          'A tool for call-centre staff and general contractors that generates consent links for personal data processing',
        ],
      },
      crm: {
        meta: 'Expert Centre, 2025 — present',
        title: 'Internal CRM and Chrome extension',
        summary:
          'The CRM runs every internal process at the company: vacancies, staff, tasks and personal dashboards. Hiring too — candidate resumes live in the CRM, not on hh.ru.',
        role: 'The only frontend developer. Took over the project at the skeleton stage and built out its features; built the extension from scratch.',
        highlights: [
          'The extension imports a candidate from an hh.ru resume page into the CRM in one click',
          'Moved state to Redux Toolkit and TanStack Query and upgraded dependencies',
          'Vacancy, staff, task and dashboard modules',
        ],
      },
      eduflow: {
        meta: 'Personal project, 2026',
        title: 'Eduflow — an online learning platform',
        summary:
          'A Stepik-style platform: course → module → lesson → step. Text, video and six kinds of interactive tasks, from quizzes and matching to fill-in-the-blanks and free-form answers.',
        role: 'Sole developer: frontend, backend, database and infrastructure.',
        highlights: [
          'Automatic grading for every task except free-form answers, which teachers review: “pending” → “accepted” or “needs work”',
          'Sessions with refresh-token rotation; student and teacher roles with separate access',
          '86 automated tests, learning progress and statistics',
        ],
      },
      tapper: {
        meta: 'Telegram Mini App',
        title: 'Tap game for Telegram',
        summary: 'A mini-app game within Telegram with instant response to taps.',
        highlights: [
          'Multitouch: up to three simultaneous touches',
          'Game economy: tokens for taps, energy expenditure and recovery',
          'A springy animation and a floating “+N” in response to every tap',
          'Real-time data exchange with the server over WebSocket',
        ],
      },
    },
    captions: {
      procurementSearch: 'Tender search: filters saved as a template and highlighted matches',
      procurementTender: 'Tender page: the winner, financial results and court cases',
      crmCandidate: 'Candidate profile in the CRM',
      crmExtension: 'The extension on an hh.ru resume page: the candidate is sent to the CRM',
      eduflowLesson: 'A lesson with module and step navigation',
      eduflowMatching: 'An interactive matching task',
      eduflowReview: 'The answer review module for teachers',
      eduflowMonorepo: 'Architecture of the pnpm monorepo',
      eduflowSchema: 'Database schema',
      eduflowAuthFlow: 'Authentication and token rotation',
      tapperMain: 'Main screen of the tap game',
    },
  },
  stack: {
    title: 'Stack',
    intro:
      'My core stack is TypeScript, React and Next.js. In my own projects I run a pnpm monorepo with a backend and infrastructure, and I take a particular interest in web security: authentication and sessions, XSS and CSRF protection, rate limiting, input validation.',
    groups: {
      core: 'Core',
      data: 'State and data',
      ui: 'Interfaces',
      tooling: 'Tooling and quality',
      backend: 'Backend and DevOps',
    },
  },
  faq: {
    title: 'FAQ',
    entries: [
      {
        question: 'What work format are you open to?',
        answer:
          'Full-time, remote or hybrid. I live in Moscow and I am open to relocation and business trips.',
      },
      {
        question: 'Will you take on backend work?',
        answer:
          'Yes. In my own projects I write backends with NestJS and Express with tRPC, and work with PostgreSQL, Prisma, Redis and Docker. If the team needs it, I am in.',
      },
      {
        question: 'What kind of team are you looking for?',
        answer:
          'A product team where I can grow in frontend architecture and take part in product decisions. Next, I want to grow into full-stack development: backend, DevOps, security and, in time, technical leadership.',
      },
      {
        question: 'How do you feel about legacy code and tech debt?',
        answer:
          'Calm: legacy code usually means a product that works. I first figure out why the code is the way it is, then improve it step by step and keep the tech debt visible to the team. I have done it before: a migration from React to Next.js, moving state to Redux Toolkit and TanStack Query.',
      },
      {
        question: 'How do you bring value to the team beyond your core tasks?',
        answer:
          'I help colleagues work through complex tasks and pin down problem areas. In my current role, backend developers often come to me so we can localise issues together.',
      },
      {
        question: 'Do you have references?',
        answer:
          'Yes — from the project manager at Expert Centre and the full-stack team lead at LakiLeki studio. Contacts on request.',
      },
    ],
  },
  contact: {
    title: 'Let’s work together',
    text: 'I respond fastest on Telegram. You can also send an email.',
    channels: { telegram: 'Telegram', email: 'Email', github: 'GitHub' },
    copy: 'Copy address',
    copied: 'Address copied',
    backToTop: 'Back to top',
    colophon: 'Built with Next.js, TypeScript and GSAP',
  },
  gallery: {
    close: 'Close',
    previous: 'Previous image',
    next: 'Next image',
    position: '{current} of {total}',
    actualSize: 'Show at actual size',
    fitToScreen: 'Fit to screen',
    note: 'Data in the images is anonymised',
  },
  notFound: {
    title: 'This page does not exist',
    text: 'The link may be outdated, or there is a typo in the address.',
    back: 'Go to the home page',
  },
};
