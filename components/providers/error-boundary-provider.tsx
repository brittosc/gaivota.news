/**
 * @file error-boundary-provider.tsx
 * @directory gaivota.news\components\providers
 * @author Mauricio de Britto - grupobritto.com.br
 * @version 0.0.1
 * @since 29/12/2025 06:16
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

import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <div className="bg-destructive/10 text-destructive rounded-full p-3">
          <AlertTriangle className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold">Algo deu muito errado</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Ocorreu um erro crítico na interface que impediu o carregamento. Detalhes:
          <code className="bg-muted mt-2 block rounded p-2 font-mono text-xs">{error.message}</code>
        </p>
        <Button onClick={resetErrorBoundary} className="mt-2 w-full">
          Tentar recarregar interface
        </Button>
      </div>
    </div>
  );
}

export function ErrorBoundaryProvider({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      {children}
    </ErrorBoundary>
  );
}
