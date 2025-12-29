/**
 * @file page.tsx
 * @directory template-nextjs\app\offline
 * @author Mauricio de Britto - grupobritto.com.br
 * @version 0.0.1
 * @since 27/12/2025 21:09
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

import { WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function OfflinePage() {
  const t = useTranslations('Offline');
  const c = useTranslations('Common');

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="bg-muted rounded-full p-6">
        <WifiOff className="text-muted-foreground h-12 w-12" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter">{t('title')}</h1>
        <p className="text-muted-foreground max-w-150">{t('subtitle')}</p>
      </div>
      <Button asChild variant="default" size="lg">
        <Link href="/">{c('tryAgain')}</Link>
      </Button>
    </div>
  );
}
