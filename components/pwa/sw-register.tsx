/**
 * @file sw-register.tsx
 * @directory template-nextjs\components\pwa
 * @author Mauricio de Britto - grupobritto.com.br
 * @version 0.0.1
 * @since 21/12/2025 13:33
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

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;

    let registration: ServiceWorkerRegistration | undefined;

    navigator.serviceWorker
      .register('/sw.js')
      .then(reg => {
        registration = reg;
        console.log('SW registrado com sucesso:', reg.scope);

        // Se já houver um worker em estado waiting, sinalizamos para a UI exibir o prompt.
        if (reg.waiting) {
          window.dispatchEvent(new Event('sw-update-available'));
        }
      })
      .catch(error => {
        console.error('Falha ao registrar SW:', error);
      });

    return () => {
      registration?.update?.();
    };
  }, []);

  return null; // Este componente não renderiza nada visualmente
}
