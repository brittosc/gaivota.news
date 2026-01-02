import Link from 'next/link';
import { SupportersMarquee } from '@/components/marketing/supporters-marquee';
import { NewsletterForm } from '@/components/newsletter-form';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeSwitch } from '@/components/theme/theme-toggle';
import { getTranslations } from 'next-intl/server';

export async function Footer() {
  const t = await getTranslations('Components.Footer');

  return (
    <footer className="bg-muted/30 mt-10">
      <SupportersMarquee />

      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                <path d="M18 14h-8" />
                <path d="M15 18h-5" />
                <path d="M10 6h8v4h-8V6Z" />
              </svg>
              Gaivota News
            </Link>
            <p className="text-muted-foreground mt-4 text-sm">{t('description')}</p>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <h4 className="mb-2 text-sm font-semibold tracking-wider uppercase">
                {t('linksTitle')}
              </h4>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>
                  <Link href="/" className="hover:text-primary transition-colors">
                    {t('home')}
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-primary transition-colors">
                    {t('admin')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold tracking-wider uppercase">
                {t('legalTitle')}
              </h4>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>
                  <Link href="/privacy" className="hover:text-primary transition-colors">
                    {t('privacy')}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-primary transition-colors">
                    {t('terms')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <NewsletterForm />
          </div>
        </div>

        <div className="text-muted-foreground mt-12 flex flex-col items-center gap-4 border-t pt-8 text-center text-sm">
          <div className="flex items-center gap-2">
            <ThemeSwitch />
            <LanguageSwitcher />
          </div>
          <p>
            &copy; {new Date().getFullYear()} Gaivota News. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
