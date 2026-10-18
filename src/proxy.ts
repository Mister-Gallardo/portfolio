import { type NextRequest, NextResponse } from 'next/server';
import { defaultLocale, isLocale } from '@/i18n/config';

/**
 * Locale routing without a prefix for the default language:
 * - `/` and other unprefixed paths are rewritten to `/{defaultLocale}`;
 * - `/{defaultLocale}/...` redirects to the unprefixed URL, so each page has one address;
 * - other locale prefixes (`/en/...`) pass through untouched.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segment = pathname.split('/')[1] ?? '';

  if (segment === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || '/';
    return NextResponse.redirect(url, 308);
  }

  if (isLocale(segment)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next.js internals, generated metadata images and files with an extension.
  matcher: ['/((?!_next|api|.*opengraph-image|.*\\..*).*)'],
};
