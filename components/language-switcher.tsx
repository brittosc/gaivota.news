/**
 * @file language-switcher.tsx
 * @directory gaivota.news\components
 * @author Gaivota News - gaivota.news
 * @version 0.0.1
 * @since 29/12/2025 06:13
 *
 * @description
 * Descrição objetiva da responsabilidade do arquivo
 *
 * @company Gaivota News
 * @system Em qual sistema este arquivo existe?
 * @module Qual parte funcional do sistema ele implementa?
 *
 * @maintenance
 * Alterações devem ser registradas conforme normas internas.
 */

'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Check, ChevronDown, Languages } from 'lucide-react';
import { locales, Locale } from '@/lib/i18n';
import { useTransition } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const languageConfig: Record<Locale, { name: string; flagUrl: string; fallback: string }> = {
  'pt-BR': {
    name: 'Português (Brasil)',
    flagUrl: 'https://flagcdn.com/w80/br.png',
    fallback: 'BR',
  },
  en: {
    name: 'English (US)',
    flagUrl: 'https://flagcdn.com/w80/us.png',
    fallback: 'US',
  },
  es: {
    name: 'Español',
    flagUrl: 'https://flagcdn.com/w80/es.png',
    fallback: 'ES',
  },
  ru: {
    name: 'Русский',
    flagUrl: 'https://flagcdn.com/w80/ru.png',
    fallback: 'RU',
  },
  'zh-CN': {
    name: '简体中文',
    flagUrl: 'https://flagcdn.com/w80/cn.png',
    fallback: 'CN',
  },
  fr: {
    name: 'Français',
    flagUrl: 'https://flagcdn.com/w80/fr.png',
    fallback: 'FR',
  },
  de: {
    name: 'Deutsch',
    flagUrl: 'https://flagcdn.com/w80/de.png',
    fallback: 'DE',
  },
  ar: {
    name: 'العربية',
    flagUrl: 'https://flagcdn.com/w80/sa.png',
    fallback: 'AR',
  },
  hi: {
    name: 'हिन्दी',
    flagUrl: 'https://flagcdn.com/w80/in.png',
    fallback: 'HI',
  },
};

export function LanguageSwitcher() {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;

    startTransition(() => {
      const segments = pathname.split('/');
      segments[1] = newLocale;
      const newPath = segments.join('/');
      router.push(newPath);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'hover:bg-accent hover:border-border h-10 gap-3 border border-transparent px-3 transition-all',
            isPending && 'cursor-wait opacity-50'
          )}
        >
          <div className="flex items-center gap-2">
            <Avatar className="border-border h-5 w-5 border">
              <AvatarImage
                src={languageConfig[currentLocale].flagUrl}
                alt={languageConfig[currentLocale].name}
              />
              <AvatarFallback className="text-[10px]">
                {languageConfig[currentLocale].fallback}
              </AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              {currentLocale}
            </span>
          </div>
          <ChevronDown className="text-muted-foreground/50 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 p-2">
        <div className="text-muted-foreground/70 flex items-center gap-2 px-2 py-1.5 text-xs font-semibold">
          <Languages className="h-3 w-3" />
          Idioma do Sistema
        </div>

        {locales.map(locale => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLanguageChange(locale)}
            className={cn(
              'mt-1 flex cursor-pointer items-center justify-between gap-2 rounded-md p-2 transition-all',
              currentLocale === locale
                ? 'bg-primary/10 text-primary font-medium'
                : 'hover:bg-accent'
            )}
          >
            <div className="flex items-center gap-3">
              <Avatar className="border-border/50 size-5 rounded-sm border">
                <AvatarImage
                  src={languageConfig[locale].flagUrl}
                  alt={languageConfig[locale].name}
                />
                <AvatarFallback>{languageConfig[locale].fallback}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{languageConfig[locale].name}</span>
            </div>

            {currentLocale === locale && (
              <div className="bg-primary flex h-5 w-5 items-center justify-center rounded-full">
                <Check className="text-primary-foreground h-3 w-3" />
              </div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
