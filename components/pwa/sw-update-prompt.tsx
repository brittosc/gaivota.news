/**
 * @file sw-update-prompt.tsx
 * @directory gaivota.news\components\pwa
 * @author Mauricio de Britto - grupobritto.com.br
 * @version 0.0.1
 * @since 27/12/2025 21:10
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

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function ServiceWorkerUpdatePrompt() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null | undefined>(
    null
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(reg => {
        setRegistration(reg);

        // Prompt imediatamente se um SW já estiver waiting.
        if (reg?.waiting) {
          window.dispatchEvent(new Event('sw-update-available'));
        }
      });
    }
  }, []);

  useEffect(() => {
    if (!registration) return;

    const onUpdateFound = () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          toast.info('Nova versão disponível!', {
            description: 'Atualize a aplicação para ter as últimas funcionalidades.',
            duration: Infinity,
            action: {
              label: 'Atualizar',
              onClick: () => {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              },
            },
          });
        }
      });
    };

    registration.addEventListener('updatefound', onUpdateFound);

    const showWaitingPrompt = () => {
      const waitingWorker = registration.waiting;
      if (!waitingWorker) return;

      toast.info('Nova versão disponível!', {
        description: 'Atualize a aplicação para ter as últimas funcionalidades.',
        duration: Infinity,
        action: {
          label: 'Atualizar',
          onClick: () => {
            waitingWorker.postMessage({ type: 'SKIP_WAITING' });
          },
        },
      });
    };

    window.addEventListener('sw-update-available', showWaitingPrompt);

    const onControllerChange = () => {
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    return () => {
      registration.removeEventListener('updatefound', onUpdateFound);
      window.removeEventListener('sw-update-available', showWaitingPrompt);
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    };
  }, [registration]);

  return null;
}
