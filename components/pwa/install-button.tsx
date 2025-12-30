/**
 * @file install-button.tsx
 * @directory gaivota.news\components\pwa
 * @author Mauricio de Britto - grupobritto.com.br
 * @version 0.0.1
 * @since 21/12/2025 13:32
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

import { Button } from '@/components/ui/button';
import { usePwaInstall } from '@/hooks/use-pwa-install';
import { Download } from 'lucide-react'; // Ou outro ícone de sua preferência

export function InstallButton() {
  const { showInstallButton, installApp } = usePwaInstall();

  // Se o navegador não disparou o evento (ex: já instalado ou não suportado), não renderiza nada
  if (!showInstallButton) {
    return null;
  }

  return (
    <div className="fixed right-0 bottom-6 left-0 z-50 flex justify-center px-4 md:hidden">
      {/* A classe 'md:hidden' garante que suma em telas médias/desktop.
         'fixed bottom-6' posiciona flutuando na parte inferior.
      */}
      <Button
        onClick={installApp}
        size="lg"
        className="animate-in fade-in slide-in-from-bottom-4 w-full font-bold shadow-lg"
      >
        <Download className="mr-2 h-4 w-4" />
        Instalar App
      </Button>
    </div>
  );
}
