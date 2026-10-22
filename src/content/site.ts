export const site = {
  /** Canonical origin, set NEXT_PUBLIC_SITE_URL in production. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, ''),
  telegram: { handle: '@Asket_AAV', url: 'https://t.me/Asket_AAV' },
  email: 'amir.azizov.dev@gmail.com',
  github: {
    handle: 'Mister-Gallardo',
    url: 'https://github.com/Mister-Gallardo',
  },
  /** Shows the availability caption above the floating contact button. */
  openToWork: true,
  /** Year in the footer copyright: the year of the build, as the page is static. */
  publishedYear: new Date().getFullYear(),
} as const;
