'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { createBrowserClient } from '@supabase/ssr';
import { Mail } from 'lucide-react';

import { useTranslations } from 'next-intl';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const t = useTranslations('Components.Newsletter');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error(t('invalidEmail'));
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('newsletter_subscribers').insert({ email });

      if (error) {
        if (error.code === '23505') {
          // Unique violation
          toast.info(t('alreadySubscribed'));
        } else {
          throw error;
        }
      } else {
        toast.success(t('success'));
        setEmail('');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : t('error');
      // Keeping detailed error in console, specific user message in toast?
      // User prompt implies strictly translating the visible texts, keeping error message generic for user is better i18n practice usually.
      // But let's keep it simple.
      toast.error(`${t('error')}: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h4 className="mb-4 text-sm font-semibold tracking-wider uppercase">{t('label')}</h4>
      <p className="text-muted-foreground mb-4 text-sm">{t('shortDescription')}</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="relative">
          <Mail className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            type="email"
            placeholder={t('placeholder')}
            className="pl-9"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <Button type="submit" disabled={loading} size="sm" className="w-full">
          {loading ? t('subscribing') : t('subscribe')}
        </Button>
      </form>
    </div>
  );
}
