/**
 * @file page.tsx
 * @directory template-nextjs\app\exemplo
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

import { useSettings } from '@/components/providers/settings-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Bell, Play, CheckCircle2, FlaskConical } from 'lucide-react';
import { ThemeSwitch } from '@/components/theme/theme-toggle';

export default function TestPage() {
  const { playSound, isSoundEnabled, isNotificationsEnabled } = useSettings();

  const handleTestAll = () => {
    playSound();
    toast.success('Integração Completa!', {
      description: 'O som e a notificação visual foram sincronizados com sucesso.',
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 transition-colors">
      <Card className="w-full max-w-md border-zinc-200 shadow-lg dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FlaskConical className="text-primary h-5 w-5" />
            Laboratório de Componentes
          </CardTitle>
          <CardDescription>Valide as configurações globais de interface e áudio.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Bloco de Teste: TEMA */}
          <div className="flex items-center justify-between rounded-lg border bg-white p-3 dark:bg-zinc-900">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-muted-foreground text-xs">Alternar visual do sistema</p>
            </div>
            <ThemeSwitch />
          </div>

          {/* Bloco de Teste: Som individual */}
          <div className="flex items-center justify-between rounded-lg border bg-white p-3 dark:bg-zinc-900">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Efeito Sonoro</p>
              <p className="text-muted-foreground text-xs">
                Status: {isSoundEnabled ? 'Ativado' : 'Silenciado'}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => playSound()}
              title={!isSoundEnabled ? 'Habilite o som nas configurações' : ''}
            >
              <Play className="mr-2 h-4 w-4" />
              Tocar
            </Button>
          </div>

          {/* Bloco de Teste: Notificação */}
          <div className="flex items-center justify-between rounded-lg border bg-white p-3 dark:bg-zinc-900">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Notificação Visual</p>
              <p className="text-muted-foreground text-xs">
                Status: {isNotificationsEnabled ? 'Visível' : 'Oculta'}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.info('Teste de notificação sem som!')}
            >
              <Bell className="mr-2 h-4 w-4" />
              Exibir
            </Button>
          </div>

          {/* Bloco te Teste: Todos as configurações */}
          <Button className="w-full py-6 text-base font-semibold" onClick={handleTestAll}>
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Testar Fluxo Completo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
