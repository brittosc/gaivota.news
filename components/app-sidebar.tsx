/**
 * @file app-sidebar.tsx
 * @directory template-nextjs\components
 * @author Mauricio de Britto - grupobritto.com.br
 * @version 0.0.1
 * @since 28/12/2025 14:09
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

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';

import { Sidebar, SidebarContent, SidebarGroup } from '@/components/ui/sidebar';

import {
  BarChart3,
  BookOpen,
  Briefcase,
  ClipboardList,
  Cog,
  Settings,
  Shield,
  Users,
  Wrench,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

type SidebarLink = {
  labelKey: string;
  href: string;
  icon: LucideIcon;
};

type SidebarSection = {
  titleKey: string;
  links: SidebarLink[];
};
const sidebarSections: SidebarSection[] = [
  {
    titleKey: 'management.title',
    links: [
      { labelKey: 'management.administration', href: '#', icon: Briefcase },
      { labelKey: 'management.indicators', href: '#', icon: BarChart3 },
      { labelKey: 'management.teams', href: '#', icon: Users },
    ],
  },
  {
    titleKey: 'operational.title',
    links: [
      { labelKey: 'operational.operations', href: '#', icon: ClipboardList },
      { labelKey: 'operational.processes', href: '#', icon: Cog },
      { labelKey: 'operational.maintenance', href: '#', icon: Wrench },
    ],
  },
  {
    titleKey: 'system.title',
    links: [
      { labelKey: 'system.logs', href: '#', icon: BookOpen },
      { labelKey: 'system.settings', href: '/settings', icon: Settings },
      { labelKey: 'system.permissions', href: '#', icon: Shield },
    ],
  },
];

export function AppSidebar() {
  const t = useTranslations('sidebar');
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent className="bg-zinc-50 p-4 font-bold dark:bg-zinc-900">
        {sidebarSections.map(({ titleKey, links }) => (
          <SidebarGroup key={titleKey} className="text-muted-foreground p-4 text-sm">
            <span className="mb-2 block font-medium">{t(titleKey)}</span>

            {links.map(({ labelKey, href, icon: Icon }, index) => {
              const isActive = pathname === href;

              return (
                <Link
                  key={labelKey}
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  style={{ transitionDelay: `${index * 40}ms` }}
                  className={`group hover:bg-muted hover:text-foreground mt-1 flex items-center gap-2 rounded-md px-2 py-1 transition-colors duration-200 ${
                    isActive ? 'bg-muted text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="size-4 transition-transform duration-200 group-hover:scale-105" />
                  <span>{t(labelKey)}</span>
                </Link>
              );
            })}
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
