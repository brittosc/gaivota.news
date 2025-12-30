'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { subscribeToNewsletter } from '@/app/actions/newsletter';

export function NewsletterForm() {
  const [loading, setLoading] = useState(false);
  const t = useTranslations('Components.Newsletter');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    if (!email || !email.includes('@')) {
      toast.error(t('invalidEmail'));
      setLoading(false);
      return;
    }

    try {
      // Call Server Action directly
      // Note: server action expects prevState, but we can pass null or mock if not using useFormState
      // However, typical signature is (prevState, formData).
      const result = await subscribeToNewsletter({ message: '', success: false }, formData);

      if (result.success) {
        toast.success(result.message); // Will contain debug info now
        (e.target as HTMLFormElement).reset();
      } else {
        if (result.message === 'Email já cadastrado.') {
          toast.info(t('alreadySubscribed'));
        } else {
          toast.error(result.message);
        }
      }
    } catch {
      toast.error(t('error'));
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
            name="email"
            type="email"
            placeholder={t('placeholder')}
            className="pl-9"
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
