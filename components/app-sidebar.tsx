/**
 * @file app-sidebar.tsx
 * @directory gaivota.news\components
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

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup } from '@/components/ui/sidebar';
import { ThemeSwitch } from '@/components/theme/theme-toggle';

import { BarChart3, Briefcase, ClipboardList } from 'lucide-react';

type SidebarLink = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type SidebarSection = {
  title: string;
  links: SidebarLink[];
};

const sidebarSections: SidebarSection[] = [
  {
    title: 'Administração',
    links: [
      { label: 'Dashboard', href: '/admin', icon: BarChart3 },
      { label: 'Criar Post', href: '/admin/posts/create', icon: ClipboardList },
    ],
  },
  {
    title: 'Site',
    links: [{ label: 'Página Inicial', href: '/', icon: Briefcase }],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent className="bg-zinc-50 p-4 font-bold dark:bg-zinc-900">
        {sidebarSections.map(({ title, links }) => (
          <SidebarGroup key={title} className="text-muted-foreground p-4 text-sm">
            <span className="mb-2 block font-medium">{title}</span>

            {links.map(({ label, href, icon: Icon }, index) => {
              const isActive = pathname === href;

              return (
                <Link
                  key={label}
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  style={{ transitionDelay: `${index * 40}ms` }}
                  className={`group hover:bg-muted hover:text-foreground mt-1 flex items-center gap-2 rounded-md px-2 py-1 transition-colors duration-200 ${
                    isActive ? 'bg-muted text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="size-4 transition-transform duration-200 group-hover:scale-105" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="flex items-center justify-center border-t p-4">
        <ThemeSwitch />
      </SidebarFooter>
    </Sidebar>
  );
}
