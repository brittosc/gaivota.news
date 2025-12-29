/**
 * @file modal-provider.tsx
 * @directory template-nextjs\components\providers
 * @author Mauricio de Britto - grupobritto.com.br
 * @version 0.0.1
 * @since 28/12/2025 14:07
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

import { createContext, useContext, useState, useCallback } from 'react';
import { WelcomeModal } from '../modals/modal-image';
import { TextModal } from '../modals/modal-text';

interface ModalContextType {
  isOpen: boolean;
  type: string | null;
  data: Record<string, unknown>; //
  onOpen: (type: string, data?: Record<string, unknown>) => void; //
  onClose: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<string | null>(null);
  const [data, setData] = useState<Record<string, unknown>>({}); //

  const onOpen = useCallback((type: string, data: Record<string, unknown> = {}) => {
    setType(type);
    setData(data);
    setIsOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
    setType(null);
  }, []);

  return (
    <ModalContext.Provider value={{ isOpen, type, data, onOpen, onClose }}>
      {children}
      <WelcomeModal />
      <TextModal />
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal deve ser usado dentro de um ModalProvider');
  }
  return context;
};
