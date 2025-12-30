/**
 * @file page.tsx
 * @directory template-nextjs\app\settings
 * @author Mauricio de Britto - grupobritto.com.br
 * @version 0.0.1
 * @since 28/12/2025 14:10
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

export const runtime = 'edge';

import { useSettings } from '@/components/providers/settings-provider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Volume2, VolumeX, Palette, Bell, BellOff, Globe } from 'lucide-react';
import { ThemeSwitch } from '@/components/theme/theme-toggle';
import { useEffect } from 'react';
import { useModal } from '@/components/providers/modal-provider';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/language-switcher';

export default function SettingsPage() {
  const t = useTranslations('Settings');
  const m = useTranslations('modal');

  const { onOpen } = useModal();
  const { isSoundEnabled, toggleSound, isNotificationsEnabled, toggleNotifications, playSound } =
    useSettings();

  const handleSoundToggle = (checked: boolean) => {
    toggleSound();
    if (checked) {
      setTimeout(() => playSound(), 100);
    }
  };

  useEffect(() => {
    onOpen('info', {
      title: m('settings.title'),
      message: m('settings.message'),
      buttonText: m('settings.common.close'),
    });
  }, [onOpen, m]);

  return (
    <div className="bg-muted h-screen">
      <div className="container mx-auto max-w-2xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>

        <Card>
          <CardContent className="space-y-6">
            {/* TEMA */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <Label className="flex items-center gap-2 text-base">
                  <Palette className="size-4" />
                  {t('darkMode.0')}
                </Label>
                <p className="text-muted-foreground text-sm">{t('darkMode.1')}</p>
              </div>
              <ThemeSwitch />
            </div>

            <Separator className="opacity-50" />

            {/* NOTIFICAÇÕES */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <Label
                  htmlFor="notify-mode"
                  className="flex cursor-pointer items-center gap-2 text-base"
                >
                  {isNotificationsEnabled ? (
                    <Bell className="size-4" />
                  ) : (
                    <BellOff className="size-4" />
                  )}
                  {t('visualNotifications.0')}
                </Label>
                <p className="text-muted-foreground text-sm">{t('visualNotifications.0')}</p>
              </div>
              <Switch
                id="notify-mode"
                checked={isNotificationsEnabled}
                onCheckedChange={toggleNotifications}
              />
            </div>

            <Separator className="opacity-50" />

            {/* SOM */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <Label
                  htmlFor="sound-mode"
                  className="flex cursor-pointer items-center gap-2 text-base"
                >
                  {isSoundEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
                  {t('soundEffects.0')}
                </Label>
                <p className="text-muted-foreground text-sm">{t('soundEffects.0')}</p>
              </div>
              <Switch
                id="sound-mode"
                checked={isSoundEnabled}
                onCheckedChange={handleSoundToggle}
              />
            </div>

            <Separator className="opacity-50" />

            <div className="hover:bg-muted/30 -mx-2 flex items-center justify-between rounded-lg p-2 transition-colors">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Globe className="text-muted-foreground size-4" />
                  <p className="text-sm font-medium">{t('languageSelect.0')}</p>
                </div>
                <p className="text-muted-foreground text-xs">{t('languageSelect.1')}</p>
              </div>
              <div className="flex min-w-35 justify-end">
                <LanguageSwitcher />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
