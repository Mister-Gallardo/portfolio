import localFont from 'next/font/local';

// Subset to Latin + Cyrillic and cut to the weights the design uses
// (see src/assets/fonts/README.md). Served from the same origin, so builds and visitors
// never depend on Google Fonts.

export const serif = localFont({
  src: [
    { path: '../assets/fonts/cormorant-300.woff2', weight: '300', style: 'normal' },
    { path: '../assets/fonts/cormorant-italic-400.woff2', weight: '400', style: 'italic' },
  ],
  variable: '--font-cormorant',
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
  adjustFontFallback: 'Times New Roman',
});

export const sans = localFont({
  src: '../assets/fonts/inter-tight.woff2',
  weight: '300 500',
  variable: '--font-inter-tight',
  display: 'swap',
  fallback: ['system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
  adjustFontFallback: 'Arial',
});
