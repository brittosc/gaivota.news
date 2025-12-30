/**
 * @file settings-provider.tsx
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

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  startTransition,
} from 'react';

interface SettingsContextType {
  isSoundEnabled: boolean;
  toggleSound: () => void;
  isNotificationsEnabled: boolean;
  toggleNotifications: () => void;
  playSound: (soundPath?: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean | null>(null);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState<boolean | null>(null);
  const lastPlayedRef = useRef<number>(0);

  useEffect(() => {
    const sound = localStorage.getItem('app-sound-enabled');
    const notify = localStorage.getItem('app-notifications-enabled');

    /**
     * CORREÇÃO: Usamos startTransition para marcar estas atualizações como
     * não urgentes. Isso remove o erro de 'cascading renders' pois o React
     * entende que ele pode processar o mount inicial antes de aplicar estes estados.
     */
    startTransition(() => {
      try {
        setIsSoundEnabled(sound !== null ? JSON.parse(sound) : true);
        setIsNotificationsEnabled(notify !== null ? JSON.parse(notify) : true);
      } catch {
        setIsSoundEnabled(true);
        setIsNotificationsEnabled(true);
      }
    });

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'app-sound-enabled' && e.newValue !== null) {
        setIsSoundEnabled(JSON.parse(e.newValue));
      }
      if (e.key === 'app-notifications-enabled' && e.newValue !== null) {
        setIsNotificationsEnabled(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleSound = () => {
    setIsSoundEnabled(prev => {
      const newState = !(prev ?? true);
      localStorage.setItem('app-sound-enabled', JSON.stringify(newState));
      return newState;
    });
  };

  const toggleNotifications = () => {
    setIsNotificationsEnabled(prev => {
      const newState = !(prev ?? true);
      localStorage.setItem('app-notifications-enabled', JSON.stringify(newState));
      return newState;
    });
  };

  const playSound = (soundPath: string = '/sounds/notification.mp3') => {
    const now = Date.now();
    if (isSoundEnabled === true && now - lastPlayedRef.current > 1500) {
      const audio = new Audio(soundPath);
      audio
        .play()
        .then(() => {
          lastPlayedRef.current = Date.now();
        })
        .catch(() => {});
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        isSoundEnabled: isSoundEnabled ?? true,
        toggleSound,
        isNotificationsEnabled: isNotificationsEnabled ?? true,
        toggleNotifications,
        playSound,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings deve ser usado dentro de SettingsProvider');
  return context;
};
