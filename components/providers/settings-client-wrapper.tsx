/**
 * @file settings-client-wrapper.tsx
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

import { useSettings } from '@/components/providers/settings-provider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

export function SettingsClientWrapper({ children }: { children: React.ReactNode }) {
  const { isNotificationsEnabled } = useSettings();

  return (
    <TooltipProvider delayDuration={0}>
      {children}
      {isNotificationsEnabled && (
        <Toaster position="bottom-right" richColors closeButton expand={true} duration={5000} />
      )}
    </TooltipProvider>
  );
}
