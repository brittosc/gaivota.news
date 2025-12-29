'use client';

import { createBrowserClient } from '@supabase/ssr';
import { Button } from '@/components/ui/button';
import { env } from '@/lib/env';
import { toast } from 'sonner';

export default function LoginButton() {
  const supabase = createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/api/auth/callback`,
        },
      });
      if (error) {
        toast.error('Erro ao iniciar login: ' + error.message);
      }
    } catch {
      toast.error('Erro inesperado ao tentar logar.');
    }
  };

  return (
    <Button onClick={handleLogin} className="w-full">
      Entrar com Google
    </Button>
  );
}
