<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project notes

A personal portfolio: one statically rendered page per locale (`/` in Russian, `/en`).
See README.md for the structure and how to edit content.

- Commands: `pnpm dev`, `pnpm check` (Biome and types, as in CI), `pnpm build`. Fix
  formatting, imports and class order with `pnpm lint:fix`.
- All user-facing text lives in `src/content` (`ru.ts`, `en.ts`, typed by `Dictionary`);
  components never hardcode copy.
- Server Components by default. Read text with `getDictionary()` and the locale with
  `getLocale()` (root params) from `src/i18n/dictionary.ts` instead of passing props.
- The page must stay static: `src/app/[locale]/page.tsx` exports `dynamic = 'error'`.
  Cache Components are off.
- Motion is CSS first (scroll-driven animations, transitions). GSAP is used only through
  `useMotion(query, setup)` from `src/lib/motion.ts`, which loads it on demand when the
  media query matches; never import `gsap` statically. Other heavy client work goes
  through `deferUntilIdle` from `src/lib/idle.ts`.
- Every effect respects `prefers-reduced-motion`, and the content is complete without
  JavaScript.
- Styling: Tailwind utilities for simple components, CSS Modules for layouts and
  animation. Colours come from surface tokens (`bg-surface`, `text-fg`, `text-muted`,
  `border-line`, `text-accent`) that follow the nearest `data-surface`.
