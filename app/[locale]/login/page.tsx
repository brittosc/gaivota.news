/**
 * @file page.tsx
 * @directory template-nextjs/app/login
 * @author Mauricio de Britto
 * @version 0.1.0
 * @since 21/12/2025
 *
 * @description
 * Descrição objetiva da responsabilidade do arquivo
 *
 * @company Quem é dono do sistema
 * @system Em qual sistema este arquivo existe?
 * @module Qual parte funcional do sistema ele implementa?
 *
 * @maintenance
 * Alterações devem ser registradas conforme normas internas.
 */

'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Chrome, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('login');
  const c = useTranslations('Common');
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=/profile`,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="bg-muted/40 w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          {/* Logo opcional */}
          <div className="bg-primary text-primary-foreground mx-auto flex h-12 w-12 items-center justify-center rounded-xl font-bold">
            GB
          </div>

          <CardTitle className="text-2xl font-bold">{t('welcomeBack')}</CardTitle>

          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Button
            variant="outline"
            size="lg"
            className="flex w-full items-center gap-3"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Chrome className="h-5 w-5" />
            )}
            {loading ? c('loading') : t('signInWithGoogle')}
          </Button>

          <p className="text-muted-foreground text-center text-xs leading-relaxed">
            {t('termsNotice')}{' '}
            <span className="cursor-pointer underline underline-offset-2">{t('termsOfUse')}</span>{' '}
            {t('and')}{' '}
            <span className="cursor-pointer underline underline-offset-2">
              {t('privacyPolicy')}
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
