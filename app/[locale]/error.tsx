/**
 * @file error.tsx
 * @directory gaivota.news\app
 * @author Gaivota News - gaivota.news
 * @version 0.0.1
 * @since 27/12/2025 21:09
 *
 * @description
 * Descrição objetiva da responsabilidade do arquivo
 *
 * @company Gaivota News
 * @system Em qual sistema este arquivo existe?
 * @module Qual parte funcional do sistema ele implementa?
 *
 * @maintenance
 * Alterações devem ser registradas conforme normas internas.
 */

'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from '@/components/ui/empty';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('Error');

  useEffect(() => {
    console.error('Erro capturado:', error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] w-full items-center justify-center px-6">
      <Empty>
        <EmptyMedia variant="icon">⚠️</EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>{t('title')}</EmptyTitle>
          <EmptyDescription>{t('description')}</EmptyDescription>
        </EmptyHeader>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} className="w-full sm:w-auto">
            {t('tryAgain')}
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => (window.location.href = '/')}
          >
            {t('goHome')}
          </Button>
        </div>
      </Empty>
    </main>
  );
}
