'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { createBrowserClient } from '@supabase/ssr';
import { Mail } from 'lucide-react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Por favor, insira um e-mail válido.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('newsletter_subscribers').insert({ email });

      if (error) {
        if (error.code === '23505') {
          // Unique violation
          toast.info('Este e-mail já está inscrito!');
        } else {
          throw error;
        }
      } else {
        toast.success('Inscrição realizada com sucesso!');
        setEmail('');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error('Erro ao se inscrever: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h4 className="mb-4 text-sm font-semibold tracking-wider uppercase">Newsletter</h4>
      <p className="text-muted-foreground mb-4 text-sm">
        Receba as últimas notícias diretamente no seu e-mail.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="relative">
          <Mail className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            type="email"
            placeholder="seu@email.com"
            className="pl-9"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <Button type="submit" disabled={loading} size="sm" className="w-full">
          {loading ? 'Inscrevendo...' : 'Inscrever-se'}
        </Button>
      </form>
    </div>
  );
}
