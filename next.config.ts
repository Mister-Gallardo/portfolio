import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

/**
 * Everything the site loads is its own: scripts, styles, fonts, images. The pages are
 * prerendered, so a nonce-based policy (which needs rendering per request) does not
 * apply, and inline scripts and styles stay allowed, as the Next.js guide recommends
 * for static pages. Development also needs eval for Fast Refresh.
 * HSTS belongs to the HTTPS proxy in front of the server, not here.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
];

const nextConfig: NextConfig = {
  // The Docker image sets NEXT_OUTPUT=standalone. Local builds keep the default
  // output, which also avoids the symlink limitations of standalone on Windows.
  output: process.env.NEXT_OUTPUT === 'standalone' ? 'standalone' : undefined,
  reactCompiler: true,
  poweredByHeader: false,
  // CSS stays in cacheable files on purpose: inlining it (experimental.inlineCss) also
  // copies it into the RSC payload, and parsing both cost more main-thread time than the
  // extra request saved.
  images: {
    formats: ['image/avif', 'image/webp'],
    // 75 for photos, 90 for screenshots: their small text blurs at lower settings.
    qualities: [75, 90],
  },
  turbopack: {
    rules: {
      // Tailwind processes global stylesheets only; CSS Modules are plain CSS and keep
      // their scoped class names.
      '*.css': {
        condition: { not: { path: /\.module\.css$/ } },
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
