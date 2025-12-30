/**
 * @file use-store.ts
 * @directory gaivota.news\hooks
 * @author Mauricio de Britto - grupobritto.com.br
 * @version 0.0.2
 * @since 28/12/2025 18:30
 *
 * @description
 * Gerenciamento de estado global centralizado com persistência local.
 * Tipagem corrigida de 'any' para 'unknown' para conformidade com ESLint.
 *
 * @company Quem é dono do sistema
 * @system Em qual sistema este arquivo existe?
 * @module Qual parte funcional do sistema ele implementa?
 *
 * @maintenance
 * Alterações devem ser registradas conforme normas internas.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface GlobalState {
  sidebarPinned: boolean;
  toggleSidebarPin: () => void;
  userSettings: Record<string, unknown>;
  updateSettings: (key: string, value: unknown) => void;
}

export const useStore = create<GlobalState>()(
  persist(
    set => ({
      sidebarPinned: false,
      userSettings: {},
      toggleSidebarPin: () => set(state => ({ sidebarPinned: !state.sidebarPinned })),
      updateSettings: (key, value) =>
        set(state => ({
          userSettings: { ...state.userSettings, [key]: value },
        })),
    }),
    {
      name: 'app-global-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
