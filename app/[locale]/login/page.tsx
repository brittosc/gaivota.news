export const runtime = 'edge';

import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import LoginButton from './login-button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Faça login para acessar o blog.',
};

export default function LoginPage() {
  const t = useTranslations('login');

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side - Marketing (Hidden on mobile) */}
      <div className="hidden w-1/2 flex-col justify-between bg-zinc-900 p-10 text-white lg:flex">
        <div className="flex items-center gap-2">
          {/* Logo Placeholder or App Name */}
          <div className="h-8 w-8 rounded-full bg-white/20" />
          <span className="text-xl font-bold">Gaivota.news</span>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <div className="mx-auto flex max-w-md flex-col items-center space-y-6 text-center">
            <h1 className="text-4xl leading-tight font-bold tracking-tight">
              {t('marketingTitle')}
            </h1>
            <p className="text-lg text-zinc-400">{t('marketingSubtitle')}</p>

            <div className="mt-8 flex flex-col items-center space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span>{t('feature1')}</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span>{t('feature2')}</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span>{t('feature3')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-zinc-500">&copy; {new Date().getFullYear()} Gaivota.news</div>
      </div>

      {/* Right Side - Login Form */}
      <div className="bg-background flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-foreground text-2xl font-bold tracking-tight">
              {t('welcomeBack')}
            </h2>
            <p className="text-muted-foreground">{t('description')}</p>
          </div>

          <Card className="border-none shadow-none">
            <CardContent className="p-0">
              <LoginButton />
            </CardContent>
          </Card>

          <p className="text-muted-foreground px-8 text-center text-xs">
            {t('termsNotice')}{' '}
            <Link href="/terms" className="hover:text-primary underline underline-offset-4">
              {t('termsOfUse')}
            </Link>{' '}
            {t('and')}{' '}
            <Link href="/privacy" className="hover:text-primary underline underline-offset-4">
              {t('privacyPolicy')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
