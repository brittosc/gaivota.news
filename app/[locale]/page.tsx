/**
 * @file page.tsx
 * @directory template-nextjs\app\[locale]
 * @author Mauricio de Britto - grupobritto.com.br
 * @version 0.0.1
 * @since 29/12/2025 06:17
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

import { useTranslations } from 'next-intl';
import { useModal } from '@/components/providers/modal-provider';
import { useEffect } from 'react';

export default function Home() {
  const t = useTranslations('HomePage');
  const { onOpen } = useModal();

  useEffect(() => {
    onOpen('welcome', {
      message: t('modalMessage'),
      imageUrl: '/modal/latest.jpeg',
    });
  }, [onOpen, t]);

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center font-sans">
      <main className="text-center">
        <h1 className="tracking-tight">{t('title')}</h1>
      </main>
    </div>
  );
}
