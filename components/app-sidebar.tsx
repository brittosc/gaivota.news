/**
 * @file app-sidebar.tsx
 * @directory gaivota.news\components
 * @author Gaivota News - gaivota.news
 * @version 0.0.1
 * @since 28/12/2025 14:09
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

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup } from '@/components/ui/sidebar';

import { BarChart3, Users, Heart, LogOut, Mail, FileText, ThumbsUp, Folder } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import * as React from 'react';

const sidebarSections = [
  {
    title: 'management.title', // Key for translation
    links: [
      { label: 'management.dashboard', href: '/admin', icon: BarChart3, color: 'text-sky-500' },
      { label: 'management.posts', href: '/admin/posts', icon: FileText, color: 'text-violet-500' },
      {
        label: 'management.newsletter',
        href: '/admin/newsletter',
        icon: Mail,
        color: 'text-indigo-500',
      },
      {
        label: 'management.files',
        href: '/admin/files',
        icon: Folder,
        color: 'text-blue-500',
      },
    ],
  },
  {
    title: 'management.community',
    links: [
      { label: 'management.team', href: '/admin/team', icon: Users, color: 'text-orange-500' },
      {
        label: 'management.supporters',
        href: '/admin/supporters',
        icon: Heart,
        color: 'text-pink-500',
      },
      {
        label: 'management.likes',
        href: '/admin/likes',
        icon: ThumbsUp,
        color: 'text-emerald-500',
      },
    ],
  },
];

import { useTranslations } from 'next-intl';
import { Separator } from './ui/separator';
import Image from 'next/image';

export function AppSidebar() {
  const pathname = usePathname();
  const supabase = createClient();
  const t = useTranslations('Components.Sidebar'); // Hook for translations
  const [profile, setProfile] = React.useState<{
    full_name: string | null;
    avatar_url: string | null;
  } | null>(null);

  React.useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .single();
        if (data) setProfile(data);
      }
    }
    loadProfile();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  // Helper to map keys to text, since sidebarSections is static
  const getLabel = (key: string) => {
    const map: Record<string, string> = {
      'management.title': t('adminTitle'),
      'management.community': t('communityTitle'),
      'management.dashboard': t('dashboard'),
      'management.posts': t('posts') || 'Posts',
      'management.createPost': t('createPost'),
      'management.team': t('team') || 'Colaboradores',
      'management.supporters': t('supporters'),
      'management.likes': t('likes'),
      'management.newsletter': t('newsletter') || 'Newsletter', // Fallback
      'management.files': t('files') || 'Arquivos',
      'site.title': t('siteTitle'),
      'site.home': t('home'),
    };
    return map[key] || key;
  };

  return (
    <Sidebar>
      <SidebarContent className="bg-sidebar p-4 font-bold">
        <Link href="/">
          <Image src="/logo_text.png" alt="Logo" width={156} height={156} className="mx-auto" />
        </Link>
        <Separator />
        {sidebarSections.map(({ title, links }) => (
          <SidebarGroup key={title} className="text-muted-foreground p-4 text-sm">
            <span className="mb-2 block font-medium">{getLabel(title)}</span>

            {links.map(({ label, href, icon: Icon, color }, index) => {
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
                  <Icon
                    className={`size-4 transition-transform duration-200 group-hover:scale-105 ${color || ''}`}
                  />
                  <span>{getLabel(label)}</span>
                </Link>
              );
            })}
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="bg-sidebar space-y-4 border-t p-4">
        {profile && (
          <div className="flex items-center gap-3 px-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile.avatar_url || ''} />
              <AvatarFallback>{profile.full_name?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-sm">
              <span className="text-foreground font-medium">{profile.full_name}</span>
              <button
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-left text-xs transition-colors"
              >
                <LogOut className="h-3 w-3" /> {t('logout')}
              </button>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
