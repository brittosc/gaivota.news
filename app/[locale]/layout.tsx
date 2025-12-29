/**
 * @file layout.tsx
 * @directory template-nextjs\app\[locale]
 * @author Mauricio de Britto - grupobritto.com.br
 * @version 0.0.5
 * @since 28/12/2025 19:32
 *
 * @description
 * Layout raiz unificando providers e internacionalização.
 */

import { Geist, Geist_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, Locale } from '@/lib/i18n';
import { constructMetadata } from '@/lib/seo';

// SEO Component
import { JsonLd } from '@/components/seo/json-ld';

// Providers Import
import { ThemeProvider } from '@/components/theme/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { SettingsProvider } from '@/components/providers/settings-provider';
import { ModalProvider } from '@/components/providers/modal-provider';
import { ProgressProvider } from '@/components/providers/progress-provider';
import { ErrorBoundaryProvider } from '@/components/providers/error-boundary-provider';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { SettingsClientWrapper } from '@/components/providers/settings-client-wrapper';

// PWA e UI
import { ServiceWorkerRegister } from '@/components/pwa/sw-register';
import { ServiceWorkerUpdatePrompt } from '@/components/pwa/sw-update-prompt';
import { AppSidebar } from '@/components/app-sidebar';
import { Footer } from '@/components/layout/footer';

import '../globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata = constructMetadata();

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <JsonLd />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ErrorBoundaryProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <QueryProvider>
                <AuthProvider>
                  <ProgressProvider>
                    <SettingsProvider>
                      <ModalProvider>
                        <SidebarProvider defaultOpen={false}>
                          <ServiceWorkerRegister />
                          <ServiceWorkerUpdatePrompt />
                          <SettingsClientWrapper>
                            <AppSidebar />
                            <SidebarInset className="bg-muted dark:bg-muted flex h-svh max-h-svh flex-col overflow-y-auto">
                              <div className="flex min-h-full flex-col">
                                <SidebarTrigger className="sticky top-2 z-10 mt-2 ml-2" />
                                <main className="flex-1">{children}</main>
                                <Footer />
                              </div>
                            </SidebarInset>
                          </SettingsClientWrapper>
                        </SidebarProvider>
                      </ModalProvider>
                    </SettingsProvider>
                  </ProgressProvider>
                </AuthProvider>
              </QueryProvider>
            </ThemeProvider>
          </ErrorBoundaryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}
