import { getTranslations } from 'next-intl/server';
import {
  Scale,
  FileText,
  ShieldCheck,
  UserCheck,
  RefreshCw,
  MessageSquare,
  Gavel,
  CheckCircle2,
  Activity,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Terms' });
  return {
    title: t('title'),
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Terms' });

  const today = new Date().toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const sections = [
    { key: 'acceptance', icon: FileText, color: 'text-blue-500' },
    { key: 'mission', icon: Scale, color: 'text-emerald-500' },
    { key: 'intellectual', icon: Award, color: 'text-amber-500' },
    { key: 'responsibility', icon: UserCheck, color: 'text-rose-500' },
    { key: 'modifications', icon: RefreshCw, color: 'text-purple-500' },
    { key: 'contact', icon: MessageSquare, color: 'text-cyan-500' },
  ] as const;

  return (
    <div className="relative min-h-screen overflow-hidden pb-20">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 right-0 -z-10 h-150 w-150 translate-x-1/2 -translate-y-1/2 opacity-10 blur-[120px] filter">
        <div className="h-full w-full rounded-full bg-emerald-500" />
      </div>
      <div className="absolute bottom-0 left-0 -z-10 h-125 w-125 -translate-x-1/3 translate-y-1/4 opacity-10 blur-[100px] filter">
        <div className="h-full w-full rounded-full bg-blue-600" />
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-16">
        {/* Header Section */}
        <div className="mb-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-500 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            {t('status')}
          </div>

          <h1 className="from-foreground to-foreground/50 mt-8 bg-linear-to-br bg-clip-text text-5xl font-black tracking-tighter text-transparent sm:text-6xl md:text-7xl">
            {t('title')}
          </h1>

          <div className="text-muted-foreground mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="bg-background/50 flex items-center gap-2 rounded-lg border px-3 py-1 text-sm backdrop-blur-sm">
              <Gavel className="h-4 w-4" />
              <span>{t('jurisdiction')}</span>
            </div>
            <div className="bg-background/50 flex items-center gap-2 rounded-lg border px-3 py-1 text-sm backdrop-blur-sm">
              <Activity className="h-4 w-4" />
              <span>Ver. 2.0.4 ({t('lastUpdated', { date: today })})</span>
            </div>
          </div>
        </div>

        {/* Intro Card */}
        <div className="border-primary/10 from-background/80 to-background/40 mb-16 rounded-2xl border bg-linear-to-b p-1 backdrop-blur-md">
          <div className="bg-background/50 rounded-xl p-8 text-center lg:p-12">
            <p className="text-foreground/80 mx-auto max-w-3xl text-lg leading-relaxed md:text-xl">
              {t('intro')}
            </p>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={section.key}
                className="group bg-background/40 hover:border-primary/50 hover:bg-background/60 hover:shadow-primary/10 relative overflow-hidden rounded-2xl border p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="bg-background ring-border group-hover:ring-primary/50 mb-4 flex h-12 w-12 items-center justify-center rounded-lg shadow-inner ring-1">
                  <Icon className={cn('h-6 w-6 transition-colors duration-300', section.color)} />
                </div>

                <h3 className="mb-3 text-xl font-bold tracking-tight">
                  {t(`sections.${section.key}.title`)}
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t(`sections.${section.key}.content`)}
                </p>

                {/* Tech Decoration */}
                <div className="text-muted-foreground/30 absolute top-4 right-4 font-mono text-[10px] opacity-0 transition-opacity group-hover:opacity-100">
                  REF-{String(index + 1).padStart(3, '0')}
                </div>
                <div className="from-primary/5 absolute right-0 bottom-0 h-24 w-24 translate-x-8 translate-y-8 rounded-full bg-linear-to-tl to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />
              </div>
            );
          })}
        </div>

        {/* Footer Tech Check */}
        <div className="border-border/50 mt-20 border-t pt-10">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="text-muted-foreground h-5 w-5" />
              <span className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
                {t('compliance.title')}
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {['digitalSignature', 'timeStamped', 'versionControlled', 'publicLedger'].map(
                item => (
                  <div
                    key={item}
                    className="bg-muted/20 text-muted-foreground flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase backdrop-blur-sm"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    {t(`compliance.items.${item}`)}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
