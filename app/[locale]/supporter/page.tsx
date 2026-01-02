export const runtime = 'edge';

import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { Shield, Medal, Phone, Gem, Scale, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Guardião',
  description: 'Torne-se um Guardião da Gaivota News.',
};

export default function SupporterPage() {
  const t = useTranslations('SupporterPage');

  return (
    <div className="relative min-h-screen overflow-hidden bg-black font-serif text-amber-50 selection:bg-amber-500/30">
      {/* Ambient Background */}
      <div className="absolute top-0 left-1/2 -ml-96 h-96 w-240 bg-amber-600/10 blur-[120px]" />
      <div className="absolute right-0 bottom-0 h-96 w-240 bg-amber-900/10 blur-[120px]" />

      <div className="relative container mx-auto px-4 py-24 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mx-auto mb-32 max-w-3xl text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full border border-amber-500/20 bg-amber-950/30">
            <Shield className="h-8 w-8 text-amber-500" />
          </div>
          <h1 className="mb-6 font-sans text-5xl font-bold tracking-tight text-white sm:text-7xl">
            {t('hero.title')}
          </h1>
          <p className="font-sans text-xl leading-relaxed text-amber-200/60">
            {t('hero.subtitle')}
          </p>
        </div>

        {/* Mission Statement */}
        <div className="mx-auto mb-32 grid max-w-6xl items-center gap-16 border-y border-amber-900/30 py-20 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 font-sans text-3xl font-bold tracking-wide text-amber-500 uppercase">
              {t('mission.title')}
            </h2>
            <p className="text-2xl leading-snug font-light text-zinc-300 md:text-3xl">
              &quot;{t('mission.description')}&quot;
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex aspect-square flex-col justify-end rounded-lg border border-zinc-800 bg-zinc-900/50 p-8 transition-colors hover:border-amber-500/20">
              <Scale className="mb-auto h-8 w-8 text-amber-500/50" />
              <span className="mb-2 text-4xl font-bold text-amber-500">100%</span>
              <span className="flex min-h-12 items-end font-sans text-sm tracking-widest text-zinc-500 uppercase">
                {t('mission.stats.independent')}
              </span>
            </div>
            <div className="flex aspect-square flex-col justify-end rounded-lg border border-zinc-800 bg-zinc-900/50 p-8 transition-colors hover:border-amber-500/20">
              <Ban className="mb-auto h-8 w-8 text-amber-500/50" />
              <span className="mb-2 text-4xl font-bold text-amber-500">0</span>
              <span className="flex min-h-12 items-end font-sans text-sm tracking-widest text-zinc-500 uppercase">
                {t('mission.stats.corporateAds')}
              </span>
            </div>
          </div>
        </div>

        {/* Privileges Grid */}
        <div className="mx-auto mb-32 max-w-5xl">
          <h2 className="mb-16 text-center font-sans text-sm font-bold tracking-[0.2em] text-amber-500 uppercase">
            {t('privileges.title')}
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Privilege 1 */}
            <Card className="group border-amber-900/20 bg-zinc-900/50 backdrop-blur-sm transition-colors hover:border-amber-500/30">
              <CardContent className="p-8 pt-12 text-center">
                <Gem className="mx-auto mb-6 h-10 w-10 text-amber-500 transition-transform duration-500 group-hover:scale-110" />
                <h3 className="mb-3 font-sans text-xl font-bold text-amber-100">
                  {t('privileges.editorial.title')}
                </h3>
                <p className="leading-relaxed text-amber-200/60">
                  {t('privileges.editorial.description')}
                </p>
              </CardContent>
            </Card>

            {/* Privilege 2 */}
            <Card className="group border-amber-900/20 bg-zinc-900/50 backdrop-blur-sm transition-colors hover:border-amber-500/30">
              <CardContent className="p-8 pt-12 text-center">
                <Medal className="mx-auto mb-6 h-10 w-10 text-amber-500 transition-transform duration-500 group-hover:scale-110" />
                <h3 className="mb-3 font-sans text-xl font-bold text-amber-100">
                  {t('privileges.recognition.title')}
                </h3>
                <p className="leading-relaxed text-amber-200/60">
                  {t('privileges.recognition.description')}
                </p>
              </CardContent>
            </Card>

            {/* Privilege 3 */}
            <Card className="group border-amber-900/20 bg-zinc-900/50 backdrop-blur-sm transition-colors hover:border-amber-500/30">
              <CardContent className="p-8 pt-12 text-center">
                <Phone className="mx-auto mb-6 h-10 w-10 text-amber-500 transition-transform duration-500 group-hover:scale-110" />
                <h3 className="mb-3 font-sans text-xl font-bold text-amber-100">
                  {t('privileges.concierge.title')}
                </h3>
                <p className="leading-relaxed text-amber-200/60">
                  {t('privileges.concierge.description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Concierge CTA */}
        <div className="mx-auto max-w-xl text-center">
          <Button
            size="lg"
            variant="outline"
            className="group relative h-auto overflow-hidden rounded-full border-transparent bg-amber-500 px-12 py-6 font-sans text-xl font-bold tracking-wide text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 hover:scale-105 hover:bg-amber-400 hover:shadow-[0_0_40px_rgba(245,158,11,0.5)]"
            asChild
          >
            <a
              href="https://wa.me/5511999999999?text=Gostaria%20de%20saber%20mais%20sobre%20o%20Circle%20de%20Guardiões"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3"
            >
              <span className="tracking-wide uppercase">{t('cta.label')}</span>
            </a>
          </Button>
          <p className="mt-6 font-sans text-sm tracking-widest text-amber-500/40 uppercase">
            {t('cta.subtext')}
          </p>
        </div>
      </div>
    </div>
  );
}
