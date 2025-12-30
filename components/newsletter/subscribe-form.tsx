'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { subscribeToNewsletter } from '@/app/actions/newsletter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useEffect, useRef } from 'react';
import { Mail } from 'lucide-react';

const initialState = {
  success: false,
  message: '',
};

import { useTranslations } from 'next-intl';

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations('Components.Newsletter'); // Hook inside component

  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? t('subscribing') : t('subscribe')}
    </Button>
  );
}

export function SubscribeForm() {
  const [state, formAction] = useFormState(subscribeToNewsletter, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const t = useTranslations('Components.Newsletter');

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
        formRef.current?.reset();
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <div className="bg-card rounded-2xl border p-8 shadow-sm">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="bg-primary/10 rounded-full p-3">
          <Mail className="text-primary h-6 w-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold tracking-tight">{t('title')}</h3>
          <p className="text-muted-foreground max-w-sm px-4">{t('description')}</p>
        </div>
        <form
          ref={formRef}
          action={formAction}
          className="flex w-full max-w-sm flex-col gap-2 sm:flex-row"
        >
          <Input
            name="email"
            type="email"
            placeholder={t('placeholder')}
            required
            className="flex-1"
          />
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
