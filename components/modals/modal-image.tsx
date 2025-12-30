/**
 * @file modal-image.tsx
 * @directory gaivota.news\components\modals
 * @author Mauricio de Britto - grupobritto.com.br
 * @version 0.0.1
 * @since 28/12/2025 14:071
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

import Image from 'next/image';
import { XIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogClose, DialogTitle } from '@/components/ui/dialog';
import { useModal } from '@/components/providers/modal-provider';

export function WelcomeModal() {
  const { isOpen, type, onClose, data } = useModal();

  const isModalOpen = isOpen && type === 'welcome';
  const imageUrl = data?.imageUrl as string | undefined;

  if (!imageUrl) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="max-w-fit border-none bg-transparent p-0 shadow-none outline-none"
      >
        <DialogTitle className="sr-only">Aviso Visual</DialogTitle>

        <div className="relative flex flex-col items-center justify-center">
          {/* Botão de Fechar Padronizado (Mesmo estilo do TextModal) */}
          <DialogClose className="bg-primary text-primary-foreground absolute -top-3 -right-3 z-50 flex h-9 w-9 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95">
            <XIcon className="h-5 w-5" />
            <span className="sr-only">Fechar</span>
          </DialogClose>

          {/* Container da Imagem com bordas arredondadas e sombra para alinhar com o card de texto */}
          <div className="overflow-hidden rounded-lg shadow-2xl">
            <Image
              src={imageUrl}
              alt="Comunicado"
              width={1920}
              height={1080}
              priority
              className="h-auto max-h-[80vh] w-full max-w-[95vw] object-contain sm:max-w-2xl"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
