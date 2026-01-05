import Link from 'next/link';
import { NewsletterForm } from '@/components/newsletter-form';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeSwitch } from '@/components/theme/theme-toggle';
import { getTranslations } from 'next-intl/server';
import { WeatherWidget } from '@/components/weather-widget';

export async function Footer() {
  const t = await getTranslations('Components.Footer');

  return (
    <footer className="bg-muted/30 mt-10">
      {/* <SupportersMarquee /> */}

      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="col-span-1 flex flex-col gap-6">
            <WeatherWidget />

            <div className="flex gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="X (Twitter)"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
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
                  className="lucide lucide-instagram h-5 w-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Facebook"
              >
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
                  className="lucide lucide-facebook h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
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
                  <Link href="/newsletter" className="hover:text-primary transition-colors">
                    {t('newsletter')}
                  </Link>
                </li>
                <li>
                  <Link href="/supporter" className="hover:text-primary transition-colors">
                    {t('becomeSupporter')}
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
