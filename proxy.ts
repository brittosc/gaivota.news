import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './lib/i18n';
import { env } from './lib/env';

const i18nMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

const localePattern = locales.join('|');

export async function proxy(request: NextRequest) {
  const response = i18nMiddleware(request);
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

  const isAuthPage =
    pathnameWithoutLocale.startsWith('/login') || pathnameWithoutLocale.startsWith('/api/auth');
  const isPublicPage = pathnameWithoutLocale === '/';

  if (!user && !isAuthPage && !isPublicPage) {
    const locale = pathname.split('/')[1] || defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
