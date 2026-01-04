import { getTranslations } from 'next-intl/server';
import { Lock, Cpu, Fingerprint, Users, Mail, CheckCircle2, Globe, Activity } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming this exists

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Privacy' });
  return {
    title: t('title'),
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Privacy' });

  const today = new Date().toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const sections = [
    { key: 'collection', icon: DatabaseIcon, color: 'text-blue-500' },
    { key: 'usage', icon: Cpu, color: 'text-emerald-500' },
    { key: 'cookies', icon: Fingerprint, color: 'text-amber-500' },
    { key: 'security', icon: Lock, color: 'text-rose-500' },
    { key: 'rights', icon: Users, color: 'text-purple-500' },
    { key: 'contact', icon: Mail, color: 'text-cyan-500' },
  ] as const;

  return (
    <div className="relative min-h-screen overflow-hidden pb-20">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 left-0 -z-10 h-125 w-125 -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[100px] filter">
        <div className="h-full w-full rounded-full bg-blue-500" />
      </div>
      <div className="absolute top-1/2 right-0 -z-10 h-100 w-100 translate-x-1/3 -translate-y-1/2 opacity-20 blur-[100px] filter">
        <div className="h-full w-full rounded-full bg-purple-500" />
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-16">
        {/* Header Section */}
        <div className="mb-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-500 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
            </span>
            System Status: Secure
          </div>

          <h1 className="from-foreground to-foreground/50 mt-8 bg-linear-to-r bg-clip-text text-5xl font-black tracking-tighter text-transparent sm:text-6xl md:text-7xl">
            {t('title')}
          </h1>

          <div className="text-muted-foreground mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="bg-background/50 flex items-center gap-2 rounded-lg border px-3 py-1 text-sm backdrop-blur-sm">
              <Globe className="h-4 w-4" />
              <span>Protocol: HTTPS/TLS 1.3</span>
            </div>
            <div className="bg-background/50 flex items-center gap-2 rounded-lg border px-3 py-1 text-sm backdrop-blur-sm">
              <Activity className="h-4 w-4" />
              <span> {t('lastUpdated', { date: today })}</span>
            </div>
          </div>
        </div>

        {/* Intro Card */}
        <div className="border-primary/20 bg-background/40 mb-16 rounded-2xl border p-8 text-center backdrop-blur-md lg:p-12">
          <p className="text-foreground/80 mx-auto max-w-3xl text-lg leading-relaxed md:text-xl">
            {t('intro')}
          </p>
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
                  0{index + 1}
                </div>
                <div className="from-primary/10 absolute right-0 bottom-0 h-20 w-20 translate-x-10 translate-y-10 rounded-full bg-linear-to-br to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />
              </div>
            );
          })}
        </div>

        {/* Footer Tech Check */}
        <div className="mt-20 flex justify-center">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {['gdpr', 'lgpd', 'encryption', 'monitoring'].map(key => (
              <div
                key={key}
                className="bg-muted/20 flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold backdrop-blur-sm"
              >
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                {t(`footer.${key}`)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DatabaseIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}
