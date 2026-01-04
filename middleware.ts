import { createServerClient } from '@supabase/ssr';
import { NextResponse, NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './lib/i18n';
import { env } from './lib/env';

const i18nMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

const localePattern = locales.join('|');

export async function middleware(request: NextRequest) {
  // Hack to map pt-BR/pt headers to 'br' locale since we use 'br' code for Brazil
  const acceptLanguage = request.headers.get('accept-language') || '';
  let modifiedRequest = request;

  if (acceptLanguage.toLowerCase().includes('pt')) {
    const headers = new Headers(request.headers);
    headers.set('accept-language', `pt-BR,${acceptLanguage}`);
    modifiedRequest = new NextRequest(request.url, {
      headers,
      method: request.method,
    });
  }

  const response = i18nMiddleware(modifiedRequest);
  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;
  const pathnameWithoutLocale =
    pathname.replace(new RegExp(`^/(?:${localePattern})(/|$)`), '/') || '/';

  const protectedPaths = ['/admin', '/profile'];
  const isProtectedPath = protectedPaths.some(path => pathnameWithoutLocale.startsWith(path));

  if (!user && isProtectedPath) {
    const locale = pathname.split('/')[1];
    if (!(locales as readonly string[]).includes(locale)) {
      // locale is not valid, use default
      return NextResponse.redirect(new URL(`/${defaultLocale}/login`, request.url));
    }
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
