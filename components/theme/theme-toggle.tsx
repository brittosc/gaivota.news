/**
 * @file theme-toggle.tsx
 * @directory gaivota.news\components\theme
 * @author Mauricio de Britto - grupobritto.com.br
 * @version 0.0.1
 * @since 21/12/2025 13:33
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

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';
import { Sun, Moon } from 'lucide-react';

export function ThemeSwitch() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Switch disabled aria-label="Carregando tema" />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="flex items-center gap-2">
      <Sun
        className={`h-4 w-4 transition-colors ${isDark ? 'text-muted-foreground' : 'text-yellow-500'}`}
      />

      <Switch
        id="theme-toggle"
        checked={isDark}
        onCheckedChange={checked => setTheme(checked ? 'dark' : 'light')}
        aria-label="Alternar tema"
      />

      <Moon
        className={`h-4 w-4 transition-colors ${isDark ? 'text-blue-400' : 'text-muted-foreground'}`}
      />
    </div>
  );
}
