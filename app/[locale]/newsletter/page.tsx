export const runtime = 'edge';

import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { CheckCircle2, TrendingUp, Zap } from 'lucide-react';
import { NewsletterForm } from '@/components/newsletter-form';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Newsletter',
  description: 'Inscreva-se na nossa newsletter premium.',
};

export default function NewsletterPage() {
  const t = useTranslations('NewsletterPage');

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-white selection:bg-emerald-500/30">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -ml-160 h-160 w-7xl bg-emerald-500/10 blur-[100px]" />
      <div className="absolute right-0 bottom-0 h-160 w-7xl bg-indigo-500/10 blur-[100px]" />

      <div className="relative container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-24">
          {/* Left Column: Content */}
          <div className="max-w-xl space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400">
                <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                {t('joinCount')}
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-5xl xl:text-6xl">
                {t('title')}
              </h1>
              <p className="text-lg text-zinc-400 sm:text-xl">{t('subtitle')}</p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{t('benefits.analysisTitle')}</h3>
                  <p className="text-sm text-zinc-400">{t('benefits.analysisDesc')}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
                  <Zap className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{t('benefits.exclusiveTitle')}</h3>
                  <p className="text-sm text-zinc-400">{t('benefits.exclusiveDesc')}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
                  <CheckCircle2 className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{t('benefits.communityTitle')}</h3>
                  <p className="text-sm text-zinc-400">{t('benefits.communityDesc')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form Card */}
          <div className="w-full max-w-md lg:mx-auto">
            <Card className="border-zinc-800 bg-zinc-900/50 shadow-2xl backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="mb-8">
                  <h2 className="mb-2 text-xl font-semibold text-white">{t('subscribe')}</h2>
                  <p className="text-sm text-zinc-400">{t('subtitle')}</p>
                </div>
                <NewsletterForm />
                <p className="mt-4 text-center text-xs text-zinc-500">
                  {t.raw
                    ? t
                        .raw('error')
                        .replace('Erro ao inscrever-se.', 'Sem spam. Cancele a qualquer momento.')
                    : 'Sem spam. Cancele a qualquer momento.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
