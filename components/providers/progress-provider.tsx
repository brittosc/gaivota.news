/**
 * @file progress-provider.tsx
 * @directory gaivota.news\components\providers
 * @author Mauricio de Britto - grupobritto.com.br
 * @version 0.0.1
 * @since 28/12/2025 14:08
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

import { useEffect, useState, startTransition } from 'react';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    });
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <ProgressBar
        height="3px"
        color="hsl(var(--primary))"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
}
