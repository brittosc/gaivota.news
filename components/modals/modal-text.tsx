/**
 * @file modal-text.tsx
 * @directory template-nextjs\components\modals
 * @author Mauricio de Britto - grupobritto.com.br
 * @version 0.0.1
 * @since 28/12/2025 14:20
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

import { XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useModal } from '@/components/providers/modal-provider';

export function TextModal() {
  const t = useTranslations('modal.defaults');
  const { isOpen, type, onClose, data } = useModal();

  const isModalOpen = isOpen && type === 'info';

  const title = (data?.title as string) || t('title');
  const message = (data?.message as string) || t('message');
  const buttonText = (data?.buttonText as string) || t('button');

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="bg-muted text-foreground max-w-[95vw] rounded-lg p-8 sm:max-w-lg"
      >
        {/* Botão de Fechar Padronizado */}
        <DialogClose className="bg-primary text-primary-foreground absolute -top-3 -right-3 z-50 flex h-9 w-9 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95">
          <XIcon className="h-5 w-5" />
          <span className="sr-only">Fechar</span>
        </DialogClose>

        <DialogHeader className="flex flex-col items-center gap-3 text-center">
          <DialogTitle className="text-2xl font-bold tracking-tight">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground text-base leading-relaxed">
            {message}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-8 flex justify-center sm:justify-center">
          <Button
            onClick={onClose}
            size="lg"
            className="w-full min-w-40 font-semibold shadow-sm sm:w-auto"
          >
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
