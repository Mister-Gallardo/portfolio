# syntax=docker/dockerfile:1

# Production image: the standalone Next.js server, about 50 MB on top of Node.
#   docker build --build-arg NEXT_PUBLIC_SITE_URL=https://example.com -t portfolio .
#   docker run -p 3000:3000 portfolio

# ---- Base: Node with the pnpm version pinned in package.json --------------------
FROM node:24-alpine AS base
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    NEXT_TELEMETRY_DISABLED=1
RUN corepack enable
WORKDIR /app

# ---- Dependencies: a layer of its own, rebuilt only when the lockfile changes ----
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# ---- Build -------------------------------------------------------------------------
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# The pages are prerendered with absolute URLs (canonical, Open Graph, sitemap), so the
# public origin is baked in at build time and is required.
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_OUTPUT=standalone
RUN test -n "$NEXT_PUBLIC_SITE_URL" || { echo "Pass --build-arg NEXT_PUBLIC_SITE_URL=https://your.domain" >&2; exit 1; }
RUN pnpm build

# ---- Runtime: no pnpm, no sources, no dev dependencies, not root -------------------
FROM node:24-alpine AS runner
# Docker sets HOSTNAME to the container id, but the server has to listen on all
# interfaces; the locale rewrites in src/proxy.ts rely on that as well.
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
WORKDIR /app
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs

COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public

RUN mkdir .next/cache && chown nextjs:nodejs .next/cache

USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
    CMD wget -q --spider http://127.0.0.1:3000/ || exit 1
CMD ["node", "server.js"]
