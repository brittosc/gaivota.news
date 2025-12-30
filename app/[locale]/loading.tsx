/**
 * @file loading.tsx
 * @directory gaivota.news\app
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

import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="bg-background flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="text-primary h-10 w-10 animate-spin" />
        <p className="text-muted-foreground text-sm font-medium">Carregando...</p>
      </div>
    </div>
  );
}
