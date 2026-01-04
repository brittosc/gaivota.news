/**
 * @file page.tsx
 * @directory gaivota.news\app\profile
 * @author Gaivota News - gaivota.news
 * @version 0.0.1
 * @since 21/12/2025 13:31
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

export const runtime = 'edge';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { LogOut, Mail, ShieldCheck, User } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function ProfilePage() {
  const t = await getTranslations('Profile');
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const userDetails = {
    name: user.user_metadata.full_name || t('defaultName'),
    email: user.email ?? '-',
    avatar: user.user_metadata.avatar_url,
    initials:
      user.user_metadata.full_name
        ?.split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase() || 'U',
    provider: 'Google OAuth',
  };

  const handleLogout = async () => {
    'use server';
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/login');
  };

  return (
    <div className="bg-muted/40 flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="flex flex-col items-center gap-4 text-center">
          <Avatar className="border-primary/20 h-28 w-28 border-2">
            <AvatarImage src={userDetails.avatar} alt={userDetails.name} />
            <AvatarFallback className="bg-muted text-2xl">{userDetails.initials}</AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold">{userDetails.name}</CardTitle>
            <CardDescription className="flex items-center justify-center gap-2">
              <Mail className="h-4 w-4" />
              {userDetails.email}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Separator />

          <div className="space-y-3">
            <div className="bg-muted/50 flex items-center gap-3 rounded-lg border p-3 text-sm">
              <User className="text-primary h-4 w-4" />
              <span className="font-medium">{t('account')}</span>
              <span className="text-muted-foreground ml-auto">{t('userAuth')}</span>
            </div>

            <div className="bg-muted/50 flex items-center gap-3 rounded-lg border p-3 text-sm">
              <ShieldCheck className="text-primary h-4 w-4" />
              <span className="font-medium">{t('provider')}</span>
              <span className="text-muted-foreground ml-auto">{userDetails.provider}</span>
            </div>
          </div>

          <form action={handleLogout}>
            <Button variant="destructive" className="flex w-full items-center gap-2">
              <LogOut className="h-4 w-4" />
              {t('logout')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
